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
export class RestClientService {
    constructor(http, cookies, router, config) {
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
    setConfig(config) {
        this.config = Object.assign(Object.assign({}, this.config), config);
        return this;
    }
    /** Return the current Rest Client configuration parameters.  */
    getConfig() {
        return this.config;
    }
    /**
     * Get the API Token from cookies
     */
    get token() {
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
     */
    set token(token) {
        const decoded = JwtHelper.decodeToken(token);
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
     * @param username Username
     * @param password Password
     * @deprecated Use `authenticate` method instead
     */
    authorize(username, password) {
        return this.authenticate(username, password);
    }
    /**
     * Request an authentication token
     * The default authentication URI is '[API_END_POINT]/authenticate'
     * @param username Username
     * @param password Password
     */
    authenticate(username, password) {
        return this.post(this.config.authUri, { username, password })
            .pipe(tap(payload => {
            this.token = payload;
        }));
    }
    /** Validate the Authentication token against the API */
    validateToken(url) {
        return this.secured().request(HttpMethod.Post, url);
    }
    /**
     * Removes authorization token
     * @param url a url to report to
     * @deprecated use `deauthenticate` method instead
     */
    deauthorize(url) {
        return this.deauthenticate(url);
    }
    /**
     * Removes authorization token and reports logout to the server
     * @param url a url to report to
     */
    deauthenticate(url) {
        return this.secured().request(HttpMethod.Get, url)
            .pipe(tap(() => {
            this.revoke();
        }));
    }
    /**
     * Check if the client is already authenticated
     * @deprecated use `isAuthenticated` method instead
     */
    isAuthorized() {
        const token = this.token;
        const decoded = JwtHelper.decodeToken(token);
        return decoded !== null && !isAfter(new Date(), fromUnixTime(decoded.exp));
    }
    /**
     * Check if the client is already authenticated
     */
    isAuthenticated() {
        const token = this.token;
        const decoded = JwtHelper.decodeToken(token);
        return decoded !== null && !isAfter(new Date(), fromUnixTime(decoded.exp));
    }
    /** Cancel all pending requests */
    cancelPendingRequests() {
        this.cancelPending$.next(true);
    }
    /**
     * Set the request mode to SECURED for the next request.
     *
     * Secured Mode force the next request to include the authentication token.
     * The token must be requested previously using the "authorize" method.
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
     */
    public() {
        this.secureRequest = false;
        return this;
    }
    /**
     * API request using GET method
     *
     * @param url
     * @param data A list of parametes
     */
    get(url, data) {
        return this.request(HttpMethod.Get, url, data);
    }
    /**
     * API request using POST method
     *
     * @param url
     * @param data
     * @param responseType
     * @param httpOptions
     */
    post(url, data, responseType, httpOptions = {}) {
        return this.request(HttpMethod.Post, url, data, responseType, httpOptions);
    }
    /**
     * API request using PUT method
     *
     * @param url
     * @param data
     * @param responseType
     * @param httpOptions
     */
    put(url, data, responseType, httpOptions = {}) {
        return this.request(HttpMethod.Put, url, data, responseType, httpOptions);
    }
    /**
     * API request using DELETE method
     *
     * @param url
     * @param data
     * @param responseType
     */
    delete(url, data, responseType) {
        return this.request(HttpMethod.Delete, url, data, responseType);
    }
    /** Set the upload file mode */
    withFiles() {
        this.withFilesRequest = true;
        return this;
    }
    /**
     * Create a FormData object to be send as request payload data
     */
    createFormData(object, form, namespace) {
        const formData = form || new FormData();
        for (const property in object) {
            if (!object.hasOwnProperty(property) || !object[property]) {
                continue;
            }
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
    buildUrl(url) {
        const endPoint = this.config.mockData ? 'assets/mock-data' : this.config.endPoint.replace(/\/$/, '');
        let nUrl = `${endPoint}/${url.replace(/^\//g, '')}`;
        const match = nUrl.match(/\.([0-9a-z]+)(?:[\?#]|$)/i);
        if (this.config.mockData && match == null) {
            nUrl = `${nUrl}.json`;
        }
        return nUrl;
    }
    /**
     * Return the request headers based on configuration parameters
     */
    buildHeaders() {
        const header = Object.assign({}, this.baseHeader);
        if (this.config.language) {
            header['Accept-Language'] = this.config.language;
        }
        if (this.secureRequest) {
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
    /** Raw request method */
    request(method, url, data, responseType, httpOptions = {}) {
        const msDelay = Math.floor((Math.random() * 2000) + 1000);
        const header = this.buildHeaders();
        const rType = (responseType ? responseType : 'json');
        if (this.withFilesRequest) {
            data = this.createFormData(data);
            this.withFilesRequest = false;
        }
        const options = {
            body: method === HttpMethod.Get ? {} : data,
            responseType: rType,
            params: method === HttpMethod.Get ? data : {},
            headers: header
        };
        return this.http
            .request(this.config.mockData ? HttpMethod.Get : method, this.buildUrl(url), Object.assign(Object.assign({}, options), httpOptions))
            .pipe(takeUntil(this.cancelPending$))
            .pipe(delay(this.config.mockData ? msDelay : 0))
            .pipe(catchError((err) => {
            if (this.config.UnauthenticatedRedirectUri
                && url !== this.config.authUri
                && err.status === 401) {
                this.router.navigate([this.config.UnauthenticatedRedirectUri]).then(() => { });
                this.cancelPendingRequests();
            }
            if (this.config.UnauthorizedRedirectUri
                && url !== this.config.authUri
                && err.status === 403) {
                this.router.navigate([this.config.UnauthorizedRedirectUri]).then(() => { });
                this.cancelPendingRequests();
            }
            return throwError(err);
        }));
    }
}
/** @nocollapse */ RestClientService.ɵfac = function RestClientService_Factory(t) { return new (t || RestClientService)(i0.ɵɵinject(i1.HttpClient), i0.ɵɵinject(i2.CookieService), i0.ɵɵinject(i3.Router), i0.ɵɵinject(i4.RestServiceConfig, 8)); };
/** @nocollapse */ RestClientService.ɵprov = i0.ɵɵdefineInjectable({ token: RestClientService, factory: RestClientService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(RestClientService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: i1.HttpClient }, { type: i2.CookieService }, { type: i3.Router }, { type: i4.RestServiceConfig, decorators: [{
                type: Optional
            }] }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXJlc3Quc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1yZXN0LyIsInNvdXJjZXMiOlsibGliL25neC1yZXN0LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFJckQsT0FBTyxFQUFjLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDdkQsT0FBTyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ25FLE9BQU8sRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBR2pELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNoRCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDL0MsT0FBTyxFQUFxQixnQkFBZ0IsRUFBRSxNQUFNLG1CQUFtQixDQUFDOzs7Ozs7QUFLeEUsTUFBTSxPQUFPLGlCQUFpQjtJQXNCNUIsWUFDVSxJQUFnQixFQUNoQixPQUFzQixFQUNiLE1BQWMsRUFDbkIsTUFBeUI7UUFIN0IsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUNoQixZQUFPLEdBQVAsT0FBTyxDQUFlO1FBQ2IsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQXhCakMsZ0RBQWdEO1FBQ3RDLG1CQUFjLEdBQXFCLElBQUksT0FBTyxFQUFXLENBQUM7UUFFcEUsK0JBQStCO1FBQ3JCLGVBQVUsR0FBRztZQUNyQixlQUFlLEVBQUUsVUFBVTtZQUMzQixNQUFNLEVBQUUsa0JBQWtCO1lBQzFCLE1BQU0sRUFBRSxVQUFVO1lBQ2xCLGFBQWEsRUFBRSxFQUFFO1lBQ2pCLGlCQUFpQixFQUFFLEdBQUc7U0FDdkIsQ0FBQztRQUtGLDBFQUEwRTtRQUNoRSxrQkFBYSxHQUFHLEtBQUssQ0FBQztRQUVoQyxvREFBb0Q7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O2tEQUVQLGlCQUFpQjtjQUg3QixVQUFVO2VBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkI7O3NCQTJCSSxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgQ29va2llU2VydmljZSB9IGZyb20gJ25neC1jb29raWUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3ViamVjdCwgdGhyb3dFcnJvciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgdGFrZVVudGlsLCB0YXAsIGNhdGNoRXJyb3IsIGRlbGF5IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgaXNBZnRlciwgZnJvbVVuaXhUaW1lIH0gZnJvbSAnZGF0ZS1mbnMnO1xuXG5pbXBvcnQgeyBJSHR0cE9wdGlvbnMgfSBmcm9tICcuL2h0dHAtb3B0aW9ucy5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgSHR0cE1ldGhvZCB9IGZyb20gJy4vaHR0cC1tZXRob2QuZW51bSc7XG5pbXBvcnQgeyBKd3RIZWxwZXIgfSBmcm9tICcuL2p3dC1oZWxwZXIuY2xhc3MnO1xuaW1wb3J0IHsgUmVzdFNlcnZpY2VDb25maWcsIFR5cGVUb2tlblN0b3JhZ2UgfSBmcm9tICcuL25neC1yZXN0LmNvbmZpZyc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFJlc3RDbGllbnRTZXJ2aWNlIHtcbiAgLyoqIEhhbmRsZXIgdXNlZCB0byBzdG9wIGFsbCBwZW5kaW5nIHJlcXVlc3RzICovXG4gIHByb3RlY3RlZCBjYW5jZWxQZW5kaW5nJDogU3ViamVjdDxib29sZWFuPiA9IG5ldyBTdWJqZWN0PGJvb2xlYW4+KCk7XG5cbiAgLyoqICBEZWZhdWx0IHJlcXVlc3RzIGhlYWRlciAqL1xuICBwcm90ZWN0ZWQgYmFzZUhlYWRlciA9IHtcbiAgICAnQ2FjaGUtQ29udHJvbCc6ICduby1jYWNoZScsXG4gICAgYWNjZXB0OiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgUHJhZ21hOiAnbm8tY2FjaGUnLFxuICAgIEF1dGhvcml6YXRpb246ICcnLFxuICAgICdBY2NlcHQtTGFuZ3VhZ2UnOiAnKidcbiAgfTtcblxuICAvKiogU2VydmljZSBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnMgKi9cbiAgcHJvdGVjdGVkIGNvbmZpZzogUmVzdFNlcnZpY2VDb25maWc7XG5cbiAgLyoqIFdoZW4gdHJ1ZSwgdGhlIHJlcXVlc3QgaGVhZGVyIHdpbGwgaW5jbHVkZSB0aGUgYXV0aGVudGljYXRpb24gdG9rZW4gKi9cbiAgcHJvdGVjdGVkIHNlY3VyZVJlcXVlc3QgPSBmYWxzZTtcblxuICAvKiogSG9sZHMgYSBsaXN0IG9mIGZpbGVzIHRvIGJlIHVwbG9hZCBvbiByZXF1ZXN0ICovXG4gIHByb3RlY3RlZCB3aXRoRmlsZXNSZXF1ZXN0ID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LFxuICAgIHByaXZhdGUgY29va2llczogQ29va2llU2VydmljZSxcbiAgICBwcml2YXRlIHJlYWRvbmx5IHJvdXRlcjogUm91dGVyLFxuICAgIEBPcHRpb25hbCgpIGNvbmZpZzogUmVzdFNlcnZpY2VDb25maWdcbiAgKSB7XG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICBlbmRQb2ludDogJycsXG4gICAgICB0b2tlbk5hbWU6ICdBdXRoVG9rZW4nLFxuICAgICAgdG9rZW5TdG9yYWdlOiBUeXBlVG9rZW5TdG9yYWdlLmNvb2tpZSxcbiAgICAgIHNlY3VyZUNvb2tpZTogZmFsc2UsXG4gICAgICBtb2NrRGF0YTogZmFsc2UsXG4gICAgICB2YWxpZGF0aW9uVG9rZW5Vcmk6ICcvaW5mbycsXG4gICAgICBhdXRoVXJpOiAnL2F1dGhlbnRpY2F0ZScsXG4gICAgICBVbmF1dGhvcml6ZWRSZWRpcmVjdFVyaTogbnVsbFxuICAgIH0gYXMgUmVzdFNlcnZpY2VDb25maWc7XG5cbiAgICBpZiAoY29uZmlnKSB7XG4gICAgICB0aGlzLnNldENvbmZpZyhjb25maWcpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIFJlc3QgQ2xpZW50IGNvbmZpZ3VyYXRpb24gcGFyYW1ldGVycy5cbiAgICpcbiAgICogQ0FVVElPTjogVGhpcyBtZXRob2Qgb3ZlcnJpZGVzIHRoZSBjdXJyZW50IGNvbmZpZ3VyYXRpb24gc2V0dGluZ3NcbiAgICogYW5kIHRoaXMgc2V0dGluZ3Mgd2lsbCBhcHBseSB0byBhbGwgZm9sbG93aW5nIHJlcXVlc3RzXG4gICAqL1xuICBwdWJsaWMgc2V0Q29uZmlnKGNvbmZpZzogUmVzdFNlcnZpY2VDb25maWcpOiBSZXN0Q2xpZW50U2VydmljZSB7XG4gICAgdGhpcy5jb25maWcgPSB7IC4uLnRoaXMuY29uZmlnLCAuLi5jb25maWcgfSBhcyBSZXN0U2VydmljZUNvbmZpZztcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKiBSZXR1cm4gdGhlIGN1cnJlbnQgUmVzdCBDbGllbnQgY29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzLiAgKi9cbiAgcHVibGljIGdldENvbmZpZygpOiBSZXN0U2VydmljZUNvbmZpZyB7XG4gICAgcmV0dXJuIHRoaXMuY29uZmlnO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgQVBJIFRva2VuIGZyb20gY29va2llc1xuICAgKi9cbiAgcHVibGljIGdldCB0b2tlbigpOiBzdHJpbmcge1xuICAgIGxldCB0b2tlbiA9ICcnO1xuXG4gICAgc3dpdGNoICh0aGlzLmNvbmZpZy50b2tlblN0b3JhZ2UpIHtcbiAgICAgIGNhc2UgVHlwZVRva2VuU3RvcmFnZS5jb29raWU6XG4gICAgICAgIHRva2VuID0gdGhpcy5jb29raWVzLmdldCh0aGlzLmNvbmZpZy50b2tlbk5hbWUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVHlwZVRva2VuU3RvcmFnZS5sb2NhbFN0b3JhZ2U6XG4gICAgICAgIHRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5jb25maWcudG9rZW5OYW1lKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFR5cGVUb2tlblN0b3JhZ2Uuc2Vzc2lvblN0b3JhZ2U6XG4gICAgICAgIHRva2VuID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmNvbmZpZy50b2tlbk5hbWUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBUb2tlbiBTdG9yYWdlIG1ldGhvZCcpO1xuICAgIH1cblxuICAgIHJldHVybiAhdG9rZW4gfHwgdHlwZW9mIHRva2VuID09PSAndW5kZWZpbmVkJyA/ICcnIDogdG9rZW47XG4gIH1cblxuICAvKipcbiAgICogU2F2ZSB0aGUgQVBJIFRva2VuIGNvb2tpZVxuICAgKi9cbiAgcHVibGljIHNldCB0b2tlbih0b2tlbjogc3RyaW5nKSB7XG4gICAgY29uc3QgZGVjb2RlZCA9IEp3dEhlbHBlci5kZWNvZGVUb2tlbih0b2tlbik7XG4gICAgY29uc3QgZXhwaXJlcyA9IGZyb21Vbml4VGltZShkZWNvZGVkLmV4cCk7XG5cbiAgICBzd2l0Y2ggKHRoaXMuY29uZmlnLnRva2VuU3RvcmFnZSkge1xuICAgICAgY2FzZSBUeXBlVG9rZW5TdG9yYWdlLmNvb2tpZTpcbiAgICAgICAgdGhpcy5jb29raWVzLnB1dChcbiAgICAgICAgICB0aGlzLmNvbmZpZy50b2tlbk5hbWUsXG4gICAgICAgICAgdG9rZW4sXG4gICAgICAgICAgeyBzZWN1cmU6IHRoaXMuY29uZmlnLnNlY3VyZUNvb2tpZSwgZXhwaXJlcyB9XG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBUeXBlVG9rZW5TdG9yYWdlLmxvY2FsU3RvcmFnZTpcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5jb25maWcudG9rZW5OYW1lLCB0b2tlbik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBUeXBlVG9rZW5TdG9yYWdlLnNlc3Npb25TdG9yYWdlOlxuICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKHRoaXMuY29uZmlnLnRva2VuTmFtZSwgdG9rZW4pO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBUb2tlbiBTdG9yYWdlIG1ldGhvZCcpO1xuICAgIH1cbiAgfVxuXG5cbiAgLyoqXG4gICAqIFJlbW92ZSB0aGUgQXV0aGVudGljYXRpb24gdG9rZW4gY29va2llXG4gICAqL1xuICBwdWJsaWMgcmV2b2tlKCk6IHZvaWQge1xuICAgIHN3aXRjaCAodGhpcy5jb25maWcudG9rZW5TdG9yYWdlKSB7XG4gICAgICBjYXNlIFR5cGVUb2tlblN0b3JhZ2UuY29va2llOlxuICAgICAgICB0aGlzLmNvb2tpZXMucmVtb3ZlQWxsKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBUeXBlVG9rZW5TdG9yYWdlLmxvY2FsU3RvcmFnZTpcbiAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy5jb25maWcudG9rZW5OYW1lKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFR5cGVUb2tlblN0b3JhZ2Uuc2Vzc2lvblN0b3JhZ2U6XG4gICAgICAgIHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy5jb25maWcudG9rZW5OYW1lKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgVG9rZW4gU3RvcmFnZSBtZXRob2QnKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVxdWVzdCBhbiBBdXRob3JpemF0aW9uIHRva2VuXG4gICAqIFRoZSBkZWZhdWx0IGF1dGhvcml6YXRpb24gVVJJIGlzICdbQVBJX0VORF9QT0lOVF0vYXV0aG9yaXplJ1xuICAgKiBAcGFyYW0gdXNlcm5hbWUgVXNlcm5hbWVcbiAgICogQHBhcmFtIHBhc3N3b3JkIFBhc3N3b3JkXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgYXV0aGVudGljYXRlYCBtZXRob2QgaW5zdGVhZFxuICAgKi9cbiAgcHVibGljIGF1dGhvcml6ZSh1c2VybmFtZTogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5hdXRoZW50aWNhdGUodXNlcm5hbWUsIHBhc3N3b3JkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXF1ZXN0IGFuIGF1dGhlbnRpY2F0aW9uIHRva2VuXG4gICAqIFRoZSBkZWZhdWx0IGF1dGhlbnRpY2F0aW9uIFVSSSBpcyAnW0FQSV9FTkRfUE9JTlRdL2F1dGhlbnRpY2F0ZSdcbiAgICogQHBhcmFtIHVzZXJuYW1lIFVzZXJuYW1lXG4gICAqIEBwYXJhbSBwYXNzd29yZCBQYXNzd29yZFxuICAgKi9cbiAgcHVibGljIGF1dGhlbnRpY2F0ZSh1c2VybmFtZTogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5wb3N0KHRoaXMuY29uZmlnLmF1dGhVcmksIHsgdXNlcm5hbWUsIHBhc3N3b3JkIH0pXG4gICAgICAucGlwZShcbiAgICAgICAgdGFwKHBheWxvYWQgPT4ge1xuICAgICAgICAgIHRoaXMudG9rZW4gPSBwYXlsb2FkO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgfVxuXG4gIC8qKiBWYWxpZGF0ZSB0aGUgQXV0aGVudGljYXRpb24gdG9rZW4gYWdhaW5zdCB0aGUgQVBJICovXG4gIHB1YmxpYyB2YWxpZGF0ZVRva2VuKHVybDogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5zZWN1cmVkKCkucmVxdWVzdChIdHRwTWV0aG9kLlBvc3QsIHVybCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhdXRob3JpemF0aW9uIHRva2VuXG4gICAqIEBwYXJhbSB1cmwgYSB1cmwgdG8gcmVwb3J0IHRvXG4gICAqIEBkZXByZWNhdGVkIHVzZSBgZGVhdXRoZW50aWNhdGVgIG1ldGhvZCBpbnN0ZWFkXG4gICAqL1xuICBwdWJsaWMgZGVhdXRob3JpemUodXJsOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLmRlYXV0aGVudGljYXRlKHVybCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhdXRob3JpemF0aW9uIHRva2VuIGFuZCByZXBvcnRzIGxvZ291dCB0byB0aGUgc2VydmVyXG4gICAqIEBwYXJhbSB1cmwgYSB1cmwgdG8gcmVwb3J0IHRvXG4gICAqL1xuICBwdWJsaWMgZGVhdXRoZW50aWNhdGUodXJsOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLnNlY3VyZWQoKS5yZXF1ZXN0KEh0dHBNZXRob2QuR2V0LCB1cmwpXG4gICAgICAucGlwZShcbiAgICAgICAgdGFwKCgpID0+IHtcbiAgICAgICAgICB0aGlzLnJldm9rZSgpO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgY2xpZW50IGlzIGFscmVhZHkgYXV0aGVudGljYXRlZFxuICAgKiBAZGVwcmVjYXRlZCB1c2UgYGlzQXV0aGVudGljYXRlZGAgbWV0aG9kIGluc3RlYWRcbiAgICovXG4gIHB1YmxpYyBpc0F1dGhvcml6ZWQoKTogYm9vbGVhbiB7XG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLnRva2VuO1xuICAgIGNvbnN0IGRlY29kZWQgPSBKd3RIZWxwZXIuZGVjb2RlVG9rZW4odG9rZW4pO1xuICAgIHJldHVybiBkZWNvZGVkICE9PSBudWxsICYmICFpc0FmdGVyKG5ldyBEYXRlKCksIGZyb21Vbml4VGltZShkZWNvZGVkLmV4cCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBjbGllbnQgaXMgYWxyZWFkeSBhdXRoZW50aWNhdGVkXG4gICAqL1xuICBwdWJsaWMgaXNBdXRoZW50aWNhdGVkKCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy50b2tlbjtcbiAgICBjb25zdCBkZWNvZGVkID0gSnd0SGVscGVyLmRlY29kZVRva2VuKHRva2VuKTtcbiAgICByZXR1cm4gZGVjb2RlZCAhPT0gbnVsbCAmJiAhaXNBZnRlcihuZXcgRGF0ZSgpLCBmcm9tVW5peFRpbWUoZGVjb2RlZC5leHApKTtcbiAgfVxuXG4gIC8qKiBDYW5jZWwgYWxsIHBlbmRpbmcgcmVxdWVzdHMgKi9cbiAgcHVibGljIGNhbmNlbFBlbmRpbmdSZXF1ZXN0cygpOiB2b2lkIHtcbiAgICB0aGlzLmNhbmNlbFBlbmRpbmckLm5leHQodHJ1ZSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSByZXF1ZXN0IG1vZGUgdG8gU0VDVVJFRCBmb3IgdGhlIG5leHQgcmVxdWVzdC5cbiAgICpcbiAgICogU2VjdXJlZCBNb2RlIGZvcmNlIHRoZSBuZXh0IHJlcXVlc3QgdG8gaW5jbHVkZSB0aGUgYXV0aGVudGljYXRpb24gdG9rZW4uXG4gICAqIFRoZSB0b2tlbiBtdXN0IGJlIHJlcXVlc3RlZCBwcmV2aW91c2x5IHVzaW5nIHRoZSBcImF1dGhvcml6ZVwiIG1ldGhvZC5cbiAgICovXG4gIHB1YmxpYyBzZWN1cmVkKCk6IFJlc3RDbGllbnRTZXJ2aWNlIHtcbiAgICB0aGlzLnNlY3VyZVJlcXVlc3QgPSB0cnVlO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSByZXF1ZXN0IG1vZGUgdG8gUFVCTElDIGZvciB0aGUgbmV4dCByZXF1ZXN0LlxuICAgKlxuICAgKiBQdWJsaWMgaXMgdGhlIGRlZmF1bHQgcmVxdWVzdCBtb2RlIGFuZCBlbnN1cmUgdGhhdCBubyBhdXRoZW50aWNhdGlvbiB0b2tlblxuICAgKiB3aWxsIGJlIHBhc3Mgb24gdGhlIG5leHQgcmVxdWVzdC5cbiAgICovXG4gIHB1YmxpYyBwdWJsaWMoKTogUmVzdENsaWVudFNlcnZpY2Uge1xuICAgIHRoaXMuc2VjdXJlUmVxdWVzdCA9IGZhbHNlO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQVBJIHJlcXVlc3QgdXNpbmcgR0VUIG1ldGhvZFxuICAgKlxuICAgKiBAcGFyYW0gdXJsXG4gICAqIEBwYXJhbSBkYXRhIEEgbGlzdCBvZiBwYXJhbWV0ZXNcbiAgICovXG4gIHB1YmxpYyBnZXQodXJsOiBzdHJpbmcsIGRhdGE/OiB7fSk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChIdHRwTWV0aG9kLkdldCwgdXJsLCBkYXRhKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBUEkgcmVxdWVzdCB1c2luZyBQT1NUIG1ldGhvZFxuICAgKlxuICAgKiBAcGFyYW0gdXJsXG4gICAqIEBwYXJhbSBkYXRhXG4gICAqIEBwYXJhbSByZXNwb25zZVR5cGVcbiAgICogQHBhcmFtIGh0dHBPcHRpb25zXG4gICAqL1xuICBwdWJsaWMgcG9zdCh1cmw6IHN0cmluZywgZGF0YT86IHt9LCByZXNwb25zZVR5cGU/OiBzdHJpbmcsIGh0dHBPcHRpb25zOiBJSHR0cE9wdGlvbnMgPSB7fSk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChIdHRwTWV0aG9kLlBvc3QsIHVybCwgZGF0YSwgcmVzcG9uc2VUeXBlLCBodHRwT3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQVBJIHJlcXVlc3QgdXNpbmcgUFVUIG1ldGhvZFxuICAgKlxuICAgKiBAcGFyYW0gdXJsXG4gICAqIEBwYXJhbSBkYXRhXG4gICAqIEBwYXJhbSByZXNwb25zZVR5cGVcbiAgICogQHBhcmFtIGh0dHBPcHRpb25zXG4gICAqL1xuICBwdWJsaWMgcHV0KHVybDogc3RyaW5nLCBkYXRhPzoge30sIHJlc3BvbnNlVHlwZT86IHN0cmluZywgaHR0cE9wdGlvbnM6IElIdHRwT3B0aW9ucyA9IHt9KTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KEh0dHBNZXRob2QuUHV0LCB1cmwsIGRhdGEsIHJlc3BvbnNlVHlwZSwgaHR0cE9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFQSSByZXF1ZXN0IHVzaW5nIERFTEVURSBtZXRob2RcbiAgICpcbiAgICogQHBhcmFtIHVybFxuICAgKiBAcGFyYW0gZGF0YVxuICAgKiBAcGFyYW0gcmVzcG9uc2VUeXBlXG4gICAqL1xuICBwdWJsaWMgZGVsZXRlKHVybDogc3RyaW5nLCBkYXRhPzoge30sIHJlc3BvbnNlVHlwZT86IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChIdHRwTWV0aG9kLkRlbGV0ZSwgdXJsLCBkYXRhLCByZXNwb25zZVR5cGUpO1xuICB9XG5cbiAgLyoqIFNldCB0aGUgdXBsb2FkIGZpbGUgbW9kZSAqL1xuICBwdWJsaWMgd2l0aEZpbGVzKCk6IFJlc3RDbGllbnRTZXJ2aWNlIHtcbiAgICB0aGlzLndpdGhGaWxlc1JlcXVlc3QgPSB0cnVlO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgRm9ybURhdGEgb2JqZWN0IHRvIGJlIHNlbmQgYXMgcmVxdWVzdCBwYXlsb2FkIGRhdGFcbiAgICovXG4gIHByb3RlY3RlZCBjcmVhdGVGb3JtRGF0YShvYmplY3Q6IGFueSwgZm9ybT86IEZvcm1EYXRhLCBuYW1lc3BhY2U/OiBzdHJpbmcpOiBGb3JtRGF0YSB7XG4gICAgY29uc3QgZm9ybURhdGEgPSBmb3JtIHx8IG5ldyBGb3JtRGF0YSgpO1xuXG4gICAgZm9yIChjb25zdCBwcm9wZXJ0eSBpbiBvYmplY3QpIHtcblxuICAgICAgaWYgKCFvYmplY3QuaGFzT3duUHJvcGVydHkocHJvcGVydHkpIHx8ICFvYmplY3RbcHJvcGVydHldKSB7IGNvbnRpbnVlOyB9XG5cbiAgICAgIGNvbnN0IGZvcm1LZXkgPSBuYW1lc3BhY2UgPyBgJHtuYW1lc3BhY2V9WyR7cHJvcGVydHl9XWAgOiBwcm9wZXJ0eTtcbiAgICAgIGlmIChvYmplY3RbcHJvcGVydHldIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICBmb3JtRGF0YS5hcHBlbmQoZm9ybUtleSwgb2JqZWN0W3Byb3BlcnR5XS50b0lTT1N0cmluZygpKTtcbiAgICAgIH0gZWxzZSBpZiAob2JqZWN0W3Byb3BlcnR5XSBpbnN0YW5jZW9mIEZpbGVMaXN0KSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb2JqZWN0W3Byb3BlcnR5XS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChgJHtwcm9wZXJ0eX1bXWAsIG9iamVjdFtwcm9wZXJ0eV0uaXRlbShpKSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIHR5cGVvZiBvYmplY3RbcHJvcGVydHldID09PSAnb2JqZWN0JyAmJiAhKG9iamVjdFtwcm9wZXJ0eV0gaW5zdGFuY2VvZiBGaWxlKSkge1xuICAgICAgICB0aGlzLmNyZWF0ZUZvcm1EYXRhKG9iamVjdFtwcm9wZXJ0eV0sIGZvcm1EYXRhLCBmb3JtS2V5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZChmb3JtS2V5LCBvYmplY3RbcHJvcGVydHldKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZvcm1EYXRhO1xuICB9XG5cblxuXG4gIHByb3RlY3RlZCBidWlsZFVybCh1cmw6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgZW5kUG9pbnQgPSB0aGlzLmNvbmZpZy5tb2NrRGF0YSA/ICdhc3NldHMvbW9jay1kYXRhJyA6IHRoaXMuY29uZmlnLmVuZFBvaW50LnJlcGxhY2UoL1xcLyQvLCAnJyk7XG5cbiAgICBsZXQgblVybCA9IGAke2VuZFBvaW50fS8ke3VybC5yZXBsYWNlKC9eXFwvL2csICcnKX1gO1xuICAgIGNvbnN0IG1hdGNoID0gblVybC5tYXRjaCgvXFwuKFswLTlhLXpdKykoPzpbXFw/I118JCkvaSk7XG5cbiAgICBpZiAodGhpcy5jb25maWcubW9ja0RhdGEgJiYgbWF0Y2ggPT0gbnVsbCkge1xuICAgICAgblVybCA9IGAke25Vcmx9Lmpzb25gO1xuICAgIH1cblxuICAgIHJldHVybiBuVXJsO1xuICB9XG5cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSByZXF1ZXN0IGhlYWRlcnMgYmFzZWQgb24gY29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzXG4gICAqL1xuICBwcml2YXRlIGJ1aWxkSGVhZGVycygpIHtcbiAgICBjb25zdCBoZWFkZXIgPSB7IC4uLnRoaXMuYmFzZUhlYWRlciB9O1xuXG4gICAgaWYgKHRoaXMuY29uZmlnLmxhbmd1YWdlKSB7IGhlYWRlclsnQWNjZXB0LUxhbmd1YWdlJ10gPSB0aGlzLmNvbmZpZy5sYW5ndWFnZTsgfVxuXG4gICAgaWYgKHRoaXMuc2VjdXJlUmVxdWVzdCkge1xuICAgICAgY29uc3QgdG9rZW4gPSB0aGlzLnRva2VuO1xuICAgICAgaWYgKCF0b2tlbikge1xuICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgJ0V4ZWN1dGluZyBhIHNlY3VyZSByZXF1ZXN0IHdpdGhvdXQgVE9LRU4uICdcbiAgICAgICAgICArICdBdXRob3JpemF0aW9uIGhlYWRlciB3aWxsIG5vdCBiZSBzZXQhJ1xuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaGVhZGVyLkF1dGhvcml6YXRpb24gPSBgQmVhcmVyICR7dG9rZW59YDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZWN1cmVSZXF1ZXN0ID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIGhlYWRlcjtcbiAgfVxuXG5cblxuICAvKiogUmF3IHJlcXVlc3QgbWV0aG9kICovXG4gIHByb3RlY3RlZCByZXF1ZXN0KFxuICAgIG1ldGhvZDogSHR0cE1ldGhvZCwgdXJsOiBzdHJpbmcsIGRhdGE/OiBhbnksIHJlc3BvbnNlVHlwZT86IHN0cmluZyxcbiAgICBodHRwT3B0aW9uczogSUh0dHBPcHRpb25zID0ge31cbiAgKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICBjb25zdCBtc0RlbGF5ID0gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDIwMDApICsgMTAwMCk7XG4gICAgY29uc3QgaGVhZGVyID0gdGhpcy5idWlsZEhlYWRlcnMoKTtcblxuICAgIGNvbnN0IHJUeXBlID0gKHJlc3BvbnNlVHlwZSA/IHJlc3BvbnNlVHlwZSA6ICdqc29uJykgYXMgJ3RleHQnO1xuXG4gICAgaWYgKHRoaXMud2l0aEZpbGVzUmVxdWVzdCkgeyBkYXRhID0gdGhpcy5jcmVhdGVGb3JtRGF0YShkYXRhKTsgdGhpcy53aXRoRmlsZXNSZXF1ZXN0ID0gZmFsc2U7IH1cblxuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICBib2R5OiBtZXRob2QgPT09IEh0dHBNZXRob2QuR2V0ID8ge30gOiBkYXRhLFxuICAgICAgcmVzcG9uc2VUeXBlOiByVHlwZSxcbiAgICAgIHBhcmFtczogbWV0aG9kID09PSBIdHRwTWV0aG9kLkdldCA/IGRhdGEgOiB7fSxcbiAgICAgIGhlYWRlcnM6IGhlYWRlclxuICAgIH07XG5cbiAgICByZXR1cm4gdGhpcy5odHRwXG4gICAgICAucmVxdWVzdChcbiAgICAgICAgdGhpcy5jb25maWcubW9ja0RhdGEgPyBIdHRwTWV0aG9kLkdldCA6IG1ldGhvZCwgdGhpcy5idWlsZFVybCh1cmwpLFxuICAgICAgICB7IC4uLm9wdGlvbnMsIC4uLmh0dHBPcHRpb25zIH1cbiAgICAgIClcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLmNhbmNlbFBlbmRpbmckKSlcbiAgICAgIC5waXBlKGRlbGF5KHRoaXMuY29uZmlnLm1vY2tEYXRhID8gbXNEZWxheSA6IDApKVxuICAgICAgLnBpcGUoY2F0Y2hFcnJvcigoZXJyKSA9PiB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICB0aGlzLmNvbmZpZy5VbmF1dGhlbnRpY2F0ZWRSZWRpcmVjdFVyaVxuICAgICAgICAgICYmIHVybCAhPT0gdGhpcy5jb25maWcuYXV0aFVyaVxuICAgICAgICAgICYmIGVyci5zdGF0dXMgPT09IDQwMVxuICAgICAgICApIHtcbiAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbdGhpcy5jb25maWcuVW5hdXRoZW50aWNhdGVkUmVkaXJlY3RVcmldKS50aGVuKCgpID0+IHsgfSk7XG4gICAgICAgICAgdGhpcy5jYW5jZWxQZW5kaW5nUmVxdWVzdHMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChcbiAgICAgICAgICB0aGlzLmNvbmZpZy5VbmF1dGhvcml6ZWRSZWRpcmVjdFVyaVxuICAgICAgICAgICYmIHVybCAhPT0gdGhpcy5jb25maWcuYXV0aFVyaVxuICAgICAgICAgICYmIGVyci5zdGF0dXMgPT09IDQwM1xuICAgICAgICApIHtcbiAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbdGhpcy5jb25maWcuVW5hdXRob3JpemVkUmVkaXJlY3RVcmldKS50aGVuKCgpID0+IHsgfSk7XG4gICAgICAgICAgdGhpcy5jYW5jZWxQZW5kaW5nUmVxdWVzdHMoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnIpO1xuICAgICAgfSkpO1xuICB9XG59XG4iXX0=