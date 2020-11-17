import { __assign } from "tslib";
import { Injectable, Optional } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { takeUntil, tap, catchError, delay } from 'rxjs/operators';
import { isAfter, fromUnixTime } from 'date-fns';
import { HttpMethod } from './http-method.enum';
import { JwtHelper } from './jwt-helper.class';
import { TypeTokenStorage } from './ngx-rest.config';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "ngx-cookie";
import * as i3 from "@angular/router";
import * as i4 from "./ngx-rest.config";
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
    /** @nocollapse */ RestClientService.ɵfac = function RestClientService_Factory(t) { return new (t || RestClientService)(i0.ɵɵinject(i1.HttpClient), i0.ɵɵinject(i2.CookieService), i0.ɵɵinject(i3.Router), i0.ɵɵinject(i4.RestServiceConfig, 8)); };
    /** @nocollapse */ RestClientService.ɵprov = i0.ɵɵdefineInjectable({ token: RestClientService, factory: RestClientService.ɵfac, providedIn: 'root' });
    return RestClientService;
}());
export { RestClientService };
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(RestClientService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: i1.HttpClient }, { type: i2.CookieService }, { type: i3.Router }, { type: i4.RestServiceConfig, decorators: [{
                type: Optional
            }] }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXJlc3Quc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1yZXN0LyIsInNvdXJjZXMiOlsibGliL25neC1yZXN0LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBSXJELE9BQU8sRUFBYyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3ZELE9BQU8sRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNuRSxPQUFPLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUdqRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDaEQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQy9DLE9BQU8sRUFBcUIsZ0JBQWdCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQzs7Ozs7O0FBRXhFO0lBeUJFLDJCQUNVLElBQWdCLEVBQ2hCLE9BQXNCLEVBQ2IsTUFBYyxFQUNuQixNQUF5QjtRQUg3QixTQUFJLEdBQUosSUFBSSxDQUFZO1FBQ2hCLFlBQU8sR0FBUCxPQUFPLENBQWU7UUFDYixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBeEJqQyxnREFBZ0Q7UUFDdEMsbUJBQWMsR0FBcUIsSUFBSSxPQUFPLEVBQVcsQ0FBQztRQUVwRSwrQkFBK0I7UUFDckIsZUFBVSxHQUFHO1lBQ3JCLGVBQWUsRUFBRSxVQUFVO1lBQzNCLE1BQU0sRUFBRSxrQkFBa0I7WUFDMUIsTUFBTSxFQUFFLFVBQVU7WUFDbEIsYUFBYSxFQUFFLEVBQUU7WUFDakIsaUJBQWlCLEVBQUUsR0FBRztTQUN2QixDQUFDO1FBS0YsMEVBQTBFO1FBQ2hFLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBRWhDLG9EQUFvRDtRQUMxQyxxQkFBZ0IsR0FB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Q0UsS0FBSSxDQUFDLE1BQU0sQ0FBQyx1QkFBdUI7bUJBQ2hDLEdBQUcsS0FBSyxLQUFJLENBQUMsTUFBTSxDQUFDLE9BQU87bUJBQzNCLEdBQUcsQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUNyQjtnQkFDQSxLQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUksQ0FBQyxNQUFNLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUM1RSxLQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQzthQUM5QjtZQUNELE9BQU8sVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3pCLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDUixDQUFDO3lHQTFaVSxpQkFBaUI7Z0ZBQWpCLGlCQUFpQixXQUFqQixpQkFBaUIsbUJBRmhCLE1BQU07NEJBZHBCO0NBMmFDLEFBOVpELElBOFpDO1NBM1pZLGlCQUFpQjtrREFBakIsaUJBQWlCO2NBSDdCLFVBQVU7ZUFBQztnQkFDVixVQUFVLEVBQUUsTUFBTTthQUNuQjs7c0JBMkJJLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBDb29raWVTZXJ2aWNlIH0gZnJvbSAnbmd4LWNvb2tpZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJqZWN0LCB0aHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0YWtlVW50aWwsIHRhcCwgY2F0Y2hFcnJvciwgZGVsYXkgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBpc0FmdGVyLCBmcm9tVW5peFRpbWUgfSBmcm9tICdkYXRlLWZucyc7XG5cbmltcG9ydCB7IElIdHRwT3B0aW9ucyB9IGZyb20gJy4vaHR0cC1vcHRpb25zLmludGVyZmFjZSc7XG5pbXBvcnQgeyBIdHRwTWV0aG9kIH0gZnJvbSAnLi9odHRwLW1ldGhvZC5lbnVtJztcbmltcG9ydCB7IEp3dEhlbHBlciB9IGZyb20gJy4vand0LWhlbHBlci5jbGFzcyc7XG5pbXBvcnQgeyBSZXN0U2VydmljZUNvbmZpZywgVHlwZVRva2VuU3RvcmFnZSB9IGZyb20gJy4vbmd4LXJlc3QuY29uZmlnJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgUmVzdENsaWVudFNlcnZpY2Uge1xuICAvKiogSGFuZGxlciB1c2VkIHRvIHN0b3AgYWxsIHBlbmRpbmcgcmVxdWVzdHMgKi9cbiAgcHJvdGVjdGVkIGNhbmNlbFBlbmRpbmckOiBTdWJqZWN0PGJvb2xlYW4+ID0gbmV3IFN1YmplY3Q8Ym9vbGVhbj4oKTtcblxuICAvKiogIERlZmF1bHQgcmVxdWVzdHMgaGVhZGVyICovXG4gIHByb3RlY3RlZCBiYXNlSGVhZGVyID0ge1xuICAgICdDYWNoZS1Db250cm9sJzogJ25vLWNhY2hlJyxcbiAgICBhY2NlcHQ6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICBQcmFnbWE6ICduby1jYWNoZScsXG4gICAgQXV0aG9yaXphdGlvbjogJycsXG4gICAgJ0FjY2VwdC1MYW5ndWFnZSc6ICcqJ1xuICB9O1xuXG4gIC8qKiBTZXJ2aWNlIGNvbmZpZ3VyYXRpb24gcGFyYW1ldGVycyAqL1xuICBwcm90ZWN0ZWQgY29uZmlnOiBSZXN0U2VydmljZUNvbmZpZztcblxuICAvKiogV2hlbiB0cnVlLCB0aGUgcmVxdWVzdCBoZWFkZXIgd2lsbCBpbmNsdWRlIHRoZSBhdXRoZW50aWNhdGlvbiB0b2tlbiAqL1xuICBwcm90ZWN0ZWQgc2VjdXJlUmVxdWVzdCA9IGZhbHNlO1xuXG4gIC8qKiBIb2xkcyBhIGxpc3Qgb2YgZmlsZXMgdG8gYmUgdXBsb2FkIG9uIHJlcXVlc3QgKi9cbiAgcHJvdGVjdGVkIHdpdGhGaWxlc1JlcXVlc3QgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQsXG4gICAgcHJpdmF0ZSBjb29raWVzOiBDb29raWVTZXJ2aWNlLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgcm91dGVyOiBSb3V0ZXIsXG4gICAgQE9wdGlvbmFsKCkgY29uZmlnOiBSZXN0U2VydmljZUNvbmZpZ1xuICApIHtcbiAgICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgIGVuZFBvaW50OiAnJyxcbiAgICAgIHRva2VuTmFtZTogJ0F1dGhUb2tlbicsXG4gICAgICB0b2tlblN0b3JhZ2U6IFR5cGVUb2tlblN0b3JhZ2UuY29va2llLFxuICAgICAgc2VjdXJlQ29va2llOiBmYWxzZSxcbiAgICAgIG1vY2tEYXRhOiBmYWxzZSxcbiAgICAgIHZhbGlkYXRpb25Ub2tlblVyaTogJy9pbmZvJyxcbiAgICAgIGF1dGhVcmk6ICcvYXV0aGVudGljYXRlJyxcbiAgICAgIFVuYXV0aG9yaXplZFJlZGlyZWN0VXJpOiBudWxsXG4gICAgfSBhcyBSZXN0U2VydmljZUNvbmZpZztcblxuICAgIGlmIChjb25maWcpIHtcbiAgICAgIHRoaXMuc2V0Q29uZmlnKGNvbmZpZyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgUmVzdCBDbGllbnQgY29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzLlxuICAgKlxuICAgKiBDQVVUSU9OOiBUaGlzIG1ldGhvZCBvdmVycmlkZXMgdGhlIGN1cnJlbnQgY29uZmlndXJhdGlvbiBzZXR0aW5nc1xuICAgKiBhbmQgdGhpcyBzZXR0aW5ncyB3aWxsIGFwcGx5IHRvIGFsbCBmb2xsb3dpbmcgcmVxdWVzdHNcbiAgICovXG4gIHB1YmxpYyBzZXRDb25maWcoY29uZmlnOiBSZXN0U2VydmljZUNvbmZpZyk6IFJlc3RDbGllbnRTZXJ2aWNlIHtcbiAgICB0aGlzLmNvbmZpZyA9IHsgLi4udGhpcy5jb25maWcsIC4uLmNvbmZpZyB9IGFzIFJlc3RTZXJ2aWNlQ29uZmlnO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqIFJldHVybiB0aGUgY3VycmVudCBSZXN0IENsaWVudCBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnMuICAqL1xuICBwdWJsaWMgZ2V0Q29uZmlnKCk6IFJlc3RTZXJ2aWNlQ29uZmlnIHtcbiAgICByZXR1cm4gdGhpcy5jb25maWc7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBBUEkgVG9rZW4gZnJvbSBjb29raWVzXG4gICAqL1xuICBwdWJsaWMgZ2V0IHRva2VuKCk6IHN0cmluZyB7XG4gICAgbGV0IHRva2VuID0gJyc7XG5cbiAgICBzd2l0Y2ggKHRoaXMuY29uZmlnLnRva2VuU3RvcmFnZSkge1xuICAgICAgY2FzZSBUeXBlVG9rZW5TdG9yYWdlLmNvb2tpZTpcbiAgICAgICAgdG9rZW4gPSB0aGlzLmNvb2tpZXMuZ2V0KHRoaXMuY29uZmlnLnRva2VuTmFtZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBUeXBlVG9rZW5TdG9yYWdlLmxvY2FsU3RvcmFnZTpcbiAgICAgICAgdG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmNvbmZpZy50b2tlbk5hbWUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVHlwZVRva2VuU3RvcmFnZS5zZXNzaW9uU3RvcmFnZTpcbiAgICAgICAgdG9rZW4gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKHRoaXMuY29uZmlnLnRva2VuTmFtZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIFRva2VuIFN0b3JhZ2UgbWV0aG9kJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuICF0b2tlbiB8fCB0eXBlb2YgdG9rZW4gPT09ICd1bmRlZmluZWQnID8gJycgOiB0b2tlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTYXZlIHRoZSBBUEkgVG9rZW4gY29va2llXG4gICAqL1xuICBwdWJsaWMgc2V0IHRva2VuKHRva2VuOiBzdHJpbmcpIHtcbiAgICBjb25zdCBkZWNvZGVkID0gSnd0SGVscGVyLmRlY29kZVRva2VuKHRva2VuKTtcbiAgICBjb25zdCBleHBpcmVzID0gZnJvbVVuaXhUaW1lKGRlY29kZWQuZXhwKTtcblxuICAgIHN3aXRjaCAodGhpcy5jb25maWcudG9rZW5TdG9yYWdlKSB7XG4gICAgICBjYXNlIFR5cGVUb2tlblN0b3JhZ2UuY29va2llOlxuICAgICAgICB0aGlzLmNvb2tpZXMucHV0KFxuICAgICAgICAgIHRoaXMuY29uZmlnLnRva2VuTmFtZSxcbiAgICAgICAgICB0b2tlbixcbiAgICAgICAgICB7IHNlY3VyZTogdGhpcy5jb25maWcuc2VjdXJlQ29va2llLCBleHBpcmVzIH1cbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFR5cGVUb2tlblN0b3JhZ2UubG9jYWxTdG9yYWdlOlxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmNvbmZpZy50b2tlbk5hbWUsIHRva2VuKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFR5cGVUb2tlblN0b3JhZ2Uuc2Vzc2lvblN0b3JhZ2U6XG4gICAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0odGhpcy5jb25maWcudG9rZW5OYW1lLCB0b2tlbik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIFRva2VuIFN0b3JhZ2UgbWV0aG9kJyk7XG4gICAgfVxuICB9XG5cblxuICAvKipcbiAgICogUmVtb3ZlIHRoZSBBdXRoZW50aWNhdGlvbiB0b2tlbiBjb29raWVcbiAgICovXG4gIHB1YmxpYyByZXZva2UoKTogdm9pZCB7XG4gICAgc3dpdGNoICh0aGlzLmNvbmZpZy50b2tlblN0b3JhZ2UpIHtcbiAgICAgIGNhc2UgVHlwZVRva2VuU3RvcmFnZS5jb29raWU6XG4gICAgICAgIHRoaXMuY29va2llcy5yZW1vdmVBbGwoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFR5cGVUb2tlblN0b3JhZ2UubG9jYWxTdG9yYWdlOlxuICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLmNvbmZpZy50b2tlbk5hbWUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVHlwZVRva2VuU3RvcmFnZS5zZXNzaW9uU3RvcmFnZTpcbiAgICAgICAgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLmNvbmZpZy50b2tlbk5hbWUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBUb2tlbiBTdG9yYWdlIG1ldGhvZCcpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXF1ZXN0IGFuIEF1dGhvcml6YXRpb24gdG9rZW5cbiAgICogVGhlIGRlZmF1bHQgYXV0aG9yaXphdGlvbiBVUkkgaXMgJ1tBUElfRU5EX1BPSU5UXS9hdXRob3JpemUnXG4gICAqIEBwYXJhbSB1c2VybmFtZSBVc2VybmFtZVxuICAgKiBAcGFyYW0gcGFzc3dvcmQgUGFzc3dvcmRcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBhdXRoZW50aWNhdGVgIG1ldGhvZCBpbnN0ZWFkXG4gICAqL1xuICBwdWJsaWMgYXV0aG9yaXplKHVzZXJuYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLmF1dGhlbnRpY2F0ZSh1c2VybmFtZSwgcGFzc3dvcmQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcXVlc3QgYW4gYXV0aGVudGljYXRpb24gdG9rZW5cbiAgICogVGhlIGRlZmF1bHQgYXV0aGVudGljYXRpb24gVVJJIGlzICdbQVBJX0VORF9QT0lOVF0vYXV0aGVudGljYXRlJ1xuICAgKiBAcGFyYW0gdXNlcm5hbWUgVXNlcm5hbWVcbiAgICogQHBhcmFtIHBhc3N3b3JkIFBhc3N3b3JkXG4gICAqL1xuICBwdWJsaWMgYXV0aGVudGljYXRlKHVzZXJuYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLnBvc3QodGhpcy5jb25maWcuYXV0aFVyaSwgeyB1c2VybmFtZSwgcGFzc3dvcmQgfSlcbiAgICAgIC5waXBlKFxuICAgICAgICB0YXAocGF5bG9hZCA9PiB7XG4gICAgICAgICAgdGhpcy50b2tlbiA9IHBheWxvYWQ7XG4gICAgICAgIH0pXG4gICAgICApO1xuICB9XG5cbiAgLyoqIFZhbGlkYXRlIHRoZSBBdXRoZW50aWNhdGlvbiB0b2tlbiBhZ2FpbnN0IHRoZSBBUEkgKi9cbiAgcHVibGljIHZhbGlkYXRlVG9rZW4odXJsOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLnNlY3VyZWQoKS5yZXF1ZXN0KEh0dHBNZXRob2QuUG9zdCwgdXJsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGF1dGhvcml6YXRpb24gdG9rZW5cbiAgICogQHBhcmFtIHVybCBhIHVybCB0byByZXBvcnQgdG9cbiAgICogQGRlcHJlY2F0ZWQgdXNlIGBkZWF1dGhlbnRpY2F0ZWAgbWV0aG9kIGluc3RlYWRcbiAgICovXG4gIHB1YmxpYyBkZWF1dGhvcml6ZSh1cmw6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMuZGVhdXRoZW50aWNhdGUodXJsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGF1dGhvcml6YXRpb24gdG9rZW4gYW5kIHJlcG9ydHMgbG9nb3V0IHRvIHRoZSBzZXJ2ZXJcbiAgICogQHBhcmFtIHVybCBhIHVybCB0byByZXBvcnQgdG9cbiAgICovXG4gIHB1YmxpYyBkZWF1dGhlbnRpY2F0ZSh1cmw6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMuc2VjdXJlZCgpLnJlcXVlc3QoSHR0cE1ldGhvZC5HZXQsIHVybClcbiAgICAgIC5waXBlKFxuICAgICAgICB0YXAoKCkgPT4ge1xuICAgICAgICAgIHRoaXMucmV2b2tlKCk7XG4gICAgICAgIH0pXG4gICAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBjbGllbnQgaXMgYWxyZWFkeSBhdXRoZW50aWNhdGVkXG4gICAqIEBkZXByZWNhdGVkIHVzZSBgaXNBdXRoZW50aWNhdGVkYCBtZXRob2QgaW5zdGVhZFxuICAgKi9cbiAgcHVibGljIGlzQXV0aG9yaXplZCgpOiBib29sZWFuIHtcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMudG9rZW47XG4gICAgY29uc3QgZGVjb2RlZCA9IEp3dEhlbHBlci5kZWNvZGVUb2tlbih0b2tlbik7XG4gICAgcmV0dXJuIGRlY29kZWQgIT09IG51bGwgJiYgIWlzQWZ0ZXIobmV3IERhdGUoKSwgZnJvbVVuaXhUaW1lKGRlY29kZWQuZXhwKSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGNsaWVudCBpcyBhbHJlYWR5IGF1dGhlbnRpY2F0ZWRcbiAgICovXG4gIHB1YmxpYyBpc0F1dGhlbnRpY2F0ZWQoKTogYm9vbGVhbiB7XG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLnRva2VuO1xuICAgIGNvbnN0IGRlY29kZWQgPSBKd3RIZWxwZXIuZGVjb2RlVG9rZW4odG9rZW4pO1xuICAgIHJldHVybiBkZWNvZGVkICE9PSBudWxsICYmICFpc0FmdGVyKG5ldyBEYXRlKCksIGZyb21Vbml4VGltZShkZWNvZGVkLmV4cCkpO1xuICB9XG5cbiAgLyoqIENhbmNlbCBhbGwgcGVuZGluZyByZXF1ZXN0cyAqL1xuICBwdWJsaWMgY2FuY2VsUGVuZGluZ1JlcXVlc3RzKCk6IHZvaWQge1xuICAgIHRoaXMuY2FuY2VsUGVuZGluZyQubmV4dCh0cnVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHJlcXVlc3QgbW9kZSB0byBTRUNVUkVEIGZvciB0aGUgbmV4dCByZXF1ZXN0LlxuICAgKlxuICAgKiBTZWN1cmVkIE1vZGUgZm9yY2UgdGhlIG5leHQgcmVxdWVzdCB0byBpbmNsdWRlIHRoZSBhdXRoZW50aWNhdGlvbiB0b2tlbi5cbiAgICogVGhlIHRva2VuIG11c3QgYmUgcmVxdWVzdGVkIHByZXZpb3VzbHkgdXNpbmcgdGhlIFwiYXV0aG9yaXplXCIgbWV0aG9kLlxuICAgKi9cbiAgcHVibGljIHNlY3VyZWQoKTogUmVzdENsaWVudFNlcnZpY2Uge1xuICAgIHRoaXMuc2VjdXJlUmVxdWVzdCA9IHRydWU7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHJlcXVlc3QgbW9kZSB0byBQVUJMSUMgZm9yIHRoZSBuZXh0IHJlcXVlc3QuXG4gICAqXG4gICAqIFB1YmxpYyBpcyB0aGUgZGVmYXVsdCByZXF1ZXN0IG1vZGUgYW5kIGVuc3VyZSB0aGF0IG5vIGF1dGhlbnRpY2F0aW9uIHRva2VuXG4gICAqIHdpbGwgYmUgcGFzcyBvbiB0aGUgbmV4dCByZXF1ZXN0LlxuICAgKi9cbiAgcHVibGljIHB1YmxpYygpOiBSZXN0Q2xpZW50U2VydmljZSB7XG4gICAgdGhpcy5zZWN1cmVSZXF1ZXN0ID0gZmFsc2U7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBBUEkgcmVxdWVzdCB1c2luZyBHRVQgbWV0aG9kXG4gICAqXG4gICAqIEBwYXJhbSB1cmxcbiAgICogQHBhcmFtIGRhdGEgQSBsaXN0IG9mIHBhcmFtZXRlc1xuICAgKi9cbiAgcHVibGljIGdldCh1cmw6IHN0cmluZywgZGF0YT86IHt9KTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KEh0dHBNZXRob2QuR2V0LCB1cmwsIGRhdGEpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFQSSByZXF1ZXN0IHVzaW5nIFBPU1QgbWV0aG9kXG4gICAqXG4gICAqIEBwYXJhbSB1cmxcbiAgICogQHBhcmFtIGRhdGFcbiAgICogQHBhcmFtIHJlc3BvbnNlVHlwZVxuICAgKiBAcGFyYW0gaHR0cE9wdGlvbnNcbiAgICovXG4gIHB1YmxpYyBwb3N0KHVybDogc3RyaW5nLCBkYXRhPzoge30sIHJlc3BvbnNlVHlwZT86IHN0cmluZywgaHR0cE9wdGlvbnM6IElIdHRwT3B0aW9ucyA9IHt9KTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KEh0dHBNZXRob2QuUG9zdCwgdXJsLCBkYXRhLCByZXNwb25zZVR5cGUsIGh0dHBPcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBUEkgcmVxdWVzdCB1c2luZyBQVVQgbWV0aG9kXG4gICAqXG4gICAqIEBwYXJhbSB1cmxcbiAgICogQHBhcmFtIGRhdGFcbiAgICogQHBhcmFtIHJlc3BvbnNlVHlwZVxuICAgKiBAcGFyYW0gaHR0cE9wdGlvbnNcbiAgICovXG4gIHB1YmxpYyBwdXQodXJsOiBzdHJpbmcsIGRhdGE/OiB7fSwgcmVzcG9uc2VUeXBlPzogc3RyaW5nLCBodHRwT3B0aW9uczogSUh0dHBPcHRpb25zID0ge30pOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QoSHR0cE1ldGhvZC5QdXQsIHVybCwgZGF0YSwgcmVzcG9uc2VUeXBlLCBodHRwT3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQVBJIHJlcXVlc3QgdXNpbmcgUEFUQ0ggbWV0aG9kXG4gICAqXG4gICAqIEBwYXJhbSB1cmxcbiAgICogQHBhcmFtIGRhdGFcbiAgICogQHBhcmFtIHJlc3BvbnNlVHlwZVxuICAgKiBAcGFyYW0gaHR0cE9wdGlvbnNcbiAgICovXG4gIHB1YmxpYyBwYXRjaCh1cmw6IHN0cmluZywgZGF0YT86IHt9LCByZXNwb25zZVR5cGU/OiBzdHJpbmcsIGh0dHBPcHRpb25zOiBJSHR0cE9wdGlvbnMgPSB7fSk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChIdHRwTWV0aG9kLlBhdGNoLCB1cmwsIGRhdGEsIHJlc3BvbnNlVHlwZSwgaHR0cE9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFQSSByZXF1ZXN0IHVzaW5nIERFTEVURSBtZXRob2RcbiAgICpcbiAgICogQHBhcmFtIHVybFxuICAgKiBAcGFyYW0gZGF0YVxuICAgKiBAcGFyYW0gcmVzcG9uc2VUeXBlXG4gICAqL1xuICBwdWJsaWMgZGVsZXRlKHVybDogc3RyaW5nLCBkYXRhPzoge30sIHJlc3BvbnNlVHlwZT86IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChIdHRwTWV0aG9kLkRlbGV0ZSwgdXJsLCBkYXRhLCByZXNwb25zZVR5cGUpO1xuICB9XG5cbiAgLyoqIFNldCB0aGUgdXBsb2FkIGZpbGUgbW9kZSAqL1xuICBwdWJsaWMgd2l0aEZpbGVzKCk6IFJlc3RDbGllbnRTZXJ2aWNlIHtcbiAgICB0aGlzLndpdGhGaWxlc1JlcXVlc3QgPSB0cnVlO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgRm9ybURhdGEgb2JqZWN0IHRvIGJlIHNlbmQgYXMgcmVxdWVzdCBwYXlsb2FkIGRhdGFcbiAgICovXG4gIHByb3RlY3RlZCBjcmVhdGVGb3JtRGF0YShvYmplY3Q6IGFueSwgZm9ybT86IEZvcm1EYXRhLCBuYW1lc3BhY2U/OiBzdHJpbmcpOiBGb3JtRGF0YSB7XG4gICAgY29uc3QgZm9ybURhdGEgPSBmb3JtIHx8IG5ldyBGb3JtRGF0YSgpO1xuXG4gICAgZm9yIChjb25zdCBwcm9wZXJ0eSBpbiBvYmplY3QpIHtcblxuICAgICAgaWYgKCFvYmplY3QuaGFzT3duUHJvcGVydHkocHJvcGVydHkpIHx8ICFvYmplY3RbcHJvcGVydHldKSB7IGNvbnRpbnVlOyB9XG5cbiAgICAgIGNvbnN0IGZvcm1LZXkgPSBuYW1lc3BhY2UgPyBgJHtuYW1lc3BhY2V9WyR7cHJvcGVydHl9XWAgOiBwcm9wZXJ0eTtcbiAgICAgIGlmIChvYmplY3RbcHJvcGVydHldIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICBmb3JtRGF0YS5hcHBlbmQoZm9ybUtleSwgb2JqZWN0W3Byb3BlcnR5XS50b0lTT1N0cmluZygpKTtcbiAgICAgIH0gZWxzZSBpZiAob2JqZWN0W3Byb3BlcnR5XSBpbnN0YW5jZW9mIEZpbGVMaXN0KSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb2JqZWN0W3Byb3BlcnR5XS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChgJHtwcm9wZXJ0eX1bXWAsIG9iamVjdFtwcm9wZXJ0eV0uaXRlbShpKSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIHR5cGVvZiBvYmplY3RbcHJvcGVydHldID09PSAnb2JqZWN0JyAmJiAhKG9iamVjdFtwcm9wZXJ0eV0gaW5zdGFuY2VvZiBGaWxlKSkge1xuICAgICAgICB0aGlzLmNyZWF0ZUZvcm1EYXRhKG9iamVjdFtwcm9wZXJ0eV0sIGZvcm1EYXRhLCBmb3JtS2V5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZChmb3JtS2V5LCBvYmplY3RbcHJvcGVydHldKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZvcm1EYXRhO1xuICB9XG5cblxuXG4gIHByb3RlY3RlZCBidWlsZFVybCh1cmw6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgZW5kUG9pbnQgPSB0aGlzLmNvbmZpZy5tb2NrRGF0YSA/ICdhc3NldHMvbW9jay1kYXRhJyA6IHRoaXMuY29uZmlnLmVuZFBvaW50LnJlcGxhY2UoL1xcLyQvLCAnJyk7XG5cbiAgICBsZXQgblVybCA9IGAke2VuZFBvaW50fS8ke3VybC5yZXBsYWNlKC9eXFwvL2csICcnKX1gO1xuICAgIGNvbnN0IG1hdGNoID0gblVybC5tYXRjaCgvXFwuKFswLTlhLXpdKykoPzpbXFw/I118JCkvaSk7XG5cbiAgICBpZiAodGhpcy5jb25maWcubW9ja0RhdGEgJiYgbWF0Y2ggPT0gbnVsbCkge1xuICAgICAgblVybCA9IGAke25Vcmx9Lmpzb25gO1xuICAgIH1cblxuICAgIHJldHVybiBuVXJsO1xuICB9XG5cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSByZXF1ZXN0IGhlYWRlcnMgYmFzZWQgb24gY29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzXG4gICAqL1xuICBwcml2YXRlIGJ1aWxkSGVhZGVycygpIHtcbiAgICBjb25zdCBoZWFkZXIgPSB7IC4uLnRoaXMuYmFzZUhlYWRlciB9O1xuXG4gICAgaWYgKHRoaXMuY29uZmlnLmxhbmd1YWdlKSB7IGhlYWRlclsnQWNjZXB0LUxhbmd1YWdlJ10gPSB0aGlzLmNvbmZpZy5sYW5ndWFnZTsgfVxuXG4gICAgaWYgKHRoaXMuc2VjdXJlUmVxdWVzdCkge1xuICAgICAgY29uc3QgdG9rZW4gPSB0aGlzLnRva2VuO1xuICAgICAgaWYgKCF0b2tlbikge1xuICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgJ0V4ZWN1dGluZyBhIHNlY3VyZSByZXF1ZXN0IHdpdGhvdXQgVE9LRU4uICdcbiAgICAgICAgICArICdBdXRob3JpemF0aW9uIGhlYWRlciB3aWxsIG5vdCBiZSBzZXQhJ1xuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaGVhZGVyLkF1dGhvcml6YXRpb24gPSBgQmVhcmVyICR7dG9rZW59YDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZWN1cmVSZXF1ZXN0ID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIGhlYWRlcjtcbiAgfVxuXG5cblxuICAvKiogUmF3IHJlcXVlc3QgbWV0aG9kICovXG4gIHByb3RlY3RlZCByZXF1ZXN0KFxuICAgIG1ldGhvZDogSHR0cE1ldGhvZCwgdXJsOiBzdHJpbmcsIGRhdGE/OiBhbnksIHJlc3BvbnNlVHlwZT86IHN0cmluZyxcbiAgICBodHRwT3B0aW9uczogSUh0dHBPcHRpb25zID0ge31cbiAgKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICBjb25zdCBtc0RlbGF5ID0gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDIwMDApICsgMTAwMCk7XG4gICAgY29uc3QgaGVhZGVyID0gdGhpcy5idWlsZEhlYWRlcnMoKTtcblxuICAgIGNvbnN0IHJUeXBlID0gKHJlc3BvbnNlVHlwZSA/IHJlc3BvbnNlVHlwZSA6ICdqc29uJykgYXMgJ3RleHQnO1xuXG4gICAgaWYgKHRoaXMud2l0aEZpbGVzUmVxdWVzdCkgeyBkYXRhID0gdGhpcy5jcmVhdGVGb3JtRGF0YShkYXRhKTsgdGhpcy53aXRoRmlsZXNSZXF1ZXN0ID0gZmFsc2U7IH1cblxuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICBib2R5OiBtZXRob2QgPT09IEh0dHBNZXRob2QuR2V0ID8ge30gOiBkYXRhLFxuICAgICAgcmVzcG9uc2VUeXBlOiByVHlwZSxcbiAgICAgIHBhcmFtczogbWV0aG9kID09PSBIdHRwTWV0aG9kLkdldCA/IGRhdGEgOiB7fSxcbiAgICAgIGhlYWRlcnM6IGhlYWRlclxuICAgIH07XG5cbiAgICByZXR1cm4gdGhpcy5odHRwXG4gICAgICAucmVxdWVzdChcbiAgICAgICAgdGhpcy5jb25maWcubW9ja0RhdGEgPyBIdHRwTWV0aG9kLkdldCA6IG1ldGhvZCwgdGhpcy5idWlsZFVybCh1cmwpLFxuICAgICAgICB7IC4uLm9wdGlvbnMsIC4uLmh0dHBPcHRpb25zIH1cbiAgICAgIClcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLmNhbmNlbFBlbmRpbmckKSlcbiAgICAgIC5waXBlKGRlbGF5KHRoaXMuY29uZmlnLm1vY2tEYXRhID8gbXNEZWxheSA6IDApKVxuICAgICAgLnBpcGUoY2F0Y2hFcnJvcigoZXJyKSA9PiB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICB0aGlzLmNvbmZpZy5VbmF1dGhlbnRpY2F0ZWRSZWRpcmVjdFVyaVxuICAgICAgICAgICYmIHVybCAhPT0gdGhpcy5jb25maWcuYXV0aFVyaVxuICAgICAgICAgICYmIGVyci5zdGF0dXMgPT09IDQwMVxuICAgICAgICApIHtcbiAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbdGhpcy5jb25maWcuVW5hdXRoZW50aWNhdGVkUmVkaXJlY3RVcmldKS50aGVuKCgpID0+IHsgfSk7XG4gICAgICAgICAgdGhpcy5jYW5jZWxQZW5kaW5nUmVxdWVzdHMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChcbiAgICAgICAgICB0aGlzLmNvbmZpZy5VbmF1dGhvcml6ZWRSZWRpcmVjdFVyaVxuICAgICAgICAgICYmIHVybCAhPT0gdGhpcy5jb25maWcuYXV0aFVyaVxuICAgICAgICAgICYmIGVyci5zdGF0dXMgPT09IDQwM1xuICAgICAgICApIHtcbiAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbdGhpcy5jb25maWcuVW5hdXRob3JpemVkUmVkaXJlY3RVcmldKS50aGVuKCgpID0+IHsgfSk7XG4gICAgICAgICAgdGhpcy5jYW5jZWxQZW5kaW5nUmVxdWVzdHMoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnIpO1xuICAgICAgfSkpO1xuICB9XG59XG4iXX0=