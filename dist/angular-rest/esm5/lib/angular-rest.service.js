/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie';
import { Subject, throwError } from 'rxjs';
import { takeUntil, tap, catchError, delay } from 'rxjs/operators';
import { isAfter, fromUnixTime } from 'date-fns';
import { HttpMethod } from './http-method.enum';
import { JwtHelper } from './jwt-helper.class';
import { RestServiceConfig, TypeTokenStorage } from './angular-rest.config';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "ngx-cookie";
import * as i3 from "@angular/router";
import * as i4 from "./angular-rest.config";
var RestClientService = /** @class */ (function () {
    function RestClientService(http, cookies, router, config) {
        this.http = http;
        this.cookies = cookies;
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
        { type: Router },
        { type: RestServiceConfig, decorators: [{ type: Optional }] }
    ]; };
    /** @nocollapse */ RestClientService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function RestClientService_Factory() { return new RestClientService(i0.ɵɵinject(i1.HttpClient), i0.ɵɵinject(i2.CookieService), i0.ɵɵinject(i3.Router), i0.ɵɵinject(i4.RestServiceConfig, 8)); }, token: RestClientService, providedIn: "root" });
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
    RestClientService.prototype.router;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1yZXN0LnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtcmVzdC8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLXJlc3Quc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDbEQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUMzQyxPQUFPLEVBQWMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUN2RCxPQUFPLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbkUsT0FBTyxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFHakQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUMvQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQzs7Ozs7O0FBRTVFO0lBeUJFLDJCQUNVLElBQWdCLEVBQ2hCLE9BQXNCLEVBQ2IsTUFBYyxFQUNuQixNQUF5QjtRQUg3QixTQUFJLEdBQUosSUFBSSxDQUFZO1FBQ2hCLFlBQU8sR0FBUCxPQUFPLENBQWU7UUFDYixXQUFNLEdBQU4sTUFBTSxDQUFROzs7O1FBdkJ2QixtQkFBYyxHQUFxQixJQUFJLE9BQU8sRUFBVyxDQUFDOzs7O1FBRzFELGVBQVUsR0FBRztZQUNyQixlQUFlLEVBQUUsVUFBVTtZQUMzQixNQUFNLEVBQUUsa0JBQWtCO1lBQzFCLE1BQU0sRUFBRSxVQUFVO1lBQ2xCLGFBQWEsRUFBRSxFQUFFO1lBQ2pCLGlCQUFpQixFQUFFLEdBQUc7U0FDdkIsQ0FBQzs7OztRQU1RLGtCQUFhLEdBQUcsS0FBSyxDQUFDOzs7O1FBR3RCLHFCQUFnQixHQUFHLEtBQUssQ0FBQztRQVFqQyxJQUFJLENBQUMsTUFBTSxHQUFHLG1CQUFBO1lBQ1osUUFBUSxFQUFFLEVBQUU7WUFDWixTQUFTLEVBQUUsV0FBVztZQUN0QixZQUFZLEVBQUUsZ0JBQWdCLENBQUMsTUFBTTtZQUNyQyxZQUFZLEVBQUUsS0FBSztZQUNuQixRQUFRLEVBQUUsS0FBSztZQUNmLGtCQUFrQixFQUFFLE9BQU87WUFDM0IsT0FBTyxFQUFFLFlBQVk7WUFDckIsdUJBQXVCLEVBQUUsSUFBSTtTQUM5QixFQUFxQixDQUFDO1FBRXZCLElBQUksTUFBTSxFQUFFO1lBQ1YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUN4QjtJQUNILENBQUM7SUFFRDs7Ozs7T0FLRzs7Ozs7Ozs7O0lBQ0kscUNBQVM7Ozs7Ozs7O0lBQWhCLFVBQWlCLE1BQXlCO1FBQ3hDLElBQUksQ0FBQyxNQUFNLEdBQUcsd0NBQUssSUFBSSxDQUFDLE1BQU0sRUFBSyxNQUFNLEdBQXVCLENBQUM7UUFDakUsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsZ0VBQWdFOzs7OztJQUN6RCxxQ0FBUzs7OztJQUFoQjtRQUNFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNyQixDQUFDO0lBS0Qsc0JBQVcsb0NBQUs7UUFIaEI7O1dBRUc7Ozs7O1FBQ0g7O2dCQUNNLEtBQUssR0FBRyxFQUFFO1lBRWQsUUFBUSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRTtnQkFDaEMsS0FBSyxnQkFBZ0IsQ0FBQyxNQUFNO29CQUMxQixLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDaEQsTUFBTTtnQkFDUixLQUFLLGdCQUFnQixDQUFDLFlBQVk7b0JBQ2hDLEtBQUssR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQ3BELE1BQU07Z0JBQ1IsS0FBSyxnQkFBZ0IsQ0FBQyxjQUFjO29CQUNsQyxLQUFLLEdBQUcsY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUN0RCxNQUFNO2dCQUNSO29CQUNFLE1BQU0sSUFBSSxLQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQzthQUNuRDtZQUVELE9BQU8sQ0FBQyxLQUFLLElBQUksT0FBTyxLQUFLLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUM3RCxDQUFDO1FBRUQ7O1dBRUc7Ozs7OztRQUNILFVBQWlCLEtBQWE7O2dCQUN0QixPQUFPLEdBQUcsU0FBUyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUM7O2dCQUN0QyxPQUFPLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUM7WUFFekMsUUFBUSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRTtnQkFDaEMsS0FBSyxnQkFBZ0IsQ0FBQyxNQUFNO29CQUMxQixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FDZCxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFDckIsS0FBSyxFQUNMLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLE9BQU8sU0FBQSxFQUFFLENBQzlDLENBQUM7b0JBQ0YsTUFBTTtnQkFDUixLQUFLLGdCQUFnQixDQUFDLFlBQVk7b0JBQ2hDLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQ25ELE1BQU07Z0JBQ1IsS0FBSyxnQkFBZ0IsQ0FBQyxjQUFjO29CQUNsQyxjQUFjLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUNyRCxNQUFNO2dCQUNSO29CQUNFLE1BQU0sSUFBSSxLQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQzthQUNuRDtRQUNILENBQUM7OztPQTFCQTtJQTZCRDs7T0FFRzs7Ozs7SUFDSSxrQ0FBTTs7OztJQUFiO1FBQ0UsUUFBUSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRTtZQUNoQyxLQUFLLGdCQUFnQixDQUFDLE1BQU07Z0JBQzFCLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQ3pCLE1BQU07WUFDUixLQUFLLGdCQUFnQixDQUFDLFlBQVk7Z0JBQ2hDLFlBQVksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDL0MsTUFBTTtZQUNSLEtBQUssZ0JBQWdCLENBQUMsY0FBYztnQkFDbEMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUNqRCxNQUFNO1lBQ1I7Z0JBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO1NBQ25EO0lBQ0gsQ0FBQztJQUNEOzs7OztPQUtHOzs7Ozs7OztJQUNJLHFDQUFTOzs7Ozs7O0lBQWhCLFVBQWlCLFFBQWdCLEVBQUUsUUFBZ0I7UUFBbkQsaUJBT0M7UUFOQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsRUFBRSxRQUFRLFVBQUEsRUFBRSxRQUFRLFVBQUEsRUFBRSxDQUFDO2FBQzFELElBQUksQ0FDSCxHQUFHOzs7O1FBQUMsVUFBQSxPQUFPO1lBQ1QsS0FBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO1FBQzdCLENBQUMsRUFBQyxDQUNILENBQUM7SUFDTixDQUFDO0lBRUQsd0RBQXdEOzs7Ozs7SUFDakQseUNBQWE7Ozs7O0lBQXBCLFVBQXFCLEdBQVc7UUFDOUIsT0FBTyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVELGtDQUFrQzs7Ozs7O0lBQzNCLHVDQUFXOzs7OztJQUFsQixVQUFtQixHQUFXO1FBQTlCLGlCQU9DO1FBTkMsT0FBTyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO2FBQy9DLElBQUksQ0FDSCxHQUFHOzs7UUFBQztZQUNGLEtBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNoQixDQUFDLEVBQUMsQ0FDSCxDQUFDO0lBQ04sQ0FBQztJQUVELG1EQUFtRDs7Ozs7SUFDNUMsd0NBQVk7Ozs7SUFBbkI7O1lBQ1EsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLOztZQUNsQixPQUFPLEdBQUcsU0FBUyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUM7UUFDNUMsT0FBTyxPQUFPLEtBQUssSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxFQUFFLEVBQUUsWUFBWSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzdFLENBQUM7SUFFRCxrQ0FBa0M7Ozs7O0lBQzNCLGlEQUFxQjs7OztJQUE1QjtRQUNFLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFHRDs7Ozs7T0FLRzs7Ozs7Ozs7SUFDSSxtQ0FBTzs7Ozs7OztJQUFkO1FBQ0UsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7UUFFMUIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQ7Ozs7O09BS0c7Ozs7Ozs7O0lBQ0ksa0NBQU07Ozs7Ozs7SUFBYjtRQUNFLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO1FBRTNCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVEOzs7OztPQUtHOzs7Ozs7OztJQUNJLCtCQUFHOzs7Ozs7O0lBQVYsVUFBVyxHQUFXLEVBQUUsSUFBUztRQUMvQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVEOzs7Ozs7O09BT0c7Ozs7Ozs7Ozs7SUFDSSxnQ0FBSTs7Ozs7Ozs7O0lBQVgsVUFBWSxHQUFXLEVBQUUsSUFBUyxFQUFFLFlBQXFCLEVBQUUsV0FBOEI7UUFBOUIsNEJBQUEsRUFBQSxnQkFBOEI7UUFDdkYsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDN0UsQ0FBQztJQUVEOzs7Ozs7O09BT0c7Ozs7Ozs7Ozs7SUFDSSwrQkFBRzs7Ozs7Ozs7O0lBQVYsVUFBVyxHQUFXLEVBQUUsSUFBUyxFQUFFLFlBQXFCLEVBQUUsV0FBOEI7UUFBOUIsNEJBQUEsRUFBQSxnQkFBOEI7UUFDdEYsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUVEOzs7Ozs7T0FNRzs7Ozs7Ozs7O0lBQ0ksa0NBQU07Ozs7Ozs7O0lBQWIsVUFBYyxHQUFXLEVBQUUsSUFBUyxFQUFFLFlBQXFCO1FBQ3pELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUVELCtCQUErQjs7Ozs7SUFDeEIscUNBQVM7Ozs7SUFBaEI7UUFDRSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO1FBRTdCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVEOztPQUVHOzs7Ozs7Ozs7SUFDTywwQ0FBYzs7Ozs7Ozs7SUFBeEIsVUFBeUIsTUFBVyxFQUFFLElBQWUsRUFBRSxTQUFrQjs7WUFDakUsUUFBUSxHQUFHLElBQUksSUFBSSxJQUFJLFFBQVEsRUFBRTtRQUV2QyxLQUFLLElBQU0sUUFBUSxJQUFJLE1BQU0sRUFBRTtZQUU3QixJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFBRSxTQUFTO2FBQUU7O2dCQUVsRSxPQUFPLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBSSxTQUFTLFNBQUksUUFBUSxNQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVE7WUFDbEUsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLFlBQVksSUFBSSxFQUFFO2dCQUNwQyxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQzthQUMxRDtpQkFBTSxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsWUFBWSxRQUFRLEVBQUU7Z0JBQy9DLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUNoRCxRQUFRLENBQUMsTUFBTSxDQUFJLFFBQVEsT0FBSSxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDNUQ7YUFDRjtpQkFBTSxJQUNMLE9BQU8sTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLFFBQVEsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxZQUFZLElBQUksQ0FBQyxFQUFFO2dCQUM3RSxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFDMUQ7aUJBQU07Z0JBQ0wsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7YUFDNUM7U0FDRjtRQUNELE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUM7Ozs7OztJQUlTLG9DQUFROzs7OztJQUFsQixVQUFtQixHQUFXOztZQUN4QixJQUFJLEdBQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsU0FBSSxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUc7O1lBQzVFLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLDJCQUEyQixDQUFDO1FBRXJELElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLElBQUksS0FBSyxJQUFJLElBQUksRUFBRTtZQUN6QyxJQUFJLEdBQU0sSUFBSSxVQUFPLENBQUM7U0FDdkI7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFHRDs7T0FFRzs7Ozs7O0lBQ0ssd0NBQVk7Ozs7O0lBQXBCOztZQUNRLE1BQU0sd0JBQVEsSUFBSSxDQUFDLFVBQVUsQ0FBRTtRQUVyQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFO1lBQUUsTUFBTSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7U0FBRTtRQUUvRSxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7O2dCQUNoQixLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUs7WUFDeEIsSUFBSSxDQUFDLEtBQUssRUFBRTtnQkFDVixPQUFPLENBQUMsSUFBSSxDQUNWLDRDQUE0QztzQkFDMUMsdUNBQXVDLENBQzFDLENBQUM7YUFDSDtpQkFBTTtnQkFDTCxNQUFNLENBQUMsYUFBYSxHQUFHLFlBQVUsS0FBTyxDQUFDO2FBQzFDO1lBRUQsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7U0FDNUI7UUFFRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBSUQseUJBQXlCOzs7Ozs7Ozs7OztJQUNmLG1DQUFPOzs7Ozs7Ozs7O0lBQWpCLFVBQ0UsTUFBa0IsRUFBRSxHQUFXLEVBQUUsSUFBVSxFQUFFLFlBQXFCLEVBQ2xFLFdBQThCO1FBRmhDLGlCQW9DQztRQWxDQyw0QkFBQSxFQUFBLGdCQUE4Qjs7WUFFeEIsT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDOztZQUNuRCxNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRTs7WUFFNUIsS0FBSyxHQUFHLG1CQUFBLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFVO1FBRTlELElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQUUsSUFBSSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7WUFBQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO1NBQUU7O1lBRXpGLE9BQU8sR0FBRztZQUNkLElBQUksRUFBRSxNQUFNLEtBQUssVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJO1lBQzNDLFlBQVksRUFBRSxLQUFLO1lBQ25CLE1BQU0sRUFBRSxNQUFNLEtBQUssVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQzdDLE9BQU8sRUFBRSxNQUFNO1NBQ2hCO1FBRUQsT0FBTyxJQUFJLENBQUMsSUFBSTthQUNiLE9BQU8sQ0FDTixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLHVCQUM3RCxPQUFPLEVBQUssV0FBVyxFQUM3QjthQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2FBQ3BDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDL0MsSUFBSSxDQUFDLFVBQVU7Ozs7UUFBQyxVQUFDLEdBQUc7WUFDbkIsSUFDRSxLQUFJLENBQUMsTUFBTSxDQUFDLHVCQUF1QjttQkFDaEMsR0FBRyxLQUFLLEtBQUksQ0FBQyxNQUFNLENBQUMsT0FBTzttQkFDM0IsR0FBRyxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQ3JCO2dCQUNBLEtBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSSxDQUFDLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsSUFBSTs7O2dCQUFDLGNBQVEsQ0FBQyxFQUFDLENBQUM7Z0JBQzVFLEtBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO2FBQzlCO1lBQ0QsT0FBTyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDekIsQ0FBQyxFQUFDLENBQUMsQ0FBQztJQUNSLENBQUM7O2dCQW5XRixVQUFVLFNBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25COzs7O2dCQWJRLFVBQVU7Z0JBQ1YsYUFBYTtnQkFGYixNQUFNO2dCQVVOLGlCQUFpQix1QkErQnJCLFFBQVE7Ozs0QkExQ2I7Q0FpWEMsQUFwV0QsSUFvV0M7U0FqV1ksaUJBQWlCOzs7Ozs7O0lBRTVCLDJDQUFvRTs7Ozs7O0lBR3BFLHVDQU1FOzs7Ozs7SUFHRixtQ0FBb0M7Ozs7OztJQUdwQywwQ0FBZ0M7Ozs7OztJQUdoQyw2Q0FBbUM7Ozs7O0lBR2pDLGlDQUF3Qjs7Ozs7SUFDeEIsb0NBQThCOzs7OztJQUM5QixtQ0FBK0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBDb29raWVTZXJ2aWNlIH0gZnJvbSAnbmd4LWNvb2tpZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJqZWN0LCB0aHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0YWtlVW50aWwsIHRhcCwgY2F0Y2hFcnJvciwgZGVsYXkgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBpc0FmdGVyLCBmcm9tVW5peFRpbWUgfSBmcm9tICdkYXRlLWZucyc7XG5cbmltcG9ydCB7IElIdHRwT3B0aW9ucyB9IGZyb20gJy4vaHR0cC1vcHRpb25zLmludGVyZmFjZSc7XG5pbXBvcnQgeyBIdHRwTWV0aG9kIH0gZnJvbSAnLi9odHRwLW1ldGhvZC5lbnVtJztcbmltcG9ydCB7IEp3dEhlbHBlciB9IGZyb20gJy4vand0LWhlbHBlci5jbGFzcyc7XG5pbXBvcnQgeyBSZXN0U2VydmljZUNvbmZpZywgVHlwZVRva2VuU3RvcmFnZSB9IGZyb20gJy4vYW5ndWxhci1yZXN0LmNvbmZpZyc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFJlc3RDbGllbnRTZXJ2aWNlIHtcbiAgLyoqIEhhbmRsZXIgdXNlZCB0byBzdG9wIGFsbCBwZW5kaW5nIHJlcXVlc3RzICovXG4gIHByb3RlY3RlZCBjYW5jZWxQZW5kaW5nJDogU3ViamVjdDxib29sZWFuPiA9IG5ldyBTdWJqZWN0PGJvb2xlYW4+KCk7XG5cbiAgLyoqICBEZWZhdWx0IHJlcXVlc3RzIGhlYWRlciAqL1xuICBwcm90ZWN0ZWQgYmFzZUhlYWRlciA9IHtcbiAgICAnQ2FjaGUtQ29udHJvbCc6ICduby1jYWNoZScsXG4gICAgYWNjZXB0OiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgUHJhZ21hOiAnbm8tY2FjaGUnLFxuICAgIEF1dGhvcml6YXRpb246ICcnLFxuICAgICdBY2NlcHQtTGFuZ3VhZ2UnOiAnKidcbiAgfTtcblxuICAvKiogU2VydmljZSBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnMgKi9cbiAgcHJvdGVjdGVkIGNvbmZpZzogUmVzdFNlcnZpY2VDb25maWc7XG5cbiAgLyoqIFdoZW4gdHJ1ZSwgdGhlIHJlcXVlc3QgaGVhZGVyIHdpbGwgaW5jbHVkZSB0aGUgYXV0aGVudGljYXRpb24gdG9rZW4gKi9cbiAgcHJvdGVjdGVkIHNlY3VyZVJlcXVlc3QgPSBmYWxzZTtcblxuICAvKiogSG9sZHMgYSBsaXN0IG9mIGZpbGVzIHRvIGJlIHVwbG9hZCBvbiByZXF1ZXN0ICovXG4gIHByb3RlY3RlZCB3aXRoRmlsZXNSZXF1ZXN0ID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LFxuICAgIHByaXZhdGUgY29va2llczogQ29va2llU2VydmljZSxcbiAgICBwcml2YXRlIHJlYWRvbmx5IHJvdXRlcjogUm91dGVyLFxuICAgIEBPcHRpb25hbCgpIGNvbmZpZzogUmVzdFNlcnZpY2VDb25maWdcbiAgKSB7XG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICBlbmRQb2ludDogJycsXG4gICAgICB0b2tlbk5hbWU6ICdBdXRoVG9rZW4nLFxuICAgICAgdG9rZW5TdG9yYWdlOiBUeXBlVG9rZW5TdG9yYWdlLmNvb2tpZSxcbiAgICAgIHNlY3VyZUNvb2tpZTogZmFsc2UsXG4gICAgICBtb2NrRGF0YTogZmFsc2UsXG4gICAgICB2YWxpZGF0aW9uVG9rZW5Vcmk6ICcvaW5mbycsXG4gICAgICBhdXRoVXJpOiAnL2F1dGhvcml6ZScsXG4gICAgICBVbmF1dGhvcml6ZWRSZWRpcmVjdFVyaTogbnVsbFxuICAgIH0gYXMgUmVzdFNlcnZpY2VDb25maWc7XG5cbiAgICBpZiAoY29uZmlnKSB7XG4gICAgICB0aGlzLnNldENvbmZpZyhjb25maWcpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIFJlc3QgQ2xpZW50IGNvbmZpZ3VyYXRpb24gcGFyYW1ldGVycy5cbiAgICpcbiAgICogQ0FVVElPTjogVGhpcyBtZXRob2Qgb3ZlcnJpZGVzIHRoZSBjdXJyZW50IGNvbmZpZ3VyYXRpb24gc2V0dGluZ3NcbiAgICogYW5kIHRoaXMgc2V0dGluZ3Mgd2lsbCBhcHBseSB0byBhbGwgZm9sbG93aW5nIHJlcXVlc3RzXG4gICAqL1xuICBwdWJsaWMgc2V0Q29uZmlnKGNvbmZpZzogUmVzdFNlcnZpY2VDb25maWcpOiBSZXN0Q2xpZW50U2VydmljZSB7XG4gICAgdGhpcy5jb25maWcgPSB7IC4uLnRoaXMuY29uZmlnLCAuLi5jb25maWcgfSBhcyBSZXN0U2VydmljZUNvbmZpZztcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKiBSZXR1cm4gdGhlIGN1cnJlbnQgUmVzdCBDbGllbnQgY29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzLiAgKi9cbiAgcHVibGljIGdldENvbmZpZygpOiBSZXN0U2VydmljZUNvbmZpZyB7XG4gICAgcmV0dXJuIHRoaXMuY29uZmlnO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgQVBJIFRva2VuIGZyb20gY29va2llc1xuICAgKi9cbiAgcHVibGljIGdldCB0b2tlbigpOiBzdHJpbmcge1xuICAgIGxldCB0b2tlbiA9ICcnO1xuXG4gICAgc3dpdGNoICh0aGlzLmNvbmZpZy50b2tlblN0b3JhZ2UpIHtcbiAgICAgIGNhc2UgVHlwZVRva2VuU3RvcmFnZS5jb29raWU6XG4gICAgICAgIHRva2VuID0gdGhpcy5jb29raWVzLmdldCh0aGlzLmNvbmZpZy50b2tlbk5hbWUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVHlwZVRva2VuU3RvcmFnZS5sb2NhbFN0b3JhZ2U6XG4gICAgICAgIHRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5jb25maWcudG9rZW5OYW1lKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFR5cGVUb2tlblN0b3JhZ2Uuc2Vzc2lvblN0b3JhZ2U6XG4gICAgICAgIHRva2VuID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmNvbmZpZy50b2tlbk5hbWUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBUb2tlbiBTdG9yYWdlIG1ldGhvZCcpO1xuICAgIH1cblxuICAgIHJldHVybiAhdG9rZW4gfHwgdHlwZW9mIHRva2VuID09PSAndW5kZWZpbmVkJyA/ICcnIDogdG9rZW47XG4gIH1cblxuICAvKipcbiAgICogU2F2ZSB0aGUgQVBJIFRva2VuIGNvb2tpZVxuICAgKi9cbiAgcHVibGljIHNldCB0b2tlbih0b2tlbjogc3RyaW5nKSB7XG4gICAgY29uc3QgZGVjb2RlZCA9IEp3dEhlbHBlci5kZWNvZGVUb2tlbih0b2tlbik7XG4gICAgY29uc3QgZXhwaXJlcyA9IGZyb21Vbml4VGltZShkZWNvZGVkLmV4cCk7XG5cbiAgICBzd2l0Y2ggKHRoaXMuY29uZmlnLnRva2VuU3RvcmFnZSkge1xuICAgICAgY2FzZSBUeXBlVG9rZW5TdG9yYWdlLmNvb2tpZTpcbiAgICAgICAgdGhpcy5jb29raWVzLnB1dChcbiAgICAgICAgICB0aGlzLmNvbmZpZy50b2tlbk5hbWUsXG4gICAgICAgICAgdG9rZW4sXG4gICAgICAgICAgeyBzZWN1cmU6IHRoaXMuY29uZmlnLnNlY3VyZUNvb2tpZSwgZXhwaXJlcyB9XG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBUeXBlVG9rZW5TdG9yYWdlLmxvY2FsU3RvcmFnZTpcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5jb25maWcudG9rZW5OYW1lLCB0b2tlbik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBUeXBlVG9rZW5TdG9yYWdlLnNlc3Npb25TdG9yYWdlOlxuICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKHRoaXMuY29uZmlnLnRva2VuTmFtZSwgdG9rZW4pO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBUb2tlbiBTdG9yYWdlIG1ldGhvZCcpO1xuICAgIH1cbiAgfVxuXG5cbiAgLyoqXG4gICAqIFJlbW92ZSB0aGUgQXV0aGVudGljYXRpb24gdG9rZW4gY29va2llXG4gICAqL1xuICBwdWJsaWMgcmV2b2tlKCk6IHZvaWQge1xuICAgIHN3aXRjaCAodGhpcy5jb25maWcudG9rZW5TdG9yYWdlKSB7XG4gICAgICBjYXNlIFR5cGVUb2tlblN0b3JhZ2UuY29va2llOlxuICAgICAgICB0aGlzLmNvb2tpZXMucmVtb3ZlQWxsKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBUeXBlVG9rZW5TdG9yYWdlLmxvY2FsU3RvcmFnZTpcbiAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy5jb25maWcudG9rZW5OYW1lKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFR5cGVUb2tlblN0b3JhZ2Uuc2Vzc2lvblN0b3JhZ2U6XG4gICAgICAgIHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy5jb25maWcudG9rZW5OYW1lKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgVG9rZW4gU3RvcmFnZSBtZXRob2QnKTtcbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIFJlcXVlc3QgYW4gQXV0aG9yaXphdGlvbiB0b2tlblxuICAgKiBUaGUgZGVmYXVsdCBhdXRob3JpemF0aW9uIFVSSSBpcyAnW0FQSV9FTkRfUE9JTlRdL2F1dGhvcml6ZSdcbiAgICogQHBhcmFtIHVzZXJuYW1lIFVzZXJuYW1lXG4gICAqIEBwYXJhbSBwYXNzd29yZCBQYXNzd29yZFxuICAgKi9cbiAgcHVibGljIGF1dGhvcml6ZSh1c2VybmFtZTogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5wb3N0KHRoaXMuY29uZmlnLmF1dGhVcmksIHsgdXNlcm5hbWUsIHBhc3N3b3JkIH0pXG4gICAgICAucGlwZShcbiAgICAgICAgdGFwKHBheWxvYWQgPT4ge1xuICAgICAgICAgIHRoaXMudG9rZW4gPSBwYXlsb2FkLnRva2VuO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgfVxuXG4gIC8qKiBWYWxpZGF0ZSB0aGUgQXV0aGVudGljYXRpb24gdG9rZW4gYWdhaW5zdCB0aGUgQVBJICovXG4gIHB1YmxpYyB2YWxpZGF0ZVRva2VuKHVybDogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5zZWN1cmVkKCkucmVxdWVzdChIdHRwTWV0aG9kLlBvc3QsIHVybCk7XG4gIH1cblxuICAvKiogUmVtb3ZlcyBhdXRob3JpemF0aW9uIHRva2VuICovXG4gIHB1YmxpYyBkZWF1dGhvcml6ZSh1cmw6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMuc2VjdXJlZCgpLnJlcXVlc3QoSHR0cE1ldGhvZC5HZXQsIHVybClcbiAgICAgIC5waXBlKFxuICAgICAgICB0YXAoKCkgPT4ge1xuICAgICAgICAgIHRoaXMucmV2b2tlKCk7XG4gICAgICAgIH0pXG4gICAgICApO1xuICB9XG5cbiAgLyoqIENoZWNrIGlmIHRoZSBjbGllbnQgaXMgYWxyZWFkeSBBdXRoZW50aWNhdGUgICovXG4gIHB1YmxpYyBpc0F1dGhvcml6ZWQoKTogYm9vbGVhbiB7XG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLnRva2VuO1xuICAgIGNvbnN0IGRlY29kZWQgPSBKd3RIZWxwZXIuZGVjb2RlVG9rZW4odG9rZW4pO1xuICAgIHJldHVybiBkZWNvZGVkICE9PSBudWxsICYmICFpc0FmdGVyKG5ldyBEYXRlKCksIGZyb21Vbml4VGltZShkZWNvZGVkLmV4cCkpO1xuICB9XG5cbiAgLyoqIENhbmNlbCBhbGwgcGVuZGluZyByZXF1ZXN0cyAqL1xuICBwdWJsaWMgY2FuY2VsUGVuZGluZ1JlcXVlc3RzKCk6IHZvaWQge1xuICAgIHRoaXMuY2FuY2VsUGVuZGluZyQubmV4dCh0cnVlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFNldCB0aGUgcmVxdWVzdCBtb2RlIHRvIFNFQ1VSRUQgZm9yIHRoZSBuZXh0IHJlcXVlc3QuXG4gICAqXG4gICAqIFNlY3VyZWQgTW9kZSBmb3JjZSB0aGUgbmV4dCByZXF1ZXN0IHRvIGluY2x1ZGUgdGhlIGF1dGhlbnRpY2F0aW9uIHRva2VuLlxuICAgKiBUaGUgdG9rZW4gbXVzdCBiZSByZXF1ZXN0ZWQgcHJldmlvdXNseSB1c2luZyB0aGUgXCJhdXRob3JpemVcIiBtZXRob2QuXG4gICAqL1xuICBwdWJsaWMgc2VjdXJlZCgpOiBSZXN0Q2xpZW50U2VydmljZSB7XG4gICAgdGhpcy5zZWN1cmVSZXF1ZXN0ID0gdHJ1ZTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgcmVxdWVzdCBtb2RlIHRvIFBVQkxJQyBmb3IgdGhlIG5leHQgcmVxdWVzdC5cbiAgICpcbiAgICogUHVibGljIGlzIHRoZSBkZWZhdWx0IHJlcXVlc3QgbW9kZSBhbmQgZW5zdXJlIHRoYXQgbm8gYXV0aGVudGljYXRpb24gdG9rZW5cbiAgICogd2lsbCBiZSBwYXNzIG9uIHRoZSBuZXh0IHJlcXVlc3QuXG4gICAqL1xuICBwdWJsaWMgcHVibGljKCk6IFJlc3RDbGllbnRTZXJ2aWNlIHtcbiAgICB0aGlzLnNlY3VyZVJlcXVlc3QgPSBmYWxzZTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEFQSSByZXF1ZXN0IHVzaW5nIEdFVCBtZXRob2RcbiAgICpcbiAgICogQHBhcmFtIHVybFxuICAgKiBAcGFyYW0gZGF0YSBBIGxpc3Qgb2YgcGFyYW1ldGVzXG4gICAqL1xuICBwdWJsaWMgZ2V0KHVybDogc3RyaW5nLCBkYXRhPzoge30pOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QoSHR0cE1ldGhvZC5HZXQsIHVybCwgZGF0YSk7XG4gIH1cblxuICAvKipcbiAgICogQVBJIHJlcXVlc3QgdXNpbmcgUE9TVCBtZXRob2RcbiAgICpcbiAgICogQHBhcmFtIHVybFxuICAgKiBAcGFyYW0gZGF0YVxuICAgKiBAcGFyYW0gcmVzcG9uc2VUeXBlXG4gICAqIEBwYXJhbSBodHRwT3B0aW9uc1xuICAgKi9cbiAgcHVibGljIHBvc3QodXJsOiBzdHJpbmcsIGRhdGE/OiB7fSwgcmVzcG9uc2VUeXBlPzogc3RyaW5nLCBodHRwT3B0aW9uczogSUh0dHBPcHRpb25zID0ge30pOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QoSHR0cE1ldGhvZC5Qb3N0LCB1cmwsIGRhdGEsIHJlc3BvbnNlVHlwZSwgaHR0cE9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFQSSByZXF1ZXN0IHVzaW5nIFBVVCBtZXRob2RcbiAgICpcbiAgICogQHBhcmFtIHVybFxuICAgKiBAcGFyYW0gZGF0YVxuICAgKiBAcGFyYW0gcmVzcG9uc2VUeXBlXG4gICAqIEBwYXJhbSBodHRwT3B0aW9uc1xuICAgKi9cbiAgcHVibGljIHB1dCh1cmw6IHN0cmluZywgZGF0YT86IHt9LCByZXNwb25zZVR5cGU/OiBzdHJpbmcsIGh0dHBPcHRpb25zOiBJSHR0cE9wdGlvbnMgPSB7fSk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChIdHRwTWV0aG9kLlB1dCwgdXJsLCBkYXRhLCByZXNwb25zZVR5cGUsIGh0dHBPcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBUEkgcmVxdWVzdCB1c2luZyBERUxFVEUgbWV0aG9kXG4gICAqXG4gICAqIEBwYXJhbSB1cmxcbiAgICogQHBhcmFtIGRhdGFcbiAgICogQHBhcmFtIHJlc3BvbnNlVHlwZVxuICAgKi9cbiAgcHVibGljIGRlbGV0ZSh1cmw6IHN0cmluZywgZGF0YT86IHt9LCByZXNwb25zZVR5cGU/OiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QoSHR0cE1ldGhvZC5EZWxldGUsIHVybCwgZGF0YSwgcmVzcG9uc2VUeXBlKTtcbiAgfVxuXG4gIC8qKiBTZXQgdGhlIHVwbG9hZCBmaWxlIG1vZGUgKi9cbiAgcHVibGljIHdpdGhGaWxlcygpOiBSZXN0Q2xpZW50U2VydmljZSB7XG4gICAgdGhpcy53aXRoRmlsZXNSZXF1ZXN0ID0gdHJ1ZTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIEZvcm1EYXRhIG9iamVjdCB0byBiZSBzZW5kIGFzIHJlcXVlc3QgcGF5bG9hZCBkYXRhXG4gICAqL1xuICBwcm90ZWN0ZWQgY3JlYXRlRm9ybURhdGEob2JqZWN0OiBhbnksIGZvcm0/OiBGb3JtRGF0YSwgbmFtZXNwYWNlPzogc3RyaW5nKTogRm9ybURhdGEge1xuICAgIGNvbnN0IGZvcm1EYXRhID0gZm9ybSB8fCBuZXcgRm9ybURhdGEoKTtcblxuICAgIGZvciAoY29uc3QgcHJvcGVydHkgaW4gb2JqZWN0KSB7XG5cbiAgICAgIGlmICghb2JqZWN0Lmhhc093blByb3BlcnR5KHByb3BlcnR5KSB8fCAhb2JqZWN0W3Byb3BlcnR5XSkgeyBjb250aW51ZTsgfVxuXG4gICAgICBjb25zdCBmb3JtS2V5ID0gbmFtZXNwYWNlID8gYCR7bmFtZXNwYWNlfVske3Byb3BlcnR5fV1gIDogcHJvcGVydHk7XG4gICAgICBpZiAob2JqZWN0W3Byb3BlcnR5XSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKGZvcm1LZXksIG9iamVjdFtwcm9wZXJ0eV0udG9JU09TdHJpbmcoKSk7XG4gICAgICB9IGVsc2UgaWYgKG9iamVjdFtwcm9wZXJ0eV0gaW5zdGFuY2VvZiBGaWxlTGlzdCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9iamVjdFtwcm9wZXJ0eV0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoYCR7cHJvcGVydHl9W11gLCBvYmplY3RbcHJvcGVydHldLml0ZW0oaSkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICB0eXBlb2Ygb2JqZWN0W3Byb3BlcnR5XSA9PT0gJ29iamVjdCcgJiYgIShvYmplY3RbcHJvcGVydHldIGluc3RhbmNlb2YgRmlsZSkpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVGb3JtRGF0YShvYmplY3RbcHJvcGVydHldLCBmb3JtRGF0YSwgZm9ybUtleSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3JtRGF0YS5hcHBlbmQoZm9ybUtleSwgb2JqZWN0W3Byb3BlcnR5XSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmb3JtRGF0YTtcbiAgfVxuXG5cblxuICBwcm90ZWN0ZWQgYnVpbGRVcmwodXJsOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGxldCBuVXJsID0gYCR7dGhpcy5jb25maWcuZW5kUG9pbnQucmVwbGFjZSgvXFwvJC8sICcnKX0vJHt1cmwucmVwbGFjZSgvXlxcLy9nLCAnJyl9YDtcbiAgICBjb25zdCBtYXRjaCA9IG5VcmwubWF0Y2goL1xcLihbMC05YS16XSspKD86W1xcPyNdfCQpL2kpO1xuXG4gICAgaWYgKHRoaXMuY29uZmlnLm1vY2tEYXRhICYmIG1hdGNoID09IG51bGwpIHtcbiAgICAgIG5VcmwgPSBgJHtuVXJsfS5qc29uYDtcbiAgICB9XG5cbiAgICByZXR1cm4gblVybDtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgcmVxdWVzdCBoZWFkZXJzIGJhc2VkIG9uIGNvbmZpZ3VyYXRpb24gcGFyYW1ldGVyc1xuICAgKi9cbiAgcHJpdmF0ZSBidWlsZEhlYWRlcnMoKSB7XG4gICAgY29uc3QgaGVhZGVyID0geyAuLi50aGlzLmJhc2VIZWFkZXIgfTtcblxuICAgIGlmICh0aGlzLmNvbmZpZy5sYW5ndWFnZSkgeyBoZWFkZXJbJ0FjY2VwdC1MYW5ndWFnZSddID0gdGhpcy5jb25maWcubGFuZ3VhZ2U7IH1cblxuICAgIGlmICh0aGlzLnNlY3VyZVJlcXVlc3QpIHtcbiAgICAgIGNvbnN0IHRva2VuID0gdGhpcy50b2tlbjtcbiAgICAgIGlmICghdG9rZW4pIHtcbiAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICdFeGVjdXRpbmcgYSBzZWN1cmUgcmVxdWVzdCB3aXRob3V0IFRPS0VOLiAnXG4gICAgICAgICAgKyAnQXV0aG9yaXphdGlvbiBoZWFkZXIgd2lsbCBub3QgYmUgc2V0ISdcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGhlYWRlci5BdXRob3JpemF0aW9uID0gYEJlYXJlciAke3Rva2VufWA7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2VjdXJlUmVxdWVzdCA9IGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiBoZWFkZXI7XG4gIH1cblxuXG5cbiAgLyoqIFJhdyByZXF1ZXN0IG1ldGhvZCAqL1xuICBwcm90ZWN0ZWQgcmVxdWVzdChcbiAgICBtZXRob2Q6IEh0dHBNZXRob2QsIHVybDogc3RyaW5nLCBkYXRhPzogYW55LCByZXNwb25zZVR5cGU/OiBzdHJpbmcsXG4gICAgaHR0cE9wdGlvbnM6IElIdHRwT3B0aW9ucyA9IHt9XG4gICk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgY29uc3QgbXNEZWxheSA9IE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiAyMDAwKSArIDEwMDApO1xuICAgIGNvbnN0IGhlYWRlciA9IHRoaXMuYnVpbGRIZWFkZXJzKCk7XG5cbiAgICBjb25zdCByVHlwZSA9IChyZXNwb25zZVR5cGUgPyByZXNwb25zZVR5cGUgOiAnanNvbicpIGFzICd0ZXh0JztcblxuICAgIGlmICh0aGlzLndpdGhGaWxlc1JlcXVlc3QpIHsgZGF0YSA9IHRoaXMuY3JlYXRlRm9ybURhdGEoZGF0YSk7IHRoaXMud2l0aEZpbGVzUmVxdWVzdCA9IGZhbHNlOyB9XG5cbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgYm9keTogbWV0aG9kID09PSBIdHRwTWV0aG9kLkdldCA/IHt9IDogZGF0YSxcbiAgICAgIHJlc3BvbnNlVHlwZTogclR5cGUsXG4gICAgICBwYXJhbXM6IG1ldGhvZCA9PT0gSHR0cE1ldGhvZC5HZXQgPyBkYXRhIDoge30sXG4gICAgICBoZWFkZXJzOiBoZWFkZXJcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXMuaHR0cFxuICAgICAgLnJlcXVlc3QoXG4gICAgICAgIHRoaXMuY29uZmlnLm1vY2tEYXRhID8gSHR0cE1ldGhvZC5HZXQgOiBtZXRob2QsIHRoaXMuYnVpbGRVcmwodXJsKSxcbiAgICAgICAgeyAuLi5vcHRpb25zLCAuLi5odHRwT3B0aW9ucyB9XG4gICAgICApXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5jYW5jZWxQZW5kaW5nJCkpXG4gICAgICAucGlwZShkZWxheSh0aGlzLmNvbmZpZy5tb2NrRGF0YSA/IG1zRGVsYXkgOiAwKSlcbiAgICAgIC5waXBlKGNhdGNoRXJyb3IoKGVycikgPT4ge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgdGhpcy5jb25maWcuVW5hdXRob3JpemVkUmVkaXJlY3RVcmlcbiAgICAgICAgICAmJiB1cmwgIT09IHRoaXMuY29uZmlnLmF1dGhVcmlcbiAgICAgICAgICAmJiBlcnIuc3RhdHVzID09PSA0MDFcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3RoaXMuY29uZmlnLlVuYXV0aG9yaXplZFJlZGlyZWN0VXJpXSkudGhlbigoKSA9PiB7IH0pO1xuICAgICAgICAgIHRoaXMuY2FuY2VsUGVuZGluZ1JlcXVlc3RzKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyKTtcbiAgICAgIH0pKTtcbiAgfVxufVxuIl19