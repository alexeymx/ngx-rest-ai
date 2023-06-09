import { __decorate, __param } from 'tslib';
import { Injectable, Optional, ɵɵdefineInjectable, ɵɵinject, NgModule } from '@angular/core';
import { HttpRequest, HttpHeaders, HttpEventType, HttpClient, HttpParams, HttpClientModule } from '@angular/common/http';
import { map, filter, distinctUntilChanged, tap, takeUntil, delay, catchError } from 'rxjs/operators';
import { isNullOrUndefined, isUndefined } from 'util';
import { Router, RouterModule } from '@angular/router';
import { CookieService, CookieModule } from 'ngx-cookie';
import { Subject, throwError } from 'rxjs';
import { fromUnixTime, isAfter } from 'date-fns';

/**
 * FileUpload request state enum
 */
var FileUploadState;
(function (FileUploadState) {
    FileUploadState["initialize"] = "initialize";
    FileUploadState["inProgress"] = "inProgress";
    FileUploadState["completed"] = "completed";
})(FileUploadState || (FileUploadState = {}));
let FileUpload = class FileUpload {
    /**
     * Service class constructor
     */
    constructor(http) {
        this.http = http;
    }
    /**
     * Convert bytes size to human readable format
     */
    static humanReadableFormat(bytes) {
        const e = (Math.log(bytes) / Math.log(1e3)) | 0;
        return +(bytes / Math.pow(1e3, e)).toFixed(2) + ' ' + ('kMGTPEZY'[e - 1] || '') + 'B';
    }
    /**
     * Convert bytes size to human readable format
     */
    static calculateSize(files) {
        let size = 0;
        Array.from(files).forEach((file) => { size += file.size; });
        return size;
    }
    /**
     * Create a FormData object to be send as request payload data
     */
    createFormData(object, form, namespace) {
        const formData = form || new FormData();
        for (const property in object) {
            if (!object.hasOwnProperty(property) || !object[property]) {
                continue;
            }
            const formKey = namespace ? `${namespace}[${property}]` : property;
            if (object[property] instanceof Date) {
                formData.append(formKey, object[property].toISOString());
            }
            else if (object[property] instanceof FileList) {
                for (let i = 0; i < object[property].length; i++) {
                    formData.append(`${property}[]`, object[property].item(i));
                }
            }
            else if (typeof object[property] === 'object' && !(object[property] instanceof File)) {
                this.createFormData(object[property], formData, formKey);
            }
            else {
                formData.append(formKey, object[property]);
            }
        }
        return formData;
    }
    /**
     * Upload the file list
     */
    upload(method, url, files, options) {
        method = method.toLowerCase();
        if (['post', 'put'].indexOf(method) === -1) {
            throw new Error(`FileUpload: Method "${method}" not allow, use "POST" or "PUT"`);
        }
        let result = { state: null, files: files, total: 0, loaded: 0, progress: 0 };
        const Params = {};
        Params[options.listParameterName ? options.listParameterName : 'files'] = files;
        const res = new HttpRequest(method, url, this.createFormData(options.params ? Object.assign(Object.assign({}, Params), options.params) : Params), { reportProgress: true, headers: new HttpHeaders(options.headers ? options.headers : {}) });
        return this.http
            .request(res)
            .pipe(map((event) => {
            switch (event.type) {
                case HttpEventType.Sent:
                    result = Object.assign(Object.assign({}, result), { state: FileUploadState.initialize });
                    break;
                case HttpEventType.UploadProgress:
                    result = Object.assign(Object.assign({}, result), {
                        state: event.total !== event.loaded ? FileUploadState.inProgress : FileUploadState.completed,
                        total: event.total,
                        loaded: event.loaded,
                        progress: Math.round(100 * event.loaded / event.total)
                    });
                    break;
                case HttpEventType.Response:
                    if (result.state !== FileUploadState.completed) {
                        result = Object.assign(Object.assign({}, result), { state: FileUploadState.completed });
                    }
                    break;
            }
            return result;
        }), filter((val) => !isNullOrUndefined(val)), distinctUntilChanged());
    }
    /**
     * Upload the files using POST HTTP method
     */
    post(url, files, options) {
        return this.upload('post', url, files, options);
    }
    /**
     * Upload the files using PUT HTTP method
     */
    put(url, files, options) {
        return this.upload('put', url, files, options);
    }
};
FileUpload.ctorParameters = () => [
    { type: HttpClient }
];
FileUpload = __decorate([
    Injectable()
], FileUpload);

var FileDownload_1;
/**
 * FileDownload request state enum
 */
var FileDownloadState;
(function (FileDownloadState) {
    FileDownloadState["initialize"] = "initialize";
    FileDownloadState["inProgress"] = "inProgress";
    FileDownloadState["completed"] = "completed";
})(FileDownloadState || (FileDownloadState = {}));
let FileDownload = FileDownload_1 = class FileDownload {
    /**
     * Service class constructor
     */
    constructor(http) {
        this.http = http;
    }
    /**
     * Convert bytes size to human readable format
     */
    static humanReadableFormat(bytes) {
        const e = (Math.log(bytes) / Math.log(1e3)) | 0;
        return +(bytes / Math.pow(1e3, e)).toFixed(2) + ' ' + ('kMGTPEZY'[e - 1] || '') + 'B';
    }
    /**
     * Save the Blob data
     */
    static blobSave(saveAs, data) {
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(data, saveAs);
        }
        else {
            const url = window.URL.createObjectURL(data), a = document.createElement('a');
            document.body.appendChild(a);
            a.setAttribute('style', 'display: none');
            a.href = url;
            a.download = saveAs;
            a.click();
            setTimeout(() => { window.URL.revokeObjectURL(url); document.body.removeChild(a); }, 400);
        }
    }
    /**
     * Request the file to be downloaded
     */
    download(method, url, saveAs, options = {}) {
        method = method.toLowerCase();
        if (['get', 'post', 'put'].indexOf(method) === -1) {
            throw new Error(`FileDownload: Method "${method}" not allow, use "GET", "POST" or "PUT"`);
        }
        let result = { state: null, saveAs: saveAs, total: 0, loaded: 0, progress: 0 }, Params = new HttpParams();
        const Options = {
            reportProgress: true,
            headers: new HttpHeaders(options.headers || {})
        };
        if (options.params) {
            Object.keys(options.params).forEach((key) => { Params = Params.set(key, options.params[key]); });
        }
        const res = method === 'GET'
            ? new HttpRequest(method, url, Object.assign(Object.assign({}, Options), { responseType: 'blob', params: Params }))
            : new HttpRequest(method, url, options.params || {}, Object.assign(Object.assign({}, Options), { responseType: 'blob' }));
        return this.http
            .request(res)
            .pipe(map((event) => {
            switch (event.type) {
                case HttpEventType.Sent:
                    result = Object.assign(Object.assign({}, result), { state: FileDownloadState.initialize });
                    break;
                case HttpEventType.DownloadProgress:
                    if (!isUndefined(event.total)) {
                        result = Object.assign(Object.assign({}, result), {
                            state: FileDownloadState.inProgress,
                            total: event.total,
                            loaded: event.loaded,
                            progress: Math.round(100 * event.loaded / event.total)
                        });
                    }
                    break;
                case HttpEventType.Response:
                    if (result.state !== FileDownloadState.completed) {
                        result = Object.assign(Object.assign({}, result), { state: FileDownloadState.completed });
                        FileDownload_1.blobSave(saveAs, event.body);
                    }
                    break;
            }
            return result;
        }), filter((val) => !isNullOrUndefined(val)), distinctUntilChanged());
    }
    /**
     * Upload the files using POST HTTP method
     */
    get(url, saveAs, options = {}) {
        return this.download('get', url, saveAs, options);
    }
    /**
     * Upload the files using POST HTTP method
     */
    post(url, saveAs, options = {}) {
        return this.download('post', url, saveAs, options);
    }
    /**
     * Upload the files using PUT HTTP method
     */
    put(url, saveAs, options = {}) {
        return this.download('put', url, saveAs, options);
    }
};
FileDownload.ctorParameters = () => [
    { type: HttpClient }
];
FileDownload = FileDownload_1 = __decorate([
    Injectable()
], FileDownload);

var TypeTokenStorage;
(function (TypeTokenStorage) {
    TypeTokenStorage["cookie"] = "cookie";
    TypeTokenStorage["localStorage"] = "localStorage";
    TypeTokenStorage["sessionStorage"] = "sessionStorage";
})(TypeTokenStorage || (TypeTokenStorage = {}));
class RestServiceConfig {
}

var HttpMethod;
(function (HttpMethod) {
    HttpMethod["Get"] = "get";
    HttpMethod["Post"] = "post";
    HttpMethod["Put"] = "put";
    HttpMethod["Delete"] = "delete";
    HttpMethod["Patch"] = "patch";
})(HttpMethod || (HttpMethod = {}));

class JwtHelper {
    static decodeToken(token = '') {
        if (token === null || token === '') {
            return null;
        }
        const parts = token.split('.');
        if (parts.length !== 3) {
            return null;
        }
        const decoded = this.urlBase64Decode(parts[1]);
        if (!decoded) {
            return null;
        }
        return JSON.parse(decoded);
    }
    static urlBase64Decode(str) {
        let output = str;
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                return null;
        }
        const data = atob(output);
        return decodeURIComponent(data);
    }
}

let RestClientService = class RestClientService {
    constructor(http, cookies, router, config) {
        this.http = http;
        this.cookies = cookies;
        this.router = router;
        /** Handler used to stop all pending requests */
        this.cancelPending$ = new Subject();
        /**  Default requests header */
        this.baseHeader = {
            'Cache-Control': 'no-cache',
            accept: 'application/json',
            Pragma: 'no-cache',
            Authorization: '',
            'Accept-Language': '*'
        };
        /** When true, the request header will include the authentication token */
        this.secureRequest = false;
        /** Holds a list of files to be upload on request */
        this.withFilesRequest = false;
        this.config = {
            endPoint: '',
            tokenName: 'AuthToken',
            tokenStorage: TypeTokenStorage.cookie,
            secureCookie: false,
            mockData: false,
            validationTokenUri: '/info',
            authUri: '/authenticate',
            UnauthorizedRedirectUri: null
        };
        if (config) {
            this.setConfig(config);
        }
    }
    /**
     * Set the Rest Client configuration parameters.
     *
     * CAUTION: This method overrides the current configuration settings
     * and this settings will apply to all following requests
     */
    setConfig(config) {
        this.config = Object.assign(Object.assign({}, this.config), config);
        return this;
    }
    /** Return the current Rest Client configuration parameters.  */
    getConfig() {
        return this.config;
    }
    /**
     * Get the API Token from cookies
     */
    get token() {
        let token = '';
        switch (this.config.tokenStorage) {
            case TypeTokenStorage.cookie:
                token = this.cookies.get(this.config.tokenName);
                break;
            case TypeTokenStorage.localStorage:
                token = localStorage.getItem(this.config.tokenName);
                break;
            case TypeTokenStorage.sessionStorage:
                token = sessionStorage.getItem(this.config.tokenName);
                break;
            default:
                throw new Error('Invalid Token Storage method');
        }
        return !token || typeof token === 'undefined' ? '' : token;
    }
    /**
     * Save the API Token cookie
     */
    set token(token) {
        const decoded = JwtHelper.decodeToken(token);
        const expires = fromUnixTime(decoded.exp);
        switch (this.config.tokenStorage) {
            case TypeTokenStorage.cookie:
                this.cookies.put(this.config.tokenName, token, { secure: this.config.secureCookie, expires });
                break;
            case TypeTokenStorage.localStorage:
                localStorage.setItem(this.config.tokenName, token);
                break;
            case TypeTokenStorage.sessionStorage:
                sessionStorage.setItem(this.config.tokenName, token);
                break;
            default:
                throw new Error('Invalid Token Storage method');
        }
    }
    /**
     * Remove the Authentication token cookie
     */
    revoke() {
        switch (this.config.tokenStorage) {
            case TypeTokenStorage.cookie:
                this.cookies.removeAll();
                break;
            case TypeTokenStorage.localStorage:
                localStorage.removeItem(this.config.tokenName);
                break;
            case TypeTokenStorage.sessionStorage:
                sessionStorage.removeItem(this.config.tokenName);
                break;
            default:
                throw new Error('Invalid Token Storage method');
        }
    }
    /**
     * Request an Authorization token
     * The default authorization URI is '[API_END_POINT]/authorize'
     * @param username Username
     * @param password Password
     * @deprecated Use `authenticate` method instead
     */
    authorize(username, password) {
        return this.authenticate(username, password);
    }
    /**
     * Request an authentication token
     * The default authentication URI is '[API_END_POINT]/authenticate'
     * @param username Username
     * @param password Password
     */
    authenticate(username, password) {
        return this.post(this.config.authUri, { username, password })
            .pipe(tap(payload => {
            this.token = payload;
        }));
    }
    /** Validate the Authentication token against the API */
    validateToken(url) {
        return this.secured().request(HttpMethod.Post, url);
    }
    /**
     * Removes authorization token
     * @param url a url to report to
     * @deprecated use `deauthenticate` method instead
     */
    deauthorize(url) {
        return this.deauthenticate(url);
    }
    /**
     * Removes authorization token and reports logout to the server
     * @param url a url to report to
     */
    deauthenticate(url) {
        return this.secured().request(HttpMethod.Get, url)
            .pipe(tap(() => {
            this.revoke();
        }));
    }
    /**
     * Check if the client is already authenticated
     * @deprecated use `isAuthenticated` method instead
     */
    isAuthorized() {
        const token = this.token;
        const decoded = JwtHelper.decodeToken(token);
        return decoded !== null && !isAfter(new Date(), fromUnixTime(decoded.exp));
    }
    /**
     * Check if the client is already authenticated
     */
    isAuthenticated() {
        const token = this.token;
        const decoded = JwtHelper.decodeToken(token);
        return decoded !== null && !isAfter(new Date(), fromUnixTime(decoded.exp));
    }
    /** Cancel all pending requests */
    cancelPendingRequests() {
        this.cancelPending$.next(true);
    }
    /**
     * Set the request mode to SECURED for the next request.
     *
     * Secured Mode force the next request to include the authentication token.
     * The token must be requested previously using the "authorize" method.
     */
    secured() {
        this.secureRequest = true;
        return this;
    }
    /**
     * Set the request mode to PUBLIC for the next request.
     *
     * Public is the default request mode and ensure that no authentication token
     * will be pass on the next request.
     */
    public() {
        this.secureRequest = false;
        return this;
    }
    /**
     * API request using GET method
     *
     * @param url
     * @param data A list of parametes
     */
    get(url, data) {
        return this.request(HttpMethod.Get, url, data);
    }
    /**
     * API request using POST method
     *
     * @param url
     * @param data
     * @param responseType
     * @param httpOptions
     */
    post(url, data, responseType, httpOptions = {}) {
        return this.request(HttpMethod.Post, url, data, responseType, httpOptions);
    }
    /**
     * API request using PUT method
     *
     * @param url
     * @param data
     * @param responseType
     * @param httpOptions
     */
    put(url, data, responseType, httpOptions = {}) {
        return this.request(HttpMethod.Put, url, data, responseType, httpOptions);
    }
    /**
     * API request using PATCH method
     *
     * @param url
     * @param data
     * @param responseType
     * @param httpOptions
     */
    patch(url, data, responseType, httpOptions = {}) {
        return this.request(HttpMethod.Patch, url, data, responseType, httpOptions);
    }
    /**
     * API request using DELETE method
     *
     * @param url
     * @param data
     * @param responseType
     */
    delete(url, data, responseType) {
        return this.request(HttpMethod.Delete, url, data, responseType);
    }
    /** Set the upload file mode */
    withFiles() {
        this.withFilesRequest = true;
        return this;
    }
    /**
     * Create a FormData object to be send as request payload data
     */
    createFormData(object, form, namespace) {
        const formData = form || new FormData();
        for (const property in object) {
            if (!object.hasOwnProperty(property) || !object[property]) {
                continue;
            }
            const formKey = namespace ? `${namespace}[${property}]` : property;
            if (object[property] instanceof Date) {
                formData.append(formKey, object[property].toISOString());
            }
            else if (object[property] instanceof FileList) {
                for (let i = 0; i < object[property].length; i++) {
                    formData.append(`${property}[]`, object[property].item(i));
                }
            }
            else if (typeof object[property] === 'object' && !(object[property] instanceof File)) {
                this.createFormData(object[property], formData, formKey);
            }
            else {
                formData.append(formKey, object[property]);
            }
        }
        return formData;
    }
    buildUrl(url) {
        const endPoint = this.config.mockData ? 'assets/mock-data' : this.config.endPoint.replace(/\/$/, '');
        let nUrl = `${endPoint}/${url.replace(/^\//g, '')}`;
        const match = nUrl.match(/\.([0-9a-z]+)(?:[\?#]|$)/i);
        if (this.config.mockData && match == null) {
            nUrl = `${nUrl}.json`;
        }
        return nUrl;
    }
    /**
     * Return the request headers based on configuration parameters
     */
    buildHeaders() {
        const header = Object.assign({}, this.baseHeader);
        if (this.config.language) {
            header['Accept-Language'] = this.config.language;
        }
        if (this.secureRequest) {
            const token = this.token;
            if (!token) {
                console.warn('Executing a secure request without TOKEN. '
                    + 'Authorization header will not be set!');
            }
            else {
                header.Authorization = `Bearer ${token}`;
            }
            this.secureRequest = false;
        }
        return header;
    }
    /** Raw request method */
    request(method, url, data, responseType, httpOptions = {}) {
        const msDelay = Math.floor((Math.random() * 2000) + 1000);
        const header = this.buildHeaders();
        const rType = (responseType ? responseType : 'json');
        if (this.withFilesRequest) {
            data = this.createFormData(data);
            this.withFilesRequest = false;
        }
        const options = {
            body: method === HttpMethod.Get ? {} : data,
            responseType: rType,
            params: method === HttpMethod.Get ? data : {},
            headers: header
        };
        return this.http
            .request(this.config.mockData ? HttpMethod.Get : method, this.buildUrl(url), Object.assign(Object.assign({}, options), httpOptions))
            .pipe(takeUntil(this.cancelPending$))
            .pipe(delay(this.config.mockData ? msDelay : 0))
            .pipe(catchError((err) => {
            if (this.config.UnauthenticatedRedirectUri
                && url !== this.config.authUri
                && err.status === 401) {
                this.router.navigate([this.config.UnauthenticatedRedirectUri]).then(() => { });
                this.cancelPendingRequests();
            }
            if (this.config.UnauthorizedRedirectUri
                && url !== this.config.authUri
                && err.status === 403) {
                this.router.navigate([this.config.UnauthorizedRedirectUri]).then(() => { });
                this.cancelPendingRequests();
            }
            return throwError(err);
        }));
    }
};
RestClientService.ctorParameters = () => [
    { type: HttpClient },
    { type: CookieService },
    { type: Router },
    { type: RestServiceConfig, decorators: [{ type: Optional }] }
];
RestClientService.ɵprov = ɵɵdefineInjectable({ factory: function RestClientService_Factory() { return new RestClientService(ɵɵinject(HttpClient), ɵɵinject(CookieService), ɵɵinject(Router), ɵɵinject(RestServiceConfig, 8)); }, token: RestClientService, providedIn: "root" });
RestClientService = __decorate([
    Injectable({
        providedIn: 'root'
    }),
    __param(3, Optional())
], RestClientService);

var NgxRestModule_1;
let NgxRestModule = NgxRestModule_1 = class NgxRestModule {
    static forRoot(config) {
        return {
            ngModule: NgxRestModule_1,
            providers: [
                { provide: RestServiceConfig, useValue: config }
            ]
        };
    }
};
NgxRestModule = NgxRestModule_1 = __decorate([
    NgModule({
        imports: [
            HttpClientModule,
            CookieModule.forRoot()
        ],
        providers: [
            HttpClient,
            CookieService,
            FileDownload,
            FileUpload,
            RouterModule
        ]
    })
], NgxRestModule);

/*
 * Public API Surface of ngx-rest
 */

/**
 * Generated bundle index. Do not edit.
 */

export { FileDownload, FileDownloadState, FileUpload, FileUploadState, NgxRestModule, RestClientService, RestServiceConfig, TypeTokenStorage };
//# sourceMappingURL=ngx-rest.js.map
