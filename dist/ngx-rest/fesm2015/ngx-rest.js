import { Injectable, ɵɵdefineInjectable, Optional, ɵɵinject, NgModule } from '@angular/core';
import { HttpRequest, HttpHeaders, HttpEventType, HttpClient, HttpParams, HttpClientModule } from '@angular/common/http';
import { map, filter, distinctUntilChanged, tap, takeUntil, delay, catchError } from 'rxjs/operators';
import { isNullOrUndefined, isUndefined } from 'util';
import { Router, RouterModule } from '@angular/router';
import { CookieService, CookieModule } from 'ngx-cookie';
import { Subject, of, throwError } from 'rxjs';
import { fromUnixTime, isAfter } from 'date-fns';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * FileUpload request options structure
 * @record
 */
function IUploadOptions() { }
if (false) {
    /** @type {?|undefined} */
    IUploadOptions.prototype.listParameterName;
    /** @type {?|undefined} */
    IUploadOptions.prototype.params;
    /** @type {?|undefined} */
    IUploadOptions.prototype.headers;
}
/** @enum {string} */
const FileUploadState = {
    initialize: 'initialize',
    inProgress: 'inProgress',
    completed: 'completed',
};
class FileUpload {
    /**
     * Service class constructor
     * @param {?} http
     */
    constructor(http) {
        this.http = http;
    }
    /**
     * Convert bytes size to human readable format
     * @param {?} bytes
     * @return {?}
     */
    static humanReadableFormat(bytes) {
        /** @type {?} */
        const e = (Math.log(bytes) / Math.log(1e3)) | 0;
        return +(bytes / Math.pow(1e3, e)).toFixed(2) + ' ' + ('kMGTPEZY'[e - 1] || '') + 'B';
    }
    /**
     * Convert bytes size to human readable format
     * @param {?} files
     * @return {?}
     */
    static calculateSize(files) {
        /** @type {?} */
        let size = 0;
        Array.from(files).forEach((/**
         * @param {?} file
         * @return {?}
         */
        (file) => { size += file.size; }));
        return size;
    }
    /**
     * Create a FormData object to be send as request payload data
     * @protected
     * @param {?} object
     * @param {?=} form
     * @param {?=} namespace
     * @return {?}
     */
    createFormData(object, form, namespace) {
        /** @type {?} */
        const formData = form || new FormData();
        for (const property in object) {
            if (!object.hasOwnProperty(property) || !object[property]) {
                continue;
            }
            /** @type {?} */
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
     * @private
     * @param {?} method
     * @param {?} url
     * @param {?} files
     * @param {?=} options
     * @return {?}
     */
    upload(method, url, files, options) {
        method = method.toLowerCase();
        if (['post', 'put'].indexOf(method) === -1) {
            throw new Error(`FileUpload: Method "${method}" not allow, use "POST" or "PUT"`);
        }
        /** @type {?} */
        let result = { state: null, files: files, total: 0, loaded: 0, progress: 0 };
        /** @type {?} */
        const Params = {};
        Params[options.listParameterName ? options.listParameterName : 'files'] = files;
        /** @type {?} */
        const res = new HttpRequest(method, url, this.createFormData(options.params ? Object.assign({}, Params, options.params) : Params), { reportProgress: true, headers: new HttpHeaders(options.headers ? options.headers : {}) });
        return this.http
            .request(res)
            .pipe(map((/**
         * @param {?} event
         * @return {?}
         */
        (event) => {
            switch (event.type) {
                case HttpEventType.Sent:
                    result = Object.assign({}, result, { state: FileUploadState.initialize });
                    break;
                case HttpEventType.UploadProgress:
                    result = Object.assign({}, result, {
                        state: event.total !== event.loaded ? FileUploadState.inProgress : FileUploadState.completed,
                        total: event.total,
                        loaded: event.loaded,
                        progress: Math.round(100 * event.loaded / event.total)
                    });
                    break;
                case HttpEventType.Response:
                    if (result.state !== FileUploadState.completed) {
                        result = Object.assign({}, result, { state: FileUploadState.completed });
                    }
                    break;
            }
            return result;
        })), filter((/**
         * @param {?} val
         * @return {?}
         */
        (val) => !isNullOrUndefined(val))), distinctUntilChanged());
    }
    /**
     * Upload the files using POST HTTP method
     * @param {?} url
     * @param {?} files
     * @param {?=} options
     * @return {?}
     */
    post(url, files, options) {
        return this.upload('post', url, files, options);
    }
    /**
     * Upload the files using PUT HTTP method
     * @param {?} url
     * @param {?} files
     * @param {?=} options
     * @return {?}
     */
    put(url, files, options) {
        return this.upload('put', url, files, options);
    }
}
FileUpload.decorators = [
    { type: Injectable }
];
/** @nocollapse */
FileUpload.ctorParameters = () => [
    { type: HttpClient }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    FileUpload.prototype.http;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * FileDownload request options structure
 * @record
 */
function IDownloadOptions() { }
if (false) {
    /** @type {?|undefined} */
    IDownloadOptions.prototype.params;
    /** @type {?|undefined} */
    IDownloadOptions.prototype.headers;
}
/** @enum {string} */
const FileDownloadState = {
    initialize: 'initialize',
    inProgress: 'inProgress',
    completed: 'completed',
};
class FileDownload {
    /**
     * Service class constructor
     * @param {?} http
     */
    constructor(http) {
        this.http = http;
    }
    /**
     * Convert bytes size to human readable format
     * @param {?} bytes
     * @return {?}
     */
    static humanReadableFormat(bytes) {
        /** @type {?} */
        const e = (Math.log(bytes) / Math.log(1e3)) | 0;
        return +(bytes / Math.pow(1e3, e)).toFixed(2) + ' ' + ('kMGTPEZY'[e - 1] || '') + 'B';
    }
    /**
     * Save the Blob data
     * @param {?} saveAs
     * @param {?} data
     * @return {?}
     */
    static blobSave(saveAs, data) {
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(data, saveAs);
        }
        else {
            /** @type {?} */
            const url = window.URL.createObjectURL(data);
            /** @type {?} */
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.setAttribute('style', 'display: none');
            a.href = url;
            a.download = saveAs;
            a.click();
            setTimeout((/**
             * @return {?}
             */
            () => { window.URL.revokeObjectURL(url); document.body.removeChild(a); }), 400);
        }
    }
    /**
     * Request the file to be downloaded
     * @private
     * @param {?} method
     * @param {?} url
     * @param {?} saveAs
     * @param {?=} options
     * @return {?}
     */
    download(method, url, saveAs, options = {}) {
        method = method.toLowerCase();
        if (['get', 'post', 'put'].indexOf(method) === -1) {
            throw new Error(`FileDownload: Method "${method}" not allow, use "GET", "POST" or "PUT"`);
        }
        /** @type {?} */
        let result = { state: null, saveAs: saveAs, total: 0, loaded: 0, progress: 0 };
        /** @type {?} */
        let Params = new HttpParams();
        /** @type {?} */
        const Options = {
            reportProgress: true,
            headers: new HttpHeaders(options.headers || {})
        };
        if (options.params) {
            Object.keys(options.params).forEach((/**
             * @param {?} key
             * @return {?}
             */
            (key) => { Params = Params.set(key, options.params[key]); }));
        }
        /** @type {?} */
        const res = method === 'GET'
            ? new HttpRequest(method, url, Object.assign({}, Options, { responseType: 'blob', params: Params }))
            : new HttpRequest(method, url, options.params || {}, Object.assign({}, Options, { responseType: 'blob' }));
        return this.http
            .request(res)
            .pipe(map((/**
         * @param {?} event
         * @return {?}
         */
        (event) => {
            switch (event.type) {
                case HttpEventType.Sent:
                    result = Object.assign({}, result, { state: FileDownloadState.initialize });
                    break;
                case HttpEventType.DownloadProgress:
                    if (!isUndefined(event.total)) {
                        result = Object.assign({}, result, {
                            state: FileDownloadState.inProgress,
                            total: event.total,
                            loaded: event.loaded,
                            progress: Math.round(100 * event.loaded / event.total)
                        });
                    }
                    break;
                case HttpEventType.Response:
                    if (result.state !== FileDownloadState.completed) {
                        result = Object.assign({}, result, { state: FileDownloadState.completed });
                        FileDownload.blobSave(saveAs, event.body);
                    }
                    break;
            }
            return result;
        })), filter((/**
         * @param {?} val
         * @return {?}
         */
        (val) => !isNullOrUndefined(val))), distinctUntilChanged());
    }
    /**
     * Upload the files using POST HTTP method
     * @param {?} url
     * @param {?} saveAs
     * @param {?=} options
     * @return {?}
     */
    get(url, saveAs, options = {}) {
        return this.download('get', url, saveAs, options);
    }
    /**
     * Upload the files using POST HTTP method
     * @param {?} url
     * @param {?} saveAs
     * @param {?=} options
     * @return {?}
     */
    post(url, saveAs, options = {}) {
        return this.download('post', url, saveAs, options);
    }
    /**
     * Upload the files using PUT HTTP method
     * @param {?} url
     * @param {?} saveAs
     * @param {?=} options
     * @return {?}
     */
    put(url, saveAs, options = {}) {
        return this.download('put', url, saveAs, options);
    }
}
FileDownload.decorators = [
    { type: Injectable }
];
/** @nocollapse */
FileDownload.ctorParameters = () => [
    { type: HttpClient }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    FileDownload.prototype.http;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {string} */
const TypeTokenStorage = {
    cookie: 'cookie',
    localStorage: 'localStorage',
    sessionStorage: 'sessionStorage',
};
class RestServiceConfig {
}
if (false) {
    /** @type {?} */
    RestServiceConfig.prototype.endPoint;
    /** @type {?} */
    RestServiceConfig.prototype.mockData;
    /** @type {?} */
    RestServiceConfig.prototype.tokenStorage;
    /** @type {?} */
    RestServiceConfig.prototype.tokenName;
    /** @type {?} */
    RestServiceConfig.prototype.secureCookie;
    /** @type {?} */
    RestServiceConfig.prototype.language;
    /** @type {?} */
    RestServiceConfig.prototype.authUri;
    /** @type {?} */
    RestServiceConfig.prototype.validationTokenUri;
    /** @type {?} */
    RestServiceConfig.prototype.UnauthorizedRedirectUri;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {string} */
const HttpMethod = {
    Get: 'get',
    Post: 'post',
    Put: 'put',
    Delete: 'Delete',
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class JwtHelper {
    /**
     * @param {?=} token
     * @return {?}
     */
    static decodeToken(token = '') {
        if (token === null || token === '') {
            return null;
        }
        /** @type {?} */
        const parts = token.split('.');
        if (parts.length !== 3) {
            return null;
        }
        /** @type {?} */
        const decoded = this.urlBase64Decode(parts[1]);
        if (!decoded) {
            return null;
        }
        return JSON.parse(decoded);
    }
    /**
     * @private
     * @param {?} str
     * @return {?}
     */
    static urlBase64Decode(str) {
        /** @type {?} */
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
        /** @type {?} */
        const data = atob(output);
        return decodeURIComponent(data);
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class CacheService {
    constructor() {
        this.cache = new Map();
    }
    /**
     * @param {?} key
     * @param {?} data
     * @return {?}
     */
    set(key, data) {
        this.cache.set(key, data);
    }
    /**
     * @param {?} key
     * @return {?}
     */
    get(key) {
        if (this.cache.has(key)) {
            return this.cache.get(key);
        }
        else {
            return null;
        }
    }
    /**
     * @param {?} key
     * @return {?}
     */
    invalidate(key) {
        if (this.cache.has(key)) {
        }
    }
}
CacheService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */ CacheService.ngInjectableDef = ɵɵdefineInjectable({ factory: function CacheService_Factory() { return new CacheService(); }, token: CacheService, providedIn: "root" });
if (false) {
    /**
     * @type {?}
     * @private
     */
    CacheService.prototype.cache;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class RestClientService {
    /**
     * @param {?} http
     * @param {?} cookies
     * @param {?} cache
     * @param {?} router
     * @param {?} config
     */
    constructor(http, cookies, cache, router, config) {
        this.http = http;
        this.cookies = cookies;
        this.cache = cache;
        this.router = router;
        /**
         * Handler used to stop all pending requests
         */
        this.cancelPending$ = new Subject();
        /**
         * Default requests header
         */
        this.baseHeader = {
            'Cache-Control': 'no-cache',
            accept: 'application/json',
            Pragma: 'no-cache',
            Authorization: '',
            'Accept-Language': '*'
        };
        /**
         * When true, the request header will include the authentication token
         */
        this.secureRequest = false;
        /**
         * Holds a list of files to be upload on request
         */
        this.withFilesRequest = false;
        /**
         * Prefer cache
         */
        this.cachedRequest = false;
        /**
         * Invalidate cache
         */
        this.invalidateCache = false;
        this.config = (/** @type {?} */ ({
            endPoint: '',
            tokenName: 'AuthToken',
            tokenStorage: TypeTokenStorage.cookie,
            secureCookie: false,
            mockData: false,
            validationTokenUri: '/info',
            authUri: '/authorize',
            UnauthorizedRedirectUri: null
        }));
        if (config) {
            this.setConfig(config);
        }
    }
    /**
     * Set the Rest Client configuration parameters.
     *
     * CAUTION: This method overrides the current configuration settings
     * and this settings will apply to all following requests
     * @param {?} config
     * @return {?}
     */
    setConfig(config) {
        this.config = (/** @type {?} */ (Object.assign({}, this.config, config)));
        return this;
    }
    /**
     * Return the current Rest Client configuration parameters.
     * @return {?}
     */
    getConfig() {
        return this.config;
    }
    /**
     * Get the API Token from cookies
     * @return {?}
     */
    get token() {
        /** @type {?} */
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
     * @param {?} token
     * @return {?}
     */
    set token(token) {
        /** @type {?} */
        const decoded = JwtHelper.decodeToken(token);
        /** @type {?} */
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
     * @return {?}
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
     * @param {?} username Username
     * @param {?} password Password
     * @return {?}
     */
    authorize(username, password) {
        return this.post(this.config.authUri, { username, password })
            .pipe(tap((/**
         * @param {?} payload
         * @return {?}
         */
        payload => {
            this.token = payload;
        })));
    }
    /**
     * Validate the Authentication token against the API
     * @param {?} url
     * @return {?}
     */
    validateToken(url) {
        return this.secured().request(HttpMethod.Post, url);
    }
    /**
     * Removes authorization token
     * @param {?} url
     * @return {?}
     */
    deauthorize(url) {
        return this.secured().request(HttpMethod.Get, url)
            .pipe(tap((/**
         * @return {?}
         */
        () => {
            this.revoke();
        })));
    }
    /**
     * Check if the client is already Authenticate
     * @return {?}
     */
    isAuthorized() {
        /** @type {?} */
        const token = this.token;
        /** @type {?} */
        const decoded = JwtHelper.decodeToken(token);
        return decoded !== null && !isAfter(new Date(), fromUnixTime(decoded.exp));
    }
    /**
     * Cancel all pending requests
     * @return {?}
     */
    cancelPendingRequests() {
        this.cancelPending$.next(true);
    }
    /**
     * @template THIS
     * @this {THIS}
     * @param {?=} invalidate
     * @return {THIS}
     */
    cached(invalidate = false) {
        (/** @type {?} */ (this)).cachedRequest = true;
        (/** @type {?} */ (this)).invalidateCache = invalidate;
        return (/** @type {?} */ (this));
    }
    /**
     * Set the request mode to SECURED for the next request.
     *
     * Secured Mode force the next request to include the authentication token.
     * The token must be requested previously using the "authorize" method.
     * @return {?}
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
     * @return {?}
     */
    public() {
        this.secureRequest = false;
        return this;
    }
    /**
     * API request using GET method
     *
     * @param {?} url
     * @param {?=} data A list of parametes
     * @return {?}
     */
    get(url, data) {
        return this.request(HttpMethod.Get, url, data);
    }
    /**
     * API request using POST method
     *
     * @param {?} url
     * @param {?=} data
     * @param {?=} responseType
     * @param {?=} httpOptions
     * @return {?}
     */
    post(url, data, responseType, httpOptions = {}) {
        return this.request(HttpMethod.Post, url, data, responseType, httpOptions);
    }
    /**
     * API request using PUT method
     *
     * @param {?} url
     * @param {?=} data
     * @param {?=} responseType
     * @param {?=} httpOptions
     * @return {?}
     */
    put(url, data, responseType, httpOptions = {}) {
        return this.request(HttpMethod.Put, url, data, responseType, httpOptions);
    }
    /**
     * API request using DELETE method
     *
     * @param {?} url
     * @param {?=} data
     * @param {?=} responseType
     * @return {?}
     */
    delete(url, data, responseType) {
        return this.request(HttpMethod.Delete, url, data, responseType);
    }
    /**
     * Set the upload file mode
     * @return {?}
     */
    withFiles() {
        this.withFilesRequest = true;
        return this;
    }
    /**
     * Create a FormData object to be send as request payload data
     * @protected
     * @param {?} object
     * @param {?=} form
     * @param {?=} namespace
     * @return {?}
     */
    createFormData(object, form, namespace) {
        /** @type {?} */
        const formData = form || new FormData();
        for (const property in object) {
            if (!object.hasOwnProperty(property) || !object[property]) {
                continue;
            }
            /** @type {?} */
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
     * @protected
     * @param {?} url
     * @return {?}
     */
    buildUrl(url) {
        /** @type {?} */
        const endPoint = this.config.mockData ? 'assets/mock-data/' : this.config.endPoint.replace(/\/$/, '');
        /** @type {?} */
        let nUrl = `${endPoint}/${url.replace(/^\//g, '')}`;
        /** @type {?} */
        const match = nUrl.match(/\.([0-9a-z]+)(?:[\?#]|$)/i);
        if (this.config.mockData && match == null) {
            nUrl = `${nUrl}.json`;
        }
        return nUrl;
    }
    /**
     * Return the request headers based on configuration parameters
     * @private
     * @return {?}
     */
    buildHeaders() {
        /** @type {?} */
        const header = Object.assign({}, this.baseHeader);
        if (this.config.language) {
            header['Accept-Language'] = this.config.language;
        }
        if (this.secureRequest) {
            /** @type {?} */
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
    /**
     * Raw request method
     * @protected
     * @param {?} method
     * @param {?} url
     * @param {?=} data
     * @param {?=} responseType
     * @param {?=} httpOptions
     * @return {?}
     */
    request(method, url, data, responseType, httpOptions = {}) {
        /** @type {?} */
        const msDelay = Math.floor((Math.random() * 2000) + 1000);
        /** @type {?} */
        const header = this.buildHeaders();
        /** @type {?} */
        const rType = (/** @type {?} */ ((responseType ? responseType : 'json')));
        if (this.withFilesRequest) {
            data = this.createFormData(data);
            this.withFilesRequest = false;
        }
        /** @type {?} */
        let cacheKey = '';
        if (this.cachedRequest) {
            cacheKey = btoa(unescape(encodeURIComponent(method + '_' + url + '_' + (method === HttpMethod.Get ? JSON.stringify(data) : ''))));
            if (!this.invalidateCache) {
                /** @type {?} */
                const cached = this.cache.get(cacheKey);
                if (cached) {
                    this.cachedRequest = false;
                    return of(cached);
                }
            }
            else {
                this.cache.invalidate(cacheKey);
            }
        }
        /** @type {?} */
        const options = {
            body: method === HttpMethod.Get ? {} : data,
            responseType: rType,
            params: method === HttpMethod.Get ? data : {},
            headers: header
        };
        return this.http
            .request(this.config.mockData ? HttpMethod.Get : method, this.buildUrl(url), Object.assign({}, options, httpOptions))
            .pipe(takeUntil(this.cancelPending$))
            .pipe(delay(this.config.mockData ? msDelay : 0))
            .pipe(tap((/**
         * @param {?} resp
         * @return {?}
         */
        resp => {
            if (this.cachedRequest) {
                this.cachedRequest = false;
                this.cache.set(cacheKey, resp);
            }
        })))
            .pipe(catchError((/**
         * @param {?} err
         * @return {?}
         */
        (err) => {
            if (this.config.UnauthorizedRedirectUri
                && url !== this.config.authUri
                && err.status === 401) {
                this.router.navigate([this.config.UnauthorizedRedirectUri]).then((/**
                 * @return {?}
                 */
                () => { }));
                this.cancelPendingRequests();
            }
            return throwError(err);
        })));
    }
}
RestClientService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
RestClientService.ctorParameters = () => [
    { type: HttpClient },
    { type: CookieService },
    { type: CacheService },
    { type: Router },
    { type: RestServiceConfig, decorators: [{ type: Optional }] }
];
/** @nocollapse */ RestClientService.ngInjectableDef = ɵɵdefineInjectable({ factory: function RestClientService_Factory() { return new RestClientService(ɵɵinject(HttpClient), ɵɵinject(CookieService), ɵɵinject(CacheService), ɵɵinject(Router), ɵɵinject(RestServiceConfig, 8)); }, token: RestClientService, providedIn: "root" });
if (false) {
    /**
     * Handler used to stop all pending requests
     * @type {?}
     * @protected
     */
    RestClientService.prototype.cancelPending$;
    /**
     * Default requests header
     * @type {?}
     * @protected
     */
    RestClientService.prototype.baseHeader;
    /**
     * Service configuration parameters
     * @type {?}
     * @protected
     */
    RestClientService.prototype.config;
    /**
     * When true, the request header will include the authentication token
     * @type {?}
     * @protected
     */
    RestClientService.prototype.secureRequest;
    /**
     * Holds a list of files to be upload on request
     * @type {?}
     * @protected
     */
    RestClientService.prototype.withFilesRequest;
    /**
     * Prefer cache
     * @type {?}
     * @protected
     */
    RestClientService.prototype.cachedRequest;
    /**
     * Invalidate cache
     * @type {?}
     * @protected
     */
    RestClientService.prototype.invalidateCache;
    /**
     * @type {?}
     * @private
     */
    RestClientService.prototype.http;
    /**
     * @type {?}
     * @private
     */
    RestClientService.prototype.cookies;
    /**
     * @type {?}
     * @private
     */
    RestClientService.prototype.cache;
    /**
     * @type {?}
     * @private
     */
    RestClientService.prototype.router;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NgxRestModule {
    /**
     * @param {?=} config
     * @return {?}
     */
    static forRoot(config) {
        return {
            ngModule: NgxRestModule,
            providers: [
                { provide: RestServiceConfig, useValue: config }
            ]
        };
    }
}
NgxRestModule.decorators = [
    { type: NgModule, args: [{
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
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { FileDownload, FileDownloadState, FileUpload, FileUploadState, NgxRestModule, RestClientService, RestServiceConfig, TypeTokenStorage, CacheService as ɵa };
//# sourceMappingURL=ngx-rest.js.map
