import { __decorate, __param } from "tslib";
import { Injectable, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie';
import { Subject, throwError } from 'rxjs';
import { takeUntil, tap, catchError, delay } from 'rxjs/operators';
import { isAfter, fromUnixTime } from 'date-fns';
import { HttpMethod } from './http-method.enum';
import { JwtHelper } from './jwt-helper.class';
import { RestServiceConfig, TypeTokenStorage } from './ngx-rest.config';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "ngx-cookie";
import * as i3 from "@angular/router";
import * as i4 from "./ngx-rest.config";
let RestClientService = class RestClientService {
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
     * API request using PATCH method
     *
     * @param url
     * @param data
     * @param responseType
     * @param httpOptions
     */
    patch(url, data, responseType, httpOptions = {}) {
        return this.request(HttpMethod.Patch, url, data, responseType, httpOptions);
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
};
RestClientService.ctorParameters = () => [
    { type: HttpClient },
    { type: CookieService },
    { type: Router },
    { type: RestServiceConfig, decorators: [{ type: Optional }] }
];
RestClientService.ɵprov = i0.ɵɵdefineInjectable({ factory: function RestClientService_Factory() { return new RestClientService(i0.ɵɵinject(i1.HttpClient), i0.ɵɵinject(i2.CookieService), i0.ɵɵinject(i3.Router), i0.ɵɵinject(i4.RestServiceConfig, 8)); }, token: RestClientService, providedIn: "root" });
RestClientService = __decorate([
    Injectable({
        providedIn: 'root'
    }),
    __param(3, Optional())
], RestClientService);
export { RestClientService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXJlc3Quc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1yZXN0LyIsInNvdXJjZXMiOlsibGliL25neC1yZXN0LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDbEQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUMzQyxPQUFPLEVBQWMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUN2RCxPQUFPLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbkUsT0FBTyxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFHakQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUMvQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQzs7Ozs7O0FBS3hFLElBQWEsaUJBQWlCLEdBQTlCLE1BQWEsaUJBQWlCO0lBc0I1QixZQUNVLElBQWdCLEVBQ2hCLE9BQXNCLEVBQ2IsTUFBYyxFQUNuQixNQUF5QjtRQUg3QixTQUFJLEdBQUosSUFBSSxDQUFZO1FBQ2hCLFlBQU8sR0FBUCxPQUFPLENBQWU7UUFDYixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBeEJqQyxnREFBZ0Q7UUFDdEMsbUJBQWMsR0FBcUIsSUFBSSxPQUFPLEVBQVcsQ0FBQztRQUVwRSwrQkFBK0I7UUFDckIsZUFBVSxHQUFHO1lBQ3JCLGVBQWUsRUFBRSxVQUFVO1lBQzNCLE1BQU0sRUFBRSxrQkFBa0I7WUFDMUIsTUFBTSxFQUFFLFVBQVU7WUFDbEIsYUFBYSxFQUFFLEVBQUU7WUFDakIsaUJBQWlCLEVBQUUsR0FBRztTQUN2QixDQUFDO1FBS0YsMEVBQTBFO1FBQ2hFLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBRWhDLG9EQUFvRDtRQUMxQyxxQkFBZ0IsR0FBRyxLQUFLLENBQUM7UUFRakMsSUFBSSxDQUFDLE1BQU0sR0FBRztZQUNaLFFBQVEsRUFBRSxFQUFFO1lBQ1osU0FBUyxFQUFFLFdBQVc7WUFDdEIsWUFBWSxFQUFFLGdCQUFnQixDQUFDLE1BQU07WUFDckMsWUFBWSxFQUFFLEtBQUs7WUFDbkIsUUFBUSxFQUFFLEtBQUs7WUFDZixrQkFBa0IsRUFBRSxPQUFPO1lBQzNCLE9BQU8sRUFBRSxlQUFlO1lBQ3hCLHVCQUF1QixFQUFFLElBQUk7U0FDVCxDQUFDO1FBRXZCLElBQUksTUFBTSxFQUFFO1lBQ1YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUN4QjtJQUNILENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLFNBQVMsQ0FBQyxNQUF5QjtRQUN4QyxJQUFJLENBQUMsTUFBTSxHQUFHLGdDQUFLLElBQUksQ0FBQyxNQUFNLEdBQUssTUFBTSxDQUF1QixDQUFDO1FBQ2pFLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELGdFQUFnRTtJQUN6RCxTQUFTO1FBQ2QsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3JCLENBQUM7SUFFRDs7T0FFRztJQUNILElBQVcsS0FBSztRQUNkLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUVmLFFBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUU7WUFDaEMsS0FBSyxnQkFBZ0IsQ0FBQyxNQUFNO2dCQUMxQixLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDaEQsTUFBTTtZQUNSLEtBQUssZ0JBQWdCLENBQUMsWUFBWTtnQkFDaEMsS0FBSyxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDcEQsTUFBTTtZQUNSLEtBQUssZ0JBQWdCLENBQUMsY0FBYztnQkFDbEMsS0FBSyxHQUFHLGNBQWMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDdEQsTUFBTTtZQUNSO2dCQUNFLE1BQU0sSUFBSSxLQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQztTQUNuRDtRQUVELE9BQU8sQ0FBQyxLQUFLLElBQUksT0FBTyxLQUFLLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUM3RCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUFXLEtBQUssQ0FBQyxLQUFhO1FBQzVCLE1BQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDN0MsTUFBTSxPQUFPLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUUxQyxRQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFO1lBQ2hDLEtBQUssZ0JBQWdCLENBQUMsTUFBTTtnQkFDMUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQ2QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQ3JCLEtBQUssRUFDTCxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxPQUFPLEVBQUUsQ0FDOUMsQ0FBQztnQkFDRixNQUFNO1lBQ1IsS0FBSyxnQkFBZ0IsQ0FBQyxZQUFZO2dCQUNoQyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNuRCxNQUFNO1lBQ1IsS0FBSyxnQkFBZ0IsQ0FBQyxjQUFjO2dCQUNsQyxjQUFjLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNyRCxNQUFNO1lBQ1I7Z0JBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO1NBQ25EO0lBQ0gsQ0FBQztJQUdEOztPQUVHO0lBQ0ksTUFBTTtRQUNYLFFBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUU7WUFDaEMsS0FBSyxnQkFBZ0IsQ0FBQyxNQUFNO2dCQUMxQixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUN6QixNQUFNO1lBQ1IsS0FBSyxnQkFBZ0IsQ0FBQyxZQUFZO2dCQUNoQyxZQUFZLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQy9DLE1BQU07WUFDUixLQUFLLGdCQUFnQixDQUFDLGNBQWM7Z0JBQ2xDLGNBQWMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDakQsTUFBTTtZQUNSO2dCQUNFLE1BQU0sSUFBSSxLQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQztTQUNuRDtJQUNILENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxTQUFTLENBQUMsUUFBZ0IsRUFBRSxRQUFnQjtRQUNqRCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLFlBQVksQ0FBQyxRQUFnQixFQUFFLFFBQWdCO1FBQ3BELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsQ0FBQzthQUMxRCxJQUFJLENBQ0gsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1osSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQ0gsQ0FBQztJQUNOLENBQUM7SUFFRCx3REFBd0Q7SUFDakQsYUFBYSxDQUFDLEdBQVc7UUFDOUIsT0FBTyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxXQUFXLENBQUMsR0FBVztRQUM1QixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVEOzs7T0FHRztJQUNJLGNBQWMsQ0FBQyxHQUFXO1FBQy9CLE9BQU8sSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQzthQUMvQyxJQUFJLENBQ0gsR0FBRyxDQUFDLEdBQUcsRUFBRTtZQUNQLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNoQixDQUFDLENBQUMsQ0FDSCxDQUFDO0lBQ04sQ0FBQztJQUVEOzs7T0FHRztJQUNJLFlBQVk7UUFDakIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN6QixNQUFNLE9BQU8sR0FBRyxTQUFTLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzdDLE9BQU8sT0FBTyxLQUFLLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksRUFBRSxFQUFFLFlBQVksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUM3RSxDQUFDO0lBRUQ7O09BRUc7SUFDSSxlQUFlO1FBQ3BCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDekIsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM3QyxPQUFPLE9BQU8sS0FBSyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLEVBQUUsRUFBRSxZQUFZLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDN0UsQ0FBQztJQUVELGtDQUFrQztJQUMzQixxQkFBcUI7UUFDMUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksT0FBTztRQUNaLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1FBRTFCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksTUFBTTtRQUNYLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO1FBRTNCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksR0FBRyxDQUFDLEdBQVcsRUFBRSxJQUFTO1FBQy9CLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNJLElBQUksQ0FBQyxHQUFXLEVBQUUsSUFBUyxFQUFFLFlBQXFCLEVBQUUsY0FBNEIsRUFBRTtRQUN2RixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxXQUFXLENBQUMsQ0FBQztJQUM3RSxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNJLEdBQUcsQ0FBQyxHQUFXLEVBQUUsSUFBUyxFQUFFLFlBQXFCLEVBQUUsY0FBNEIsRUFBRTtRQUN0RixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxXQUFXLENBQUMsQ0FBQztJQUM1RSxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNJLEtBQUssQ0FBQyxHQUFXLEVBQUUsSUFBUyxFQUFFLFlBQXFCLEVBQUUsY0FBNEIsRUFBRTtRQUN4RixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxXQUFXLENBQUMsQ0FBQztJQUM5RSxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksTUFBTSxDQUFDLEdBQVcsRUFBRSxJQUFTLEVBQUUsWUFBcUI7UUFDekQsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRUQsK0JBQStCO0lBQ3hCLFNBQVM7UUFDZCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO1FBRTdCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVEOztPQUVHO0lBQ08sY0FBYyxDQUFDLE1BQVcsRUFBRSxJQUFlLEVBQUUsU0FBa0I7UUFDdkUsTUFBTSxRQUFRLEdBQUcsSUFBSSxJQUFJLElBQUksUUFBUSxFQUFFLENBQUM7UUFFeEMsS0FBSyxNQUFNLFFBQVEsSUFBSSxNQUFNLEVBQUU7WUFFN0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQUUsU0FBUzthQUFFO1lBRXhFLE1BQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztZQUNuRSxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsWUFBWSxJQUFJLEVBQUU7Z0JBQ3BDLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO2FBQzFEO2lCQUFNLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxZQUFZLFFBQVEsRUFBRTtnQkFDL0MsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ2hELFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxRQUFRLElBQUksRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQzVEO2FBQ0Y7aUJBQU0sSUFDTCxPQUFPLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxRQUFRLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsWUFBWSxJQUFJLENBQUMsRUFBRTtnQkFDN0UsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBQzFEO2lCQUFNO2dCQUNMLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2FBQzVDO1NBQ0Y7UUFDRCxPQUFPLFFBQVEsQ0FBQztJQUNsQixDQUFDO0lBSVMsUUFBUSxDQUFDLEdBQVc7UUFDNUIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRXJHLElBQUksSUFBSSxHQUFHLEdBQUcsUUFBUSxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7UUFDcEQsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1FBRXRELElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLElBQUksS0FBSyxJQUFJLElBQUksRUFBRTtZQUN6QyxJQUFJLEdBQUcsR0FBRyxJQUFJLE9BQU8sQ0FBQztTQUN2QjtRQUVELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUdEOztPQUVHO0lBQ0ssWUFBWTtRQUNsQixNQUFNLE1BQU0scUJBQVEsSUFBSSxDQUFDLFVBQVUsQ0FBRSxDQUFDO1FBRXRDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUU7WUFBRSxNQUFNLENBQUMsaUJBQWlCLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztTQUFFO1FBRS9FLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUN0QixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ1YsT0FBTyxDQUFDLElBQUksQ0FDViw0Q0FBNEM7c0JBQzFDLHVDQUF1QyxDQUMxQyxDQUFDO2FBQ0g7aUJBQU07Z0JBQ0wsTUFBTSxDQUFDLGFBQWEsR0FBRyxVQUFVLEtBQUssRUFBRSxDQUFDO2FBQzFDO1lBRUQsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7U0FDNUI7UUFFRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBSUQseUJBQXlCO0lBQ2YsT0FBTyxDQUNmLE1BQWtCLEVBQUUsR0FBVyxFQUFFLElBQVUsRUFBRSxZQUFxQixFQUNsRSxjQUE0QixFQUFFO1FBRTlCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDMUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBRW5DLE1BQU0sS0FBSyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBVyxDQUFDO1FBRS9ELElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQUUsSUFBSSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7WUFBQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO1NBQUU7UUFFL0YsTUFBTSxPQUFPLEdBQUc7WUFDZCxJQUFJLEVBQUUsTUFBTSxLQUFLLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSTtZQUMzQyxZQUFZLEVBQUUsS0FBSztZQUNuQixNQUFNLEVBQUUsTUFBTSxLQUFLLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUM3QyxPQUFPLEVBQUUsTUFBTTtTQUNoQixDQUFDO1FBRUYsT0FBTyxJQUFJLENBQUMsSUFBSTthQUNiLE9BQU8sQ0FDTixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGtDQUM3RCxPQUFPLEdBQUssV0FBVyxFQUM3QjthQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2FBQ3BDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDL0MsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQ3ZCLElBQ0UsSUFBSSxDQUFDLE1BQU0sQ0FBQywwQkFBMEI7bUJBQ25DLEdBQUcsS0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU87bUJBQzNCLEdBQUcsQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUNyQjtnQkFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDL0UsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7YUFDOUI7WUFFRCxJQUNFLElBQUksQ0FBQyxNQUFNLENBQUMsdUJBQXVCO21CQUNoQyxHQUFHLEtBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPO21CQUMzQixHQUFHLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFDckI7Z0JBQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQzVFLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO2FBQzlCO1lBQ0QsT0FBTyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDekIsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNSLENBQUM7Q0FDRixDQUFBOztZQXBZaUIsVUFBVTtZQUNQLGFBQWE7WUFDTCxNQUFNO1lBQ1gsaUJBQWlCLHVCQUFwQyxRQUFROzs7QUExQkEsaUJBQWlCO0lBSDdCLFVBQVUsQ0FBQztRQUNWLFVBQVUsRUFBRSxNQUFNO0tBQ25CLENBQUM7SUEyQkcsV0FBQSxRQUFRLEVBQUUsQ0FBQTtHQTFCRixpQkFBaUIsQ0EyWjdCO1NBM1pZLGlCQUFpQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IENvb2tpZVNlcnZpY2UgfSBmcm9tICduZ3gtY29va2llJztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QsIHRocm93RXJyb3IgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHRha2VVbnRpbCwgdGFwLCBjYXRjaEVycm9yLCBkZWxheSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IGlzQWZ0ZXIsIGZyb21Vbml4VGltZSB9IGZyb20gJ2RhdGUtZm5zJztcblxuaW1wb3J0IHsgSUh0dHBPcHRpb25zIH0gZnJvbSAnLi9odHRwLW9wdGlvbnMuaW50ZXJmYWNlJztcbmltcG9ydCB7IEh0dHBNZXRob2QgfSBmcm9tICcuL2h0dHAtbWV0aG9kLmVudW0nO1xuaW1wb3J0IHsgSnd0SGVscGVyIH0gZnJvbSAnLi9qd3QtaGVscGVyLmNsYXNzJztcbmltcG9ydCB7IFJlc3RTZXJ2aWNlQ29uZmlnLCBUeXBlVG9rZW5TdG9yYWdlIH0gZnJvbSAnLi9uZ3gtcmVzdC5jb25maWcnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBSZXN0Q2xpZW50U2VydmljZSB7XG4gIC8qKiBIYW5kbGVyIHVzZWQgdG8gc3RvcCBhbGwgcGVuZGluZyByZXF1ZXN0cyAqL1xuICBwcm90ZWN0ZWQgY2FuY2VsUGVuZGluZyQ6IFN1YmplY3Q8Ym9vbGVhbj4gPSBuZXcgU3ViamVjdDxib29sZWFuPigpO1xuXG4gIC8qKiAgRGVmYXVsdCByZXF1ZXN0cyBoZWFkZXIgKi9cbiAgcHJvdGVjdGVkIGJhc2VIZWFkZXIgPSB7XG4gICAgJ0NhY2hlLUNvbnRyb2wnOiAnbm8tY2FjaGUnLFxuICAgIGFjY2VwdDogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgIFByYWdtYTogJ25vLWNhY2hlJyxcbiAgICBBdXRob3JpemF0aW9uOiAnJyxcbiAgICAnQWNjZXB0LUxhbmd1YWdlJzogJyonXG4gIH07XG5cbiAgLyoqIFNlcnZpY2UgY29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzICovXG4gIHByb3RlY3RlZCBjb25maWc6IFJlc3RTZXJ2aWNlQ29uZmlnO1xuXG4gIC8qKiBXaGVuIHRydWUsIHRoZSByZXF1ZXN0IGhlYWRlciB3aWxsIGluY2x1ZGUgdGhlIGF1dGhlbnRpY2F0aW9uIHRva2VuICovXG4gIHByb3RlY3RlZCBzZWN1cmVSZXF1ZXN0ID0gZmFsc2U7XG5cbiAgLyoqIEhvbGRzIGEgbGlzdCBvZiBmaWxlcyB0byBiZSB1cGxvYWQgb24gcmVxdWVzdCAqL1xuICBwcm90ZWN0ZWQgd2l0aEZpbGVzUmVxdWVzdCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCxcbiAgICBwcml2YXRlIGNvb2tpZXM6IENvb2tpZVNlcnZpY2UsXG4gICAgcHJpdmF0ZSByZWFkb25seSByb3V0ZXI6IFJvdXRlcixcbiAgICBAT3B0aW9uYWwoKSBjb25maWc6IFJlc3RTZXJ2aWNlQ29uZmlnXG4gICkge1xuICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgZW5kUG9pbnQ6ICcnLFxuICAgICAgdG9rZW5OYW1lOiAnQXV0aFRva2VuJyxcbiAgICAgIHRva2VuU3RvcmFnZTogVHlwZVRva2VuU3RvcmFnZS5jb29raWUsXG4gICAgICBzZWN1cmVDb29raWU6IGZhbHNlLFxuICAgICAgbW9ja0RhdGE6IGZhbHNlLFxuICAgICAgdmFsaWRhdGlvblRva2VuVXJpOiAnL2luZm8nLFxuICAgICAgYXV0aFVyaTogJy9hdXRoZW50aWNhdGUnLFxuICAgICAgVW5hdXRob3JpemVkUmVkaXJlY3RVcmk6IG51bGxcbiAgICB9IGFzIFJlc3RTZXJ2aWNlQ29uZmlnO1xuXG4gICAgaWYgKGNvbmZpZykge1xuICAgICAgdGhpcy5zZXRDb25maWcoY29uZmlnKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBSZXN0IENsaWVudCBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnMuXG4gICAqXG4gICAqIENBVVRJT046IFRoaXMgbWV0aG9kIG92ZXJyaWRlcyB0aGUgY3VycmVudCBjb25maWd1cmF0aW9uIHNldHRpbmdzXG4gICAqIGFuZCB0aGlzIHNldHRpbmdzIHdpbGwgYXBwbHkgdG8gYWxsIGZvbGxvd2luZyByZXF1ZXN0c1xuICAgKi9cbiAgcHVibGljIHNldENvbmZpZyhjb25maWc6IFJlc3RTZXJ2aWNlQ29uZmlnKTogUmVzdENsaWVudFNlcnZpY2Uge1xuICAgIHRoaXMuY29uZmlnID0geyAuLi50aGlzLmNvbmZpZywgLi4uY29uZmlnIH0gYXMgUmVzdFNlcnZpY2VDb25maWc7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKiogUmV0dXJuIHRoZSBjdXJyZW50IFJlc3QgQ2xpZW50IGNvbmZpZ3VyYXRpb24gcGFyYW1ldGVycy4gICovXG4gIHB1YmxpYyBnZXRDb25maWcoKTogUmVzdFNlcnZpY2VDb25maWcge1xuICAgIHJldHVybiB0aGlzLmNvbmZpZztcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIEFQSSBUb2tlbiBmcm9tIGNvb2tpZXNcbiAgICovXG4gIHB1YmxpYyBnZXQgdG9rZW4oKTogc3RyaW5nIHtcbiAgICBsZXQgdG9rZW4gPSAnJztcblxuICAgIHN3aXRjaCAodGhpcy5jb25maWcudG9rZW5TdG9yYWdlKSB7XG4gICAgICBjYXNlIFR5cGVUb2tlblN0b3JhZ2UuY29va2llOlxuICAgICAgICB0b2tlbiA9IHRoaXMuY29va2llcy5nZXQodGhpcy5jb25maWcudG9rZW5OYW1lKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFR5cGVUb2tlblN0b3JhZ2UubG9jYWxTdG9yYWdlOlxuICAgICAgICB0b2tlbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMuY29uZmlnLnRva2VuTmFtZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBUeXBlVG9rZW5TdG9yYWdlLnNlc3Npb25TdG9yYWdlOlxuICAgICAgICB0b2tlbiA9IHNlc3Npb25TdG9yYWdlLmdldEl0ZW0odGhpcy5jb25maWcudG9rZW5OYW1lKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgVG9rZW4gU3RvcmFnZSBtZXRob2QnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gIXRva2VuIHx8IHR5cGVvZiB0b2tlbiA9PT0gJ3VuZGVmaW5lZCcgPyAnJyA6IHRva2VuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNhdmUgdGhlIEFQSSBUb2tlbiBjb29raWVcbiAgICovXG4gIHB1YmxpYyBzZXQgdG9rZW4odG9rZW46IHN0cmluZykge1xuICAgIGNvbnN0IGRlY29kZWQgPSBKd3RIZWxwZXIuZGVjb2RlVG9rZW4odG9rZW4pO1xuICAgIGNvbnN0IGV4cGlyZXMgPSBmcm9tVW5peFRpbWUoZGVjb2RlZC5leHApO1xuXG4gICAgc3dpdGNoICh0aGlzLmNvbmZpZy50b2tlblN0b3JhZ2UpIHtcbiAgICAgIGNhc2UgVHlwZVRva2VuU3RvcmFnZS5jb29raWU6XG4gICAgICAgIHRoaXMuY29va2llcy5wdXQoXG4gICAgICAgICAgdGhpcy5jb25maWcudG9rZW5OYW1lLFxuICAgICAgICAgIHRva2VuLFxuICAgICAgICAgIHsgc2VjdXJlOiB0aGlzLmNvbmZpZy5zZWN1cmVDb29raWUsIGV4cGlyZXMgfVxuICAgICAgICApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVHlwZVRva2VuU3RvcmFnZS5sb2NhbFN0b3JhZ2U6XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuY29uZmlnLnRva2VuTmFtZSwgdG9rZW4pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVHlwZVRva2VuU3RvcmFnZS5zZXNzaW9uU3RvcmFnZTpcbiAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmNvbmZpZy50b2tlbk5hbWUsIHRva2VuKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgVG9rZW4gU3RvcmFnZSBtZXRob2QnKTtcbiAgICB9XG4gIH1cblxuXG4gIC8qKlxuICAgKiBSZW1vdmUgdGhlIEF1dGhlbnRpY2F0aW9uIHRva2VuIGNvb2tpZVxuICAgKi9cbiAgcHVibGljIHJldm9rZSgpOiB2b2lkIHtcbiAgICBzd2l0Y2ggKHRoaXMuY29uZmlnLnRva2VuU3RvcmFnZSkge1xuICAgICAgY2FzZSBUeXBlVG9rZW5TdG9yYWdlLmNvb2tpZTpcbiAgICAgICAgdGhpcy5jb29raWVzLnJlbW92ZUFsbCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVHlwZVRva2VuU3RvcmFnZS5sb2NhbFN0b3JhZ2U6XG4gICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMuY29uZmlnLnRva2VuTmFtZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBUeXBlVG9rZW5TdG9yYWdlLnNlc3Npb25TdG9yYWdlOlxuICAgICAgICBzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMuY29uZmlnLnRva2VuTmFtZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIFRva2VuIFN0b3JhZ2UgbWV0aG9kJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlcXVlc3QgYW4gQXV0aG9yaXphdGlvbiB0b2tlblxuICAgKiBUaGUgZGVmYXVsdCBhdXRob3JpemF0aW9uIFVSSSBpcyAnW0FQSV9FTkRfUE9JTlRdL2F1dGhvcml6ZSdcbiAgICogQHBhcmFtIHVzZXJuYW1lIFVzZXJuYW1lXG4gICAqIEBwYXJhbSBwYXNzd29yZCBQYXNzd29yZFxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYGF1dGhlbnRpY2F0ZWAgbWV0aG9kIGluc3RlYWRcbiAgICovXG4gIHB1YmxpYyBhdXRob3JpemUodXNlcm5hbWU6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMuYXV0aGVudGljYXRlKHVzZXJuYW1lLCBwYXNzd29yZCk7XG4gIH1cblxuICAvKipcbiAgICogUmVxdWVzdCBhbiBhdXRoZW50aWNhdGlvbiB0b2tlblxuICAgKiBUaGUgZGVmYXVsdCBhdXRoZW50aWNhdGlvbiBVUkkgaXMgJ1tBUElfRU5EX1BPSU5UXS9hdXRoZW50aWNhdGUnXG4gICAqIEBwYXJhbSB1c2VybmFtZSBVc2VybmFtZVxuICAgKiBAcGFyYW0gcGFzc3dvcmQgUGFzc3dvcmRcbiAgICovXG4gIHB1YmxpYyBhdXRoZW50aWNhdGUodXNlcm5hbWU6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMucG9zdCh0aGlzLmNvbmZpZy5hdXRoVXJpLCB7IHVzZXJuYW1lLCBwYXNzd29yZCB9KVxuICAgICAgLnBpcGUoXG4gICAgICAgIHRhcChwYXlsb2FkID0+IHtcbiAgICAgICAgICB0aGlzLnRva2VuID0gcGF5bG9hZDtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gIH1cblxuICAvKiogVmFsaWRhdGUgdGhlIEF1dGhlbnRpY2F0aW9uIHRva2VuIGFnYWluc3QgdGhlIEFQSSAqL1xuICBwdWJsaWMgdmFsaWRhdGVUb2tlbih1cmw6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMuc2VjdXJlZCgpLnJlcXVlc3QoSHR0cE1ldGhvZC5Qb3N0LCB1cmwpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYXV0aG9yaXphdGlvbiB0b2tlblxuICAgKiBAcGFyYW0gdXJsIGEgdXJsIHRvIHJlcG9ydCB0b1xuICAgKiBAZGVwcmVjYXRlZCB1c2UgYGRlYXV0aGVudGljYXRlYCBtZXRob2QgaW5zdGVhZFxuICAgKi9cbiAgcHVibGljIGRlYXV0aG9yaXplKHVybDogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5kZWF1dGhlbnRpY2F0ZSh1cmwpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYXV0aG9yaXphdGlvbiB0b2tlbiBhbmQgcmVwb3J0cyBsb2dvdXQgdG8gdGhlIHNlcnZlclxuICAgKiBAcGFyYW0gdXJsIGEgdXJsIHRvIHJlcG9ydCB0b1xuICAgKi9cbiAgcHVibGljIGRlYXV0aGVudGljYXRlKHVybDogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5zZWN1cmVkKCkucmVxdWVzdChIdHRwTWV0aG9kLkdldCwgdXJsKVxuICAgICAgLnBpcGUoXG4gICAgICAgIHRhcCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5yZXZva2UoKTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIGNsaWVudCBpcyBhbHJlYWR5IGF1dGhlbnRpY2F0ZWRcbiAgICogQGRlcHJlY2F0ZWQgdXNlIGBpc0F1dGhlbnRpY2F0ZWRgIG1ldGhvZCBpbnN0ZWFkXG4gICAqL1xuICBwdWJsaWMgaXNBdXRob3JpemVkKCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy50b2tlbjtcbiAgICBjb25zdCBkZWNvZGVkID0gSnd0SGVscGVyLmRlY29kZVRva2VuKHRva2VuKTtcbiAgICByZXR1cm4gZGVjb2RlZCAhPT0gbnVsbCAmJiAhaXNBZnRlcihuZXcgRGF0ZSgpLCBmcm9tVW5peFRpbWUoZGVjb2RlZC5leHApKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB0aGUgY2xpZW50IGlzIGFscmVhZHkgYXV0aGVudGljYXRlZFxuICAgKi9cbiAgcHVibGljIGlzQXV0aGVudGljYXRlZCgpOiBib29sZWFuIHtcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMudG9rZW47XG4gICAgY29uc3QgZGVjb2RlZCA9IEp3dEhlbHBlci5kZWNvZGVUb2tlbih0b2tlbik7XG4gICAgcmV0dXJuIGRlY29kZWQgIT09IG51bGwgJiYgIWlzQWZ0ZXIobmV3IERhdGUoKSwgZnJvbVVuaXhUaW1lKGRlY29kZWQuZXhwKSk7XG4gIH1cblxuICAvKiogQ2FuY2VsIGFsbCBwZW5kaW5nIHJlcXVlc3RzICovXG4gIHB1YmxpYyBjYW5jZWxQZW5kaW5nUmVxdWVzdHMoKTogdm9pZCB7XG4gICAgdGhpcy5jYW5jZWxQZW5kaW5nJC5uZXh0KHRydWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgcmVxdWVzdCBtb2RlIHRvIFNFQ1VSRUQgZm9yIHRoZSBuZXh0IHJlcXVlc3QuXG4gICAqXG4gICAqIFNlY3VyZWQgTW9kZSBmb3JjZSB0aGUgbmV4dCByZXF1ZXN0IHRvIGluY2x1ZGUgdGhlIGF1dGhlbnRpY2F0aW9uIHRva2VuLlxuICAgKiBUaGUgdG9rZW4gbXVzdCBiZSByZXF1ZXN0ZWQgcHJldmlvdXNseSB1c2luZyB0aGUgXCJhdXRob3JpemVcIiBtZXRob2QuXG4gICAqL1xuICBwdWJsaWMgc2VjdXJlZCgpOiBSZXN0Q2xpZW50U2VydmljZSB7XG4gICAgdGhpcy5zZWN1cmVSZXF1ZXN0ID0gdHJ1ZTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgcmVxdWVzdCBtb2RlIHRvIFBVQkxJQyBmb3IgdGhlIG5leHQgcmVxdWVzdC5cbiAgICpcbiAgICogUHVibGljIGlzIHRoZSBkZWZhdWx0IHJlcXVlc3QgbW9kZSBhbmQgZW5zdXJlIHRoYXQgbm8gYXV0aGVudGljYXRpb24gdG9rZW5cbiAgICogd2lsbCBiZSBwYXNzIG9uIHRoZSBuZXh0IHJlcXVlc3QuXG4gICAqL1xuICBwdWJsaWMgcHVibGljKCk6IFJlc3RDbGllbnRTZXJ2aWNlIHtcbiAgICB0aGlzLnNlY3VyZVJlcXVlc3QgPSBmYWxzZTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEFQSSByZXF1ZXN0IHVzaW5nIEdFVCBtZXRob2RcbiAgICpcbiAgICogQHBhcmFtIHVybFxuICAgKiBAcGFyYW0gZGF0YSBBIGxpc3Qgb2YgcGFyYW1ldGVzXG4gICAqL1xuICBwdWJsaWMgZ2V0KHVybDogc3RyaW5nLCBkYXRhPzoge30pOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QoSHR0cE1ldGhvZC5HZXQsIHVybCwgZGF0YSk7XG4gIH1cblxuICAvKipcbiAgICogQVBJIHJlcXVlc3QgdXNpbmcgUE9TVCBtZXRob2RcbiAgICpcbiAgICogQHBhcmFtIHVybFxuICAgKiBAcGFyYW0gZGF0YVxuICAgKiBAcGFyYW0gcmVzcG9uc2VUeXBlXG4gICAqIEBwYXJhbSBodHRwT3B0aW9uc1xuICAgKi9cbiAgcHVibGljIHBvc3QodXJsOiBzdHJpbmcsIGRhdGE/OiB7fSwgcmVzcG9uc2VUeXBlPzogc3RyaW5nLCBodHRwT3B0aW9uczogSUh0dHBPcHRpb25zID0ge30pOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QoSHR0cE1ldGhvZC5Qb3N0LCB1cmwsIGRhdGEsIHJlc3BvbnNlVHlwZSwgaHR0cE9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFQSSByZXF1ZXN0IHVzaW5nIFBVVCBtZXRob2RcbiAgICpcbiAgICogQHBhcmFtIHVybFxuICAgKiBAcGFyYW0gZGF0YVxuICAgKiBAcGFyYW0gcmVzcG9uc2VUeXBlXG4gICAqIEBwYXJhbSBodHRwT3B0aW9uc1xuICAgKi9cbiAgcHVibGljIHB1dCh1cmw6IHN0cmluZywgZGF0YT86IHt9LCByZXNwb25zZVR5cGU/OiBzdHJpbmcsIGh0dHBPcHRpb25zOiBJSHR0cE9wdGlvbnMgPSB7fSk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChIdHRwTWV0aG9kLlB1dCwgdXJsLCBkYXRhLCByZXNwb25zZVR5cGUsIGh0dHBPcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBUEkgcmVxdWVzdCB1c2luZyBQQVRDSCBtZXRob2RcbiAgICpcbiAgICogQHBhcmFtIHVybFxuICAgKiBAcGFyYW0gZGF0YVxuICAgKiBAcGFyYW0gcmVzcG9uc2VUeXBlXG4gICAqIEBwYXJhbSBodHRwT3B0aW9uc1xuICAgKi9cbiAgcHVibGljIHBhdGNoKHVybDogc3RyaW5nLCBkYXRhPzoge30sIHJlc3BvbnNlVHlwZT86IHN0cmluZywgaHR0cE9wdGlvbnM6IElIdHRwT3B0aW9ucyA9IHt9KTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KEh0dHBNZXRob2QuUGF0Y2gsIHVybCwgZGF0YSwgcmVzcG9uc2VUeXBlLCBodHRwT3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQVBJIHJlcXVlc3QgdXNpbmcgREVMRVRFIG1ldGhvZFxuICAgKlxuICAgKiBAcGFyYW0gdXJsXG4gICAqIEBwYXJhbSBkYXRhXG4gICAqIEBwYXJhbSByZXNwb25zZVR5cGVcbiAgICovXG4gIHB1YmxpYyBkZWxldGUodXJsOiBzdHJpbmcsIGRhdGE/OiB7fSwgcmVzcG9uc2VUeXBlPzogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KEh0dHBNZXRob2QuRGVsZXRlLCB1cmwsIGRhdGEsIHJlc3BvbnNlVHlwZSk7XG4gIH1cblxuICAvKiogU2V0IHRoZSB1cGxvYWQgZmlsZSBtb2RlICovXG4gIHB1YmxpYyB3aXRoRmlsZXMoKTogUmVzdENsaWVudFNlcnZpY2Uge1xuICAgIHRoaXMud2l0aEZpbGVzUmVxdWVzdCA9IHRydWU7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBGb3JtRGF0YSBvYmplY3QgdG8gYmUgc2VuZCBhcyByZXF1ZXN0IHBheWxvYWQgZGF0YVxuICAgKi9cbiAgcHJvdGVjdGVkIGNyZWF0ZUZvcm1EYXRhKG9iamVjdDogYW55LCBmb3JtPzogRm9ybURhdGEsIG5hbWVzcGFjZT86IHN0cmluZyk6IEZvcm1EYXRhIHtcbiAgICBjb25zdCBmb3JtRGF0YSA9IGZvcm0gfHwgbmV3IEZvcm1EYXRhKCk7XG5cbiAgICBmb3IgKGNvbnN0IHByb3BlcnR5IGluIG9iamVjdCkge1xuXG4gICAgICBpZiAoIW9iamVjdC5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkgfHwgIW9iamVjdFtwcm9wZXJ0eV0pIHsgY29udGludWU7IH1cblxuICAgICAgY29uc3QgZm9ybUtleSA9IG5hbWVzcGFjZSA/IGAke25hbWVzcGFjZX1bJHtwcm9wZXJ0eX1dYCA6IHByb3BlcnR5O1xuICAgICAgaWYgKG9iamVjdFtwcm9wZXJ0eV0gaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZChmb3JtS2V5LCBvYmplY3RbcHJvcGVydHldLnRvSVNPU3RyaW5nKCkpO1xuICAgICAgfSBlbHNlIGlmIChvYmplY3RbcHJvcGVydHldIGluc3RhbmNlb2YgRmlsZUxpc3QpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvYmplY3RbcHJvcGVydHldLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgZm9ybURhdGEuYXBwZW5kKGAke3Byb3BlcnR5fVtdYCwgb2JqZWN0W3Byb3BlcnR5XS5pdGVtKGkpKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgdHlwZW9mIG9iamVjdFtwcm9wZXJ0eV0gPT09ICdvYmplY3QnICYmICEob2JqZWN0W3Byb3BlcnR5XSBpbnN0YW5jZW9mIEZpbGUpKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlRm9ybURhdGEob2JqZWN0W3Byb3BlcnR5XSwgZm9ybURhdGEsIGZvcm1LZXkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKGZvcm1LZXksIG9iamVjdFtwcm9wZXJ0eV0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZm9ybURhdGE7XG4gIH1cblxuXG5cbiAgcHJvdGVjdGVkIGJ1aWxkVXJsKHVybDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBlbmRQb2ludCA9IHRoaXMuY29uZmlnLm1vY2tEYXRhID8gJ2Fzc2V0cy9tb2NrLWRhdGEnIDogdGhpcy5jb25maWcuZW5kUG9pbnQucmVwbGFjZSgvXFwvJC8sICcnKTtcblxuICAgIGxldCBuVXJsID0gYCR7ZW5kUG9pbnR9LyR7dXJsLnJlcGxhY2UoL15cXC8vZywgJycpfWA7XG4gICAgY29uc3QgbWF0Y2ggPSBuVXJsLm1hdGNoKC9cXC4oWzAtOWEtel0rKSg/OltcXD8jXXwkKS9pKTtcblxuICAgIGlmICh0aGlzLmNvbmZpZy5tb2NrRGF0YSAmJiBtYXRjaCA9PSBudWxsKSB7XG4gICAgICBuVXJsID0gYCR7blVybH0uanNvbmA7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5Vcmw7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHJlcXVlc3QgaGVhZGVycyBiYXNlZCBvbiBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnNcbiAgICovXG4gIHByaXZhdGUgYnVpbGRIZWFkZXJzKCkge1xuICAgIGNvbnN0IGhlYWRlciA9IHsgLi4udGhpcy5iYXNlSGVhZGVyIH07XG5cbiAgICBpZiAodGhpcy5jb25maWcubGFuZ3VhZ2UpIHsgaGVhZGVyWydBY2NlcHQtTGFuZ3VhZ2UnXSA9IHRoaXMuY29uZmlnLmxhbmd1YWdlOyB9XG5cbiAgICBpZiAodGhpcy5zZWN1cmVSZXF1ZXN0KSB7XG4gICAgICBjb25zdCB0b2tlbiA9IHRoaXMudG9rZW47XG4gICAgICBpZiAoIXRva2VuKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAnRXhlY3V0aW5nIGEgc2VjdXJlIHJlcXVlc3Qgd2l0aG91dCBUT0tFTi4gJ1xuICAgICAgICAgICsgJ0F1dGhvcml6YXRpb24gaGVhZGVyIHdpbGwgbm90IGJlIHNldCEnXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBoZWFkZXIuQXV0aG9yaXphdGlvbiA9IGBCZWFyZXIgJHt0b2tlbn1gO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnNlY3VyZVJlcXVlc3QgPSBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gaGVhZGVyO1xuICB9XG5cblxuXG4gIC8qKiBSYXcgcmVxdWVzdCBtZXRob2QgKi9cbiAgcHJvdGVjdGVkIHJlcXVlc3QoXG4gICAgbWV0aG9kOiBIdHRwTWV0aG9kLCB1cmw6IHN0cmluZywgZGF0YT86IGFueSwgcmVzcG9uc2VUeXBlPzogc3RyaW5nLFxuICAgIGh0dHBPcHRpb25zOiBJSHR0cE9wdGlvbnMgPSB7fVxuICApOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIGNvbnN0IG1zRGVsYXkgPSBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogMjAwMCkgKyAxMDAwKTtcbiAgICBjb25zdCBoZWFkZXIgPSB0aGlzLmJ1aWxkSGVhZGVycygpO1xuXG4gICAgY29uc3QgclR5cGUgPSAocmVzcG9uc2VUeXBlID8gcmVzcG9uc2VUeXBlIDogJ2pzb24nKSBhcyAndGV4dCc7XG5cbiAgICBpZiAodGhpcy53aXRoRmlsZXNSZXF1ZXN0KSB7IGRhdGEgPSB0aGlzLmNyZWF0ZUZvcm1EYXRhKGRhdGEpOyB0aGlzLndpdGhGaWxlc1JlcXVlc3QgPSBmYWxzZTsgfVxuXG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgIGJvZHk6IG1ldGhvZCA9PT0gSHR0cE1ldGhvZC5HZXQgPyB7fSA6IGRhdGEsXG4gICAgICByZXNwb25zZVR5cGU6IHJUeXBlLFxuICAgICAgcGFyYW1zOiBtZXRob2QgPT09IEh0dHBNZXRob2QuR2V0ID8gZGF0YSA6IHt9LFxuICAgICAgaGVhZGVyczogaGVhZGVyXG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLmh0dHBcbiAgICAgIC5yZXF1ZXN0KFxuICAgICAgICB0aGlzLmNvbmZpZy5tb2NrRGF0YSA/IEh0dHBNZXRob2QuR2V0IDogbWV0aG9kLCB0aGlzLmJ1aWxkVXJsKHVybCksXG4gICAgICAgIHsgLi4ub3B0aW9ucywgLi4uaHR0cE9wdGlvbnMgfVxuICAgICAgKVxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuY2FuY2VsUGVuZGluZyQpKVxuICAgICAgLnBpcGUoZGVsYXkodGhpcy5jb25maWcubW9ja0RhdGEgPyBtc0RlbGF5IDogMCkpXG4gICAgICAucGlwZShjYXRjaEVycm9yKChlcnIpID0+IHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHRoaXMuY29uZmlnLlVuYXV0aGVudGljYXRlZFJlZGlyZWN0VXJpXG4gICAgICAgICAgJiYgdXJsICE9PSB0aGlzLmNvbmZpZy5hdXRoVXJpXG4gICAgICAgICAgJiYgZXJyLnN0YXR1cyA9PT0gNDAxXG4gICAgICAgICkge1xuICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFt0aGlzLmNvbmZpZy5VbmF1dGhlbnRpY2F0ZWRSZWRpcmVjdFVyaV0pLnRoZW4oKCkgPT4geyB9KTtcbiAgICAgICAgICB0aGlzLmNhbmNlbFBlbmRpbmdSZXF1ZXN0cygpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgIHRoaXMuY29uZmlnLlVuYXV0aG9yaXplZFJlZGlyZWN0VXJpXG4gICAgICAgICAgJiYgdXJsICE9PSB0aGlzLmNvbmZpZy5hdXRoVXJpXG4gICAgICAgICAgJiYgZXJyLnN0YXR1cyA9PT0gNDAzXG4gICAgICAgICkge1xuICAgICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFt0aGlzLmNvbmZpZy5VbmF1dGhvcml6ZWRSZWRpcmVjdFVyaV0pLnRoZW4oKCkgPT4geyB9KTtcbiAgICAgICAgICB0aGlzLmNhbmNlbFBlbmRpbmdSZXF1ZXN0cygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aHJvd0Vycm9yKGVycik7XG4gICAgICB9KSk7XG4gIH1cbn1cbiJdfQ==