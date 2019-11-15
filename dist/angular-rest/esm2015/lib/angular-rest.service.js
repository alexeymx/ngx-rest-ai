/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
export class RestClientService {
    /**
     * @param {?} http
     * @param {?} cookies
     * @param {?} router
     * @param {?} config
     */
    constructor(http, cookies, router, config) {
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
    { type: Router },
    { type: RestServiceConfig, decorators: [{ type: Optional }] }
];
/** @nocollapse */ RestClientService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function RestClientService_Factory() { return new RestClientService(i0.ɵɵinject(i1.HttpClient), i0.ɵɵinject(i2.CookieService), i0.ɵɵinject(i3.Router), i0.ɵɵinject(i4.RestServiceConfig, 8)); }, token: RestClientService, providedIn: "root" });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1yZXN0LnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtcmVzdC8iLCJzb3VyY2VzIjpbImxpYi9hbmd1bGFyLXJlc3Quc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDckQsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNsRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQzNDLE9BQU8sRUFBYyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3ZELE9BQU8sRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNuRSxPQUFPLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUdqRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDaEQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHVCQUF1QixDQUFDOzs7Ozs7QUFLNUUsTUFBTSxPQUFPLGlCQUFpQjs7Ozs7OztJQXNCNUIsWUFDVSxJQUFnQixFQUNoQixPQUFzQixFQUNiLE1BQWMsRUFDbkIsTUFBeUI7UUFIN0IsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUNoQixZQUFPLEdBQVAsT0FBTyxDQUFlO1FBQ2IsV0FBTSxHQUFOLE1BQU0sQ0FBUTs7OztRQXZCdkIsbUJBQWMsR0FBcUIsSUFBSSxPQUFPLEVBQVcsQ0FBQzs7OztRQUcxRCxlQUFVLEdBQUc7WUFDckIsZUFBZSxFQUFFLFVBQVU7WUFDM0IsTUFBTSxFQUFF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RmIsTUFBTTtZQVVOLGlCQUFpQix1QkErQnJCLFFBQVE7Ozs7Ozs7OztJQXhCWCwyQ0FBb0U7Ozs7OztJQUdwRSx1Q0FNRTs7Ozs7O0lBR0YsbUNBQW9DOzs7Ozs7SUFHcEMsMENBQWdDOzs7Ozs7SUFHaEMsNkNBQW1DOzs7OztJQUdqQyxpQ0FBd0I7Ozs7O0lBQ3hCLG9DQUE4Qjs7Ozs7SUFDOUIsbUNBQStCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgQ29va2llU2VydmljZSB9IGZyb20gJ25neC1jb29raWUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3ViamVjdCwgdGhyb3dFcnJvciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgdGFrZVVudGlsLCB0YXAsIGNhdGNoRXJyb3IsIGRlbGF5IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgaXNBZnRlciwgZnJvbVVuaXhUaW1lIH0gZnJvbSAnZGF0ZS1mbnMnO1xuXG5pbXBvcnQgeyBJSHR0cE9wdGlvbnMgfSBmcm9tICcuL2h0dHAtb3B0aW9ucy5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgSHR0cE1ldGhvZCB9IGZyb20gJy4vaHR0cC1tZXRob2QuZW51bSc7XG5pbXBvcnQgeyBKd3RIZWxwZXIgfSBmcm9tICcuL2p3dC1oZWxwZXIuY2xhc3MnO1xuaW1wb3J0IHsgUmVzdFNlcnZpY2VDb25maWcsIFR5cGVUb2tlblN0b3JhZ2UgfSBmcm9tICcuL2FuZ3VsYXItcmVzdC5jb25maWcnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBSZXN0Q2xpZW50U2VydmljZSB7XG4gIC8qKiBIYW5kbGVyIHVzZWQgdG8gc3RvcCBhbGwgcGVuZGluZyByZXF1ZXN0cyAqL1xuICBwcm90ZWN0ZWQgY2FuY2VsUGVuZGluZyQ6IFN1YmplY3Q8Ym9vbGVhbj4gPSBuZXcgU3ViamVjdDxib29sZWFuPigpO1xuXG4gIC8qKiAgRGVmYXVsdCByZXF1ZXN0cyBoZWFkZXIgKi9cbiAgcHJvdGVjdGVkIGJhc2VIZWFkZXIgPSB7XG4gICAgJ0NhY2hlLUNvbnRyb2wnOiAnbm8tY2FjaGUnLFxuICAgIGFjY2VwdDogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgIFByYWdtYTogJ25vLWNhY2hlJyxcbiAgICBBdXRob3JpemF0aW9uOiAnJyxcbiAgICAnQWNjZXB0LUxhbmd1YWdlJzogJyonXG4gIH07XG5cbiAgLyoqIFNlcnZpY2UgY29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzICovXG4gIHByb3RlY3RlZCBjb25maWc6IFJlc3RTZXJ2aWNlQ29uZmlnO1xuXG4gIC8qKiBXaGVuIHRydWUsIHRoZSByZXF1ZXN0IGhlYWRlciB3aWxsIGluY2x1ZGUgdGhlIGF1dGhlbnRpY2F0aW9uIHRva2VuICovXG4gIHByb3RlY3RlZCBzZWN1cmVSZXF1ZXN0ID0gZmFsc2U7XG5cbiAgLyoqIEhvbGRzIGEgbGlzdCBvZiBmaWxlcyB0byBiZSB1cGxvYWQgb24gcmVxdWVzdCAqL1xuICBwcm90ZWN0ZWQgd2l0aEZpbGVzUmVxdWVzdCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCxcbiAgICBwcml2YXRlIGNvb2tpZXM6IENvb2tpZVNlcnZpY2UsXG4gICAgcHJpdmF0ZSByZWFkb25seSByb3V0ZXI6IFJvdXRlcixcbiAgICBAT3B0aW9uYWwoKSBjb25maWc6IFJlc3RTZXJ2aWNlQ29uZmlnXG4gICkge1xuICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgZW5kUG9pbnQ6ICcnLFxuICAgICAgdG9rZW5OYW1lOiAnQXV0aFRva2VuJyxcbiAgICAgIHRva2VuU3RvcmFnZTogVHlwZVRva2VuU3RvcmFnZS5jb29raWUsXG4gICAgICBzZWN1cmVDb29raWU6IGZhbHNlLFxuICAgICAgbW9ja0RhdGE6IGZhbHNlLFxuICAgICAgdmFsaWRhdGlvblRva2VuVXJpOiAnL2luZm8nLFxuICAgICAgYXV0aFVyaTogJy9hdXRob3JpemUnLFxuICAgICAgVW5hdXRob3JpemVkUmVkaXJlY3RVcmk6IG51bGxcbiAgICB9IGFzIFJlc3RTZXJ2aWNlQ29uZmlnO1xuXG4gICAgaWYgKGNvbmZpZykge1xuICAgICAgdGhpcy5zZXRDb25maWcoY29uZmlnKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBSZXN0IENsaWVudCBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnMuXG4gICAqXG4gICAqIENBVVRJT046IFRoaXMgbWV0aG9kIG92ZXJyaWRlcyB0aGUgY3VycmVudCBjb25maWd1cmF0aW9uIHNldHRpbmdzXG4gICAqIGFuZCB0aGlzIHNldHRpbmdzIHdpbGwgYXBwbHkgdG8gYWxsIGZvbGxvd2luZyByZXF1ZXN0c1xuICAgKi9cbiAgcHVibGljIHNldENvbmZpZyhjb25maWc6IFJlc3RTZXJ2aWNlQ29uZmlnKTogUmVzdENsaWVudFNlcnZpY2Uge1xuICAgIHRoaXMuY29uZmlnID0geyAuLi50aGlzLmNvbmZpZywgLi4uY29uZmlnIH0gYXMgUmVzdFNlcnZpY2VDb25maWc7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKiogUmV0dXJuIHRoZSBjdXJyZW50IFJlc3QgQ2xpZW50IGNvbmZpZ3VyYXRpb24gcGFyYW1ldGVycy4gICovXG4gIHB1YmxpYyBnZXRDb25maWcoKTogUmVzdFNlcnZpY2VDb25maWcge1xuICAgIHJldHVybiB0aGlzLmNvbmZpZztcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIEFQSSBUb2tlbiBmcm9tIGNvb2tpZXNcbiAgICovXG4gIHB1YmxpYyBnZXQgdG9rZW4oKTogc3RyaW5nIHtcbiAgICBsZXQgdG9rZW4gPSAnJztcblxuICAgIHN3aXRjaCAodGhpcy5jb25maWcudG9rZW5TdG9yYWdlKSB7XG4gICAgICBjYXNlIFR5cGVUb2tlblN0b3JhZ2UuY29va2llOlxuICAgICAgICB0b2tlbiA9IHRoaXMuY29va2llcy5nZXQodGhpcy5jb25maWcudG9rZW5OYW1lKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFR5cGVUb2tlblN0b3JhZ2UubG9jYWxTdG9yYWdlOlxuICAgICAgICB0b2tlbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMuY29uZmlnLnRva2VuTmFtZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBUeXBlVG9rZW5TdG9yYWdlLnNlc3Npb25TdG9yYWdlOlxuICAgICAgICB0b2tlbiA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0odGhpcy5jb25maWcudG9rZW5OYW1lKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgVG9rZW4gU3RvcmFnZSBtZXRob2QnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gIXRva2VuIHx8IHR5cGVvZiB0b2tlbiA9PT0gJ3VuZGVmaW5lZCcgPyAnJyA6IHRva2VuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNhdmUgdGhlIEFQSSBUb2tlbiBjb29raWVcbiAgICovXG4gIHB1YmxpYyBzZXQgdG9rZW4odG9rZW46IHN0cmluZykge1xuICAgIGNvbnN0IGRlY29kZWQgPSBKd3RIZWxwZXIuZGVjb2RlVG9rZW4odG9rZW4pO1xuICAgIGNvbnN0IGV4cGlyZXMgPSBmcm9tVW5peFRpbWUoZGVjb2RlZC5leHApO1xuXG4gICAgc3dpdGNoICh0aGlzLmNvbmZpZy50b2tlblN0b3JhZ2UpIHtcbiAgICAgIGNhc2UgVHlwZVRva2VuU3RvcmFnZS5jb29raWU6XG4gICAgICAgIHRoaXMuY29va2llcy5wdXQoXG4gICAgICAgICAgdGhpcy5jb25maWcudG9rZW5OYW1lLFxuICAgICAgICAgIHRva2VuLFxuICAgICAgICAgIHsgc2VjdXJlOiB0aGlzLmNvbmZpZy5zZWN1cmVDb29raWUsIGV4cGlyZXMgfVxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVHlwZVRva2VuU3RvcmFnZS5sb2NhbFN0b3JhZ2U6XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuY29uZmlnLnRva2VuTmFtZSwgdG9rZW4pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVHlwZVRva2VuU3RvcmFnZS5zZXNzaW9uU3RvcmFnZTpcbiAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmNvbmZpZy50b2tlbk5hbWUsIHRva2VuKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgVG9rZW4gU3RvcmFnZSBtZXRob2QnKTtcbiAgICB9XG4gIH1cblxuXG4gIC8qKlxuICAgKiBSZW1vdmUgdGhlIEF1dGhlbnRpY2F0aW9uIHRva2VuIGNvb2tpZVxuICAgKi9cbiAgcHVibGljIHJldm9rZSgpOiB2b2lkIHtcbiAgICBzd2l0Y2ggKHRoaXMuY29uZmlnLnRva2VuU3RvcmFnZSkge1xuICAgICAgY2FzZSBUeXBlVG9rZW5TdG9yYWdlLmNvb2tpZTpcbiAgICAgICAgdGhpcy5jb29raWVzLnJlbW92ZUFsbCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVHlwZVRva2VuU3RvcmFnZS5sb2NhbFN0b3JhZ2U6XG4gICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMuY29uZmlnLnRva2VuTmFtZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBUeXBlVG9rZW5TdG9yYWdlLnNlc3Npb25TdG9yYWdlOlxuICAgICAgICBzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMuY29uZmlnLnRva2VuTmFtZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIFRva2VuIFN0b3JhZ2UgbWV0aG9kJyk7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBSZXF1ZXN0IGFuIEF1dGhvcml6YXRpb24gdG9rZW5cbiAgICogVGhlIGRlZmF1bHQgYXV0aG9yaXphdGlvbiBVUkkgaXMgJ1tBUElfRU5EX1BPSU5UXS9hdXRob3JpemUnXG4gICAqIEBwYXJhbSB1c2VybmFtZSBVc2VybmFtZVxuICAgKiBAcGFyYW0gcGFzc3dvcmQgUGFzc3dvcmRcbiAgICovXG4gIHB1YmxpYyBhdXRob3JpemUodXNlcm5hbWU6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMucG9zdCh0aGlzLmNvbmZpZy5hdXRoVXJpLCB7IHVzZXJuYW1lLCBwYXNzd29yZCB9KVxuICAgICAgLnBpcGUoXG4gICAgICAgIHRhcChwYXlsb2FkID0+IHtcbiAgICAgICAgICB0aGlzLnRva2VuID0gcGF5bG9hZC50b2tlbjtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gIH1cblxuICAvKiogVmFsaWRhdGUgdGhlIEF1dGhlbnRpY2F0aW9uIHRva2VuIGFnYWluc3QgdGhlIEFQSSAqL1xuICBwdWJsaWMgdmFsaWRhdGVUb2tlbih1cmw6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMuc2VjdXJlZCgpLnJlcXVlc3QoSHR0cE1ldGhvZC5Qb3N0LCB1cmwpO1xuICB9XG5cbiAgLyoqIFJlbW92ZXMgYXV0aG9yaXphdGlvbiB0b2tlbiAqL1xuICBwdWJsaWMgZGVhdXRob3JpemUodXJsOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLnNlY3VyZWQoKS5yZXF1ZXN0KEh0dHBNZXRob2QuR2V0LCB1cmwpXG4gICAgICAucGlwZShcbiAgICAgICAgdGFwKCgpID0+IHtcbiAgICAgICAgICB0aGlzLnJldm9rZSgpO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgfVxuXG4gIC8qKiBDaGVjayBpZiB0aGUgY2xpZW50IGlzIGFscmVhZHkgQXV0aGVudGljYXRlICAqL1xuICBwdWJsaWMgaXNBdXRob3JpemVkKCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy50b2tlbjtcbiAgICBjb25zdCBkZWNvZGVkID0gSnd0SGVscGVyLmRlY29kZVRva2VuKHRva2VuKTtcbiAgICByZXR1cm4gZGVjb2RlZCAhPT0gbnVsbCAmJiAhaXNBZnRlcihuZXcgRGF0ZSgpLCBmcm9tVW5peFRpbWUoZGVjb2RlZC5leHApKTtcbiAgfVxuXG4gIC8qKiBDYW5jZWwgYWxsIHBlbmRpbmcgcmVxdWVzdHMgKi9cbiAgcHVibGljIGNhbmNlbFBlbmRpbmdSZXF1ZXN0cygpOiB2b2lkIHtcbiAgICB0aGlzLmNhbmNlbFBlbmRpbmckLm5leHQodHJ1ZSk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHJlcXVlc3QgbW9kZSB0byBTRUNVUkVEIGZvciB0aGUgbmV4dCByZXF1ZXN0LlxuICAgKlxuICAgKiBTZWN1cmVkIE1vZGUgZm9yY2UgdGhlIG5leHQgcmVxdWVzdCB0byBpbmNsdWRlIHRoZSBhdXRoZW50aWNhdGlvbiB0b2tlbi5cbiAgICogVGhlIHRva2VuIG11c3QgYmUgcmVxdWVzdGVkIHByZXZpb3VzbHkgdXNpbmcgdGhlIFwiYXV0aG9yaXplXCIgbWV0aG9kLlxuICAgKi9cbiAgcHVibGljIHNlY3VyZWQoKTogUmVzdENsaWVudFNlcnZpY2Uge1xuICAgIHRoaXMuc2VjdXJlUmVxdWVzdCA9IHRydWU7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIHJlcXVlc3QgbW9kZSB0byBQVUJMSUMgZm9yIHRoZSBuZXh0IHJlcXVlc3QuXG4gICAqXG4gICAqIFB1YmxpYyBpcyB0aGUgZGVmYXVsdCByZXF1ZXN0IG1vZGUgYW5kIGVuc3VyZSB0aGF0IG5vIGF1dGhlbnRpY2F0aW9uIHRva2VuXG4gICAqIHdpbGwgYmUgcGFzcyBvbiB0aGUgbmV4dCByZXF1ZXN0LlxuICAgKi9cbiAgcHVibGljIHB1YmxpYygpOiBSZXN0Q2xpZW50U2VydmljZSB7XG4gICAgdGhpcy5zZWN1cmVSZXF1ZXN0ID0gZmFsc2U7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBBUEkgcmVxdWVzdCB1c2luZyBHRVQgbWV0aG9kXG4gICAqXG4gICAqIEBwYXJhbSB1cmxcbiAgICogQHBhcmFtIGRhdGEgQSBsaXN0IG9mIHBhcmFtZXRlc1xuICAgKi9cbiAgcHVibGljIGdldCh1cmw6IHN0cmluZywgZGF0YT86IHt9KTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KEh0dHBNZXRob2QuR2V0LCB1cmwsIGRhdGEpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFQSSByZXF1ZXN0IHVzaW5nIFBPU1QgbWV0aG9kXG4gICAqXG4gICAqIEBwYXJhbSB1cmxcbiAgICogQHBhcmFtIGRhdGFcbiAgICogQHBhcmFtIHJlc3BvbnNlVHlwZVxuICAgKiBAcGFyYW0gaHR0cE9wdGlvbnNcbiAgICovXG4gIHB1YmxpYyBwb3N0KHVybDogc3RyaW5nLCBkYXRhPzoge30sIHJlc3BvbnNlVHlwZT86IHN0cmluZywgaHR0cE9wdGlvbnM6IElIdHRwT3B0aW9ucyA9IHt9KTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KEh0dHBNZXRob2QuUG9zdCwgdXJsLCBkYXRhLCByZXNwb25zZVR5cGUsIGh0dHBPcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBUEkgcmVxdWVzdCB1c2luZyBQVVQgbWV0aG9kXG4gICAqXG4gICAqIEBwYXJhbSB1cmxcbiAgICogQHBhcmFtIGRhdGFcbiAgICogQHBhcmFtIHJlc3BvbnNlVHlwZVxuICAgKiBAcGFyYW0gaHR0cE9wdGlvbnNcbiAgICovXG4gIHB1YmxpYyBwdXQodXJsOiBzdHJpbmcsIGRhdGE/OiB7fSwgcmVzcG9uc2VUeXBlPzogc3RyaW5nLCBodHRwT3B0aW9uczogSUh0dHBPcHRpb25zID0ge30pOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QoSHR0cE1ldGhvZC5QdXQsIHVybCwgZGF0YSwgcmVzcG9uc2VUeXBlLCBodHRwT3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQVBJIHJlcXVlc3QgdXNpbmcgREVMRVRFIG1ldGhvZFxuICAgKlxuICAgKiBAcGFyYW0gdXJsXG4gICAqIEBwYXJhbSBkYXRhXG4gICAqIEBwYXJhbSByZXNwb25zZVR5cGVcbiAgICovXG4gIHB1YmxpYyBkZWxldGUodXJsOiBzdHJpbmcsIGRhdGE/OiB7fSwgcmVzcG9uc2VUeXBlPzogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KEh0dHBNZXRob2QuRGVsZXRlLCB1cmwsIGRhdGEsIHJlc3BvbnNlVHlwZSk7XG4gIH1cblxuICAvKiogU2V0IHRoZSB1cGxvYWQgZmlsZSBtb2RlICovXG4gIHB1YmxpYyB3aXRoRmlsZXMoKTogUmVzdENsaWVudFNlcnZpY2Uge1xuICAgIHRoaXMud2l0aEZpbGVzUmVxdWVzdCA9IHRydWU7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBGb3JtRGF0YSBvYmplY3QgdG8gYmUgc2VuZCBhcyByZXF1ZXN0IHBheWxvYWQgZGF0YVxuICAgKi9cbiAgcHJvdGVjdGVkIGNyZWF0ZUZvcm1EYXRhKG9iamVjdDogYW55LCBmb3JtPzogRm9ybURhdGEsIG5hbWVzcGFjZT86IHN0cmluZyk6IEZvcm1EYXRhIHtcbiAgICBjb25zdCBmb3JtRGF0YSA9IGZvcm0gfHwgbmV3IEZvcm1EYXRhKCk7XG5cbiAgICBmb3IgKGNvbnN0IHByb3BlcnR5IGluIG9iamVjdCkge1xuXG4gICAgICBpZiAoIW9iamVjdC5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkgfHwgIW9iamVjdFtwcm9wZXJ0eV0pIHsgY29udGludWU7IH1cblxuICAgICAgY29uc3QgZm9ybUtleSA9IG5hbWVzcGFjZSA/IGAke25hbWVzcGFjZX1bJHtwcm9wZXJ0eX1dYCA6IHByb3BlcnR5O1xuICAgICAgaWYgKG9iamVjdFtwcm9wZXJ0eV0gaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZChmb3JtS2V5LCBvYmplY3RbcHJvcGVydHldLnRvSVNPU3RyaW5nKCkpO1xuICAgICAgfSBlbHNlIGlmIChvYmplY3RbcHJvcGVydHldIGluc3RhbmNlb2YgRmlsZUxpc3QpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvYmplY3RbcHJvcGVydHldLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgZm9ybURhdGEuYXBwZW5kKGAke3Byb3BlcnR5fVtdYCwgb2JqZWN0W3Byb3BlcnR5XS5pdGVtKGkpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgdHlwZW9mIG9iamVjdFtwcm9wZXJ0eV0gPT09ICdvYmplY3QnICYmICEob2JqZWN0W3Byb3BlcnR5XSBpbnN0YW5jZW9mIEZpbGUpKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlRm9ybURhdGEob2JqZWN0W3Byb3BlcnR5XSwgZm9ybURhdGEsIGZvcm1LZXkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKGZvcm1LZXksIG9iamVjdFtwcm9wZXJ0eV0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZm9ybURhdGE7XG4gIH1cblxuXG5cbiAgcHJvdGVjdGVkIGJ1aWxkVXJsKHVybDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBsZXQgblVybCA9IGAke3RoaXMuY29uZmlnLmVuZFBvaW50LnJlcGxhY2UoL1xcLyQvLCAnJyl9LyR7dXJsLnJlcGxhY2UoL15cXC8vZywgJycpfWA7XG4gICAgY29uc3QgbWF0Y2ggPSBuVXJsLm1hdGNoKC9cXC4oWzAtOWEtel0rKSg/OltcXD8jXXwkKS9pKTtcblxuICAgIGlmICh0aGlzLmNvbmZpZy5tb2NrRGF0YSAmJiBtYXRjaCA9PSBudWxsKSB7XG4gICAgICBuVXJsID0gYCR7blVybH0uanNvbmA7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5Vcmw7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHJlcXVlc3QgaGVhZGVycyBiYXNlZCBvbiBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnNcbiAgICovXG4gIHByaXZhdGUgYnVpbGRIZWFkZXJzKCkge1xuICAgIGNvbnN0IGhlYWRlciA9IHsgLi4udGhpcy5iYXNlSGVhZGVyIH07XG5cbiAgICBpZiAodGhpcy5jb25maWcubGFuZ3VhZ2UpIHsgaGVhZGVyWydBY2NlcHQtTGFuZ3VhZ2UnXSA9IHRoaXMuY29uZmlnLmxhbmd1YWdlOyB9XG5cbiAgICBpZiAodGhpcy5zZWN1cmVSZXF1ZXN0KSB7XG4gICAgICBjb25zdCB0b2tlbiA9IHRoaXMudG9rZW47XG4gICAgICBpZiAoIXRva2VuKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAnRXhlY3V0aW5nIGEgc2VjdXJlIHJlcXVlc3Qgd2l0aG91dCBUT0tFTi4gJ1xuICAgICAgICAgICsgJ0F1dGhvcml6YXRpb24gaGVhZGVyIHdpbGwgbm90IGJlIHNldCEnXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBoZWFkZXIuQXV0aG9yaXphdGlvbiA9IGBCZWFyZXIgJHt0b2tlbn1gO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnNlY3VyZVJlcXVlc3QgPSBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gaGVhZGVyO1xuICB9XG5cblxuXG4gIC8qKiBSYXcgcmVxdWVzdCBtZXRob2QgKi9cbiAgcHJvdGVjdGVkIHJlcXVlc3QoXG4gICAgbWV0aG9kOiBIdHRwTWV0aG9kLCB1cmw6IHN0cmluZywgZGF0YT86IGFueSwgcmVzcG9uc2VUeXBlPzogc3RyaW5nLFxuICAgIGh0dHBPcHRpb25zOiBJSHR0cE9wdGlvbnMgPSB7fVxuICApOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIGNvbnN0IG1zRGVsYXkgPSBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogMjAwMCkgKyAxMDAwKTtcbiAgICBjb25zdCBoZWFkZXIgPSB0aGlzLmJ1aWxkSGVhZGVycygpO1xuXG4gICAgY29uc3QgclR5cGUgPSAocmVzcG9uc2VUeXBlID8gcmVzcG9uc2VUeXBlIDogJ2pzb24nKSBhcyAndGV4dCc7XG5cbiAgICBpZiAodGhpcy53aXRoRmlsZXNSZXF1ZXN0KSB7IGRhdGEgPSB0aGlzLmNyZWF0ZUZvcm1EYXRhKGRhdGEpOyB0aGlzLndpdGhGaWxlc1JlcXVlc3QgPSBmYWxzZTsgfVxuXG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgIGJvZHk6IG1ldGhvZCA9PT0gSHR0cE1ldGhvZC5HZXQgPyB7fSA6IGRhdGEsXG4gICAgICByZXNwb25zZVR5cGU6IHJUeXBlLFxuICAgICAgcGFyYW1zOiBtZXRob2QgPT09IEh0dHBNZXRob2QuR2V0ID8gZGF0YSA6IHt9LFxuICAgICAgaGVhZGVyczogaGVhZGVyXG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLmh0dHBcbiAgICAgIC5yZXF1ZXN0KFxuICAgICAgICB0aGlzLmNvbmZpZy5tb2NrRGF0YSA/IEh0dHBNZXRob2QuR2V0IDogbWV0aG9kLCB0aGlzLmJ1aWxkVXJsKHVybCksXG4gICAgICAgIHsgLi4ub3B0aW9ucywgLi4uaHR0cE9wdGlvbnMgfVxuICAgICAgKVxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuY2FuY2VsUGVuZGluZyQpKVxuICAgICAgLnBpcGUoZGVsYXkodGhpcy5jb25maWcubW9ja0RhdGEgPyBtc0RlbGF5IDogMCkpXG4gICAgICAucGlwZShjYXRjaEVycm9yKChlcnIpID0+IHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHRoaXMuY29uZmlnLlVuYXV0aG9yaXplZFJlZGlyZWN0VXJpXG4gICAgICAgICAgJiYgdXJsICE9PSB0aGlzLmNvbmZpZy5hdXRoVXJpXG4gICAgICAgICAgJiYgZXJyLnN0YXR1cyA9PT0gNDAxXG4gICAgICAgICkge1xuICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFt0aGlzLmNvbmZpZy5VbmF1dGhvcml6ZWRSZWRpcmVjdFVyaV0pLnRoZW4oKCkgPT4geyB9KTtcbiAgICAgICAgICB0aGlzLmNhbmNlbFBlbmRpbmdSZXF1ZXN0cygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aHJvd0Vycm9yKGVycik7XG4gICAgICB9KSk7XG4gIH1cbn1cbiJdfQ==