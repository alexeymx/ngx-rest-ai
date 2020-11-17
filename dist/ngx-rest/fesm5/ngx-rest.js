import { __assign, __decorate, __param } from 'tslib';
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
var FileUpload = /** @class */ (function () {
    /**
     * Service class constructor
     */
    function FileUpload(http) {
        this.http = http;
    }
    /**
     * Convert bytes size to human readable format
     */
    FileUpload.humanReadableFormat = function (bytes) {
        var e = (Math.log(bytes) / Math.log(1e3)) | 0;
        return +(bytes / Math.pow(1e3, e)).toFixed(2) + ' ' + ('kMGTPEZY'[e - 1] || '') + 'B';
    };
    /**
     * Convert bytes size to human readable format
     */
    FileUpload.calculateSize = function (files) {
        var size = 0;
        Array.from(files).forEach(function (file) { size += file.size; });
        return size;
    };
    /**
     * Create a FormData object to be send as request payload data
     */
    FileUpload.prototype.createFormData = function (object, form, namespace) {
        var formData = form || new FormData();
        for (var property in object) {
            if (!object.hasOwnProperty(property) || !object[property]) {
                continue;
            }
            var formKey = namespace ? namespace + "[" + property + "]" : property;
            if (object[property] instanceof Date) {
                formData.append(formKey, object[property].toISOString());
            }
            else if (object[property] instanceof FileList) {
                for (var i = 0; i < object[property].length; i++) {
                    formData.append(property + "[]", object[property].item(i));
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
    };
    /**
     * Upload the file list
     */
    FileUpload.prototype.upload = function (method, url, files, options) {
        method = method.toLowerCase();
        if (['post', 'put'].indexOf(method) === -1) {
            throw new Error("FileUpload: Method \"" + method + "\" not allow, use \"POST\" or \"PUT\"");
        }
        var result = { state: null, files: files, total: 0, loaded: 0, progress: 0 };
        var Params = {};
        Params[options.listParameterName ? options.listParameterName : 'files'] = files;
        var res = new HttpRequest(method, url, this.createFormData(options.params ? __assign(__assign({}, Params), options.params) : Params), { reportProgress: true, headers: new HttpHeaders(options.headers ? options.headers : {}) });
        return this.http
            .request(res)
            .pipe(map(function (event) {
            switch (event.type) {
                case HttpEventType.Sent:
                    result = __assign(__assign({}, result), { state: FileUploadState.initialize });
                    break;
                case HttpEventType.UploadProgress:
                    result = __assign(__assign({}, result), {
                        state: event.total !== event.loaded ? FileUploadState.inProgress : FileUploadState.completed,
                        total: event.total,
                        loaded: event.loaded,
                        progress: Math.round(100 * event.loaded / event.total)
                    });
                    break;
                case HttpEventType.Response:
                    if (result.state !== FileUploadState.completed) {
                        result = __assign(__assign({}, result), { state: FileUploadState.completed });
                    }
                    break;
            }
            return result;
        }), filter(function (val) { return !isNullOrUndefined(val); }), distinctUntilChanged());
    };
    /**
     * Upload the files using POST HTTP method
     */
    FileUpload.prototype.post = function (url, files, options) {
        return this.upload('post', url, files, options);
    };
    /**
     * Upload the files using PUT HTTP method
     */
    FileUpload.prototype.put = function (url, files, options) {
        return this.upload('put', url, files, options);
    };
    FileUpload.ctorParameters = function () { return [
        { type: HttpClient }
    ]; };
    FileUpload = __decorate([
        Injectable()
    ], FileUpload);
    return FileUpload;
}());

/**
 * FileDownload request state enum
 */
var FileDownloadState;
(function (FileDownloadState) {
    FileDownloadState["initialize"] = "initialize";
    FileDownloadState["inProgress"] = "inProgress";
    FileDownloadState["completed"] = "completed";
})(FileDownloadState || (FileDownloadState = {}));
var FileDownload = /** @class */ (function () {
    /**
     * Service class constructor
     */
    function FileDownload(http) {
        this.http = http;
    }
    FileDownload_1 = FileDownload;
    /**
     * Convert bytes size to human readable format
     */
    FileDownload.humanReadableFormat = function (bytes) {
        var e = (Math.log(bytes) / Math.log(1e3)) | 0;
        return +(bytes / Math.pow(1e3, e)).toFixed(2) + ' ' + ('kMGTPEZY'[e - 1] || '') + 'B';
    };
    /**
     * Save the Blob data
     */
    FileDownload.blobSave = function (saveAs, data) {
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(data, saveAs);
        }
        else {
            var url_1 = window.URL.createObjectURL(data), a_1 = document.createElement('a');
            document.body.appendChild(a_1);
            a_1.setAttribute('style', 'display: none');
            a_1.href = url_1;
            a_1.download = saveAs;
            a_1.click();
            setTimeout(function () { window.URL.revokeObjectURL(url_1); document.body.removeChild(a_1); }, 400);
        }
    };
    /**
     * Request the file to be downloaded
     */
    FileDownload.prototype.download = function (method, url, saveAs, options) {
        if (options === void 0) { options = {}; }
        method = method.toLowerCase();
        if (['get', 'post', 'put'].indexOf(method) === -1) {
            throw new Error("FileDownload: Method \"" + method + "\" not allow, use \"GET\", \"POST\" or \"PUT\"");
        }
        var result = { state: null, saveAs: saveAs, total: 0, loaded: 0, progress: 0 }, Params = new HttpParams();
        var Options = {
            reportProgress: true,
            headers: new HttpHeaders(options.headers || {})
        };
        if (options.params) {
            Object.keys(options.params).forEach(function (key) { Params = Params.set(key, options.params[key]); });
        }
        var res = method === 'GET'
            ? new HttpRequest(method, url, __assign(__assign({}, Options), { responseType: 'blob', params: Params }))
            : new HttpRequest(method, url, options.params || {}, __assign(__assign({}, Options), { responseType: 'blob' }));
        return this.http
            .request(res)
            .pipe(map(function (event) {
            switch (event.type) {
                case HttpEventType.Sent:
                    result = __assign(__assign({}, result), { state: FileDownloadState.initialize });
                    break;
                case HttpEventType.DownloadProgress:
                    if (!isUndefined(event.total)) {
                        result = __assign(__assign({}, result), {
                            state: FileDownloadState.inProgress,
                            total: event.total,
                            loaded: event.loaded,
                            progress: Math.round(100 * event.loaded / event.total)
                        });
                    }
                    break;
                case HttpEventType.Response:
                    if (result.state !== FileDownloadState.completed) {
                        result = __assign(__assign({}, result), { state: FileDownloadState.completed });
                        FileDownload_1.blobSave(saveAs, event.body);
                    }
                    break;
            }
            return result;
        }), filter(function (val) { return !isNullOrUndefined(val); }), distinctUntilChanged());
    };
    /**
     * Upload the files using POST HTTP method
     */
    FileDownload.prototype.get = function (url, saveAs, options) {
        if (options === void 0) { options = {}; }
        return this.download('get', url, saveAs, options);
    };
    /**
     * Upload the files using POST HTTP method
     */
    FileDownload.prototype.post = function (url, saveAs, options) {
        if (options === void 0) { options = {}; }
        return this.download('post', url, saveAs, options);
    };
    /**
     * Upload the files using PUT HTTP method
     */
    FileDownload.prototype.put = function (url, saveAs, options) {
        if (options === void 0) { options = {}; }
        return this.download('put', url, saveAs, options);
    };
    var FileDownload_1;
    FileDownload.ctorParameters = function () { return [
        { type: HttpClient }
    ]; };
    FileDownload = FileDownload_1 = __decorate([
        Injectable()
    ], FileDownload);
    return FileDownload;
}());

var TypeTokenStorage;
(function (TypeTokenStorage) {
    TypeTokenStorage["cookie"] = "cookie";
    TypeTokenStorage["localStorage"] = "localStorage";
    TypeTokenStorage["sessionStorage"] = "sessionStorage";
})(TypeTokenStorage || (TypeTokenStorage = {}));
var RestServiceConfig = /** @class */ (function () {
    function RestServiceConfig() {
    }
    return RestServiceConfig;
}());

var HttpMethod;
(function (HttpMethod) {
    HttpMethod["Get"] = "get";
    HttpMethod["Post"] = "post";
    HttpMethod["Put"] = "put";
    HttpMethod["Delete"] = "selete";
    HttpMethod["Patch"] = "patch";
})(HttpMethod || (HttpMethod = {}));

var JwtHelper = /** @class */ (function () {
    function JwtHelper() {
    }
    JwtHelper.decodeToken = function (token) {
        if (token === void 0) { token = ''; }
        if (token === null || token === '') {
            return null;
        }
        var parts = token.split('.');
        if (parts.length !== 3) {
            return null;
        }
        var decoded = this.urlBase64Decode(parts[1]);
        if (!decoded) {
            return null;
        }
        return JSON.parse(decoded);
    };
    JwtHelper.urlBase64Decode = function (str) {
        var output = str;
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
        var data = atob(output);
        return decodeURIComponent(data);
    };
    return JwtHelper;
}());

var RestClientService = /** @class */ (function () {
    function RestClientService(http, cookies, router, config) {
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
    RestClientService.prototype.setConfig = function (config) {
        this.config = __assign(__assign({}, this.config), config);
        return this;
    };
    /** Return the current Rest Client configuration parameters.  */
    RestClientService.prototype.getConfig = function () {
        return this.config;
    };
    Object.defineProperty(RestClientService.prototype, "token", {
        /**
         * Get the API Token from cookies
         */
        get: function () {
            var token = '';
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
        },
        /**
         * Save the API Token cookie
         */
        set: function (token) {
            var decoded = JwtHelper.decodeToken(token);
            var expires = fromUnixTime(decoded.exp);
            switch (this.config.tokenStorage) {
                case TypeTokenStorage.cookie:
                    this.cookies.put(this.config.tokenName, token, { secure: this.config.secureCookie, expires: expires });
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
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Remove the Authentication token cookie
     */
    RestClientService.prototype.revoke = function () {
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
    };
    /**
     * Request an Authorization token
     * The default authorization URI is '[API_END_POINT]/authorize'
     * @param username Username
     * @param password Password
     * @deprecated Use `authenticate` method instead
     */
    RestClientService.prototype.authorize = function (username, password) {
        return this.authenticate(username, password);
    };
    /**
     * Request an authentication token
     * The default authentication URI is '[API_END_POINT]/authenticate'
     * @param username Username
     * @param password Password
     */
    RestClientService.prototype.authenticate = function (username, password) {
        var _this = this;
        return this.post(this.config.authUri, { username: username, password: password })
            .pipe(tap(function (payload) {
            _this.token = payload;
        }));
    };
    /** Validate the Authentication token against the API */
    RestClientService.prototype.validateToken = function (url) {
        return this.secured().request(HttpMethod.Post, url);
    };
    /**
     * Removes authorization token
     * @param url a url to report to
     * @deprecated use `deauthenticate` method instead
     */
    RestClientService.prototype.deauthorize = function (url) {
        return this.deauthenticate(url);
    };
    /**
     * Removes authorization token and reports logout to the server
     * @param url a url to report to
     */
    RestClientService.prototype.deauthenticate = function (url) {
        var _this = this;
        return this.secured().request(HttpMethod.Get, url)
            .pipe(tap(function () {
            _this.revoke();
        }));
    };
    /**
     * Check if the client is already authenticated
     * @deprecated use `isAuthenticated` method instead
     */
    RestClientService.prototype.isAuthorized = function () {
        var token = this.token;
        var decoded = JwtHelper.decodeToken(token);
        return decoded !== null && !isAfter(new Date(), fromUnixTime(decoded.exp));
    };
    /**
     * Check if the client is already authenticated
     */
    RestClientService.prototype.isAuthenticated = function () {
        var token = this.token;
        var decoded = JwtHelper.decodeToken(token);
        return decoded !== null && !isAfter(new Date(), fromUnixTime(decoded.exp));
    };
    /** Cancel all pending requests */
    RestClientService.prototype.cancelPendingRequests = function () {
        this.cancelPending$.next(true);
    };
    /**
     * Set the request mode to SECURED for the next request.
     *
     * Secured Mode force the next request to include the authentication token.
     * The token must be requested previously using the "authorize" method.
     */
    RestClientService.prototype.secured = function () {
        this.secureRequest = true;
        return this;
    };
    /**
     * Set the request mode to PUBLIC for the next request.
     *
     * Public is the default request mode and ensure that no authentication token
     * will be pass on the next request.
     */
    RestClientService.prototype.public = function () {
        this.secureRequest = false;
        return this;
    };
    /**
     * API request using GET method
     *
     * @param url
     * @param data A list of parametes
     */
    RestClientService.prototype.get = function (url, data) {
        return this.request(HttpMethod.Get, url, data);
    };
    /**
     * API request using POST method
     *
     * @param url
     * @param data
     * @param responseType
     * @param httpOptions
     */
    RestClientService.prototype.post = function (url, data, responseType, httpOptions) {
        if (httpOptions === void 0) { httpOptions = {}; }
        return this.request(HttpMethod.Post, url, data, responseType, httpOptions);
    };
    /**
     * API request using PUT method
     *
     * @param url
     * @param data
     * @param responseType
     * @param httpOptions
     */
    RestClientService.prototype.put = function (url, data, responseType, httpOptions) {
        if (httpOptions === void 0) { httpOptions = {}; }
        return this.request(HttpMethod.Put, url, data, responseType, httpOptions);
    };
    /**
     * API request using PATCH method
     *
     * @param url
     * @param data
     * @param responseType
     * @param httpOptions
     */
    RestClientService.prototype.patch = function (url, data, responseType, httpOptions) {
        if (httpOptions === void 0) { httpOptions = {}; }
        return this.request(HttpMethod.Patch, url, data, responseType, httpOptions);
    };
    /**
     * API request using DELETE method
     *
     * @param url
     * @param data
     * @param responseType
     */
    RestClientService.prototype.delete = function (url, data, responseType) {
        return this.request(HttpMethod.Delete, url, data, responseType);
    };
    /** Set the upload file mode */
    RestClientService.prototype.withFiles = function () {
        this.withFilesRequest = true;
        return this;
    };
    /**
     * Create a FormData object to be send as request payload data
     */
    RestClientService.prototype.createFormData = function (object, form, namespace) {
        var formData = form || new FormData();
        for (var property in object) {
            if (!object.hasOwnProperty(property) || !object[property]) {
                continue;
            }
            var formKey = namespace ? namespace + "[" + property + "]" : property;
            if (object[property] instanceof Date) {
                formData.append(formKey, object[property].toISOString());
            }
            else if (object[property] instanceof FileList) {
                for (var i = 0; i < object[property].length; i++) {
                    formData.append(property + "[]", object[property].item(i));
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
    };
    RestClientService.prototype.buildUrl = function (url) {
        var endPoint = this.config.mockData ? 'assets/mock-data' : this.config.endPoint.replace(/\/$/, '');
        var nUrl = endPoint + "/" + url.replace(/^\//g, '');
        var match = nUrl.match(/\.([0-9a-z]+)(?:[\?#]|$)/i);
        if (this.config.mockData && match == null) {
            nUrl = nUrl + ".json";
        }
        return nUrl;
    };
    /**
     * Return the request headers based on configuration parameters
     */
    RestClientService.prototype.buildHeaders = function () {
        var header = __assign({}, this.baseHeader);
        if (this.config.language) {
            header['Accept-Language'] = this.config.language;
        }
        if (this.secureRequest) {
            var token = this.token;
            if (!token) {
                console.warn('Executing a secure request without TOKEN. '
                    + 'Authorization header will not be set!');
            }
            else {
                header.Authorization = "Bearer " + token;
            }
            this.secureRequest = false;
        }
        return header;
    };
    /** Raw request method */
    RestClientService.prototype.request = function (method, url, data, responseType, httpOptions) {
        var _this = this;
        if (httpOptions === void 0) { httpOptions = {}; }
        var msDelay = Math.floor((Math.random() * 2000) + 1000);
        var header = this.buildHeaders();
        var rType = (responseType ? responseType : 'json');
        if (this.withFilesRequest) {
            data = this.createFormData(data);
            this.withFilesRequest = false;
        }
        var options = {
            body: method === HttpMethod.Get ? {} : data,
            responseType: rType,
            params: method === HttpMethod.Get ? data : {},
            headers: header
        };
        return this.http
            .request(this.config.mockData ? HttpMethod.Get : method, this.buildUrl(url), __assign(__assign({}, options), httpOptions))
            .pipe(takeUntil(this.cancelPending$))
            .pipe(delay(this.config.mockData ? msDelay : 0))
            .pipe(catchError(function (err) {
            if (_this.config.UnauthenticatedRedirectUri
                && url !== _this.config.authUri
                && err.status === 401) {
                _this.router.navigate([_this.config.UnauthenticatedRedirectUri]).then(function () { });
                _this.cancelPendingRequests();
            }
            if (_this.config.UnauthorizedRedirectUri
                && url !== _this.config.authUri
                && err.status === 403) {
                _this.router.navigate([_this.config.UnauthorizedRedirectUri]).then(function () { });
                _this.cancelPendingRequests();
            }
            return throwError(err);
        }));
    };
    RestClientService.ctorParameters = function () { return [
        { type: HttpClient },
        { type: CookieService },
        { type: Router },
        { type: RestServiceConfig, decorators: [{ type: Optional }] }
    ]; };
    RestClientService.ɵprov = ɵɵdefineInjectable({ factory: function RestClientService_Factory() { return new RestClientService(ɵɵinject(HttpClient), ɵɵinject(CookieService), ɵɵinject(Router), ɵɵinject(RestServiceConfig, 8)); }, token: RestClientService, providedIn: "root" });
    RestClientService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __param(3, Optional())
    ], RestClientService);
    return RestClientService;
}());

var NgxRestModule = /** @class */ (function () {
    function NgxRestModule() {
    }
    NgxRestModule_1 = NgxRestModule;
    NgxRestModule.forRoot = function (config) {
        return {
            ngModule: NgxRestModule_1,
            providers: [
                { provide: RestServiceConfig, useValue: config }
            ]
        };
    };
    var NgxRestModule_1;
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
    return NgxRestModule;
}());

/*
 * Public API Surface of ngx-rest
 */

/**
 * Generated bundle index. Do not edit.
 */

export { FileDownload, FileDownloadState, FileUpload, FileUploadState, NgxRestModule, RestClientService, RestServiceConfig, TypeTokenStorage };
//# sourceMappingURL=ngx-rest.js.map
