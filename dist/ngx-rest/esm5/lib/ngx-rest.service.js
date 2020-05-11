import { __assign } from "tslib";
import { Injectable, Optional } from '@angular/core';
import { Subject, throwError, of } from 'rxjs';
import { takeUntil, tap, catchError, delay } from 'rxjs/operators';
import { isAfter, fromUnixTime } from 'date-fns';
import { HttpMethod } from './http-method.enum';
import { JwtHelper } from './jwt-helper.class';
import { TypeTokenStorage } from './ngx-rest.config';
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
        /** Prefer cache */
        this.cachedRequest = false;
        /** Invalidate cache */
        this.invalidateCache = false;
        this.config = {
            endPoint: '',
            tokenName: 'AuthToken',
            tokenStorage: TypeTokenStorage.cookie,
            secureCookie: false,
            mockData: false,
            validationTokenUri: '/info',
            authUri: '/authorize',
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
     */
    RestClientService.prototype.authorize = function (username, password) {
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
    /** Removes authorization token */
    RestClientService.prototype.deauthorize = function (url) {
        var _this = this;
        return this.secured().request(HttpMethod.Get, url)
            .pipe(tap(function () {
            _this.revoke();
        }));
    };
    /** Check if the client is already Authenticate  */
    RestClientService.prototype.isAuthorized = function () {
        var token = this.token;
        var decoded = JwtHelper.decodeToken(token);
        return decoded !== null && !isAfter(new Date(), fromUnixTime(decoded.exp));
    };
    /** Cancel all pending requests */
    RestClientService.prototype.cancelPendingRequests = function () {
        this.cancelPending$.next(true);
    };
    RestClientService.prototype.cached = function (invalidate) {
        if (invalidate === void 0) { invalidate = false; }
        this.cachedRequest = true;
        this.invalidateCache = invalidate;
        return this;
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
        var cacheKey = '';
        if (this.cachedRequest) {
            cacheKey = btoa(unescape(encodeURIComponent(method + '_' + url + '_' + (method === HttpMethod.Get ? JSON.stringify(data) : ''))));
            if (!this.invalidateCache) {
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
            .pipe(tap(function (resp) {
            if (_this.cachedRequest) {
                _this.cachedRequest = false;
                _this.cache.set(cacheKey, resp);
            }
        }))
            .pipe(catchError(function (err) {
            if (_this.config.UnauthorizedRedirectUri
                && url !== _this.config.authUri
                && err.status === 401) {
                _this.router.navigate([_this.config.UnauthorizedRedirectUri]).then(function () { });
                _this.cancelPendingRequests();
            }
            return throwError(err);
        }));
    };
    /** @nocollapse */ RestClientService.ɵfac = function RestClientService_Factory(t) { return new (t || RestClientService)(i0.ɵɵinject(i1.HttpClient), i0.ɵɵinject(i2.CookieService), i0.ɵɵinject(i3.CacheService), i0.ɵɵinject(i4.Router), i0.ɵɵinject(i5.RestServiceConfig, 8)); };
    /** @nocollapse */ RestClientService.ɵprov = i0.ɵɵdefineInjectable({ token: RestClientService, factory: RestClientService.ɵfac, providedIn: 'root' });
    return RestClientService;
}());
export { RestClientService };
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(RestClientService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: i1.HttpClient }, { type: i2.CookieService }, { type: i3.CacheService }, { type: i4.Router }, { type: i5.RestServiceConfig, decorators: [{
                type: Optional
            }] }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXJlc3Quc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1yZXN0LyIsInNvdXJjZXMiOlsibGliL25neC1yZXN0LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBSXJELE9BQU8sRUFBYyxPQUFPLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMzRCxPQUFPLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbkUsT0FBTyxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFHakQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUMvQyxPQUFPLEVBQXFCLGdCQUFnQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7Ozs7Ozs7QUFHeEU7SUErQkUsMkJBQ1UsSUFBZ0IsRUFDaEIsT0FBc0IsRUFDdEIsS0FBbUIsRUFDVixNQUFjLEVBQ25CLE1BQXlCO1FBSjdCLFNBQUksR0FBSixJQUFJLENBQVk7UUFDaEIsWUFBTyxHQUFQLE9BQU8sQ0FBZTtRQUN0QixVQUFLLEdBQUwsS0FBSyxDQUFjO1FBQ1YsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQS9CakMsZ0RBQWdEO1FBQ3RDLG1CQUFjLEdBQXFCLElBQUksT0FBTyxFQUFXLENBQUM7UUFFcEUsK0JBQStCO1FBQ3JCLGVBQVUsR0FBRztZQUNyQixlQUFlLEVBQUUsVUFBVTtZQUMzQixNQUFNLEVBQUUsa0JBQWtCO1lBQzFCLE1BQU0sRUFBRSxVQUFVO1lBQ2xCLGFBQWEsRUFBRSxFQUFFO1lBQ2pCLGlCQUFpQixFQUFFLEdBQUc7U0FDdkIsQ0FBQztRQUtGLDBFQUEwRTtRQUNoRSxr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SUFBSSxDQUFDLENBQUM7YUFDaEM7UUFDSCxDQUFDLENBQ0EsQ0FBQzthQUNELElBQUksQ0FBQyxVQUFVLENBQUMsVUFBQyxHQUFHO1lBQ25CLElBQ0UsS0FBSSxDQUFDLE1BQU0sQ0FBQyx1QkFBdUI7bUJBQ2hDLEdBQUcsS0FBSyxLQUFJLENBQUMsTUFBTSxDQUFDLE9BQU87bUJBQzNCLEdBQUcsQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUNyQjtnQkFDQSxLQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUksQ0FBQyxNQUFNLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUM1RSxLQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQzthQUM5QjtZQUNELE9BQU8sVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3pCLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDUixDQUFDO3lHQXZZVSxpQkFBaUI7Z0ZBQWpCLGlCQUFpQixXQUFqQixpQkFBaUIsbUJBRmhCLE1BQU07NEJBZnBCO0NBeVpDLEFBM1lELElBMllDO1NBeFlZLGlCQUFpQjtrREFBakIsaUJBQWlCO2NBSDdCLFVBQVU7ZUFBQztnQkFDVixVQUFVLEVBQUUsTUFBTTthQUNuQjs7c0JBa0NJLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBDb29raWVTZXJ2aWNlIH0gZnJvbSAnbmd4LWNvb2tpZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJqZWN0LCB0aHJvd0Vycm9yLCBvZiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgdGFrZVVudGlsLCB0YXAsIGNhdGNoRXJyb3IsIGRlbGF5IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgaXNBZnRlciwgZnJvbVVuaXhUaW1lIH0gZnJvbSAnZGF0ZS1mbnMnO1xuXG5pbXBvcnQgeyBJSHR0cE9wdGlvbnMgfSBmcm9tICcuL2h0dHAtb3B0aW9ucy5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgSHR0cE1ldGhvZCB9IGZyb20gJy4vaHR0cC1tZXRob2QuZW51bSc7XG5pbXBvcnQgeyBKd3RIZWxwZXIgfSBmcm9tICcuL2p3dC1oZWxwZXIuY2xhc3MnO1xuaW1wb3J0IHsgUmVzdFNlcnZpY2VDb25maWcsIFR5cGVUb2tlblN0b3JhZ2UgfSBmcm9tICcuL25neC1yZXN0LmNvbmZpZyc7XG5pbXBvcnQgeyBDYWNoZVNlcnZpY2UgfSBmcm9tICcuL2NhY2hlLnNlcnZpY2UnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBSZXN0Q2xpZW50U2VydmljZSB7XG4gIC8qKiBIYW5kbGVyIHVzZWQgdG8gc3RvcCBhbGwgcGVuZGluZyByZXF1ZXN0cyAqL1xuICBwcm90ZWN0ZWQgY2FuY2VsUGVuZGluZyQ6IFN1YmplY3Q8Ym9vbGVhbj4gPSBuZXcgU3ViamVjdDxib29sZWFuPigpO1xuXG4gIC8qKiAgRGVmYXVsdCByZXF1ZXN0cyBoZWFkZXIgKi9cbiAgcHJvdGVjdGVkIGJhc2VIZWFkZXIgPSB7XG4gICAgJ0NhY2hlLUNvbnRyb2wnOiAnbm8tY2FjaGUnLFxuICAgIGFjY2VwdDogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgIFByYWdtYTogJ25vLWNhY2hlJyxcbiAgICBBdXRob3JpemF0aW9uOiAnJyxcbiAgICAnQWNjZXB0LUxhbmd1YWdlJzogJyonXG4gIH07XG5cbiAgLyoqIFNlcnZpY2UgY29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzICovXG4gIHByb3RlY3RlZCBjb25maWc6IFJlc3RTZXJ2aWNlQ29uZmlnO1xuXG4gIC8qKiBXaGVuIHRydWUsIHRoZSByZXF1ZXN0IGhlYWRlciB3aWxsIGluY2x1ZGUgdGhlIGF1dGhlbnRpY2F0aW9uIHRva2VuICovXG4gIHByb3RlY3RlZCBzZWN1cmVSZXF1ZXN0ID0gZmFsc2U7XG5cbiAgLyoqIEhvbGRzIGEgbGlzdCBvZiBmaWxlcyB0byBiZSB1cGxvYWQgb24gcmVxdWVzdCAqL1xuICBwcm90ZWN0ZWQgd2l0aEZpbGVzUmVxdWVzdCA9IGZhbHNlO1xuXG4gIC8qKiBQcmVmZXIgY2FjaGUgKi9cbiAgcHJvdGVjdGVkIGNhY2hlZFJlcXVlc3QgPSBmYWxzZTtcblxuICAvKiogSW52YWxpZGF0ZSBjYWNoZSAqL1xuICBwcm90ZWN0ZWQgaW52YWxpZGF0ZUNhY2hlID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LFxuICAgIHByaXZhdGUgY29va2llczogQ29va2llU2VydmljZSxcbiAgICBwcml2YXRlIGNhY2hlOiBDYWNoZVNlcnZpY2UsXG4gICAgcHJpdmF0ZSByZWFkb25seSByb3V0ZXI6IFJvdXRlcixcbiAgICBAT3B0aW9uYWwoKSBjb25maWc6IFJlc3RTZXJ2aWNlQ29uZmlnXG4gICkge1xuICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgZW5kUG9pbnQ6ICcnLFxuICAgICAgdG9rZW5OYW1lOiAnQXV0aFRva2VuJyxcbiAgICAgIHRva2VuU3RvcmFnZTogVHlwZVRva2VuU3RvcmFnZS5jb29raWUsXG4gICAgICBzZWN1cmVDb29raWU6IGZhbHNlLFxuICAgICAgbW9ja0RhdGE6IGZhbHNlLFxuICAgICAgdmFsaWRhdGlvblRva2VuVXJpOiAnL2luZm8nLFxuICAgICAgYXV0aFVyaTogJy9hdXRob3JpemUnLFxuICAgICAgVW5hdXRob3JpemVkUmVkaXJlY3RVcmk6IG51bGxcbiAgICB9IGFzIFJlc3RTZXJ2aWNlQ29uZmlnO1xuXG4gICAgaWYgKGNvbmZpZykge1xuICAgICAgdGhpcy5zZXRDb25maWcoY29uZmlnKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBSZXN0IENsaWVudCBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnMuXG4gICAqXG4gICAqIENBVVRJT046IFRoaXMgbWV0aG9kIG92ZXJyaWRlcyB0aGUgY3VycmVudCBjb25maWd1cmF0aW9uIHNldHRpbmdzXG4gICAqIGFuZCB0aGlzIHNldHRpbmdzIHdpbGwgYXBwbHkgdG8gYWxsIGZvbGxvd2luZyByZXF1ZXN0c1xuICAgKi9cbiAgcHVibGljIHNldENvbmZpZyhjb25maWc6IFJlc3RTZXJ2aWNlQ29uZmlnKTogUmVzdENsaWVudFNlcnZpY2Uge1xuICAgIHRoaXMuY29uZmlnID0geyAuLi50aGlzLmNvbmZpZywgLi4uY29uZmlnIH0gYXMgUmVzdFNlcnZpY2VDb25maWc7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKiogUmV0dXJuIHRoZSBjdXJyZW50IFJlc3QgQ2xpZW50IGNvbmZpZ3VyYXRpb24gcGFyYW1ldGVycy4gICovXG4gIHB1YmxpYyBnZXRDb25maWcoKTogUmVzdFNlcnZpY2VDb25maWcge1xuICAgIHJldHVybiB0aGlzLmNvbmZpZztcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIEFQSSBUb2tlbiBmcm9tIGNvb2tpZXNcbiAgICovXG4gIHB1YmxpYyBnZXQgdG9rZW4oKTogc3RyaW5nIHtcbiAgICBsZXQgdG9rZW4gPSAnJztcblxuICAgIHN3aXRjaCAodGhpcy5jb25maWcudG9rZW5TdG9yYWdlKSB7XG4gICAgICBjYXNlIFR5cGVUb2tlblN0b3JhZ2UuY29va2llOlxuICAgICAgICB0b2tlbiA9IHRoaXMuY29va2llcy5nZXQodGhpcy5jb25maWcudG9rZW5OYW1lKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFR5cGVUb2tlblN0b3JhZ2UubG9jYWxTdG9yYWdlOlxuICAgICAgICB0b2tlbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMuY29uZmlnLnRva2VuTmFtZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBUeXBlVG9rZW5TdG9yYWdlLnNlc3Npb25TdG9yYWdlOlxuICAgICAgICB0b2tlbiA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0odGhpcy5jb25maWcudG9rZW5OYW1lKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgVG9rZW4gU3RvcmFnZSBtZXRob2QnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gIXRva2VuIHx8IHR5cGVvZiB0b2tlbiA9PT0gJ3VuZGVmaW5lZCcgPyAnJyA6IHRva2VuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNhdmUgdGhlIEFQSSBUb2tlbiBjb29raWVcbiAgICovXG4gIHB1YmxpYyBzZXQgdG9rZW4odG9rZW46IHN0cmluZykge1xuICAgIGNvbnN0IGRlY29kZWQgPSBKd3RIZWxwZXIuZGVjb2RlVG9rZW4odG9rZW4pO1xuICAgIGNvbnN0IGV4cGlyZXMgPSBmcm9tVW5peFRpbWUoZGVjb2RlZC5leHApO1xuXG4gICAgc3dpdGNoICh0aGlzLmNvbmZpZy50b2tlblN0b3JhZ2UpIHtcbiAgICAgIGNhc2UgVHlwZVRva2VuU3RvcmFnZS5jb29raWU6XG4gICAgICAgIHRoaXMuY29va2llcy5wdXQoXG4gICAgICAgICAgdGhpcy5jb25maWcudG9rZW5OYW1lLFxuICAgICAgICAgIHRva2VuLFxuICAgICAgICAgIHsgc2VjdXJlOiB0aGlzLmNvbmZpZy5zZWN1cmVDb29raWUsIGV4cGlyZXMgfVxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVHlwZVRva2VuU3RvcmFnZS5sb2NhbFN0b3JhZ2U6XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuY29uZmlnLnRva2VuTmFtZSwgdG9rZW4pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVHlwZVRva2VuU3RvcmFnZS5zZXNzaW9uU3RvcmFnZTpcbiAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmNvbmZpZy50b2tlbk5hbWUsIHRva2VuKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgVG9rZW4gU3RvcmFnZSBtZXRob2QnKTtcbiAgICB9XG4gIH1cblxuXG4gIC8qKlxuICAgKiBSZW1vdmUgdGhlIEF1dGhlbnRpY2F0aW9uIHRva2VuIGNvb2tpZVxuICAgKi9cbiAgcHVibGljIHJldm9rZSgpOiB2b2lkIHtcbiAgICBzd2l0Y2ggKHRoaXMuY29uZmlnLnRva2VuU3RvcmFnZSkge1xuICAgICAgY2FzZSBUeXBlVG9rZW5TdG9yYWdlLmNvb2tpZTpcbiAgICAgICAgdGhpcy5jb29raWVzLnJlbW92ZUFsbCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVHlwZVRva2VuU3RvcmFnZS5sb2NhbFN0b3JhZ2U6XG4gICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMuY29uZmlnLnRva2VuTmFtZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBUeXBlVG9rZW5TdG9yYWdlLnNlc3Npb25TdG9yYWdlOlxuICAgICAgICBzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMuY29uZmlnLnRva2VuTmFtZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIFRva2VuIFN0b3JhZ2UgbWV0aG9kJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlcXVlc3QgYW4gQXV0aG9yaXphdGlvbiB0b2tlblxuICAgKiBUaGUgZGVmYXVsdCBhdXRob3JpemF0aW9uIFVSSSBpcyAnW0FQSV9FTkRfUE9JTlRdL2F1dGhvcml6ZSdcbiAgICogQHBhcmFtIHVzZXJuYW1lIFVzZXJuYW1lXG4gICAqIEBwYXJhbSBwYXNzd29yZCBQYXNzd29yZFxuICAgKi9cbiAgcHVibGljIGF1dGhvcml6ZSh1c2VybmFtZTogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5wb3N0KHRoaXMuY29uZmlnLmF1dGhVcmksIHsgdXNlcm5hbWUsIHBhc3N3b3JkIH0pXG4gICAgICAucGlwZShcbiAgICAgICAgdGFwKHBheWxvYWQgPT4ge1xuICAgICAgICAgIHRoaXMudG9rZW4gPSBwYXlsb2FkO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgfVxuXG4gIC8qKiBWYWxpZGF0ZSB0aGUgQXV0aGVudGljYXRpb24gdG9rZW4gYWdhaW5zdCB0aGUgQVBJICovXG4gIHB1YmxpYyB2YWxpZGF0ZVRva2VuKHVybDogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5zZWN1cmVkKCkucmVxdWVzdChIdHRwTWV0aG9kLlBvc3QsIHVybCk7XG4gIH1cblxuICAvKiogUmVtb3ZlcyBhdXRob3JpemF0aW9uIHRva2VuICovXG4gIHB1YmxpYyBkZWF1dGhvcml6ZSh1cmw6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMuc2VjdXJlZCgpLnJlcXVlc3QoSHR0cE1ldGhvZC5HZXQsIHVybClcbiAgICAgIC5waXBlKFxuICAgICAgICB0YXAoKCkgPT4ge1xuICAgICAgICAgIHRoaXMucmV2b2tlKCk7XG4gICAgICAgIH0pXG4gICAgICApO1xuICB9XG5cbiAgLyoqIENoZWNrIGlmIHRoZSBjbGllbnQgaXMgYWxyZWFkeSBBdXRoZW50aWNhdGUgICovXG4gIHB1YmxpYyBpc0F1dGhvcml6ZWQoKTogYm9vbGVhbiB7XG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLnRva2VuO1xuICAgIGNvbnN0IGRlY29kZWQgPSBKd3RIZWxwZXIuZGVjb2RlVG9rZW4odG9rZW4pO1xuICAgIHJldHVybiBkZWNvZGVkICE9PSBudWxsICYmICFpc0FmdGVyKG5ldyBEYXRlKCksIGZyb21Vbml4VGltZShkZWNvZGVkLmV4cCkpO1xuICB9XG5cbiAgLyoqIENhbmNlbCBhbGwgcGVuZGluZyByZXF1ZXN0cyAqL1xuICBwdWJsaWMgY2FuY2VsUGVuZGluZ1JlcXVlc3RzKCk6IHZvaWQge1xuICAgIHRoaXMuY2FuY2VsUGVuZGluZyQubmV4dCh0cnVlKTtcbiAgfVxuXG5cbiAgcHVibGljIGNhY2hlZChpbnZhbGlkYXRlID0gZmFsc2UpIHtcbiAgICB0aGlzLmNhY2hlZFJlcXVlc3QgPSB0cnVlO1xuICAgIHRoaXMuaW52YWxpZGF0ZUNhY2hlID0gaW52YWxpZGF0ZTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cblxuICAvKipcbiAgICogU2V0IHRoZSByZXF1ZXN0IG1vZGUgdG8gU0VDVVJFRCBmb3IgdGhlIG5leHQgcmVxdWVzdC5cbiAgICpcbiAgICogU2VjdXJlZCBNb2RlIGZvcmNlIHRoZSBuZXh0IHJlcXVlc3QgdG8gaW5jbHVkZSB0aGUgYXV0aGVudGljYXRpb24gdG9rZW4uXG4gICAqIFRoZSB0b2tlbiBtdXN0IGJlIHJlcXVlc3RlZCBwcmV2aW91c2x5IHVzaW5nIHRoZSBcImF1dGhvcml6ZVwiIG1ldGhvZC5cbiAgICovXG4gIHB1YmxpYyBzZWN1cmVkKCk6IFJlc3RDbGllbnRTZXJ2aWNlIHtcbiAgICB0aGlzLnNlY3VyZVJlcXVlc3QgPSB0cnVlO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSByZXF1ZXN0IG1vZGUgdG8gUFVCTElDIGZvciB0aGUgbmV4dCByZXF1ZXN0LlxuICAgKlxuICAgKiBQdWJsaWMgaXMgdGhlIGRlZmF1bHQgcmVxdWVzdCBtb2RlIGFuZCBlbnN1cmUgdGhhdCBubyBhdXRoZW50aWNhdGlvbiB0b2tlblxuICAgKiB3aWxsIGJlIHBhc3Mgb24gdGhlIG5leHQgcmVxdWVzdC5cbiAgICovXG4gIHB1YmxpYyBwdWJsaWMoKTogUmVzdENsaWVudFNlcnZpY2Uge1xuICAgIHRoaXMuc2VjdXJlUmVxdWVzdCA9IGZhbHNlO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQVBJIHJlcXVlc3QgdXNpbmcgR0VUIG1ldGhvZFxuICAgKlxuICAgKiBAcGFyYW0gdXJsXG4gICAqIEBwYXJhbSBkYXRhIEEgbGlzdCBvZiBwYXJhbWV0ZXNcbiAgICovXG4gIHB1YmxpYyBnZXQodXJsOiBzdHJpbmcsIGRhdGE/OiB7fSk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChIdHRwTWV0aG9kLkdldCwgdXJsLCBkYXRhKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBUEkgcmVxdWVzdCB1c2luZyBQT1NUIG1ldGhvZFxuICAgKlxuICAgKiBAcGFyYW0gdXJsXG4gICAqIEBwYXJhbSBkYXRhXG4gICAqIEBwYXJhbSByZXNwb25zZVR5cGVcbiAgICogQHBhcmFtIGh0dHBPcHRpb25zXG4gICAqL1xuICBwdWJsaWMgcG9zdCh1cmw6IHN0cmluZywgZGF0YT86IHt9LCByZXNwb25zZVR5cGU/OiBzdHJpbmcsIGh0dHBPcHRpb25zOiBJSHR0cE9wdGlvbnMgPSB7fSk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChIdHRwTWV0aG9kLlBvc3QsIHVybCwgZGF0YSwgcmVzcG9uc2VUeXBlLCBodHRwT3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQVBJIHJlcXVlc3QgdXNpbmcgUFVUIG1ldGhvZFxuICAgKlxuICAgKiBAcGFyYW0gdXJsXG4gICAqIEBwYXJhbSBkYXRhXG4gICAqIEBwYXJhbSByZXNwb25zZVR5cGVcbiAgICogQHBhcmFtIGh0dHBPcHRpb25zXG4gICAqL1xuICBwdWJsaWMgcHV0KHVybDogc3RyaW5nLCBkYXRhPzoge30sIHJlc3BvbnNlVHlwZT86IHN0cmluZywgaHR0cE9wdGlvbnM6IElIdHRwT3B0aW9ucyA9IHt9KTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KEh0dHBNZXRob2QuUHV0LCB1cmwsIGRhdGEsIHJlc3BvbnNlVHlwZSwgaHR0cE9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFQSSByZXF1ZXN0IHVzaW5nIERFTEVURSBtZXRob2RcbiAgICpcbiAgICogQHBhcmFtIHVybFxuICAgKiBAcGFyYW0gZGF0YVxuICAgKiBAcGFyYW0gcmVzcG9uc2VUeXBlXG4gICAqL1xuICBwdWJsaWMgZGVsZXRlKHVybDogc3RyaW5nLCBkYXRhPzoge30sIHJlc3BvbnNlVHlwZT86IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChIdHRwTWV0aG9kLkRlbGV0ZSwgdXJsLCBkYXRhLCByZXNwb25zZVR5cGUpO1xuICB9XG5cbiAgLyoqIFNldCB0aGUgdXBsb2FkIGZpbGUgbW9kZSAqL1xuICBwdWJsaWMgd2l0aEZpbGVzKCk6IFJlc3RDbGllbnRTZXJ2aWNlIHtcbiAgICB0aGlzLndpdGhGaWxlc1JlcXVlc3QgPSB0cnVlO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgRm9ybURhdGEgb2JqZWN0IHRvIGJlIHNlbmQgYXMgcmVxdWVzdCBwYXlsb2FkIGRhdGFcbiAgICovXG4gIHByb3RlY3RlZCBjcmVhdGVGb3JtRGF0YShvYmplY3Q6IGFueSwgZm9ybT86IEZvcm1EYXRhLCBuYW1lc3BhY2U/OiBzdHJpbmcpOiBGb3JtRGF0YSB7XG4gICAgY29uc3QgZm9ybURhdGEgPSBmb3JtIHx8IG5ldyBGb3JtRGF0YSgpO1xuXG4gICAgZm9yIChjb25zdCBwcm9wZXJ0eSBpbiBvYmplY3QpIHtcblxuICAgICAgaWYgKCFvYmplY3QuaGFzT3duUHJvcGVydHkocHJvcGVydHkpIHx8ICFvYmplY3RbcHJvcGVydHldKSB7IGNvbnRpbnVlOyB9XG5cbiAgICAgIGNvbnN0IGZvcm1LZXkgPSBuYW1lc3BhY2UgPyBgJHtuYW1lc3BhY2V9WyR7cHJvcGVydHl9XWAgOiBwcm9wZXJ0eTtcbiAgICAgIGlmIChvYmplY3RbcHJvcGVydHldIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICBmb3JtRGF0YS5hcHBlbmQoZm9ybUtleSwgb2JqZWN0W3Byb3BlcnR5XS50b0lTT1N0cmluZygpKTtcbiAgICAgIH0gZWxzZSBpZiAob2JqZWN0W3Byb3BlcnR5XSBpbnN0YW5jZW9mIEZpbGVMaXN0KSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb2JqZWN0W3Byb3BlcnR5XS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChgJHtwcm9wZXJ0eX1bXWAsIG9iamVjdFtwcm9wZXJ0eV0uaXRlbShpKSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIHR5cGVvZiBvYmplY3RbcHJvcGVydHldID09PSAnb2JqZWN0JyAmJiAhKG9iamVjdFtwcm9wZXJ0eV0gaW5zdGFuY2VvZiBGaWxlKSkge1xuICAgICAgICB0aGlzLmNyZWF0ZUZvcm1EYXRhKG9iamVjdFtwcm9wZXJ0eV0sIGZvcm1EYXRhLCBmb3JtS2V5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZChmb3JtS2V5LCBvYmplY3RbcHJvcGVydHldKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZvcm1EYXRhO1xuICB9XG5cblxuXG4gIHByb3RlY3RlZCBidWlsZFVybCh1cmw6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgZW5kUG9pbnQgPSB0aGlzLmNvbmZpZy5tb2NrRGF0YSA/ICdhc3NldHMvbW9jay1kYXRhJyA6IHRoaXMuY29uZmlnLmVuZFBvaW50LnJlcGxhY2UoL1xcLyQvLCAnJyk7XG5cbiAgICBsZXQgblVybCA9IGAke2VuZFBvaW50fS8ke3VybC5yZXBsYWNlKC9eXFwvL2csICcnKX1gO1xuICAgIGNvbnN0IG1hdGNoID0gblVybC5tYXRjaCgvXFwuKFswLTlhLXpdKykoPzpbXFw/I118JCkvaSk7XG5cbiAgICBpZiAodGhpcy5jb25maWcubW9ja0RhdGEgJiYgbWF0Y2ggPT0gbnVsbCkge1xuICAgICAgblVybCA9IGAke25Vcmx9Lmpzb25gO1xuICAgIH1cblxuICAgIHJldHVybiBuVXJsO1xuICB9XG5cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSByZXF1ZXN0IGhlYWRlcnMgYmFzZWQgb24gY29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzXG4gICAqL1xuICBwcml2YXRlIGJ1aWxkSGVhZGVycygpIHtcbiAgICBjb25zdCBoZWFkZXIgPSB7IC4uLnRoaXMuYmFzZUhlYWRlciB9O1xuXG4gICAgaWYgKHRoaXMuY29uZmlnLmxhbmd1YWdlKSB7IGhlYWRlclsnQWNjZXB0LUxhbmd1YWdlJ10gPSB0aGlzLmNvbmZpZy5sYW5ndWFnZTsgfVxuXG4gICAgaWYgKHRoaXMuc2VjdXJlUmVxdWVzdCkge1xuICAgICAgY29uc3QgdG9rZW4gPSB0aGlzLnRva2VuO1xuICAgICAgaWYgKCF0b2tlbikge1xuICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgJ0V4ZWN1dGluZyBhIHNlY3VyZSByZXF1ZXN0IHdpdGhvdXQgVE9LRU4uICdcbiAgICAgICAgICArICdBdXRob3JpemF0aW9uIGhlYWRlciB3aWxsIG5vdCBiZSBzZXQhJ1xuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaGVhZGVyLkF1dGhvcml6YXRpb24gPSBgQmVhcmVyICR7dG9rZW59YDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZWN1cmVSZXF1ZXN0ID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIGhlYWRlcjtcbiAgfVxuXG5cblxuICAvKiogUmF3IHJlcXVlc3QgbWV0aG9kICovXG4gIHByb3RlY3RlZCByZXF1ZXN0KFxuICAgIG1ldGhvZDogSHR0cE1ldGhvZCwgdXJsOiBzdHJpbmcsIGRhdGE/OiBhbnksIHJlc3BvbnNlVHlwZT86IHN0cmluZyxcbiAgICBodHRwT3B0aW9uczogSUh0dHBPcHRpb25zID0ge31cbiAgKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICBjb25zdCBtc0RlbGF5ID0gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDIwMDApICsgMTAwMCk7XG4gICAgY29uc3QgaGVhZGVyID0gdGhpcy5idWlsZEhlYWRlcnMoKTtcblxuICAgIGNvbnN0IHJUeXBlID0gKHJlc3BvbnNlVHlwZSA/IHJlc3BvbnNlVHlwZSA6ICdqc29uJykgYXMgJ3RleHQnO1xuXG4gICAgaWYgKHRoaXMud2l0aEZpbGVzUmVxdWVzdCkgeyBkYXRhID0gdGhpcy5jcmVhdGVGb3JtRGF0YShkYXRhKTsgdGhpcy53aXRoRmlsZXNSZXF1ZXN0ID0gZmFsc2U7IH1cblxuICAgIGxldCBjYWNoZUtleSA9ICcnO1xuICAgIGlmICh0aGlzLmNhY2hlZFJlcXVlc3QpIHtcbiAgICAgIGNhY2hlS2V5ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQobWV0aG9kICsgJ18nICsgdXJsICsgJ18nICsgKG1ldGhvZCA9PT0gSHR0cE1ldGhvZC5HZXQgPyBKU09OLnN0cmluZ2lmeShkYXRhKSA6ICcnKSkpKTtcbiAgICAgIGlmICghdGhpcy5pbnZhbGlkYXRlQ2FjaGUpIHtcbiAgICAgICAgY29uc3QgY2FjaGVkID0gdGhpcy5jYWNoZS5nZXQoY2FjaGVLZXkpO1xuICAgICAgICBpZiAoY2FjaGVkKSB7XG4gICAgICAgICAgdGhpcy5jYWNoZWRSZXF1ZXN0ID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIG9mKGNhY2hlZCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY2FjaGUuaW52YWxpZGF0ZShjYWNoZUtleSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgIGJvZHk6IG1ldGhvZCA9PT0gSHR0cE1ldGhvZC5HZXQgPyB7fSA6IGRhdGEsXG4gICAgICByZXNwb25zZVR5cGU6IHJUeXBlLFxuICAgICAgcGFyYW1zOiBtZXRob2QgPT09IEh0dHBNZXRob2QuR2V0ID8gZGF0YSA6IHt9LFxuICAgICAgaGVhZGVyczogaGVhZGVyXG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLmh0dHBcbiAgICAgIC5yZXF1ZXN0KFxuICAgICAgICB0aGlzLmNvbmZpZy5tb2NrRGF0YSA/IEh0dHBNZXRob2QuR2V0IDogbWV0aG9kLCB0aGlzLmJ1aWxkVXJsKHVybCksXG4gICAgICAgIHsgLi4ub3B0aW9ucywgLi4uaHR0cE9wdGlvbnMgfVxuICAgICAgKVxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuY2FuY2VsUGVuZGluZyQpKVxuICAgICAgLnBpcGUoZGVsYXkodGhpcy5jb25maWcubW9ja0RhdGEgPyBtc0RlbGF5IDogMCkpXG4gICAgICAucGlwZSh0YXAocmVzcCA9PiB7XG4gICAgICAgIGlmICh0aGlzLmNhY2hlZFJlcXVlc3QpIHtcbiAgICAgICAgICB0aGlzLmNhY2hlZFJlcXVlc3QgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLmNhY2hlLnNldChjYWNoZUtleSwgcmVzcCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgICkpXG4gICAgICAucGlwZShjYXRjaEVycm9yKChlcnIpID0+IHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHRoaXMuY29uZmlnLlVuYXV0aG9yaXplZFJlZGlyZWN0VXJpXG4gICAgICAgICAgJiYgdXJsICE9PSB0aGlzLmNvbmZpZy5hdXRoVXJpXG4gICAgICAgICAgJiYgZXJyLnN0YXR1cyA9PT0gNDAxXG4gICAgICAgICkge1xuICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFt0aGlzLmNvbmZpZy5VbmF1dGhvcml6ZWRSZWRpcmVjdFVyaV0pLnRoZW4oKCkgPT4geyB9KTtcbiAgICAgICAgICB0aGlzLmNhbmNlbFBlbmRpbmdSZXF1ZXN0cygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aHJvd0Vycm9yKGVycik7XG4gICAgICB9KSk7XG4gIH1cbn1cbiJdfQ==