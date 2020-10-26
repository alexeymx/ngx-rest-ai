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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXJlc3Quc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1yZXN0LyIsInNvdXJjZXMiOlsibGliL25neC1yZXN0LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBSXJELE9BQU8sRUFBYyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3ZELE9BQU8sRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNuRSxPQUFPLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUdqRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDaEQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQy9DLE9BQU8sRUFBcUIsZ0JBQWdCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQzs7Ozs7O0FBRXhFO0lBeUJFLDJCQUNVLElBQWdCLEVBQ2hCLE9BQXNCLEVBQ2IsTUFBYyxFQUNuQixNQUF5QjtRQUg3QixTQUFJLEdBQUosSUFBSSxDQUFZO1FBQ2hCLFlBQU8sR0FBUCxPQUFPLENBQWU7UUFDYixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBeEJqQyxnREFBZ0Q7UUFDdEMsbUJBQWMsR0FBcUIsSUFBSSxPQUFPLEVBQVcsQ0FBQztRQUVwRSwrQkFBK0I7UUFDckIsZUFBVSxHQUFHO1lBQ3JCLGVBQWUsRUFBRSxVQUFVO1lBQzNCLE1BQU0sRUFBRSxrQkFBa0I7WUFDMUIsTUFBTSxFQUFFLFVBQVU7WUFDbEIsYUFBYSxFQUFFLEVBQUU7WUFDakIsaUJBQWlCLEVBQUUsR0FBRztTQUN2QixDQUFDO1FBS0YsMEVBQTBFO1FBQ2hFLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBRWhDLG9EQUFvRDtRQUMxQyxxQkFBZ0IsR0FB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QVEsQ0FBQyxDQUFDLENBQUM7Z0JBQzVFLEtBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO2FBQzlCO1lBQ0QsT0FBTyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDekIsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNSLENBQUM7eUdBOVlVLGlCQUFpQjtnRkFBakIsaUJBQWlCLFdBQWpCLGlCQUFpQixtQkFGaEIsTUFBTTs0QkFkcEI7Q0ErWkMsQUFsWkQsSUFrWkM7U0EvWVksaUJBQWlCO2tEQUFqQixpQkFBaUI7Y0FIN0IsVUFBVTtlQUFDO2dCQUNWLFVBQVUsRUFBRSxNQUFNO2FBQ25COztzQkEyQkksUUFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IENvb2tpZVNlcnZpY2UgfSBmcm9tICduZ3gtY29va2llJztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QsIHRocm93RXJyb3IgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHRha2VVbnRpbCwgdGFwLCBjYXRjaEVycm9yLCBkZWxheSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IGlzQWZ0ZXIsIGZyb21Vbml4VGltZSB9IGZyb20gJ2RhdGUtZm5zJztcblxuaW1wb3J0IHsgSUh0dHBPcHRpb25zIH0gZnJvbSAnLi9odHRwLW9wdGlvbnMuaW50ZXJmYWNlJztcbmltcG9ydCB7IEh0dHBNZXRob2QgfSBmcm9tICcuL2h0dHAtbWV0aG9kLmVudW0nO1xuaW1wb3J0IHsgSnd0SGVscGVyIH0gZnJvbSAnLi9qd3QtaGVscGVyLmNsYXNzJztcbmltcG9ydCB7IFJlc3RTZXJ2aWNlQ29uZmlnLCBUeXBlVG9rZW5TdG9yYWdlIH0gZnJvbSAnLi9uZ3gtcmVzdC5jb25maWcnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBSZXN0Q2xpZW50U2VydmljZSB7XG4gIC8qKiBIYW5kbGVyIHVzZWQgdG8gc3RvcCBhbGwgcGVuZGluZyByZXF1ZXN0cyAqL1xuICBwcm90ZWN0ZWQgY2FuY2VsUGVuZGluZyQ6IFN1YmplY3Q8Ym9vbGVhbj4gPSBuZXcgU3ViamVjdDxib29sZWFuPigpO1xuXG4gIC8qKiAgRGVmYXVsdCByZXF1ZXN0cyBoZWFkZXIgKi9cbiAgcHJvdGVjdGVkIGJhc2VIZWFkZXIgPSB7XG4gICAgJ0NhY2hlLUNvbnRyb2wnOiAnbm8tY2FjaGUnLFxuICAgIGFjY2VwdDogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgIFByYWdtYTogJ25vLWNhY2hlJyxcbiAgICBBdXRob3JpemF0aW9uOiAnJyxcbiAgICAnQWNjZXB0LUxhbmd1YWdlJzogJyonXG4gIH07XG5cbiAgLyoqIFNlcnZpY2UgY29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzICovXG4gIHByb3RlY3RlZCBjb25maWc6IFJlc3RTZXJ2aWNlQ29uZmlnO1xuXG4gIC8qKiBXaGVuIHRydWUsIHRoZSByZXF1ZXN0IGhlYWRlciB3aWxsIGluY2x1ZGUgdGhlIGF1dGhlbnRpY2F0aW9uIHRva2VuICovXG4gIHByb3RlY3RlZCBzZWN1cmVSZXF1ZXN0ID0gZmFsc2U7XG5cbiAgLyoqIEhvbGRzIGEgbGlzdCBvZiBmaWxlcyB0byBiZSB1cGxvYWQgb24gcmVxdWVzdCAqL1xuICBwcm90ZWN0ZWQgd2l0aEZpbGVzUmVxdWVzdCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCxcbiAgICBwcml2YXRlIGNvb2tpZXM6IENvb2tpZVNlcnZpY2UsXG4gICAgcHJpdmF0ZSByZWFkb25seSByb3V0ZXI6IFJvdXRlcixcbiAgICBAT3B0aW9uYWwoKSBjb25maWc6IFJlc3RTZXJ2aWNlQ29uZmlnXG4gICkge1xuICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgZW5kUG9pbnQ6ICcnLFxuICAgICAgdG9rZW5OYW1lOiAnQXV0aFRva2VuJyxcbiAgICAgIHRva2VuU3RvcmFnZTogVHlwZVRva2VuU3RvcmFnZS5jb29raWUsXG4gICAgICBzZWN1cmVDb29raWU6IGZhbHNlLFxuICAgICAgbW9ja0RhdGE6IGZhbHNlLFxuICAgICAgdmFsaWRhdGlvblRva2VuVXJpOiAnL2luZm8nLFxuICAgICAgYXV0aFVyaTogJy9hdXRoZW50aWNhdGUnLFxuICAgICAgVW5hdXRob3JpemVkUmVkaXJlY3RVcmk6IG51bGxcbiAgICB9IGFzIFJlc3RTZXJ2aWNlQ29uZmlnO1xuXG4gICAgaWYgKGNvbmZpZykge1xuICAgICAgdGhpcy5zZXRDb25maWcoY29uZmlnKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBSZXN0IENsaWVudCBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnMuXG4gICAqXG4gICAqIENBVVRJT046IFRoaXMgbWV0aG9kIG92ZXJyaWRlcyB0aGUgY3VycmVudCBjb25maWd1cmF0aW9uIHNldHRpbmdzXG4gICAqIGFuZCB0aGlzIHNldHRpbmdzIHdpbGwgYXBwbHkgdG8gYWxsIGZvbGxvd2luZyByZXF1ZXN0c1xuICAgKi9cbiAgcHVibGljIHNldENvbmZpZyhjb25maWc6IFJlc3RTZXJ2aWNlQ29uZmlnKTogUmVzdENsaWVudFNlcnZpY2Uge1xuICAgIHRoaXMuY29uZmlnID0geyAuLi50aGlzLmNvbmZpZywgLi4uY29uZmlnIH0gYXMgUmVzdFNlcnZpY2VDb25maWc7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKiogUmV0dXJuIHRoZSBjdXJyZW50IFJlc3QgQ2xpZW50IGNvbmZpZ3VyYXRpb24gcGFyYW1ldGVycy4gICovXG4gIHB1YmxpYyBnZXRDb25maWcoKTogUmVzdFNlcnZpY2VDb25maWcge1xuICAgIHJldHVybiB0aGlzLmNvbmZpZztcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIEFQSSBUb2tlbiBmcm9tIGNvb2tpZXNcbiAgICovXG4gIHB1YmxpYyBnZXQgdG9rZW4oKTogc3RyaW5nIHtcbiAgICBsZXQgdG9rZW4gPSAnJztcblxuICAgIHN3aXRjaCAodGhpcy5jb25maWcudG9rZW5TdG9yYWdlKSB7XG4gICAgICBjYXNlIFR5cGVUb2tlblN0b3JhZ2UuY29va2llOlxuICAgICAgICB0b2tlbiA9IHRoaXMuY29va2llcy5nZXQodGhpcy5jb25maWcudG9rZW5OYW1lKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFR5cGVUb2tlblN0b3JhZ2UubG9jYWxTdG9yYWdlOlxuICAgICAgICB0b2tlbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMuY29uZmlnLnRva2VuTmFtZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBUeXBlVG9rZW5TdG9yYWdlLnNlc3Npb25TdG9yYWdlOlxuICAgICAgICB0b2tlbiA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0odGhpcy5jb25maWcudG9rZW5OYW1lKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgVG9rZW4gU3RvcmFnZSBtZXRob2QnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gIXRva2VuIHx8IHR5cGVvZiB0b2tlbiA9PT0gJ3VuZGVmaW5lZCcgPyAnJyA6IHRva2VuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNhdmUgdGhlIEFQSSBUb2tlbiBjb29raWVcbiAgICovXG4gIHB1YmxpYyBzZXQgdG9rZW4odG9rZW46IHN0cmluZykge1xuICAgIGNvbnN0IGRlY29kZWQgPSBKd3RIZWxwZXIuZGVjb2RlVG9rZW4odG9rZW4pO1xuICAgIGNvbnN0IGV4cGlyZXMgPSBmcm9tVW5peFRpbWUoZGVjb2RlZC5leHApO1xuXG4gICAgc3dpdGNoICh0aGlzLmNvbmZpZy50b2tlblN0b3JhZ2UpIHtcbiAgICAgIGNhc2UgVHlwZVRva2VuU3RvcmFnZS5jb29raWU6XG4gICAgICAgIHRoaXMuY29va2llcy5wdXQoXG4gICAgICAgICAgdGhpcy5jb25maWcudG9rZW5OYW1lLFxuICAgICAgICAgIHRva2VuLFxuICAgICAgICAgIHsgc2VjdXJlOiB0aGlzLmNvbmZpZy5zZWN1cmVDb29raWUsIGV4cGlyZXMgfVxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVHlwZVRva2VuU3RvcmFnZS5sb2NhbFN0b3JhZ2U6XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuY29uZmlnLnRva2VuTmFtZSwgdG9rZW4pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVHlwZVRva2VuU3RvcmFnZS5zZXNzaW9uU3RvcmFnZTpcbiAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmNvbmZpZy50b2tlbk5hbWUsIHRva2VuKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgVG9rZW4gU3RvcmFnZSBtZXRob2QnKTtcbiAgICB9XG4gIH1cblxuXG4gIC8qKlxuICAgKiBSZW1vdmUgdGhlIEF1dGhlbnRpY2F0aW9uIHRva2VuIGNvb2tpZVxuICAgKi9cbiAgcHVibGljIHJldm9rZSgpOiB2b2lkIHtcbiAgICBzd2l0Y2ggKHRoaXMuY29uZmlnLnRva2VuU3RvcmFnZSkge1xuICAgICAgY2FzZSBUeXBlVG9rZW5TdG9yYWdlLmNvb2tpZTpcbiAgICAgICAgdGhpcy5jb29raWVzLnJlbW92ZUFsbCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVHlwZVRva2VuU3RvcmFnZS5sb2NhbFN0b3JhZ2U6XG4gICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMuY29uZmlnLnRva2VuTmFtZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBUeXBlVG9rZW5TdG9yYWdlLnNlc3Npb25TdG9yYWdlOlxuICAgICAgICBzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMuY29uZmlnLnRva2VuTmFtZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIFRva2VuIFN0b3JhZ2UgbWV0aG9kJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlcXVlc3QgYW4gQXV0aG9yaXphdGlvbiB0b2tlblxuICAgKiBUaGUgZGVmYXVsdCBhdXRob3JpemF0aW9uIFVSSSBpcyAnW0FQSV9FTkRfUE9JTlRdL2F1dGhvcml6ZSdcbiAgICogQHBhcmFtIHVzZXJuYW1lIFVzZXJuYW1lXG4gICAqIEBwYXJhbSBwYXNzd29yZCBQYXNzd29yZFxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYGF1dGhlbnRpY2F0ZWAgbWV0aG9kIGluc3RlYWRcbiAgICovXG4gIHB1YmxpYyBhdXRob3JpemUodXNlcm5hbWU6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMuYXV0aGVudGljYXRlKHVzZXJuYW1lLCBwYXNzd29yZCk7XG4gIH1cblxuICAvKipcbiAgICogUmVxdWVzdCBhbiBhdXRoZW50aWNhdGlvbiB0b2tlblxuICAgKiBUaGUgZGVmYXVsdCBhdXRoZW50aWNhdGlvbiBVUkkgaXMgJ1tBUElfRU5EX1BPSU5UXS9hdXRoZW50aWNhdGUnXG4gICAqIEBwYXJhbSB1c2VybmFtZSBVc2VybmFtZVxuICAgKiBAcGFyYW0gcGFzc3dvcmQgUGFzc3dvcmRcbiAgICovXG4gIHB1YmxpYyBhdXRoZW50aWNhdGUodXNlcm5hbWU6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMucG9zdCh0aGlzLmNvbmZpZy5hdXRoVXJpLCB7IHVzZXJuYW1lLCBwYXNzd29yZCB9KVxuICAgICAgLnBpcGUoXG4gICAgICAgIHRhcChwYXlsb2FkID0+IHtcbiAgICAgICAgICB0aGlzLnRva2VuID0gcGF5bG9hZDtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gIH1cblxuICAvKiogVmFsaWRhdGUgdGhlIEF1dGhlbnRpY2F0aW9uIHRva2VuIGFnYWluc3QgdGhlIEFQSSAqL1xuICBwdWJsaWMgdmFsaWRhdGVUb2tlbih1cmw6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMuc2VjdXJlZCgpLnJlcXVlc3QoSHR0cE1ldGhvZC5Qb3N0LCB1cmwpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYXV0aG9yaXphdGlvbiB0b2tlblxuICAgKiBAcGFyYW0gdXJsIGEgdXJsIHRvIHJlcG9ydCB0b1xuICAgKiBAZGVwcmVjYXRlZCB1c2UgYGRlYXV0aGVudGljYXRlYCBtZXRob2QgaW5zdGVhZFxuICAgKi9cbiAgcHVibGljIGRlYXV0aG9yaXplKHVybDogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5kZWF1dGhlbnRpY2F0ZSh1cmwpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYXV0aG9yaXphdGlvbiB0b2tlbiBhbmQgcmVwb3J0cyBsb2dvdXQgdG8gdGhlIHNlcnZlclxuICAgKiBAcGFyYW0gdXJsIGEgdXJsIHRvIHJlcG9ydCB0b1xuICAgKi9cbiAgcHVibGljIGRlYXV0aGVudGljYXRlKHVybDogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5zZWN1cmVkKCkucmVxdWVzdChIdHRwTWV0aG9kLkdldCwgdXJsKVxuICAgICAgLnBpcGUoXG4gICAgICAgIHRhcCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5yZXZva2UoKTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGNsaWVudCBpcyBhbHJlYWR5IGF1dGhlbnRpY2F0ZWRcbiAgICogQGRlcHJlY2F0ZWQgdXNlIGBpc0F1dGhlbnRpY2F0ZWRgIG1ldGhvZCBpbnN0ZWFkXG4gICAqL1xuICBwdWJsaWMgaXNBdXRob3JpemVkKCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy50b2tlbjtcbiAgICBjb25zdCBkZWNvZGVkID0gSnd0SGVscGVyLmRlY29kZVRva2VuKHRva2VuKTtcbiAgICByZXR1cm4gZGVjb2RlZCAhPT0gbnVsbCAmJiAhaXNBZnRlcihuZXcgRGF0ZSgpLCBmcm9tVW5peFRpbWUoZGVjb2RlZC5leHApKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgY2xpZW50IGlzIGFscmVhZHkgYXV0aGVudGljYXRlZFxuICAgKi9cbiAgcHVibGljIGlzQXV0aGVudGljYXRlZCgpOiBib29sZWFuIHtcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMudG9rZW47XG4gICAgY29uc3QgZGVjb2RlZCA9IEp3dEhlbHBlci5kZWNvZGVUb2tlbih0b2tlbik7XG4gICAgcmV0dXJuIGRlY29kZWQgIT09IG51bGwgJiYgIWlzQWZ0ZXIobmV3IERhdGUoKSwgZnJvbVVuaXhUaW1lKGRlY29kZWQuZXhwKSk7XG4gIH1cblxuICAvKiogQ2FuY2VsIGFsbCBwZW5kaW5nIHJlcXVlc3RzICovXG4gIHB1YmxpYyBjYW5jZWxQZW5kaW5nUmVxdWVzdHMoKTogdm9pZCB7XG4gICAgdGhpcy5jYW5jZWxQZW5kaW5nJC5uZXh0KHRydWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgcmVxdWVzdCBtb2RlIHRvIFNFQ1VSRUQgZm9yIHRoZSBuZXh0IHJlcXVlc3QuXG4gICAqXG4gICAqIFNlY3VyZWQgTW9kZSBmb3JjZSB0aGUgbmV4dCByZXF1ZXN0IHRvIGluY2x1ZGUgdGhlIGF1dGhlbnRpY2F0aW9uIHRva2VuLlxuICAgKiBUaGUgdG9rZW4gbXVzdCBiZSByZXF1ZXN0ZWQgcHJldmlvdXNseSB1c2luZyB0aGUgXCJhdXRob3JpemVcIiBtZXRob2QuXG4gICAqL1xuICBwdWJsaWMgc2VjdXJlZCgpOiBSZXN0Q2xpZW50U2VydmljZSB7XG4gICAgdGhpcy5zZWN1cmVSZXF1ZXN0ID0gdHJ1ZTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgcmVxdWVzdCBtb2RlIHRvIFBVQkxJQyBmb3IgdGhlIG5leHQgcmVxdWVzdC5cbiAgICpcbiAgICogUHVibGljIGlzIHRoZSBkZWZhdWx0IHJlcXVlc3QgbW9kZSBhbmQgZW5zdXJlIHRoYXQgbm8gYXV0aGVudGljYXRpb24gdG9rZW5cbiAgICogd2lsbCBiZSBwYXNzIG9uIHRoZSBuZXh0IHJlcXVlc3QuXG4gICAqL1xuICBwdWJsaWMgcHVibGljKCk6IFJlc3RDbGllbnRTZXJ2aWNlIHtcbiAgICB0aGlzLnNlY3VyZVJlcXVlc3QgPSBmYWxzZTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEFQSSByZXF1ZXN0IHVzaW5nIEdFVCBtZXRob2RcbiAgICpcbiAgICogQHBhcmFtIHVybFxuICAgKiBAcGFyYW0gZGF0YSBBIGxpc3Qgb2YgcGFyYW1ldGVzXG4gICAqL1xuICBwdWJsaWMgZ2V0KHVybDogc3RyaW5nLCBkYXRhPzoge30pOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QoSHR0cE1ldGhvZC5HZXQsIHVybCwgZGF0YSk7XG4gIH1cblxuICAvKipcbiAgICogQVBJIHJlcXVlc3QgdXNpbmcgUE9TVCBtZXRob2RcbiAgICpcbiAgICogQHBhcmFtIHVybFxuICAgKiBAcGFyYW0gZGF0YVxuICAgKiBAcGFyYW0gcmVzcG9uc2VUeXBlXG4gICAqIEBwYXJhbSBodHRwT3B0aW9uc1xuICAgKi9cbiAgcHVibGljIHBvc3QodXJsOiBzdHJpbmcsIGRhdGE/OiB7fSwgcmVzcG9uc2VUeXBlPzogc3RyaW5nLCBodHRwT3B0aW9uczogSUh0dHBPcHRpb25zID0ge30pOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QoSHR0cE1ldGhvZC5Qb3N0LCB1cmwsIGRhdGEsIHJlc3BvbnNlVHlwZSwgaHR0cE9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFQSSByZXF1ZXN0IHVzaW5nIFBVVCBtZXRob2RcbiAgICpcbiAgICogQHBhcmFtIHVybFxuICAgKiBAcGFyYW0gZGF0YVxuICAgKiBAcGFyYW0gcmVzcG9uc2VUeXBlXG4gICAqIEBwYXJhbSBodHRwT3B0aW9uc1xuICAgKi9cbiAgcHVibGljIHB1dCh1cmw6IHN0cmluZywgZGF0YT86IHt9LCByZXNwb25zZVR5cGU/OiBzdHJpbmcsIGh0dHBPcHRpb25zOiBJSHR0cE9wdGlvbnMgPSB7fSk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChIdHRwTWV0aG9kLlB1dCwgdXJsLCBkYXRhLCByZXNwb25zZVR5cGUsIGh0dHBPcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBUEkgcmVxdWVzdCB1c2luZyBERUxFVEUgbWV0aG9kXG4gICAqXG4gICAqIEBwYXJhbSB1cmxcbiAgICogQHBhcmFtIGRhdGFcbiAgICogQHBhcmFtIHJlc3BvbnNlVHlwZVxuICAgKi9cbiAgcHVibGljIGRlbGV0ZSh1cmw6IHN0cmluZywgZGF0YT86IHt9LCByZXNwb25zZVR5cGU/OiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QoSHR0cE1ldGhvZC5EZWxldGUsIHVybCwgZGF0YSwgcmVzcG9uc2VUeXBlKTtcbiAgfVxuXG4gIC8qKiBTZXQgdGhlIHVwbG9hZCBmaWxlIG1vZGUgKi9cbiAgcHVibGljIHdpdGhGaWxlcygpOiBSZXN0Q2xpZW50U2VydmljZSB7XG4gICAgdGhpcy53aXRoRmlsZXNSZXF1ZXN0ID0gdHJ1ZTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIEZvcm1EYXRhIG9iamVjdCB0byBiZSBzZW5kIGFzIHJlcXVlc3QgcGF5bG9hZCBkYXRhXG4gICAqL1xuICBwcm90ZWN0ZWQgY3JlYXRlRm9ybURhdGEob2JqZWN0OiBhbnksIGZvcm0/OiBGb3JtRGF0YSwgbmFtZXNwYWNlPzogc3RyaW5nKTogRm9ybURhdGEge1xuICAgIGNvbnN0IGZvcm1EYXRhID0gZm9ybSB8fCBuZXcgRm9ybURhdGEoKTtcblxuICAgIGZvciAoY29uc3QgcHJvcGVydHkgaW4gb2JqZWN0KSB7XG5cbiAgICAgIGlmICghb2JqZWN0Lmhhc093blByb3BlcnR5KHByb3BlcnR5KSB8fCAhb2JqZWN0W3Byb3BlcnR5XSkgeyBjb250aW51ZTsgfVxuXG4gICAgICBjb25zdCBmb3JtS2V5ID0gbmFtZXNwYWNlID8gYCR7bmFtZXNwYWNlfVske3Byb3BlcnR5fV1gIDogcHJvcGVydHk7XG4gICAgICBpZiAob2JqZWN0W3Byb3BlcnR5XSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKGZvcm1LZXksIG9iamVjdFtwcm9wZXJ0eV0udG9JU09TdHJpbmcoKSk7XG4gICAgICB9IGVsc2UgaWYgKG9iamVjdFtwcm9wZXJ0eV0gaW5zdGFuY2VvZiBGaWxlTGlzdCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9iamVjdFtwcm9wZXJ0eV0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoYCR7cHJvcGVydHl9W11gLCBvYmplY3RbcHJvcGVydHldLml0ZW0oaSkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICB0eXBlb2Ygb2JqZWN0W3Byb3BlcnR5XSA9PT0gJ29iamVjdCcgJiYgIShvYmplY3RbcHJvcGVydHldIGluc3RhbmNlb2YgRmlsZSkpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVGb3JtRGF0YShvYmplY3RbcHJvcGVydHldLCBmb3JtRGF0YSwgZm9ybUtleSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3JtRGF0YS5hcHBlbmQoZm9ybUtleSwgb2JqZWN0W3Byb3BlcnR5XSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmb3JtRGF0YTtcbiAgfVxuXG5cblxuICBwcm90ZWN0ZWQgYnVpbGRVcmwodXJsOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IGVuZFBvaW50ID0gdGhpcy5jb25maWcubW9ja0RhdGEgPyAnYXNzZXRzL21vY2stZGF0YScgOiB0aGlzLmNvbmZpZy5lbmRQb2ludC5yZXBsYWNlKC9cXC8kLywgJycpO1xuXG4gICAgbGV0IG5VcmwgPSBgJHtlbmRQb2ludH0vJHt1cmwucmVwbGFjZSgvXlxcLy9nLCAnJyl9YDtcbiAgICBjb25zdCBtYXRjaCA9IG5VcmwubWF0Y2goL1xcLihbMC05YS16XSspKD86W1xcPyNdfCQpL2kpO1xuXG4gICAgaWYgKHRoaXMuY29uZmlnLm1vY2tEYXRhICYmIG1hdGNoID09IG51bGwpIHtcbiAgICAgIG5VcmwgPSBgJHtuVXJsfS5qc29uYDtcbiAgICB9XG5cbiAgICByZXR1cm4gblVybDtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgcmVxdWVzdCBoZWFkZXJzIGJhc2VkIG9uIGNvbmZpZ3VyYXRpb24gcGFyYW1ldGVyc1xuICAgKi9cbiAgcHJpdmF0ZSBidWlsZEhlYWRlcnMoKSB7XG4gICAgY29uc3QgaGVhZGVyID0geyAuLi50aGlzLmJhc2VIZWFkZXIgfTtcblxuICAgIGlmICh0aGlzLmNvbmZpZy5sYW5ndWFnZSkgeyBoZWFkZXJbJ0FjY2VwdC1MYW5ndWFnZSddID0gdGhpcy5jb25maWcubGFuZ3VhZ2U7IH1cblxuICAgIGlmICh0aGlzLnNlY3VyZVJlcXVlc3QpIHtcbiAgICAgIGNvbnN0IHRva2VuID0gdGhpcy50b2tlbjtcbiAgICAgIGlmICghdG9rZW4pIHtcbiAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICdFeGVjdXRpbmcgYSBzZWN1cmUgcmVxdWVzdCB3aXRob3V0IFRPS0VOLiAnXG4gICAgICAgICAgKyAnQXV0aG9yaXphdGlvbiBoZWFkZXIgd2lsbCBub3QgYmUgc2V0ISdcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGhlYWRlci5BdXRob3JpemF0aW9uID0gYEJlYXJlciAke3Rva2VufWA7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2VjdXJlUmVxdWVzdCA9IGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiBoZWFkZXI7XG4gIH1cblxuXG5cbiAgLyoqIFJhdyByZXF1ZXN0IG1ldGhvZCAqL1xuICBwcm90ZWN0ZWQgcmVxdWVzdChcbiAgICBtZXRob2Q6IEh0dHBNZXRob2QsIHVybDogc3RyaW5nLCBkYXRhPzogYW55LCByZXNwb25zZVR5cGU/OiBzdHJpbmcsXG4gICAgaHR0cE9wdGlvbnM6IElIdHRwT3B0aW9ucyA9IHt9XG4gICk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgY29uc3QgbXNEZWxheSA9IE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiAyMDAwKSArIDEwMDApO1xuICAgIGNvbnN0IGhlYWRlciA9IHRoaXMuYnVpbGRIZWFkZXJzKCk7XG5cbiAgICBjb25zdCByVHlwZSA9IChyZXNwb25zZVR5cGUgPyByZXNwb25zZVR5cGUgOiAnanNvbicpIGFzICd0ZXh0JztcblxuICAgIGlmICh0aGlzLndpdGhGaWxlc1JlcXVlc3QpIHsgZGF0YSA9IHRoaXMuY3JlYXRlRm9ybURhdGEoZGF0YSk7IHRoaXMud2l0aEZpbGVzUmVxdWVzdCA9IGZhbHNlOyB9XG5cbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgYm9keTogbWV0aG9kID09PSBIdHRwTWV0aG9kLkdldCA/IHt9IDogZGF0YSxcbiAgICAgIHJlc3BvbnNlVHlwZTogclR5cGUsXG4gICAgICBwYXJhbXM6IG1ldGhvZCA9PT0gSHR0cE1ldGhvZC5HZXQgPyBkYXRhIDoge30sXG4gICAgICBoZWFkZXJzOiBoZWFkZXJcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXMuaHR0cFxuICAgICAgLnJlcXVlc3QoXG4gICAgICAgIHRoaXMuY29uZmlnLm1vY2tEYXRhID8gSHR0cE1ldGhvZC5HZXQgOiBtZXRob2QsIHRoaXMuYnVpbGRVcmwodXJsKSxcbiAgICAgICAgeyAuLi5vcHRpb25zLCAuLi5odHRwT3B0aW9ucyB9XG4gICAgICApXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5jYW5jZWxQZW5kaW5nJCkpXG4gICAgICAucGlwZShkZWxheSh0aGlzLmNvbmZpZy5tb2NrRGF0YSA/IG1zRGVsYXkgOiAwKSlcbiAgICAgIC5waXBlKGNhdGNoRXJyb3IoKGVycikgPT4ge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgdGhpcy5jb25maWcuVW5hdXRoZW50aWNhdGVkUmVkaXJlY3RVcmlcbiAgICAgICAgICAmJiB1cmwgIT09IHRoaXMuY29uZmlnLmF1dGhVcmlcbiAgICAgICAgICAmJiBlcnIuc3RhdHVzID09PSA0MDFcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3RoaXMuY29uZmlnLlVuYXV0aGVudGljYXRlZFJlZGlyZWN0VXJpXSkudGhlbigoKSA9PiB7IH0pO1xuICAgICAgICAgIHRoaXMuY2FuY2VsUGVuZGluZ1JlcXVlc3RzKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXG4gICAgICAgICAgdGhpcy5jb25maWcuVW5hdXRob3JpemVkUmVkaXJlY3RVcmlcbiAgICAgICAgICAmJiB1cmwgIT09IHRoaXMuY29uZmlnLmF1dGhVcmlcbiAgICAgICAgICAmJiBlcnIuc3RhdHVzID09PSA0MDNcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW3RoaXMuY29uZmlnLlVuYXV0aG9yaXplZFJlZGlyZWN0VXJpXSkudGhlbigoKSA9PiB7IH0pO1xuICAgICAgICAgIHRoaXMuY2FuY2VsUGVuZGluZ1JlcXVlc3RzKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoZXJyKTtcbiAgICAgIH0pKTtcbiAgfVxufVxuIl19