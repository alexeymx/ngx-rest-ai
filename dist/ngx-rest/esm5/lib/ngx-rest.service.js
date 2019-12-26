/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie';
import { Subject, throwError, of } from 'rxjs';
import { takeUntil, tap, catchError, delay } from 'rxjs/operators';
import { isAfter, fromUnixTime } from 'date-fns';
import { HttpMethod } from './http-method.enum';
import { JwtHelper } from './jwt-helper.class';
import { RestServiceConfig, TypeTokenStorage } from './ngx-rest.config';
import { CacheService } from './cache.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "ngx-cookie";
import * as i3 from "./cache.service";
import * as i4 from "@angular/router";
import * as i5 from "./ngx-rest.config";
var RestClientService = /** @class */ (function () {
    function RestClientService(http, cookies, cache, router, config) {
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
     */
    /**
     * Set the Rest Client configuration parameters.
     *
     * CAUTION: This method overrides the current configuration settings
     * and this settings will apply to all following requests
     * @param {?} config
     * @return {?}
     */
    RestClientService.prototype.setConfig = /**
     * Set the Rest Client configuration parameters.
     *
     * CAUTION: This method overrides the current configuration settings
     * and this settings will apply to all following requests
     * @param {?} config
     * @return {?}
     */
    function (config) {
        this.config = (/** @type {?} */ (tslib_1.__assign({}, this.config, config)));
        return this;
    };
    /** Return the current Rest Client configuration parameters.  */
    /**
     * Return the current Rest Client configuration parameters.
     * @return {?}
     */
    RestClientService.prototype.getConfig = /**
     * Return the current Rest Client configuration parameters.
     * @return {?}
     */
    function () {
        return this.config;
    };
    Object.defineProperty(RestClientService.prototype, "token", {
        /**
         * Get the API Token from cookies
         */
        get: /**
         * Get the API Token from cookies
         * @return {?}
         */
        function () {
            /** @type {?} */
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
        set: /**
         * Save the API Token cookie
         * @param {?} token
         * @return {?}
         */
        function (token) {
            /** @type {?} */
            var decoded = JwtHelper.decodeToken(token);
            /** @type {?} */
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
    /**
     * Remove the Authentication token cookie
     * @return {?}
     */
    RestClientService.prototype.revoke = /**
     * Remove the Authentication token cookie
     * @return {?}
     */
    function () {
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
     */
    /**
     * Request an Authorization token
     * The default authorization URI is '[API_END_POINT]/authorize'
     * @param {?} username Username
     * @param {?} password Password
     * @return {?}
     */
    RestClientService.prototype.authorize = /**
     * Request an Authorization token
     * The default authorization URI is '[API_END_POINT]/authorize'
     * @param {?} username Username
     * @param {?} password Password
     * @return {?}
     */
    function (username, password) {
        var _this = this;
        return this.post(this.config.authUri, { username: username, password: password })
            .pipe(tap((/**
         * @param {?} payload
         * @return {?}
         */
        function (payload) {
            _this.token = payload;
        })));
    };
    /** Validate the Authentication token against the API */
    /**
     * Validate the Authentication token against the API
     * @param {?} url
     * @return {?}
     */
    RestClientService.prototype.validateToken = /**
     * Validate the Authentication token against the API
     * @param {?} url
     * @return {?}
     */
    function (url) {
        return this.secured().request(HttpMethod.Post, url);
    };
    /** Removes authorization token */
    /**
     * Removes authorization token
     * @param {?} url
     * @return {?}
     */
    RestClientService.prototype.deauthorize = /**
     * Removes authorization token
     * @param {?} url
     * @return {?}
     */
    function (url) {
        var _this = this;
        return this.secured().request(HttpMethod.Get, url)
            .pipe(tap((/**
         * @return {?}
         */
        function () {
            _this.revoke();
        })));
    };
    /** Check if the client is already Authenticate  */
    /**
     * Check if the client is already Authenticate
     * @return {?}
     */
    RestClientService.prototype.isAuthorized = /**
     * Check if the client is already Authenticate
     * @return {?}
     */
    function () {
        /** @type {?} */
        var token = this.token;
        /** @type {?} */
        var decoded = JwtHelper.decodeToken(token);
        return decoded !== null && !isAfter(new Date(), fromUnixTime(decoded.exp));
    };
    /** Cancel all pending requests */
    /**
     * Cancel all pending requests
     * @return {?}
     */
    RestClientService.prototype.cancelPendingRequests = /**
     * Cancel all pending requests
     * @return {?}
     */
    function () {
        this.cancelPending$.next(true);
    };
    /**
     * @template THIS
     * @this {THIS}
     * @param {?=} invalidate
     * @return {THIS}
     */
    RestClientService.prototype.cached = /**
     * @template THIS
     * @this {THIS}
     * @param {?=} invalidate
     * @return {THIS}
     */
    function (invalidate) {
        if (invalidate === void 0) { invalidate = false; }
        (/** @type {?} */ (this)).cachedRequest = true;
        (/** @type {?} */ (this)).invalidateCache = invalidate;
        return (/** @type {?} */ (this));
    };
    /**
     * Set the request mode to SECURED for the next request.
     *
     * Secured Mode force the next request to include the authentication token.
     * The token must be requested previously using the "authorize" method.
     */
    /**
     * Set the request mode to SECURED for the next request.
     *
     * Secured Mode force the next request to include the authentication token.
     * The token must be requested previously using the "authorize" method.
     * @return {?}
     */
    RestClientService.prototype.secured = /**
     * Set the request mode to SECURED for the next request.
     *
     * Secured Mode force the next request to include the authentication token.
     * The token must be requested previously using the "authorize" method.
     * @return {?}
     */
    function () {
        this.secureRequest = true;
        return this;
    };
    /**
     * Set the request mode to PUBLIC for the next request.
     *
     * Public is the default request mode and ensure that no authentication token
     * will be pass on the next request.
     */
    /**
     * Set the request mode to PUBLIC for the next request.
     *
     * Public is the default request mode and ensure that no authentication token
     * will be pass on the next request.
     * @return {?}
     */
    RestClientService.prototype.public = /**
     * Set the request mode to PUBLIC for the next request.
     *
     * Public is the default request mode and ensure that no authentication token
     * will be pass on the next request.
     * @return {?}
     */
    function () {
        this.secureRequest = false;
        return this;
    };
    /**
     * API request using GET method
     *
     * @param url
     * @param data A list of parametes
     */
    /**
     * API request using GET method
     *
     * @param {?} url
     * @param {?=} data A list of parametes
     * @return {?}
     */
    RestClientService.prototype.get = /**
     * API request using GET method
     *
     * @param {?} url
     * @param {?=} data A list of parametes
     * @return {?}
     */
    function (url, data) {
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
    /**
     * API request using POST method
     *
     * @param {?} url
     * @param {?=} data
     * @param {?=} responseType
     * @param {?=} httpOptions
     * @return {?}
     */
    RestClientService.prototype.post = /**
     * API request using POST method
     *
     * @param {?} url
     * @param {?=} data
     * @param {?=} responseType
     * @param {?=} httpOptions
     * @return {?}
     */
    function (url, data, responseType, httpOptions) {
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
    /**
     * API request using PUT method
     *
     * @param {?} url
     * @param {?=} data
     * @param {?=} responseType
     * @param {?=} httpOptions
     * @return {?}
     */
    RestClientService.prototype.put = /**
     * API request using PUT method
     *
     * @param {?} url
     * @param {?=} data
     * @param {?=} responseType
     * @param {?=} httpOptions
     * @return {?}
     */
    function (url, data, responseType, httpOptions) {
        if (httpOptions === void 0) { httpOptions = {}; }
        return this.request(HttpMethod.Put, url, data, responseType, httpOptions);
    };
    /**
     * API request using DELETE method
     *
     * @param url
     * @param data
     * @param responseType
     */
    /**
     * API request using DELETE method
     *
     * @param {?} url
     * @param {?=} data
     * @param {?=} responseType
     * @return {?}
     */
    RestClientService.prototype.delete = /**
     * API request using DELETE method
     *
     * @param {?} url
     * @param {?=} data
     * @param {?=} responseType
     * @return {?}
     */
    function (url, data, responseType) {
        return this.request(HttpMethod.Delete, url, data, responseType);
    };
    /** Set the upload file mode */
    /**
     * Set the upload file mode
     * @return {?}
     */
    RestClientService.prototype.withFiles = /**
     * Set the upload file mode
     * @return {?}
     */
    function () {
        this.withFilesRequest = true;
        return this;
    };
    /**
     * Create a FormData object to be send as request payload data
     */
    /**
     * Create a FormData object to be send as request payload data
     * @protected
     * @param {?} object
     * @param {?=} form
     * @param {?=} namespace
     * @return {?}
     */
    RestClientService.prototype.createFormData = /**
     * Create a FormData object to be send as request payload data
     * @protected
     * @param {?} object
     * @param {?=} form
     * @param {?=} namespace
     * @return {?}
     */
    function (object, form, namespace) {
        /** @type {?} */
        var formData = form || new FormData();
        for (var property in object) {
            if (!object.hasOwnProperty(property) || !object[property]) {
                continue;
            }
            /** @type {?} */
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
     * @protected
     * @param {?} url
     * @return {?}
     */
    RestClientService.prototype.buildUrl = /**
     * @protected
     * @param {?} url
     * @return {?}
     */
    function (url) {
        /** @type {?} */
        var endPoint = this.config.mockData ? 'assets/mock-data' : this.config.endPoint.replace(/\/$/, '');
        /** @type {?} */
        var nUrl = endPoint + "/" + url.replace(/^\//g, '');
        /** @type {?} */
        var match = nUrl.match(/\.([0-9a-z]+)(?:[\?#]|$)/i);
        if (this.config.mockData && match == null) {
            nUrl = nUrl + ".json";
        }
        return nUrl;
    };
    /**
     * Return the request headers based on configuration parameters
     */
    /**
     * Return the request headers based on configuration parameters
     * @private
     * @return {?}
     */
    RestClientService.prototype.buildHeaders = /**
     * Return the request headers based on configuration parameters
     * @private
     * @return {?}
     */
    function () {
        /** @type {?} */
        var header = tslib_1.__assign({}, this.baseHeader);
        if (this.config.language) {
            header['Accept-Language'] = this.config.language;
        }
        if (this.secureRequest) {
            /** @type {?} */
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
    RestClientService.prototype.request = /**
     * Raw request method
     * @protected
     * @param {?} method
     * @param {?} url
     * @param {?=} data
     * @param {?=} responseType
     * @param {?=} httpOptions
     * @return {?}
     */
    function (method, url, data, responseType, httpOptions) {
        var _this = this;
        if (httpOptions === void 0) { httpOptions = {}; }
        /** @type {?} */
        var msDelay = Math.floor((Math.random() * 2000) + 1000);
        /** @type {?} */
        var header = this.buildHeaders();
        /** @type {?} */
        var rType = (/** @type {?} */ ((responseType ? responseType : 'json')));
        if (this.withFilesRequest) {
            data = this.createFormData(data);
            this.withFilesRequest = false;
        }
        /** @type {?} */
        var cacheKey = '';
        if (this.cachedRequest) {
            cacheKey = btoa(unescape(encodeURIComponent(method + '_' + url + '_' + (method === HttpMethod.Get ? JSON.stringify(data) : ''))));
            if (!this.invalidateCache) {
                /** @type {?} */
                var cached = this.cache.get(cacheKey);
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
        var options = {
            body: method === HttpMethod.Get ? {} : data,
            responseType: rType,
            params: method === HttpMethod.Get ? data : {},
            headers: header
        };
        return this.http
            .request(this.config.mockData ? HttpMethod.Get : method, this.buildUrl(url), tslib_1.__assign({}, options, httpOptions))
            .pipe(takeUntil(this.cancelPending$))
            .pipe(delay(this.config.mockData ? msDelay : 0))
            .pipe(tap((/**
         * @param {?} resp
         * @return {?}
         */
        function (resp) {
            if (_this.cachedRequest) {
                _this.cachedRequest = false;
                _this.cache.set(cacheKey, resp);
            }
        })))
            .pipe(catchError((/**
         * @param {?} err
         * @return {?}
         */
        function (err) {
            if (_this.config.UnauthorizedRedirectUri
                && url !== _this.config.authUri
                && err.status === 401) {
                _this.router.navigate([_this.config.UnauthorizedRedirectUri]).then((/**
                 * @return {?}
                 */
                function () { }));
                _this.cancelPendingRequests();
            }
            return throwError(err);
        })));
    };
    RestClientService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    /** @nocollapse */
    RestClientService.ctorParameters = function () { return [
        { type: HttpClient },
        { type: CookieService },
        { type: CacheService },
        { type: Router },
        { type: RestServiceConfig, decorators: [{ type: Optional }] }
    ]; };
    /** @nocollapse */ RestClientService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function RestClientService_Factory() { return new RestClientService(i0.ɵɵinject(i1.HttpClient), i0.ɵɵinject(i2.CookieService), i0.ɵɵinject(i3.CacheService), i0.ɵɵinject(i4.Router), i0.ɵɵinject(i5.RestServiceConfig, 8)); }, token: RestClientService, providedIn: "root" });
    return RestClientService;
}());
export { RestClientService };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXJlc3Quc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1yZXN0LyIsInNvdXJjZXMiOlsibGliL25neC1yZXN0LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNyRCxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDM0MsT0FBTyxFQUFjLE9BQU8sRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzNELE9BQU8sRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNuRSxPQUFPLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUdqRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDaEQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ3hFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7Ozs7OztBQUUvQztJQStCRSwyQkFDVSxJQUFnQixFQUNoQixPQUFzQixFQUN0QixLQUFtQixFQUNWLE1BQWMsRUFDbkIsTUFBeUI7UUFKN0IsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUNoQixZQUFPLEdBQVAsT0FBTyxDQUFlO1FBQ3RCLFVBQUssR0FBTCxLQUFLLENBQWM7UUFDVixXQUFNLEdBQU4sTUFBTSxDQUFROzs7O1FBOUJ2QixtQkFBYyxHQUFxQixJQUFJLE9BQU8sRUFB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SUFHRixtQ0FBb0M7Ozs7OztJQUdwQywwQ0FBZ0M7Ozs7OztJQUdoQyw2Q0FBbUM7Ozs7OztJQUduQywwQ0FBZ0M7Ozs7OztJQUdoQyw0Q0FBa0M7Ozs7O0lBR2hDLGlDQUF3Qjs7Ozs7SUFDeEIsb0NBQThCOzs7OztJQUM5QixrQ0FBMkI7Ozs7O0lBQzNCLG1DQUErQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IENvb2tpZVNlcnZpY2UgfSBmcm9tICduZ3gtY29va2llJztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QsIHRocm93RXJyb3IsIG9mIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0YWtlVW50aWwsIHRhcCwgY2F0Y2hFcnJvciwgZGVsYXkgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBpc0FmdGVyLCBmcm9tVW5peFRpbWUgfSBmcm9tICdkYXRlLWZucyc7XG5cbmltcG9ydCB7IElIdHRwT3B0aW9ucyB9IGZyb20gJy4vaHR0cC1vcHRpb25zLmludGVyZmFjZSc7XG5pbXBvcnQgeyBIdHRwTWV0aG9kIH0gZnJvbSAnLi9odHRwLW1ldGhvZC5lbnVtJztcbmltcG9ydCB7IEp3dEhlbHBlciB9IGZyb20gJy4vand0LWhlbHBlci5jbGFzcyc7XG5pbXBvcnQgeyBSZXN0U2VydmljZUNvbmZpZywgVHlwZVRva2VuU3RvcmFnZSB9IGZyb20gJy4vbmd4LXJlc3QuY29uZmlnJztcbmltcG9ydCB7IENhY2hlU2VydmljZSB9IGZyb20gJy4vY2FjaGUuc2VydmljZSc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFJlc3RDbGllbnRTZXJ2aWNlIHtcbiAgLyoqIEhhbmRsZXIgdXNlZCB0byBzdG9wIGFsbCBwZW5kaW5nIHJlcXVlc3RzICovXG4gIHByb3RlY3RlZCBjYW5jZWxQZW5kaW5nJDogU3ViamVjdDxib29sZWFuPiA9IG5ldyBTdWJqZWN0PGJvb2xlYW4+KCk7XG5cbiAgLyoqICBEZWZhdWx0IHJlcXVlc3RzIGhlYWRlciAqL1xuICBwcm90ZWN0ZWQgYmFzZUhlYWRlciA9IHtcbiAgICAnQ2FjaGUtQ29udHJvbCc6ICduby1jYWNoZScsXG4gICAgYWNjZXB0OiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgUHJhZ21hOiAnbm8tY2FjaGUnLFxuICAgIEF1dGhvcml6YXRpb246ICcnLFxuICAgICdBY2NlcHQtTGFuZ3VhZ2UnOiAnKidcbiAgfTtcblxuICAvKiogU2VydmljZSBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnMgKi9cbiAgcHJvdGVjdGVkIGNvbmZpZzogUmVzdFNlcnZpY2VDb25maWc7XG5cbiAgLyoqIFdoZW4gdHJ1ZSwgdGhlIHJlcXVlc3QgaGVhZGVyIHdpbGwgaW5jbHVkZSB0aGUgYXV0aGVudGljYXRpb24gdG9rZW4gKi9cbiAgcHJvdGVjdGVkIHNlY3VyZVJlcXVlc3QgPSBmYWxzZTtcblxuICAvKiogSG9sZHMgYSBsaXN0IG9mIGZpbGVzIHRvIGJlIHVwbG9hZCBvbiByZXF1ZXN0ICovXG4gIHByb3RlY3RlZCB3aXRoRmlsZXNSZXF1ZXN0ID0gZmFsc2U7XG5cbiAgLyoqIFByZWZlciBjYWNoZSAqL1xuICBwcm90ZWN0ZWQgY2FjaGVkUmVxdWVzdCA9IGZhbHNlO1xuXG4gIC8qKiBJbnZhbGlkYXRlIGNhY2hlICovXG4gIHByb3RlY3RlZCBpbnZhbGlkYXRlQ2FjaGUgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQsXG4gICAgcHJpdmF0ZSBjb29raWVzOiBDb29raWVTZXJ2aWNlLFxuICAgIHByaXZhdGUgY2FjaGU6IENhY2hlU2VydmljZSxcbiAgICBwcml2YXRlIHJlYWRvbmx5IHJvdXRlcjogUm91dGVyLFxuICAgIEBPcHRpb25hbCgpIGNvbmZpZzogUmVzdFNlcnZpY2VDb25maWdcbiAgKSB7XG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICBlbmRQb2ludDogJycsXG4gICAgICB0b2tlbk5hbWU6ICdBdXRoVG9rZW4nLFxuICAgICAgdG9rZW5TdG9yYWdlOiBUeXBlVG9rZW5TdG9yYWdlLmNvb2tpZSxcbiAgICAgIHNlY3VyZUNvb2tpZTogZmFsc2UsXG4gICAgICBtb2NrRGF0YTogZmFsc2UsXG4gICAgICB2YWxpZGF0aW9uVG9rZW5Vcmk6ICcvaW5mbycsXG4gICAgICBhdXRoVXJpOiAnL2F1dGhvcml6ZScsXG4gICAgICBVbmF1dGhvcml6ZWRSZWRpcmVjdFVyaTogbnVsbFxuICAgIH0gYXMgUmVzdFNlcnZpY2VDb25maWc7XG5cbiAgICBpZiAoY29uZmlnKSB7XG4gICAgICB0aGlzLnNldENvbmZpZyhjb25maWcpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIFJlc3QgQ2xpZW50IGNvbmZpZ3VyYXRpb24gcGFyYW1ldGVycy5cbiAgICpcbiAgICogQ0FVVElPTjogVGhpcyBtZXRob2Qgb3ZlcnJpZGVzIHRoZSBjdXJyZW50IGNvbmZpZ3VyYXRpb24gc2V0dGluZ3NcbiAgICogYW5kIHRoaXMgc2V0dGluZ3Mgd2lsbCBhcHBseSB0byBhbGwgZm9sbG93aW5nIHJlcXVlc3RzXG4gICAqL1xuICBwdWJsaWMgc2V0Q29uZmlnKGNvbmZpZzogUmVzdFNlcnZpY2VDb25maWcpOiBSZXN0Q2xpZW50U2VydmljZSB7XG4gICAgdGhpcy5jb25maWcgPSB7IC4uLnRoaXMuY29uZmlnLCAuLi5jb25maWcgfSBhcyBSZXN0U2VydmljZUNvbmZpZztcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKiBSZXR1cm4gdGhlIGN1cnJlbnQgUmVzdCBDbGllbnQgY29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzLiAgKi9cbiAgcHVibGljIGdldENvbmZpZygpOiBSZXN0U2VydmljZUNvbmZpZyB7XG4gICAgcmV0dXJuIHRoaXMuY29uZmlnO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgQVBJIFRva2VuIGZyb20gY29va2llc1xuICAgKi9cbiAgcHVibGljIGdldCB0b2tlbigpOiBzdHJpbmcge1xuICAgIGxldCB0b2tlbiA9ICcnO1xuXG4gICAgc3dpdGNoICh0aGlzLmNvbmZpZy50b2tlblN0b3JhZ2UpIHtcbiAgICAgIGNhc2UgVHlwZVRva2VuU3RvcmFnZS5jb29raWU6XG4gICAgICAgIHRva2VuID0gdGhpcy5jb29raWVzLmdldCh0aGlzLmNvbmZpZy50b2tlbk5hbWUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVHlwZVRva2VuU3RvcmFnZS5sb2NhbFN0b3JhZ2U6XG4gICAgICAgIHRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5jb25maWcudG9rZW5OYW1lKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFR5cGVUb2tlblN0b3JhZ2Uuc2Vzc2lvblN0b3JhZ2U6XG4gICAgICAgIHRva2VuID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmNvbmZpZy50b2tlbk5hbWUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBUb2tlbiBTdG9yYWdlIG1ldGhvZCcpO1xuICAgIH1cblxuICAgIHJldHVybiAhdG9rZW4gfHwgdHlwZW9mIHRva2VuID09PSAndW5kZWZpbmVkJyA/ICcnIDogdG9rZW47XG4gIH1cblxuICAvKipcbiAgICogU2F2ZSB0aGUgQVBJIFRva2VuIGNvb2tpZVxuICAgKi9cbiAgcHVibGljIHNldCB0b2tlbih0b2tlbjogc3RyaW5nKSB7XG4gICAgY29uc3QgZGVjb2RlZCA9IEp3dEhlbHBlci5kZWNvZGVUb2tlbih0b2tlbik7XG4gICAgY29uc3QgZXhwaXJlcyA9IGZyb21Vbml4VGltZShkZWNvZGVkLmV4cCk7XG5cbiAgICBzd2l0Y2ggKHRoaXMuY29uZmlnLnRva2VuU3RvcmFnZSkge1xuICAgICAgY2FzZSBUeXBlVG9rZW5TdG9yYWdlLmNvb2tpZTpcbiAgICAgICAgdGhpcy5jb29raWVzLnB1dChcbiAgICAgICAgICB0aGlzLmNvbmZpZy50b2tlbk5hbWUsXG4gICAgICAgICAgdG9rZW4sXG4gICAgICAgICAgeyBzZWN1cmU6IHRoaXMuY29uZmlnLnNlY3VyZUNvb2tpZSwgZXhwaXJlcyB9XG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBUeXBlVG9rZW5TdG9yYWdlLmxvY2FsU3RvcmFnZTpcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5jb25maWcudG9rZW5OYW1lLCB0b2tlbik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBUeXBlVG9rZW5TdG9yYWdlLnNlc3Npb25TdG9yYWdlOlxuICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKHRoaXMuY29uZmlnLnRva2VuTmFtZSwgdG9rZW4pO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBUb2tlbiBTdG9yYWdlIG1ldGhvZCcpO1xuICAgIH1cbiAgfVxuXG5cbiAgLyoqXG4gICAqIFJlbW92ZSB0aGUgQXV0aGVudGljYXRpb24gdG9rZW4gY29va2llXG4gICAqL1xuICBwdWJsaWMgcmV2b2tlKCk6IHZvaWQge1xuICAgIHN3aXRjaCAodGhpcy5jb25maWcudG9rZW5TdG9yYWdlKSB7XG4gICAgICBjYXNlIFR5cGVUb2tlblN0b3JhZ2UuY29va2llOlxuICAgICAgICB0aGlzLmNvb2tpZXMucmVtb3ZlQWxsKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBUeXBlVG9rZW5TdG9yYWdlLmxvY2FsU3RvcmFnZTpcbiAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy5jb25maWcudG9rZW5OYW1lKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFR5cGVUb2tlblN0b3JhZ2Uuc2Vzc2lvblN0b3JhZ2U6XG4gICAgICAgIHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy5jb25maWcudG9rZW5OYW1lKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgVG9rZW4gU3RvcmFnZSBtZXRob2QnKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVxdWVzdCBhbiBBdXRob3JpemF0aW9uIHRva2VuXG4gICAqIFRoZSBkZWZhdWx0IGF1dGhvcml6YXRpb24gVVJJIGlzICdbQVBJX0VORF9QT0lOVF0vYXV0aG9yaXplJ1xuICAgKiBAcGFyYW0gdXNlcm5hbWUgVXNlcm5hbWVcbiAgICogQHBhcmFtIHBhc3N3b3JkIFBhc3N3b3JkXG4gICAqL1xuICBwdWJsaWMgYXV0aG9yaXplKHVzZXJuYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLnBvc3QodGhpcy5jb25maWcuYXV0aFVyaSwgeyB1c2VybmFtZSwgcGFzc3dvcmQgfSlcbiAgICAgIC5waXBlKFxuICAgICAgICB0YXAocGF5bG9hZCA9PiB7XG4gICAgICAgICAgdGhpcy50b2tlbiA9IHBheWxvYWQ7XG4gICAgICAgIH0pXG4gICAgICApO1xuICB9XG5cbiAgLyoqIFZhbGlkYXRlIHRoZSBBdXRoZW50aWNhdGlvbiB0b2tlbiBhZ2FpbnN0IHRoZSBBUEkgKi9cbiAgcHVibGljIHZhbGlkYXRlVG9rZW4odXJsOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLnNlY3VyZWQoKS5yZXF1ZXN0KEh0dHBNZXRob2QuUG9zdCwgdXJsKTtcbiAgfVxuXG4gIC8qKiBSZW1vdmVzIGF1dGhvcml6YXRpb24gdG9rZW4gKi9cbiAgcHVibGljIGRlYXV0aG9yaXplKHVybDogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5zZWN1cmVkKCkucmVxdWVzdChIdHRwTWV0aG9kLkdldCwgdXJsKVxuICAgICAgLnBpcGUoXG4gICAgICAgIHRhcCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5yZXZva2UoKTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gIH1cblxuICAvKiogQ2hlY2sgaWYgdGhlIGNsaWVudCBpcyBhbHJlYWR5IEF1dGhlbnRpY2F0ZSAgKi9cbiAgcHVibGljIGlzQXV0aG9yaXplZCgpOiBib29sZWFuIHtcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMudG9rZW47XG4gICAgY29uc3QgZGVjb2RlZCA9IEp3dEhlbHBlci5kZWNvZGVUb2tlbih0b2tlbik7XG4gICAgcmV0dXJuIGRlY29kZWQgIT09IG51bGwgJiYgIWlzQWZ0ZXIobmV3IERhdGUoKSwgZnJvbVVuaXhUaW1lKGRlY29kZWQuZXhwKSk7XG4gIH1cblxuICAvKiogQ2FuY2VsIGFsbCBwZW5kaW5nIHJlcXVlc3RzICovXG4gIHB1YmxpYyBjYW5jZWxQZW5kaW5nUmVxdWVzdHMoKTogdm9pZCB7XG4gICAgdGhpcy5jYW5jZWxQZW5kaW5nJC5uZXh0KHRydWUpO1xuICB9XG5cblxuICBwdWJsaWMgY2FjaGVkKGludmFsaWRhdGUgPSBmYWxzZSkge1xuICAgIHRoaXMuY2FjaGVkUmVxdWVzdCA9IHRydWU7XG4gICAgdGhpcy5pbnZhbGlkYXRlQ2FjaGUgPSBpbnZhbGlkYXRlO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHJlcXVlc3QgbW9kZSB0byBTRUNVUkVEIGZvciB0aGUgbmV4dCByZXF1ZXN0LlxuICAgKlxuICAgKiBTZWN1cmVkIE1vZGUgZm9yY2UgdGhlIG5leHQgcmVxdWVzdCB0byBpbmNsdWRlIHRoZSBhdXRoZW50aWNhdGlvbiB0b2tlbi5cbiAgICogVGhlIHRva2VuIG11c3QgYmUgcmVxdWVzdGVkIHByZXZpb3VzbHkgdXNpbmcgdGhlIFwiYXV0aG9yaXplXCIgbWV0aG9kLlxuICAgKi9cbiAgcHVibGljIHNlY3VyZWQoKTogUmVzdENsaWVudFNlcnZpY2Uge1xuICAgIHRoaXMuc2VjdXJlUmVxdWVzdCA9IHRydWU7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHJlcXVlc3QgbW9kZSB0byBQVUJMSUMgZm9yIHRoZSBuZXh0IHJlcXVlc3QuXG4gICAqXG4gICAqIFB1YmxpYyBpcyB0aGUgZGVmYXVsdCByZXF1ZXN0IG1vZGUgYW5kIGVuc3VyZSB0aGF0IG5vIGF1dGhlbnRpY2F0aW9uIHRva2VuXG4gICAqIHdpbGwgYmUgcGFzcyBvbiB0aGUgbmV4dCByZXF1ZXN0LlxuICAgKi9cbiAgcHVibGljIHB1YmxpYygpOiBSZXN0Q2xpZW50U2VydmljZSB7XG4gICAgdGhpcy5zZWN1cmVSZXF1ZXN0ID0gZmFsc2U7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBBUEkgcmVxdWVzdCB1c2luZyBHRVQgbWV0aG9kXG4gICAqXG4gICAqIEBwYXJhbSB1cmxcbiAgICogQHBhcmFtIGRhdGEgQSBsaXN0IG9mIHBhcmFtZXRlc1xuICAgKi9cbiAgcHVibGljIGdldCh1cmw6IHN0cmluZywgZGF0YT86IHt9KTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KEh0dHBNZXRob2QuR2V0LCB1cmwsIGRhdGEpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFQSSByZXF1ZXN0IHVzaW5nIFBPU1QgbWV0aG9kXG4gICAqXG4gICAqIEBwYXJhbSB1cmxcbiAgICogQHBhcmFtIGRhdGFcbiAgICogQHBhcmFtIHJlc3BvbnNlVHlwZVxuICAgKiBAcGFyYW0gaHR0cE9wdGlvbnNcbiAgICovXG4gIHB1YmxpYyBwb3N0KHVybDogc3RyaW5nLCBkYXRhPzoge30sIHJlc3BvbnNlVHlwZT86IHN0cmluZywgaHR0cE9wdGlvbnM6IElIdHRwT3B0aW9ucyA9IHt9KTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KEh0dHBNZXRob2QuUG9zdCwgdXJsLCBkYXRhLCByZXNwb25zZVR5cGUsIGh0dHBPcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBUEkgcmVxdWVzdCB1c2luZyBQVVQgbWV0aG9kXG4gICAqXG4gICAqIEBwYXJhbSB1cmxcbiAgICogQHBhcmFtIGRhdGFcbiAgICogQHBhcmFtIHJlc3BvbnNlVHlwZVxuICAgKiBAcGFyYW0gaHR0cE9wdGlvbnNcbiAgICovXG4gIHB1YmxpYyBwdXQodXJsOiBzdHJpbmcsIGRhdGE/OiB7fSwgcmVzcG9uc2VUeXBlPzogc3RyaW5nLCBodHRwT3B0aW9uczogSUh0dHBPcHRpb25zID0ge30pOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QoSHR0cE1ldGhvZC5QdXQsIHVybCwgZGF0YSwgcmVzcG9uc2VUeXBlLCBodHRwT3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQVBJIHJlcXVlc3QgdXNpbmcgREVMRVRFIG1ldGhvZFxuICAgKlxuICAgKiBAcGFyYW0gdXJsXG4gICAqIEBwYXJhbSBkYXRhXG4gICAqIEBwYXJhbSByZXNwb25zZVR5cGVcbiAgICovXG4gIHB1YmxpYyBkZWxldGUodXJsOiBzdHJpbmcsIGRhdGE/OiB7fSwgcmVzcG9uc2VUeXBlPzogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KEh0dHBNZXRob2QuRGVsZXRlLCB1cmwsIGRhdGEsIHJlc3BvbnNlVHlwZSk7XG4gIH1cblxuICAvKiogU2V0IHRoZSB1cGxvYWQgZmlsZSBtb2RlICovXG4gIHB1YmxpYyB3aXRoRmlsZXMoKTogUmVzdENsaWVudFNlcnZpY2Uge1xuICAgIHRoaXMud2l0aEZpbGVzUmVxdWVzdCA9IHRydWU7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBGb3JtRGF0YSBvYmplY3QgdG8gYmUgc2VuZCBhcyByZXF1ZXN0IHBheWxvYWQgZGF0YVxuICAgKi9cbiAgcHJvdGVjdGVkIGNyZWF0ZUZvcm1EYXRhKG9iamVjdDogYW55LCBmb3JtPzogRm9ybURhdGEsIG5hbWVzcGFjZT86IHN0cmluZyk6IEZvcm1EYXRhIHtcbiAgICBjb25zdCBmb3JtRGF0YSA9IGZvcm0gfHwgbmV3IEZvcm1EYXRhKCk7XG5cbiAgICBmb3IgKGNvbnN0IHByb3BlcnR5IGluIG9iamVjdCkge1xuXG4gICAgICBpZiAoIW9iamVjdC5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkgfHwgIW9iamVjdFtwcm9wZXJ0eV0pIHsgY29udGludWU7IH1cblxuICAgICAgY29uc3QgZm9ybUtleSA9IG5hbWVzcGFjZSA/IGAke25hbWVzcGFjZX1bJHtwcm9wZXJ0eX1dYCA6IHByb3BlcnR5O1xuICAgICAgaWYgKG9iamVjdFtwcm9wZXJ0eV0gaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZChmb3JtS2V5LCBvYmplY3RbcHJvcGVydHldLnRvSVNPU3RyaW5nKCkpO1xuICAgICAgfSBlbHNlIGlmIChvYmplY3RbcHJvcGVydHldIGluc3RhbmNlb2YgRmlsZUxpc3QpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvYmplY3RbcHJvcGVydHldLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgZm9ybURhdGEuYXBwZW5kKGAke3Byb3BlcnR5fVtdYCwgb2JqZWN0W3Byb3BlcnR5XS5pdGVtKGkpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgdHlwZW9mIG9iamVjdFtwcm9wZXJ0eV0gPT09ICdvYmplY3QnICYmICEob2JqZWN0W3Byb3BlcnR5XSBpbnN0YW5jZW9mIEZpbGUpKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlRm9ybURhdGEob2JqZWN0W3Byb3BlcnR5XSwgZm9ybURhdGEsIGZvcm1LZXkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKGZvcm1LZXksIG9iamVjdFtwcm9wZXJ0eV0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZm9ybURhdGE7XG4gIH1cblxuXG5cbiAgcHJvdGVjdGVkIGJ1aWxkVXJsKHVybDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBlbmRQb2ludCA9IHRoaXMuY29uZmlnLm1vY2tEYXRhID8gJ2Fzc2V0cy9tb2NrLWRhdGEnIDogdGhpcy5jb25maWcuZW5kUG9pbnQucmVwbGFjZSgvXFwvJC8sICcnKTtcblxuICAgIGxldCBuVXJsID0gYCR7ZW5kUG9pbnR9LyR7dXJsLnJlcGxhY2UoL15cXC8vZywgJycpfWA7XG4gICAgY29uc3QgbWF0Y2ggPSBuVXJsLm1hdGNoKC9cXC4oWzAtOWEtel0rKSg/OltcXD8jXXwkKS9pKTtcblxuICAgIGlmICh0aGlzLmNvbmZpZy5tb2NrRGF0YSAmJiBtYXRjaCA9PSBudWxsKSB7XG4gICAgICBuVXJsID0gYCR7blVybH0uanNvbmA7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5Vcmw7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHJlcXVlc3QgaGVhZGVycyBiYXNlZCBvbiBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnNcbiAgICovXG4gIHByaXZhdGUgYnVpbGRIZWFkZXJzKCkge1xuICAgIGNvbnN0IGhlYWRlciA9IHsgLi4udGhpcy5iYXNlSGVhZGVyIH07XG5cbiAgICBpZiAodGhpcy5jb25maWcubGFuZ3VhZ2UpIHsgaGVhZGVyWydBY2NlcHQtTGFuZ3VhZ2UnXSA9IHRoaXMuY29uZmlnLmxhbmd1YWdlOyB9XG5cbiAgICBpZiAodGhpcy5zZWN1cmVSZXF1ZXN0KSB7XG4gICAgICBjb25zdCB0b2tlbiA9IHRoaXMudG9rZW47XG4gICAgICBpZiAoIXRva2VuKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAnRXhlY3V0aW5nIGEgc2VjdXJlIHJlcXVlc3Qgd2l0aG91dCBUT0tFTi4gJ1xuICAgICAgICAgICsgJ0F1dGhvcml6YXRpb24gaGVhZGVyIHdpbGwgbm90IGJlIHNldCEnXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBoZWFkZXIuQXV0aG9yaXphdGlvbiA9IGBCZWFyZXIgJHt0b2tlbn1gO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnNlY3VyZVJlcXVlc3QgPSBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gaGVhZGVyO1xuICB9XG5cblxuXG4gIC8qKiBSYXcgcmVxdWVzdCBtZXRob2QgKi9cbiAgcHJvdGVjdGVkIHJlcXVlc3QoXG4gICAgbWV0aG9kOiBIdHRwTWV0aG9kLCB1cmw6IHN0cmluZywgZGF0YT86IGFueSwgcmVzcG9uc2VUeXBlPzogc3RyaW5nLFxuICAgIGh0dHBPcHRpb25zOiBJSHR0cE9wdGlvbnMgPSB7fVxuICApOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIGNvbnN0IG1zRGVsYXkgPSBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogMjAwMCkgKyAxMDAwKTtcbiAgICBjb25zdCBoZWFkZXIgPSB0aGlzLmJ1aWxkSGVhZGVycygpO1xuXG4gICAgY29uc3QgclR5cGUgPSAocmVzcG9uc2VUeXBlID8gcmVzcG9uc2VUeXBlIDogJ2pzb24nKSBhcyAndGV4dCc7XG5cbiAgICBpZiAodGhpcy53aXRoRmlsZXNSZXF1ZXN0KSB7IGRhdGEgPSB0aGlzLmNyZWF0ZUZvcm1EYXRhKGRhdGEpOyB0aGlzLndpdGhGaWxlc1JlcXVlc3QgPSBmYWxzZTsgfVxuXG4gICAgbGV0IGNhY2hlS2V5ID0gJyc7XG4gICAgaWYgKHRoaXMuY2FjaGVkUmVxdWVzdCkge1xuICAgICAgY2FjaGVLZXkgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChtZXRob2QgKyAnXycgKyB1cmwgKyAnXycgKyAobWV0aG9kID09PSBIdHRwTWV0aG9kLkdldCA/IEpTT04uc3RyaW5naWZ5KGRhdGEpIDogJycpKSkpO1xuICAgICAgaWYgKCF0aGlzLmludmFsaWRhdGVDYWNoZSkge1xuICAgICAgICBjb25zdCBjYWNoZWQgPSB0aGlzLmNhY2hlLmdldChjYWNoZUtleSk7XG4gICAgICAgIGlmIChjYWNoZWQpIHtcbiAgICAgICAgICB0aGlzLmNhY2hlZFJlcXVlc3QgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gb2YoY2FjaGVkKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jYWNoZS5pbnZhbGlkYXRlKGNhY2hlS2V5KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgYm9keTogbWV0aG9kID09PSBIdHRwTWV0aG9kLkdldCA/IHt9IDogZGF0YSxcbiAgICAgIHJlc3BvbnNlVHlwZTogclR5cGUsXG4gICAgICBwYXJhbXM6IG1ldGhvZCA9PT0gSHR0cE1ldGhvZC5HZXQgPyBkYXRhIDoge30sXG4gICAgICBoZWFkZXJzOiBoZWFkZXJcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXMuaHR0cFxuICAgICAgLnJlcXVlc3QoXG4gICAgICAgIHRoaXMuY29uZmlnLm1vY2tEYXRhID8gSHR0cE1ldGhvZC5HZXQgOiBtZXRob2QsIHRoaXMuYnVpbGRVcmwodXJsKSxcbiAgICAgICAgeyAuLi5vcHRpb25zLCAuLi5odHRwT3B0aW9ucyB9XG4gICAgICApXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5jYW5jZWxQZW5kaW5nJCkpXG4gICAgICAucGlwZShkZWxheSh0aGlzLmNvbmZpZy5tb2NrRGF0YSA/IG1zRGVsYXkgOiAwKSlcbiAgICAgIC5waXBlKHRhcChyZXNwID0+IHtcbiAgICAgICAgaWYgKHRoaXMuY2FjaGVkUmVxdWVzdCkge1xuICAgICAgICAgIHRoaXMuY2FjaGVkUmVxdWVzdCA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuY2FjaGUuc2V0KGNhY2hlS2V5LCByZXNwKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgKSlcbiAgICAgIC5waXBlKGNhdGNoRXJyb3IoKGVycikgPT4ge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgdGhpcy5jb25maWcuVW5hdXRob3JpemVkUmVkaXJlY3RVcmlcbiAgICAgICAgICAmJiB1cmwgIT09IHRoaXMuY29uZmlnLmF1dGhVcmlcbiAgICAgICAgICAmJiBlcnIuc3RhdHVzID09PSA0MDFcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3RoaXMuY29uZmlnLlVuYXV0aG9yaXplZFJlZGlyZWN0VXJpXSkudGhlbigoKSA9PiB7IH0pO1xuICAgICAgICAgIHRoaXMuY2FuY2VsUGVuZGluZ1JlcXVlc3RzKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyKTtcbiAgICAgIH0pKTtcbiAgfVxufVxuIl19