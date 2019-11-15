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
            _this.token = payload.token;
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
        var nUrl = this.config.endPoint.replace(/\/$/, '') + "/" + url.replace(/^\//g, '');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXJlc3Quc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1yZXN0LyIsInNvdXJjZXMiOlsibGliL25neC1yZXN0LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNyRCxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDM0MsT0FBTyxFQUFjLE9BQU8sRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzNELE9BQU8sRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNuRSxPQUFPLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUdqRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDaEQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ3hFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7Ozs7OztBQUUvQztJQStCRSwyQkFDVSxJQUFnQixFQUNoQixPQUFzQixFQUN0QixLQUFtQixFQUNWLE1BQWMsRUFDbkIsTUFBeUI7UUFKN0IsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUNoQixZQUFPLEdBQVAsT0FBTyxDQUFlO1FBQ3RCLFVBQUssR0FBTCxLQUFLLENBQWM7UUFDVixXQUFNLEdBQU4sTUFBTSxDQUFROzs7O1FBOUJ2QixtQkFBYyxHQUFxQixJQUFJLE9BQU8sRUFB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R2hDLDRDQUFrQzs7Ozs7SUFHaEMsaUNBQXdCOzs7OztJQUN4QixvQ0FBOEI7Ozs7O0lBQzlCLGtDQUEyQjs7Ozs7SUFDM0IsbUNBQStCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgQ29va2llU2VydmljZSB9IGZyb20gJ25neC1jb29raWUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3ViamVjdCwgdGhyb3dFcnJvciwgb2YgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHRha2VVbnRpbCwgdGFwLCBjYXRjaEVycm9yLCBkZWxheSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IGlzQWZ0ZXIsIGZyb21Vbml4VGltZSB9IGZyb20gJ2RhdGUtZm5zJztcblxuaW1wb3J0IHsgSUh0dHBPcHRpb25zIH0gZnJvbSAnLi9odHRwLW9wdGlvbnMuaW50ZXJmYWNlJztcbmltcG9ydCB7IEh0dHBNZXRob2QgfSBmcm9tICcuL2h0dHAtbWV0aG9kLmVudW0nO1xuaW1wb3J0IHsgSnd0SGVscGVyIH0gZnJvbSAnLi9qd3QtaGVscGVyLmNsYXNzJztcbmltcG9ydCB7IFJlc3RTZXJ2aWNlQ29uZmlnLCBUeXBlVG9rZW5TdG9yYWdlIH0gZnJvbSAnLi9uZ3gtcmVzdC5jb25maWcnO1xuaW1wb3J0IHsgQ2FjaGVTZXJ2aWNlIH0gZnJvbSAnLi9jYWNoZS5zZXJ2aWNlJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgUmVzdENsaWVudFNlcnZpY2Uge1xuICAvKiogSGFuZGxlciB1c2VkIHRvIHN0b3AgYWxsIHBlbmRpbmcgcmVxdWVzdHMgKi9cbiAgcHJvdGVjdGVkIGNhbmNlbFBlbmRpbmckOiBTdWJqZWN0PGJvb2xlYW4+ID0gbmV3IFN1YmplY3Q8Ym9vbGVhbj4oKTtcblxuICAvKiogIERlZmF1bHQgcmVxdWVzdHMgaGVhZGVyICovXG4gIHByb3RlY3RlZCBiYXNlSGVhZGVyID0ge1xuICAgICdDYWNoZS1Db250cm9sJzogJ25vLWNhY2hlJyxcbiAgICBhY2NlcHQ6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICBQcmFnbWE6ICduby1jYWNoZScsXG4gICAgQXV0aG9yaXphdGlvbjogJycsXG4gICAgJ0FjY2VwdC1MYW5ndWFnZSc6ICcqJ1xuICB9O1xuXG4gIC8qKiBTZXJ2aWNlIGNvbmZpZ3VyYXRpb24gcGFyYW1ldGVycyAqL1xuICBwcm90ZWN0ZWQgY29uZmlnOiBSZXN0U2VydmljZUNvbmZpZztcblxuICAvKiogV2hlbiB0cnVlLCB0aGUgcmVxdWVzdCBoZWFkZXIgd2lsbCBpbmNsdWRlIHRoZSBhdXRoZW50aWNhdGlvbiB0b2tlbiAqL1xuICBwcm90ZWN0ZWQgc2VjdXJlUmVxdWVzdCA9IGZhbHNlO1xuXG4gIC8qKiBIb2xkcyBhIGxpc3Qgb2YgZmlsZXMgdG8gYmUgdXBsb2FkIG9uIHJlcXVlc3QgKi9cbiAgcHJvdGVjdGVkIHdpdGhGaWxlc1JlcXVlc3QgPSBmYWxzZTtcblxuICAvKiogUHJlZmVyIGNhY2hlICovXG4gIHByb3RlY3RlZCBjYWNoZWRSZXF1ZXN0ID0gZmFsc2U7XG5cbiAgLyoqIEludmFsaWRhdGUgY2FjaGUgKi9cbiAgcHJvdGVjdGVkIGludmFsaWRhdGVDYWNoZSA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCxcbiAgICBwcml2YXRlIGNvb2tpZXM6IENvb2tpZVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBjYWNoZTogQ2FjaGVTZXJ2aWNlLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgcm91dGVyOiBSb3V0ZXIsXG4gICAgQE9wdGlvbmFsKCkgY29uZmlnOiBSZXN0U2VydmljZUNvbmZpZ1xuICApIHtcbiAgICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgIGVuZFBvaW50OiAnJyxcbiAgICAgIHRva2VuTmFtZTogJ0F1dGhUb2tlbicsXG4gICAgICB0b2tlblN0b3JhZ2U6IFR5cGVUb2tlblN0b3JhZ2UuY29va2llLFxuICAgICAgc2VjdXJlQ29va2llOiBmYWxzZSxcbiAgICAgIG1vY2tEYXRhOiBmYWxzZSxcbiAgICAgIHZhbGlkYXRpb25Ub2tlblVyaTogJy9pbmZvJyxcbiAgICAgIGF1dGhVcmk6ICcvYXV0aG9yaXplJyxcbiAgICAgIFVuYXV0aG9yaXplZFJlZGlyZWN0VXJpOiBudWxsXG4gICAgfSBhcyBSZXN0U2VydmljZUNvbmZpZztcblxuICAgIGlmIChjb25maWcpIHtcbiAgICAgIHRoaXMuc2V0Q29uZmlnKGNvbmZpZyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgUmVzdCBDbGllbnQgY29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzLlxuICAgKlxuICAgKiBDQVVUSU9OOiBUaGlzIG1ldGhvZCBvdmVycmlkZXMgdGhlIGN1cnJlbnQgY29uZmlndXJhdGlvbiBzZXR0aW5nc1xuICAgKiBhbmQgdGhpcyBzZXR0aW5ncyB3aWxsIGFwcGx5IHRvIGFsbCBmb2xsb3dpbmcgcmVxdWVzdHNcbiAgICovXG4gIHB1YmxpYyBzZXRDb25maWcoY29uZmlnOiBSZXN0U2VydmljZUNvbmZpZyk6IFJlc3RDbGllbnRTZXJ2aWNlIHtcbiAgICB0aGlzLmNvbmZpZyA9IHsgLi4udGhpcy5jb25maWcsIC4uLmNvbmZpZyB9IGFzIFJlc3RTZXJ2aWNlQ29uZmlnO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqIFJldHVybiB0aGUgY3VycmVudCBSZXN0IENsaWVudCBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnMuICAqL1xuICBwdWJsaWMgZ2V0Q29uZmlnKCk6IFJlc3RTZXJ2aWNlQ29uZmlnIHtcbiAgICByZXR1cm4gdGhpcy5jb25maWc7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBBUEkgVG9rZW4gZnJvbSBjb29raWVzXG4gICAqL1xuICBwdWJsaWMgZ2V0IHRva2VuKCk6IHN0cmluZyB7XG4gICAgbGV0IHRva2VuID0gJyc7XG5cbiAgICBzd2l0Y2ggKHRoaXMuY29uZmlnLnRva2VuU3RvcmFnZSkge1xuICAgICAgY2FzZSBUeXBlVG9rZW5TdG9yYWdlLmNvb2tpZTpcbiAgICAgICAgdG9rZW4gPSB0aGlzLmNvb2tpZXMuZ2V0KHRoaXMuY29uZmlnLnRva2VuTmFtZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBUeXBlVG9rZW5TdG9yYWdlLmxvY2FsU3RvcmFnZTpcbiAgICAgICAgdG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmNvbmZpZy50b2tlbk5hbWUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVHlwZVRva2VuU3RvcmFnZS5zZXNzaW9uU3RvcmFnZTpcbiAgICAgICAgdG9rZW4gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKHRoaXMuY29uZmlnLnRva2VuTmFtZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIFRva2VuIFN0b3JhZ2UgbWV0aG9kJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuICF0b2tlbiB8fCB0eXBlb2YgdG9rZW4gPT09ICd1bmRlZmluZWQnID8gJycgOiB0b2tlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTYXZlIHRoZSBBUEkgVG9rZW4gY29va2llXG4gICAqL1xuICBwdWJsaWMgc2V0IHRva2VuKHRva2VuOiBzdHJpbmcpIHtcbiAgICBjb25zdCBkZWNvZGVkID0gSnd0SGVscGVyLmRlY29kZVRva2VuKHRva2VuKTtcbiAgICBjb25zdCBleHBpcmVzID0gZnJvbVVuaXhUaW1lKGRlY29kZWQuZXhwKTtcblxuICAgIHN3aXRjaCAodGhpcy5jb25maWcudG9rZW5TdG9yYWdlKSB7XG4gICAgICBjYXNlIFR5cGVUb2tlblN0b3JhZ2UuY29va2llOlxuICAgICAgICB0aGlzLmNvb2tpZXMucHV0KFxuICAgICAgICAgIHRoaXMuY29uZmlnLnRva2VuTmFtZSxcbiAgICAgICAgICB0b2tlbixcbiAgICAgICAgICB7IHNlY3VyZTogdGhpcy5jb25maWcuc2VjdXJlQ29va2llLCBleHBpcmVzIH1cbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFR5cGVUb2tlblN0b3JhZ2UubG9jYWxTdG9yYWdlOlxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmNvbmZpZy50b2tlbk5hbWUsIHRva2VuKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFR5cGVUb2tlblN0b3JhZ2Uuc2Vzc2lvblN0b3JhZ2U6XG4gICAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0odGhpcy5jb25maWcudG9rZW5OYW1lLCB0b2tlbik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIFRva2VuIFN0b3JhZ2UgbWV0aG9kJyk7XG4gICAgfVxuICB9XG5cblxuICAvKipcbiAgICogUmVtb3ZlIHRoZSBBdXRoZW50aWNhdGlvbiB0b2tlbiBjb29raWVcbiAgICovXG4gIHB1YmxpYyByZXZva2UoKTogdm9pZCB7XG4gICAgc3dpdGNoICh0aGlzLmNvbmZpZy50b2tlblN0b3JhZ2UpIHtcbiAgICAgIGNhc2UgVHlwZVRva2VuU3RvcmFnZS5jb29raWU6XG4gICAgICAgIHRoaXMuY29va2llcy5yZW1vdmVBbGwoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFR5cGVUb2tlblN0b3JhZ2UubG9jYWxTdG9yYWdlOlxuICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLmNvbmZpZy50b2tlbk5hbWUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVHlwZVRva2VuU3RvcmFnZS5zZXNzaW9uU3RvcmFnZTpcbiAgICAgICAgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLmNvbmZpZy50b2tlbk5hbWUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBUb2tlbiBTdG9yYWdlIG1ldGhvZCcpO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogUmVxdWVzdCBhbiBBdXRob3JpemF0aW9uIHRva2VuXG4gICAqIFRoZSBkZWZhdWx0IGF1dGhvcml6YXRpb24gVVJJIGlzICdbQVBJX0VORF9QT0lOVF0vYXV0aG9yaXplJ1xuICAgKiBAcGFyYW0gdXNlcm5hbWUgVXNlcm5hbWVcbiAgICogQHBhcmFtIHBhc3N3b3JkIFBhc3N3b3JkXG4gICAqL1xuICBwdWJsaWMgYXV0aG9yaXplKHVzZXJuYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLnBvc3QodGhpcy5jb25maWcuYXV0aFVyaSwgeyB1c2VybmFtZSwgcGFzc3dvcmQgfSlcbiAgICAgIC5waXBlKFxuICAgICAgICB0YXAocGF5bG9hZCA9PiB7XG4gICAgICAgICAgdGhpcy50b2tlbiA9IHBheWxvYWQudG9rZW47XG4gICAgICAgIH0pXG4gICAgICApO1xuICB9XG5cbiAgLyoqIFZhbGlkYXRlIHRoZSBBdXRoZW50aWNhdGlvbiB0b2tlbiBhZ2FpbnN0IHRoZSBBUEkgKi9cbiAgcHVibGljIHZhbGlkYXRlVG9rZW4odXJsOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLnNlY3VyZWQoKS5yZXF1ZXN0KEh0dHBNZXRob2QuUG9zdCwgdXJsKTtcbiAgfVxuXG4gIC8qKiBSZW1vdmVzIGF1dGhvcml6YXRpb24gdG9rZW4gKi9cbiAgcHVibGljIGRlYXV0aG9yaXplKHVybDogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5zZWN1cmVkKCkucmVxdWVzdChIdHRwTWV0aG9kLkdldCwgdXJsKVxuICAgICAgLnBpcGUoXG4gICAgICAgIHRhcCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5yZXZva2UoKTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gIH1cblxuICAvKiogQ2hlY2sgaWYgdGhlIGNsaWVudCBpcyBhbHJlYWR5IEF1dGhlbnRpY2F0ZSAgKi9cbiAgcHVibGljIGlzQXV0aG9yaXplZCgpOiBib29sZWFuIHtcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMudG9rZW47XG4gICAgY29uc3QgZGVjb2RlZCA9IEp3dEhlbHBlci5kZWNvZGVUb2tlbih0b2tlbik7XG4gICAgcmV0dXJuIGRlY29kZWQgIT09IG51bGwgJiYgIWlzQWZ0ZXIobmV3IERhdGUoKSwgZnJvbVVuaXhUaW1lKGRlY29kZWQuZXhwKSk7XG4gIH1cblxuICAvKiogQ2FuY2VsIGFsbCBwZW5kaW5nIHJlcXVlc3RzICovXG4gIHB1YmxpYyBjYW5jZWxQZW5kaW5nUmVxdWVzdHMoKTogdm9pZCB7XG4gICAgdGhpcy5jYW5jZWxQZW5kaW5nJC5uZXh0KHRydWUpO1xuICB9XG5cblxuICBwdWJsaWMgY2FjaGVkKGludmFsaWRhdGUgPSBmYWxzZSkge1xuICAgIHRoaXMuY2FjaGVkUmVxdWVzdCA9IHRydWU7XG4gICAgdGhpcy5pbnZhbGlkYXRlQ2FjaGUgPSBpbnZhbGlkYXRlO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHJlcXVlc3QgbW9kZSB0byBTRUNVUkVEIGZvciB0aGUgbmV4dCByZXF1ZXN0LlxuICAgKlxuICAgKiBTZWN1cmVkIE1vZGUgZm9yY2UgdGhlIG5leHQgcmVxdWVzdCB0byBpbmNsdWRlIHRoZSBhdXRoZW50aWNhdGlvbiB0b2tlbi5cbiAgICogVGhlIHRva2VuIG11c3QgYmUgcmVxdWVzdGVkIHByZXZpb3VzbHkgdXNpbmcgdGhlIFwiYXV0aG9yaXplXCIgbWV0aG9kLlxuICAgKi9cbiAgcHVibGljIHNlY3VyZWQoKTogUmVzdENsaWVudFNlcnZpY2Uge1xuICAgIHRoaXMuc2VjdXJlUmVxdWVzdCA9IHRydWU7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHJlcXVlc3QgbW9kZSB0byBQVUJMSUMgZm9yIHRoZSBuZXh0IHJlcXVlc3QuXG4gICAqXG4gICAqIFB1YmxpYyBpcyB0aGUgZGVmYXVsdCByZXF1ZXN0IG1vZGUgYW5kIGVuc3VyZSB0aGF0IG5vIGF1dGhlbnRpY2F0aW9uIHRva2VuXG4gICAqIHdpbGwgYmUgcGFzcyBvbiB0aGUgbmV4dCByZXF1ZXN0LlxuICAgKi9cbiAgcHVibGljIHB1YmxpYygpOiBSZXN0Q2xpZW50U2VydmljZSB7XG4gICAgdGhpcy5zZWN1cmVSZXF1ZXN0ID0gZmFsc2U7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBBUEkgcmVxdWVzdCB1c2luZyBHRVQgbWV0aG9kXG4gICAqXG4gICAqIEBwYXJhbSB1cmxcbiAgICogQHBhcmFtIGRhdGEgQSBsaXN0IG9mIHBhcmFtZXRlc1xuICAgKi9cbiAgcHVibGljIGdldCh1cmw6IHN0cmluZywgZGF0YT86IHt9KTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KEh0dHBNZXRob2QuR2V0LCB1cmwsIGRhdGEpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFQSSByZXF1ZXN0IHVzaW5nIFBPU1QgbWV0aG9kXG4gICAqXG4gICAqIEBwYXJhbSB1cmxcbiAgICogQHBhcmFtIGRhdGFcbiAgICogQHBhcmFtIHJlc3BvbnNlVHlwZVxuICAgKiBAcGFyYW0gaHR0cE9wdGlvbnNcbiAgICovXG4gIHB1YmxpYyBwb3N0KHVybDogc3RyaW5nLCBkYXRhPzoge30sIHJlc3BvbnNlVHlwZT86IHN0cmluZywgaHR0cE9wdGlvbnM6IElIdHRwT3B0aW9ucyA9IHt9KTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KEh0dHBNZXRob2QuUG9zdCwgdXJsLCBkYXRhLCByZXNwb25zZVR5cGUsIGh0dHBPcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBUEkgcmVxdWVzdCB1c2luZyBQVVQgbWV0aG9kXG4gICAqXG4gICAqIEBwYXJhbSB1cmxcbiAgICogQHBhcmFtIGRhdGFcbiAgICogQHBhcmFtIHJlc3BvbnNlVHlwZVxuICAgKiBAcGFyYW0gaHR0cE9wdGlvbnNcbiAgICovXG4gIHB1YmxpYyBwdXQodXJsOiBzdHJpbmcsIGRhdGE/OiB7fSwgcmVzcG9uc2VUeXBlPzogc3RyaW5nLCBodHRwT3B0aW9uczogSUh0dHBPcHRpb25zID0ge30pOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QoSHR0cE1ldGhvZC5QdXQsIHVybCwgZGF0YSwgcmVzcG9uc2VUeXBlLCBodHRwT3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQVBJIHJlcXVlc3QgdXNpbmcgREVMRVRFIG1ldGhvZFxuICAgKlxuICAgKiBAcGFyYW0gdXJsXG4gICAqIEBwYXJhbSBkYXRhXG4gICAqIEBwYXJhbSByZXNwb25zZVR5cGVcbiAgICovXG4gIHB1YmxpYyBkZWxldGUodXJsOiBzdHJpbmcsIGRhdGE/OiB7fSwgcmVzcG9uc2VUeXBlPzogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KEh0dHBNZXRob2QuRGVsZXRlLCB1cmwsIGRhdGEsIHJlc3BvbnNlVHlwZSk7XG4gIH1cblxuICAvKiogU2V0IHRoZSB1cGxvYWQgZmlsZSBtb2RlICovXG4gIHB1YmxpYyB3aXRoRmlsZXMoKTogUmVzdENsaWVudFNlcnZpY2Uge1xuICAgIHRoaXMud2l0aEZpbGVzUmVxdWVzdCA9IHRydWU7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBGb3JtRGF0YSBvYmplY3QgdG8gYmUgc2VuZCBhcyByZXF1ZXN0IHBheWxvYWQgZGF0YVxuICAgKi9cbiAgcHJvdGVjdGVkIGNyZWF0ZUZvcm1EYXRhKG9iamVjdDogYW55LCBmb3JtPzogRm9ybURhdGEsIG5hbWVzcGFjZT86IHN0cmluZyk6IEZvcm1EYXRhIHtcbiAgICBjb25zdCBmb3JtRGF0YSA9IGZvcm0gfHwgbmV3IEZvcm1EYXRhKCk7XG5cbiAgICBmb3IgKGNvbnN0IHByb3BlcnR5IGluIG9iamVjdCkge1xuXG4gICAgICBpZiAoIW9iamVjdC5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkgfHwgIW9iamVjdFtwcm9wZXJ0eV0pIHsgY29udGludWU7IH1cblxuICAgICAgY29uc3QgZm9ybUtleSA9IG5hbWVzcGFjZSA/IGAke25hbWVzcGFjZX1bJHtwcm9wZXJ0eX1dYCA6IHByb3BlcnR5O1xuICAgICAgaWYgKG9iamVjdFtwcm9wZXJ0eV0gaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZChmb3JtS2V5LCBvYmplY3RbcHJvcGVydHldLnRvSVNPU3RyaW5nKCkpO1xuICAgICAgfSBlbHNlIGlmIChvYmplY3RbcHJvcGVydHldIGluc3RhbmNlb2YgRmlsZUxpc3QpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvYmplY3RbcHJvcGVydHldLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgZm9ybURhdGEuYXBwZW5kKGAke3Byb3BlcnR5fVtdYCwgb2JqZWN0W3Byb3BlcnR5XS5pdGVtKGkpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgdHlwZW9mIG9iamVjdFtwcm9wZXJ0eV0gPT09ICdvYmplY3QnICYmICEob2JqZWN0W3Byb3BlcnR5XSBpbnN0YW5jZW9mIEZpbGUpKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlRm9ybURhdGEob2JqZWN0W3Byb3BlcnR5XSwgZm9ybURhdGEsIGZvcm1LZXkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKGZvcm1LZXksIG9iamVjdFtwcm9wZXJ0eV0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZm9ybURhdGE7XG4gIH1cblxuXG5cbiAgcHJvdGVjdGVkIGJ1aWxkVXJsKHVybDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBsZXQgblVybCA9IGAke3RoaXMuY29uZmlnLmVuZFBvaW50LnJlcGxhY2UoL1xcLyQvLCAnJyl9LyR7dXJsLnJlcGxhY2UoL15cXC8vZywgJycpfWA7XG4gICAgY29uc3QgbWF0Y2ggPSBuVXJsLm1hdGNoKC9cXC4oWzAtOWEtel0rKSg/OltcXD8jXXwkKS9pKTtcblxuICAgIGlmICh0aGlzLmNvbmZpZy5tb2NrRGF0YSAmJiBtYXRjaCA9PSBudWxsKSB7XG4gICAgICBuVXJsID0gYCR7blVybH0uanNvbmA7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5Vcmw7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHJlcXVlc3QgaGVhZGVycyBiYXNlZCBvbiBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnNcbiAgICovXG4gIHByaXZhdGUgYnVpbGRIZWFkZXJzKCkge1xuICAgIGNvbnN0IGhlYWRlciA9IHsgLi4udGhpcy5iYXNlSGVhZGVyIH07XG5cbiAgICBpZiAodGhpcy5jb25maWcubGFuZ3VhZ2UpIHsgaGVhZGVyWydBY2NlcHQtTGFuZ3VhZ2UnXSA9IHRoaXMuY29uZmlnLmxhbmd1YWdlOyB9XG5cbiAgICBpZiAodGhpcy5zZWN1cmVSZXF1ZXN0KSB7XG4gICAgICBjb25zdCB0b2tlbiA9IHRoaXMudG9rZW47XG4gICAgICBpZiAoIXRva2VuKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAnRXhlY3V0aW5nIGEgc2VjdXJlIHJlcXVlc3Qgd2l0aG91dCBUT0tFTi4gJ1xuICAgICAgICAgICsgJ0F1dGhvcml6YXRpb24gaGVhZGVyIHdpbGwgbm90IGJlIHNldCEnXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBoZWFkZXIuQXV0aG9yaXphdGlvbiA9IGBCZWFyZXIgJHt0b2tlbn1gO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnNlY3VyZVJlcXVlc3QgPSBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gaGVhZGVyO1xuICB9XG5cblxuXG4gIC8qKiBSYXcgcmVxdWVzdCBtZXRob2QgKi9cbiAgcHJvdGVjdGVkIHJlcXVlc3QoXG4gICAgbWV0aG9kOiBIdHRwTWV0aG9kLCB1cmw6IHN0cmluZywgZGF0YT86IGFueSwgcmVzcG9uc2VUeXBlPzogc3RyaW5nLFxuICAgIGh0dHBPcHRpb25zOiBJSHR0cE9wdGlvbnMgPSB7fVxuICApOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIGNvbnN0IG1zRGVsYXkgPSBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogMjAwMCkgKyAxMDAwKTtcbiAgICBjb25zdCBoZWFkZXIgPSB0aGlzLmJ1aWxkSGVhZGVycygpO1xuXG4gICAgY29uc3QgclR5cGUgPSAocmVzcG9uc2VUeXBlID8gcmVzcG9uc2VUeXBlIDogJ2pzb24nKSBhcyAndGV4dCc7XG5cbiAgICBpZiAodGhpcy53aXRoRmlsZXNSZXF1ZXN0KSB7IGRhdGEgPSB0aGlzLmNyZWF0ZUZvcm1EYXRhKGRhdGEpOyB0aGlzLndpdGhGaWxlc1JlcXVlc3QgPSBmYWxzZTsgfVxuXG4gICAgbGV0IGNhY2hlS2V5ID0gJyc7XG4gICAgaWYgKHRoaXMuY2FjaGVkUmVxdWVzdCkge1xuICAgICAgY2FjaGVLZXkgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChtZXRob2QgKyAnXycgKyB1cmwgKyAnXycgKyAobWV0aG9kID09PSBIdHRwTWV0aG9kLkdldCA/IEpTT04uc3RyaW5naWZ5KGRhdGEpIDogJycpKSkpO1xuICAgICAgaWYgKCF0aGlzLmludmFsaWRhdGVDYWNoZSkge1xuICAgICAgICBjb25zdCBjYWNoZWQgPSB0aGlzLmNhY2hlLmdldChjYWNoZUtleSk7XG4gICAgICAgIGlmIChjYWNoZWQpIHtcbiAgICAgICAgICB0aGlzLmNhY2hlZFJlcXVlc3QgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gb2YoY2FjaGVkKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jYWNoZS5pbnZhbGlkYXRlKGNhY2hlS2V5KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgYm9keTogbWV0aG9kID09PSBIdHRwTWV0aG9kLkdldCA/IHt9IDogZGF0YSxcbiAgICAgIHJlc3BvbnNlVHlwZTogclR5cGUsXG4gICAgICBwYXJhbXM6IG1ldGhvZCA9PT0gSHR0cE1ldGhvZC5HZXQgPyBkYXRhIDoge30sXG4gICAgICBoZWFkZXJzOiBoZWFkZXJcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXMuaHR0cFxuICAgICAgLnJlcXVlc3QoXG4gICAgICAgIHRoaXMuY29uZmlnLm1vY2tEYXRhID8gSHR0cE1ldGhvZC5HZXQgOiBtZXRob2QsIHRoaXMuYnVpbGRVcmwodXJsKSxcbiAgICAgICAgeyAuLi5vcHRpb25zLCAuLi5odHRwT3B0aW9ucyB9XG4gICAgICApXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5jYW5jZWxQZW5kaW5nJCkpXG4gICAgICAucGlwZShkZWxheSh0aGlzLmNvbmZpZy5tb2NrRGF0YSA/IG1zRGVsYXkgOiAwKSlcbiAgICAgIC5waXBlKHRhcCgocmVzcDogYW55KSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmNhY2hlZFJlcXVlc3QpIHtcbiAgICAgICAgICB0aGlzLmNhY2hlZFJlcXVlc3QgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLmNhY2hlLnNldChjYWNoZUtleSwgcmVzcCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgICkpXG4gICAgICAucGlwZShjYXRjaEVycm9yKChlcnIpID0+IHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHRoaXMuY29uZmlnLlVuYXV0aG9yaXplZFJlZGlyZWN0VXJpXG4gICAgICAgICAgJiYgdXJsICE9PSB0aGlzLmNvbmZpZy5hdXRoVXJpXG4gICAgICAgICAgJiYgZXJyLnN0YXR1cyA9PT0gNDAxXG4gICAgICAgICkge1xuICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFt0aGlzLmNvbmZpZy5VbmF1dGhvcml6ZWRSZWRpcmVjdFVyaV0pLnRoZW4oKCkgPT4geyB9KTtcbiAgICAgICAgICB0aGlzLmNhbmNlbFBlbmRpbmdSZXF1ZXN0cygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aHJvd0Vycm9yKGVycik7XG4gICAgICB9KSk7XG4gIH1cbn1cbiJdfQ==