/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
export class RestClientService {
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
            this.token = payload.token;
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
        let nUrl = `${this.config.endPoint.replace(/\/$/, '')}/${url.replace(/^\//g, '')}`;
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
        (resp) => {
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
/** @nocollapse */ RestClientService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function RestClientService_Factory() { return new RestClientService(i0.ɵɵinject(i1.HttpClient), i0.ɵɵinject(i2.CookieService), i0.ɵɵinject(i3.CacheService), i0.ɵɵinject(i4.Router), i0.ɵɵinject(i5.RestServiceConfig, 8)); }, token: RestClientService, providedIn: "root" });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXJlc3Quc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1yZXN0LyIsInNvdXJjZXMiOlsibGliL25neC1yZXN0LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDbEQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUMzQyxPQUFPLEVBQWMsT0FBTyxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDM0QsT0FBTyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ25FLE9BQU8sRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBR2pELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNoRCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDL0MsT0FBTyxFQUFFLGlCQUFpQixFQUFFLGdCQUFnQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDeEUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDOzs7Ozs7O0FBSy9DLE1BQU0sT0FBTyxpQkFBaUI7Ozs7Ozs7O0lBNEI1QixZQUNVLElBQWdCLEVBQ2hCLE9BQXNCLEVBQ3RCLEtBQW1CLEVBQ1YsTUFBYyxFQUNuQixNQUF5QjtRQUo3QixTQUFJLEdBQUosSUFBSSxDQUFZO1FBQ2hCLFlBQU8sR0FBUCxPQUFPLENBQWU7UUFDdEIsVUFBSyxHQUFMLEtBQUssQ0FBYztRQUNWLFdBQU0sR0FBTixNQUFNLENBQVE7Ozs7UUE5QnZCLG1C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QUM7YUFDOUI7WUFDRCxPQUFPLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN6QixDQUFDLEVBQUMsQ0FBQyxDQUFDO0lBQ1IsQ0FBQzs7O1lBdllGLFVBQVUsU0FBQztnQkFDVixVQUFVLEVBQUUsTUFBTTthQUNuQjs7OztZQWRRLFVBQVU7WUFDVixhQUFhO1lBU2IsWUFBWTtZQVhaLE1BQU07WUFVTixpQkFBaUIsdUJBdUNyQixRQUFROzs7Ozs7Ozs7SUEvQlgsMkNBQW9FOzs7Ozs7SUFHcEUsdUNBTUU7Ozs7OztJQUdGLG1DQUFvQzs7Ozs7O0lBR3BDLDBDQUFnQzs7Ozs7O0lBR2hDLDZDQUFtQzs7Ozs7O0lBR25DLDBDQUFnQzs7Ozs7O0lBR2hDLDRDQUFrQzs7Ozs7SUFHaEMsaUNBQXdCOzs7OztJQUN4QixvQ0FBOEI7Ozs7O0lBQzlCLGtDQUEyQjs7Ozs7SUFDM0IsbUNBQStCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgQ29va2llU2VydmljZSB9IGZyb20gJ25neC1jb29raWUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3ViamVjdCwgdGhyb3dFcnJvciwgb2YgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHRha2VVbnRpbCwgdGFwLCBjYXRjaEVycm9yLCBkZWxheSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IGlzQWZ0ZXIsIGZyb21Vbml4VGltZSB9IGZyb20gJ2RhdGUtZm5zJztcblxuaW1wb3J0IHsgSUh0dHBPcHRpb25zIH0gZnJvbSAnLi9odHRwLW9wdGlvbnMuaW50ZXJmYWNlJztcbmltcG9ydCB7IEh0dHBNZXRob2QgfSBmcm9tICcuL2h0dHAtbWV0aG9kLmVudW0nO1xuaW1wb3J0IHsgSnd0SGVscGVyIH0gZnJvbSAnLi9qd3QtaGVscGVyLmNsYXNzJztcbmltcG9ydCB7IFJlc3RTZXJ2aWNlQ29uZmlnLCBUeXBlVG9rZW5TdG9yYWdlIH0gZnJvbSAnLi9uZ3gtcmVzdC5jb25maWcnO1xuaW1wb3J0IHsgQ2FjaGVTZXJ2aWNlIH0gZnJvbSAnLi9jYWNoZS5zZXJ2aWNlJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgUmVzdENsaWVudFNlcnZpY2Uge1xuICAvKiogSGFuZGxlciB1c2VkIHRvIHN0b3AgYWxsIHBlbmRpbmcgcmVxdWVzdHMgKi9cbiAgcHJvdGVjdGVkIGNhbmNlbFBlbmRpbmckOiBTdWJqZWN0PGJvb2xlYW4+ID0gbmV3IFN1YmplY3Q8Ym9vbGVhbj4oKTtcblxuICAvKiogIERlZmF1bHQgcmVxdWVzdHMgaGVhZGVyICovXG4gIHByb3RlY3RlZCBiYXNlSGVhZGVyID0ge1xuICAgICdDYWNoZS1Db250cm9sJzogJ25vLWNhY2hlJyxcbiAgICBhY2NlcHQ6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICBQcmFnbWE6ICduby1jYWNoZScsXG4gICAgQXV0aG9yaXphdGlvbjogJycsXG4gICAgJ0FjY2VwdC1MYW5ndWFnZSc6ICcqJ1xuICB9O1xuXG4gIC8qKiBTZXJ2aWNlIGNvbmZpZ3VyYXRpb24gcGFyYW1ldGVycyAqL1xuICBwcm90ZWN0ZWQgY29uZmlnOiBSZXN0U2VydmljZUNvbmZpZztcblxuICAvKiogV2hlbiB0cnVlLCB0aGUgcmVxdWVzdCBoZWFkZXIgd2lsbCBpbmNsdWRlIHRoZSBhdXRoZW50aWNhdGlvbiB0b2tlbiAqL1xuICBwcm90ZWN0ZWQgc2VjdXJlUmVxdWVzdCA9IGZhbHNlO1xuXG4gIC8qKiBIb2xkcyBhIGxpc3Qgb2YgZmlsZXMgdG8gYmUgdXBsb2FkIG9uIHJlcXVlc3QgKi9cbiAgcHJvdGVjdGVkIHdpdGhGaWxlc1JlcXVlc3QgPSBmYWxzZTtcblxuICAvKiogUHJlZmVyIGNhY2hlICovXG4gIHByb3RlY3RlZCBjYWNoZWRSZXF1ZXN0ID0gZmFsc2U7XG5cbiAgLyoqIEludmFsaWRhdGUgY2FjaGUgKi9cbiAgcHJvdGVjdGVkIGludmFsaWRhdGVDYWNoZSA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCxcbiAgICBwcml2YXRlIGNvb2tpZXM6IENvb2tpZVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBjYWNoZTogQ2FjaGVTZXJ2aWNlLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgcm91dGVyOiBSb3V0ZXIsXG4gICAgQE9wdGlvbmFsKCkgY29uZmlnOiBSZXN0U2VydmljZUNvbmZpZ1xuICApIHtcbiAgICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgIGVuZFBvaW50OiAnJyxcbiAgICAgIHRva2VuTmFtZTogJ0F1dGhUb2tlbicsXG4gICAgICB0b2tlblN0b3JhZ2U6IFR5cGVUb2tlblN0b3JhZ2UuY29va2llLFxuICAgICAgc2VjdXJlQ29va2llOiBmYWxzZSxcbiAgICAgIG1vY2tEYXRhOiBmYWxzZSxcbiAgICAgIHZhbGlkYXRpb25Ub2tlblVyaTogJy9pbmZvJyxcbiAgICAgIGF1dGhVcmk6ICcvYXV0aG9yaXplJyxcbiAgICAgIFVuYXV0aG9yaXplZFJlZGlyZWN0VXJpOiBudWxsXG4gICAgfSBhcyBSZXN0U2VydmljZUNvbmZpZztcblxuICAgIGlmIChjb25maWcpIHtcbiAgICAgIHRoaXMuc2V0Q29uZmlnKGNvbmZpZyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgUmVzdCBDbGllbnQgY29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzLlxuICAgKlxuICAgKiBDQVVUSU9OOiBUaGlzIG1ldGhvZCBvdmVycmlkZXMgdGhlIGN1cnJlbnQgY29uZmlndXJhdGlvbiBzZXR0aW5nc1xuICAgKiBhbmQgdGhpcyBzZXR0aW5ncyB3aWxsIGFwcGx5IHRvIGFsbCBmb2xsb3dpbmcgcmVxdWVzdHNcbiAgICovXG4gIHB1YmxpYyBzZXRDb25maWcoY29uZmlnOiBSZXN0U2VydmljZUNvbmZpZyk6IFJlc3RDbGllbnRTZXJ2aWNlIHtcbiAgICB0aGlzLmNvbmZpZyA9IHsgLi4udGhpcy5jb25maWcsIC4uLmNvbmZpZyB9IGFzIFJlc3RTZXJ2aWNlQ29uZmlnO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqIFJldHVybiB0aGUgY3VycmVudCBSZXN0IENsaWVudCBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnMuICAqL1xuICBwdWJsaWMgZ2V0Q29uZmlnKCk6IFJlc3RTZXJ2aWNlQ29uZmlnIHtcbiAgICByZXR1cm4gdGhpcy5jb25maWc7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBBUEkgVG9rZW4gZnJvbSBjb29raWVzXG4gICAqL1xuICBwdWJsaWMgZ2V0IHRva2VuKCk6IHN0cmluZyB7XG4gICAgbGV0IHRva2VuID0gJyc7XG5cbiAgICBzd2l0Y2ggKHRoaXMuY29uZmlnLnRva2VuU3RvcmFnZSkge1xuICAgICAgY2FzZSBUeXBlVG9rZW5TdG9yYWdlLmNvb2tpZTpcbiAgICAgICAgdG9rZW4gPSB0aGlzLmNvb2tpZXMuZ2V0KHRoaXMuY29uZmlnLnRva2VuTmFtZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBUeXBlVG9rZW5TdG9yYWdlLmxvY2FsU3RvcmFnZTpcbiAgICAgICAgdG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmNvbmZpZy50b2tlbk5hbWUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVHlwZVRva2VuU3RvcmFnZS5zZXNzaW9uU3RvcmFnZTpcbiAgICAgICAgdG9rZW4gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKHRoaXMuY29uZmlnLnRva2VuTmFtZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIFRva2VuIFN0b3JhZ2UgbWV0aG9kJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuICF0b2tlbiB8fCB0eXBlb2YgdG9rZW4gPT09ICd1bmRlZmluZWQnID8gJycgOiB0b2tlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTYXZlIHRoZSBBUEkgVG9rZW4gY29va2llXG4gICAqL1xuICBwdWJsaWMgc2V0IHRva2VuKHRva2VuOiBzdHJpbmcpIHtcbiAgICBjb25zdCBkZWNvZGVkID0gSnd0SGVscGVyLmRlY29kZVRva2VuKHRva2VuKTtcbiAgICBjb25zdCBleHBpcmVzID0gZnJvbVVuaXhUaW1lKGRlY29kZWQuZXhwKTtcblxuICAgIHN3aXRjaCAodGhpcy5jb25maWcudG9rZW5TdG9yYWdlKSB7XG4gICAgICBjYXNlIFR5cGVUb2tlblN0b3JhZ2UuY29va2llOlxuICAgICAgICB0aGlzLmNvb2tpZXMucHV0KFxuICAgICAgICAgIHRoaXMuY29uZmlnLnRva2VuTmFtZSxcbiAgICAgICAgICB0b2tlbixcbiAgICAgICAgICB7IHNlY3VyZTogdGhpcy5jb25maWcuc2VjdXJlQ29va2llLCBleHBpcmVzIH1cbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFR5cGVUb2tlblN0b3JhZ2UubG9jYWxTdG9yYWdlOlxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmNvbmZpZy50b2tlbk5hbWUsIHRva2VuKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFR5cGVUb2tlblN0b3JhZ2Uuc2Vzc2lvblN0b3JhZ2U6XG4gICAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0odGhpcy5jb25maWcudG9rZW5OYW1lLCB0b2tlbik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIFRva2VuIFN0b3JhZ2UgbWV0aG9kJyk7XG4gICAgfVxuICB9XG5cblxuICAvKipcbiAgICogUmVtb3ZlIHRoZSBBdXRoZW50aWNhdGlvbiB0b2tlbiBjb29raWVcbiAgICovXG4gIHB1YmxpYyByZXZva2UoKTogdm9pZCB7XG4gICAgc3dpdGNoICh0aGlzLmNvbmZpZy50b2tlblN0b3JhZ2UpIHtcbiAgICAgIGNhc2UgVHlwZVRva2VuU3RvcmFnZS5jb29raWU6XG4gICAgICAgIHRoaXMuY29va2llcy5yZW1vdmVBbGwoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFR5cGVUb2tlblN0b3JhZ2UubG9jYWxTdG9yYWdlOlxuICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLmNvbmZpZy50b2tlbk5hbWUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVHlwZVRva2VuU3RvcmFnZS5zZXNzaW9uU3RvcmFnZTpcbiAgICAgICAgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLmNvbmZpZy50b2tlbk5hbWUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBUb2tlbiBTdG9yYWdlIG1ldGhvZCcpO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogUmVxdWVzdCBhbiBBdXRob3JpemF0aW9uIHRva2VuXG4gICAqIFRoZSBkZWZhdWx0IGF1dGhvcml6YXRpb24gVVJJIGlzICdbQVBJX0VORF9QT0lOVF0vYXV0aG9yaXplJ1xuICAgKiBAcGFyYW0gdXNlcm5hbWUgVXNlcm5hbWVcbiAgICogQHBhcmFtIHBhc3N3b3JkIFBhc3N3b3JkXG4gICAqL1xuICBwdWJsaWMgYXV0aG9yaXplKHVzZXJuYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLnBvc3QodGhpcy5jb25maWcuYXV0aFVyaSwgeyB1c2VybmFtZSwgcGFzc3dvcmQgfSlcbiAgICAgIC5waXBlKFxuICAgICAgICB0YXAocGF5bG9hZCA9PiB7XG4gICAgICAgICAgdGhpcy50b2tlbiA9IHBheWxvYWQudG9rZW47XG4gICAgICAgIH0pXG4gICAgICApO1xuICB9XG5cbiAgLyoqIFZhbGlkYXRlIHRoZSBBdXRoZW50aWNhdGlvbiB0b2tlbiBhZ2FpbnN0IHRoZSBBUEkgKi9cbiAgcHVibGljIHZhbGlkYXRlVG9rZW4odXJsOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLnNlY3VyZWQoKS5yZXF1ZXN0KEh0dHBNZXRob2QuUG9zdCwgdXJsKTtcbiAgfVxuXG4gIC8qKiBSZW1vdmVzIGF1dGhvcml6YXRpb24gdG9rZW4gKi9cbiAgcHVibGljIGRlYXV0aG9yaXplKHVybDogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5zZWN1cmVkKCkucmVxdWVzdChIdHRwTWV0aG9kLkdldCwgdXJsKVxuICAgICAgLnBpcGUoXG4gICAgICAgIHRhcCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5yZXZva2UoKTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gIH1cblxuICAvKiogQ2hlY2sgaWYgdGhlIGNsaWVudCBpcyBhbHJlYWR5IEF1dGhlbnRpY2F0ZSAgKi9cbiAgcHVibGljIGlzQXV0aG9yaXplZCgpOiBib29sZWFuIHtcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMudG9rZW47XG4gICAgY29uc3QgZGVjb2RlZCA9IEp3dEhlbHBlci5kZWNvZGVUb2tlbih0b2tlbik7XG4gICAgcmV0dXJuIGRlY29kZWQgIT09IG51bGwgJiYgIWlzQWZ0ZXIobmV3IERhdGUoKSwgZnJvbVVuaXhUaW1lKGRlY29kZWQuZXhwKSk7XG4gIH1cblxuICAvKiogQ2FuY2VsIGFsbCBwZW5kaW5nIHJlcXVlc3RzICovXG4gIHB1YmxpYyBjYW5jZWxQZW5kaW5nUmVxdWVzdHMoKTogdm9pZCB7XG4gICAgdGhpcy5jYW5jZWxQZW5kaW5nJC5uZXh0KHRydWUpO1xuICB9XG5cblxuICBwdWJsaWMgY2FjaGVkKGludmFsaWRhdGUgPSBmYWxzZSkge1xuICAgIHRoaXMuY2FjaGVkUmVxdWVzdCA9IHRydWU7XG4gICAgdGhpcy5pbnZhbGlkYXRlQ2FjaGUgPSBpbnZhbGlkYXRlO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHJlcXVlc3QgbW9kZSB0byBTRUNVUkVEIGZvciB0aGUgbmV4dCByZXF1ZXN0LlxuICAgKlxuICAgKiBTZWN1cmVkIE1vZGUgZm9yY2UgdGhlIG5leHQgcmVxdWVzdCB0byBpbmNsdWRlIHRoZSBhdXRoZW50aWNhdGlvbiB0b2tlbi5cbiAgICogVGhlIHRva2VuIG11c3QgYmUgcmVxdWVzdGVkIHByZXZpb3VzbHkgdXNpbmcgdGhlIFwiYXV0aG9yaXplXCIgbWV0aG9kLlxuICAgKi9cbiAgcHVibGljIHNlY3VyZWQoKTogUmVzdENsaWVudFNlcnZpY2Uge1xuICAgIHRoaXMuc2VjdXJlUmVxdWVzdCA9IHRydWU7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHJlcXVlc3QgbW9kZSB0byBQVUJMSUMgZm9yIHRoZSBuZXh0IHJlcXVlc3QuXG4gICAqXG4gICAqIFB1YmxpYyBpcyB0aGUgZGVmYXVsdCByZXF1ZXN0IG1vZGUgYW5kIGVuc3VyZSB0aGF0IG5vIGF1dGhlbnRpY2F0aW9uIHRva2VuXG4gICAqIHdpbGwgYmUgcGFzcyBvbiB0aGUgbmV4dCByZXF1ZXN0LlxuICAgKi9cbiAgcHVibGljIHB1YmxpYygpOiBSZXN0Q2xpZW50U2VydmljZSB7XG4gICAgdGhpcy5zZWN1cmVSZXF1ZXN0ID0gZmFsc2U7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBBUEkgcmVxdWVzdCB1c2luZyBHRVQgbWV0aG9kXG4gICAqXG4gICAqIEBwYXJhbSB1cmxcbiAgICogQHBhcmFtIGRhdGEgQSBsaXN0IG9mIHBhcmFtZXRlc1xuICAgKi9cbiAgcHVibGljIGdldCh1cmw6IHN0cmluZywgZGF0YT86IHt9KTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KEh0dHBNZXRob2QuR2V0LCB1cmwsIGRhdGEpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFQSSByZXF1ZXN0IHVzaW5nIFBPU1QgbWV0aG9kXG4gICAqXG4gICAqIEBwYXJhbSB1cmxcbiAgICogQHBhcmFtIGRhdGFcbiAgICogQHBhcmFtIHJlc3BvbnNlVHlwZVxuICAgKiBAcGFyYW0gaHR0cE9wdGlvbnNcbiAgICovXG4gIHB1YmxpYyBwb3N0KHVybDogc3RyaW5nLCBkYXRhPzoge30sIHJlc3BvbnNlVHlwZT86IHN0cmluZywgaHR0cE9wdGlvbnM6IElIdHRwT3B0aW9ucyA9IHt9KTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KEh0dHBNZXRob2QuUG9zdCwgdXJsLCBkYXRhLCByZXNwb25zZVR5cGUsIGh0dHBPcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBUEkgcmVxdWVzdCB1c2luZyBQVVQgbWV0aG9kXG4gICAqXG4gICAqIEBwYXJhbSB1cmxcbiAgICogQHBhcmFtIGRhdGFcbiAgICogQHBhcmFtIHJlc3BvbnNlVHlwZVxuICAgKiBAcGFyYW0gaHR0cE9wdGlvbnNcbiAgICovXG4gIHB1YmxpYyBwdXQodXJsOiBzdHJpbmcsIGRhdGE/OiB7fSwgcmVzcG9uc2VUeXBlPzogc3RyaW5nLCBodHRwT3B0aW9uczogSUh0dHBPcHRpb25zID0ge30pOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QoSHR0cE1ldGhvZC5QdXQsIHVybCwgZGF0YSwgcmVzcG9uc2VUeXBlLCBodHRwT3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQVBJIHJlcXVlc3QgdXNpbmcgREVMRVRFIG1ldGhvZFxuICAgKlxuICAgKiBAcGFyYW0gdXJsXG4gICAqIEBwYXJhbSBkYXRhXG4gICAqIEBwYXJhbSByZXNwb25zZVR5cGVcbiAgICovXG4gIHB1YmxpYyBkZWxldGUodXJsOiBzdHJpbmcsIGRhdGE/OiB7fSwgcmVzcG9uc2VUeXBlPzogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KEh0dHBNZXRob2QuRGVsZXRlLCB1cmwsIGRhdGEsIHJlc3BvbnNlVHlwZSk7XG4gIH1cblxuICAvKiogU2V0IHRoZSB1cGxvYWQgZmlsZSBtb2RlICovXG4gIHB1YmxpYyB3aXRoRmlsZXMoKTogUmVzdENsaWVudFNlcnZpY2Uge1xuICAgIHRoaXMud2l0aEZpbGVzUmVxdWVzdCA9IHRydWU7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBGb3JtRGF0YSBvYmplY3QgdG8gYmUgc2VuZCBhcyByZXF1ZXN0IHBheWxvYWQgZGF0YVxuICAgKi9cbiAgcHJvdGVjdGVkIGNyZWF0ZUZvcm1EYXRhKG9iamVjdDogYW55LCBmb3JtPzogRm9ybURhdGEsIG5hbWVzcGFjZT86IHN0cmluZyk6IEZvcm1EYXRhIHtcbiAgICBjb25zdCBmb3JtRGF0YSA9IGZvcm0gfHwgbmV3IEZvcm1EYXRhKCk7XG5cbiAgICBmb3IgKGNvbnN0IHByb3BlcnR5IGluIG9iamVjdCkge1xuXG4gICAgICBpZiAoIW9iamVjdC5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkgfHwgIW9iamVjdFtwcm9wZXJ0eV0pIHsgY29udGludWU7IH1cblxuICAgICAgY29uc3QgZm9ybUtleSA9IG5hbWVzcGFjZSA/IGAke25hbWVzcGFjZX1bJHtwcm9wZXJ0eX1dYCA6IHByb3BlcnR5O1xuICAgICAgaWYgKG9iamVjdFtwcm9wZXJ0eV0gaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZChmb3JtS2V5LCBvYmplY3RbcHJvcGVydHldLnRvSVNPU3RyaW5nKCkpO1xuICAgICAgfSBlbHNlIGlmIChvYmplY3RbcHJvcGVydHldIGluc3RhbmNlb2YgRmlsZUxpc3QpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvYmplY3RbcHJvcGVydHldLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgZm9ybURhdGEuYXBwZW5kKGAke3Byb3BlcnR5fVtdYCwgb2JqZWN0W3Byb3BlcnR5XS5pdGVtKGkpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgdHlwZW9mIG9iamVjdFtwcm9wZXJ0eV0gPT09ICdvYmplY3QnICYmICEob2JqZWN0W3Byb3BlcnR5XSBpbnN0YW5jZW9mIEZpbGUpKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlRm9ybURhdGEob2JqZWN0W3Byb3BlcnR5XSwgZm9ybURhdGEsIGZvcm1LZXkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKGZvcm1LZXksIG9iamVjdFtwcm9wZXJ0eV0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZm9ybURhdGE7XG4gIH1cblxuXG5cbiAgcHJvdGVjdGVkIGJ1aWxkVXJsKHVybDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBsZXQgblVybCA9IGAke3RoaXMuY29uZmlnLmVuZFBvaW50LnJlcGxhY2UoL1xcLyQvLCAnJyl9LyR7dXJsLnJlcGxhY2UoL15cXC8vZywgJycpfWA7XG4gICAgY29uc3QgbWF0Y2ggPSBuVXJsLm1hdGNoKC9cXC4oWzAtOWEtel0rKSg/OltcXD8jXXwkKS9pKTtcblxuICAgIGlmICh0aGlzLmNvbmZpZy5tb2NrRGF0YSAmJiBtYXRjaCA9PSBudWxsKSB7XG4gICAgICBuVXJsID0gYCR7blVybH0uanNvbmA7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5Vcmw7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHJlcXVlc3QgaGVhZGVycyBiYXNlZCBvbiBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnNcbiAgICovXG4gIHByaXZhdGUgYnVpbGRIZWFkZXJzKCkge1xuICAgIGNvbnN0IGhlYWRlciA9IHsgLi4udGhpcy5iYXNlSGVhZGVyIH07XG5cbiAgICBpZiAodGhpcy5jb25maWcubGFuZ3VhZ2UpIHsgaGVhZGVyWydBY2NlcHQtTGFuZ3VhZ2UnXSA9IHRoaXMuY29uZmlnLmxhbmd1YWdlOyB9XG5cbiAgICBpZiAodGhpcy5zZWN1cmVSZXF1ZXN0KSB7XG4gICAgICBjb25zdCB0b2tlbiA9IHRoaXMudG9rZW47XG4gICAgICBpZiAoIXRva2VuKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAnRXhlY3V0aW5nIGEgc2VjdXJlIHJlcXVlc3Qgd2l0aG91dCBUT0tFTi4gJ1xuICAgICAgICAgICsgJ0F1dGhvcml6YXRpb24gaGVhZGVyIHdpbGwgbm90IGJlIHNldCEnXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBoZWFkZXIuQXV0aG9yaXphdGlvbiA9IGBCZWFyZXIgJHt0b2tlbn1gO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnNlY3VyZVJlcXVlc3QgPSBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gaGVhZGVyO1xuICB9XG5cblxuXG4gIC8qKiBSYXcgcmVxdWVzdCBtZXRob2QgKi9cbiAgcHJvdGVjdGVkIHJlcXVlc3QoXG4gICAgbWV0aG9kOiBIdHRwTWV0aG9kLCB1cmw6IHN0cmluZywgZGF0YT86IGFueSwgcmVzcG9uc2VUeXBlPzogc3RyaW5nLFxuICAgIGh0dHBPcHRpb25zOiBJSHR0cE9wdGlvbnMgPSB7fVxuICApOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIGNvbnN0IG1zRGVsYXkgPSBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogMjAwMCkgKyAxMDAwKTtcbiAgICBjb25zdCBoZWFkZXIgPSB0aGlzLmJ1aWxkSGVhZGVycygpO1xuXG4gICAgY29uc3QgclR5cGUgPSAocmVzcG9uc2VUeXBlID8gcmVzcG9uc2VUeXBlIDogJ2pzb24nKSBhcyAndGV4dCc7XG5cbiAgICBpZiAodGhpcy53aXRoRmlsZXNSZXF1ZXN0KSB7IGRhdGEgPSB0aGlzLmNyZWF0ZUZvcm1EYXRhKGRhdGEpOyB0aGlzLndpdGhGaWxlc1JlcXVlc3QgPSBmYWxzZTsgfVxuXG4gICAgbGV0IGNhY2hlS2V5ID0gJyc7XG4gICAgaWYgKHRoaXMuY2FjaGVkUmVxdWVzdCkge1xuICAgICAgY2FjaGVLZXkgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChtZXRob2QgKyAnXycgKyB1cmwgKyAnXycgKyAobWV0aG9kID09PSBIdHRwTWV0aG9kLkdldCA/IEpTT04uc3RyaW5naWZ5KGRhdGEpIDogJycpKSkpO1xuICAgICAgaWYgKCF0aGlzLmludmFsaWRhdGVDYWNoZSkge1xuICAgICAgICBjb25zdCBjYWNoZWQgPSB0aGlzLmNhY2hlLmdldChjYWNoZUtleSk7XG4gICAgICAgIGlmIChjYWNoZWQpIHtcbiAgICAgICAgICB0aGlzLmNhY2hlZFJlcXVlc3QgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gb2YoY2FjaGVkKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jYWNoZS5pbnZhbGlkYXRlKGNhY2hlS2V5KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgYm9keTogbWV0aG9kID09PSBIdHRwTWV0aG9kLkdldCA/IHt9IDogZGF0YSxcbiAgICAgIHJlc3BvbnNlVHlwZTogclR5cGUsXG4gICAgICBwYXJhbXM6IG1ldGhvZCA9PT0gSHR0cE1ldGhvZC5HZXQgPyBkYXRhIDoge30sXG4gICAgICBoZWFkZXJzOiBoZWFkZXJcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXMuaHR0cFxuICAgICAgLnJlcXVlc3QoXG4gICAgICAgIHRoaXMuY29uZmlnLm1vY2tEYXRhID8gSHR0cE1ldGhvZC5HZXQgOiBtZXRob2QsIHRoaXMuYnVpbGRVcmwodXJsKSxcbiAgICAgICAgeyAuLi5vcHRpb25zLCAuLi5odHRwT3B0aW9ucyB9XG4gICAgICApXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5jYW5jZWxQZW5kaW5nJCkpXG4gICAgICAucGlwZShkZWxheSh0aGlzLmNvbmZpZy5tb2NrRGF0YSA/IG1zRGVsYXkgOiAwKSlcbiAgICAgIC5waXBlKHRhcCgocmVzcDogYW55KSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmNhY2hlZFJlcXVlc3QpIHtcbiAgICAgICAgICB0aGlzLmNhY2hlZFJlcXVlc3QgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLmNhY2hlLnNldChjYWNoZUtleSwgcmVzcCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgICkpXG4gICAgICAucGlwZShjYXRjaEVycm9yKChlcnIpID0+IHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHRoaXMuY29uZmlnLlVuYXV0aG9yaXplZFJlZGlyZWN0VXJpXG4gICAgICAgICAgJiYgdXJsICE9PSB0aGlzLmNvbmZpZy5hdXRoVXJpXG4gICAgICAgICAgJiYgZXJyLnN0YXR1cyA9PT0gNDAxXG4gICAgICAgICkge1xuICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFt0aGlzLmNvbmZpZy5VbmF1dGhvcml6ZWRSZWRpcmVjdFVyaV0pLnRoZW4oKCkgPT4geyB9KTtcbiAgICAgICAgICB0aGlzLmNhbmNlbFBlbmRpbmdSZXF1ZXN0cygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aHJvd0Vycm9yKGVycik7XG4gICAgICB9KSk7XG4gIH1cbn1cbiJdfQ==