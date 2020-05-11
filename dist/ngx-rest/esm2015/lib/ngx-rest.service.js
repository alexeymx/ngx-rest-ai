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
export class RestClientService {
    constructor(http, cookies, cache, router, config) {
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
     */
    authorize(username, password) {
        return this.post(this.config.authUri, { username, password })
            .pipe(tap(payload => {
            this.token = payload;
        }));
    }
    /** Validate the Authentication token against the API */
    validateToken(url) {
        return this.secured().request(HttpMethod.Post, url);
    }
    /** Removes authorization token */
    deauthorize(url) {
        return this.secured().request(HttpMethod.Get, url)
            .pipe(tap(() => {
            this.revoke();
        }));
    }
    /** Check if the client is already Authenticate  */
    isAuthorized() {
        const token = this.token;
        const decoded = JwtHelper.decodeToken(token);
        return decoded !== null && !isAfter(new Date(), fromUnixTime(decoded.exp));
    }
    /** Cancel all pending requests */
    cancelPendingRequests() {
        this.cancelPending$.next(true);
    }
    cached(invalidate = false) {
        this.cachedRequest = true;
        this.invalidateCache = invalidate;
        return this;
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
        let cacheKey = '';
        if (this.cachedRequest) {
            cacheKey = btoa(unescape(encodeURIComponent(method + '_' + url + '_' + (method === HttpMethod.Get ? JSON.stringify(data) : ''))));
            if (!this.invalidateCache) {
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
            .pipe(tap(resp => {
            if (this.cachedRequest) {
                this.cachedRequest = false;
                this.cache.set(cacheKey, resp);
            }
        }))
            .pipe(catchError((err) => {
            if (this.config.UnauthorizedRedirectUri
                && url !== this.config.authUri
                && err.status === 401) {
                this.router.navigate([this.config.UnauthorizedRedirectUri]).then(() => { });
                this.cancelPendingRequests();
            }
            return throwError(err);
        }));
    }
}
/** @nocollapse */ RestClientService.ɵfac = function RestClientService_Factory(t) { return new (t || RestClientService)(i0.ɵɵinject(i1.HttpClient), i0.ɵɵinject(i2.CookieService), i0.ɵɵinject(i3.CacheService), i0.ɵɵinject(i4.Router), i0.ɵɵinject(i5.RestServiceConfig, 8)); };
/** @nocollapse */ RestClientService.ɵprov = i0.ɵɵdefineInjectable({ token: RestClientService, factory: RestClientService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(RestClientService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return [{ type: i1.HttpClient }, { type: i2.CookieService }, { type: i3.CacheService }, { type: i4.Router }, { type: i5.RestServiceConfig, decorators: [{
                type: Optional
            }] }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXJlc3Quc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1yZXN0LyIsInNvdXJjZXMiOlsibGliL25neC1yZXN0LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFJckQsT0FBTyxFQUFjLE9BQU8sRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzNELE9BQU8sRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNuRSxPQUFPLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUdqRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDaEQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQy9DLE9BQU8sRUFBcUIsZ0JBQWdCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQzs7Ozs7OztBQU14RSxNQUFNLE9BQU8saUJBQWlCO0lBNEI1QixZQUNVLElBQWdCLEVBQ2hCLE9BQXNCLEVBQ3RCLEtBQW1CLEVBQ1YsTUFBYyxFQUNuQixNQUF5QjtRQUo3QixTQUFJLEdBQUosSUFBSSxDQUFZO1FBQ2hCLFlBQU8sR0FBUCxPQUFPLENBQWU7UUFDdEIsVUFBSyxHQUFMLEtBQUssQ0FBYztRQUNWLFdBQU0sR0FBTixNQUFNLENBQVE7UUEvQmpDLGdEQUFnRDtRQUN0QyxtQkFBYyxHQUFxQixJQUFJLE9BQU8sRUFBVyxDQUFDO1FBRXBFLCtCQUErQjtRQUNyQixlQUFVLEdBQUc7WUFDckIsZUFBZSxFQUFFLFVBQVU7WUFDM0IsTUFBTSxFQUFFLGtCQUFrQjtZQUMxQixNQUFNLEVBQUUsVUFBVTtZQUNsQixhQUFhLEVBQUUsRUFBRTtZQUNqQixpQkFBaUIsRUFBRSxHQUFHO1NBQ3ZCLENBQUM7UUFL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QUNBLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUM1RSxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQzthQUM5QjtZQUNELE9BQU8sVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3pCLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDUixDQUFDOztxR0F2WVUsaUJBQWlCOzRFQUFqQixpQkFBaUIsV0FBakIsaUJBQWlCLG1CQUZoQixNQUFNO2tEQUVQLGlCQUFpQjtjQUg3QixVQUFVO2VBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkI7O3NCQWtDSSxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgQ29va2llU2VydmljZSB9IGZyb20gJ25neC1jb29raWUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3ViamVjdCwgdGhyb3dFcnJvciwgb2YgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHRha2VVbnRpbCwgdGFwLCBjYXRjaEVycm9yLCBkZWxheSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IGlzQWZ0ZXIsIGZyb21Vbml4VGltZSB9IGZyb20gJ2RhdGUtZm5zJztcblxuaW1wb3J0IHsgSUh0dHBPcHRpb25zIH0gZnJvbSAnLi9odHRwLW9wdGlvbnMuaW50ZXJmYWNlJztcbmltcG9ydCB7IEh0dHBNZXRob2QgfSBmcm9tICcuL2h0dHAtbWV0aG9kLmVudW0nO1xuaW1wb3J0IHsgSnd0SGVscGVyIH0gZnJvbSAnLi9qd3QtaGVscGVyLmNsYXNzJztcbmltcG9ydCB7IFJlc3RTZXJ2aWNlQ29uZmlnLCBUeXBlVG9rZW5TdG9yYWdlIH0gZnJvbSAnLi9uZ3gtcmVzdC5jb25maWcnO1xuaW1wb3J0IHsgQ2FjaGVTZXJ2aWNlIH0gZnJvbSAnLi9jYWNoZS5zZXJ2aWNlJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgUmVzdENsaWVudFNlcnZpY2Uge1xuICAvKiogSGFuZGxlciB1c2VkIHRvIHN0b3AgYWxsIHBlbmRpbmcgcmVxdWVzdHMgKi9cbiAgcHJvdGVjdGVkIGNhbmNlbFBlbmRpbmckOiBTdWJqZWN0PGJvb2xlYW4+ID0gbmV3IFN1YmplY3Q8Ym9vbGVhbj4oKTtcblxuICAvKiogIERlZmF1bHQgcmVxdWVzdHMgaGVhZGVyICovXG4gIHByb3RlY3RlZCBiYXNlSGVhZGVyID0ge1xuICAgICdDYWNoZS1Db250cm9sJzogJ25vLWNhY2hlJyxcbiAgICBhY2NlcHQ6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICBQcmFnbWE6ICduby1jYWNoZScsXG4gICAgQXV0aG9yaXphdGlvbjogJycsXG4gICAgJ0FjY2VwdC1MYW5ndWFnZSc6ICcqJ1xuICB9O1xuXG4gIC8qKiBTZXJ2aWNlIGNvbmZpZ3VyYXRpb24gcGFyYW1ldGVycyAqL1xuICBwcm90ZWN0ZWQgY29uZmlnOiBSZXN0U2VydmljZUNvbmZpZztcblxuICAvKiogV2hlbiB0cnVlLCB0aGUgcmVxdWVzdCBoZWFkZXIgd2lsbCBpbmNsdWRlIHRoZSBhdXRoZW50aWNhdGlvbiB0b2tlbiAqL1xuICBwcm90ZWN0ZWQgc2VjdXJlUmVxdWVzdCA9IGZhbHNlO1xuXG4gIC8qKiBIb2xkcyBhIGxpc3Qgb2YgZmlsZXMgdG8gYmUgdXBsb2FkIG9uIHJlcXVlc3QgKi9cbiAgcHJvdGVjdGVkIHdpdGhGaWxlc1JlcXVlc3QgPSBmYWxzZTtcblxuICAvKiogUHJlZmVyIGNhY2hlICovXG4gIHByb3RlY3RlZCBjYWNoZWRSZXF1ZXN0ID0gZmFsc2U7XG5cbiAgLyoqIEludmFsaWRhdGUgY2FjaGUgKi9cbiAgcHJvdGVjdGVkIGludmFsaWRhdGVDYWNoZSA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCxcbiAgICBwcml2YXRlIGNvb2tpZXM6IENvb2tpZVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBjYWNoZTogQ2FjaGVTZXJ2aWNlLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgcm91dGVyOiBSb3V0ZXIsXG4gICAgQE9wdGlvbmFsKCkgY29uZmlnOiBSZXN0U2VydmljZUNvbmZpZ1xuICApIHtcbiAgICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgIGVuZFBvaW50OiAnJyxcbiAgICAgIHRva2VuTmFtZTogJ0F1dGhUb2tlbicsXG4gICAgICB0b2tlblN0b3JhZ2U6IFR5cGVUb2tlblN0b3JhZ2UuY29va2llLFxuICAgICAgc2VjdXJlQ29va2llOiBmYWxzZSxcbiAgICAgIG1vY2tEYXRhOiBmYWxzZSxcbiAgICAgIHZhbGlkYXRpb25Ub2tlblVyaTogJy9pbmZvJyxcbiAgICAgIGF1dGhVcmk6ICcvYXV0aG9yaXplJyxcbiAgICAgIFVuYXV0aG9yaXplZFJlZGlyZWN0VXJpOiBudWxsXG4gICAgfSBhcyBSZXN0U2VydmljZUNvbmZpZztcblxuICAgIGlmIChjb25maWcpIHtcbiAgICAgIHRoaXMuc2V0Q29uZmlnKGNvbmZpZyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgUmVzdCBDbGllbnQgY29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzLlxuICAgKlxuICAgKiBDQVVUSU9OOiBUaGlzIG1ldGhvZCBvdmVycmlkZXMgdGhlIGN1cnJlbnQgY29uZmlndXJhdGlvbiBzZXR0aW5nc1xuICAgKiBhbmQgdGhpcyBzZXR0aW5ncyB3aWxsIGFwcGx5IHRvIGFsbCBmb2xsb3dpbmcgcmVxdWVzdHNcbiAgICovXG4gIHB1YmxpYyBzZXRDb25maWcoY29uZmlnOiBSZXN0U2VydmljZUNvbmZpZyk6IFJlc3RDbGllbnRTZXJ2aWNlIHtcbiAgICB0aGlzLmNvbmZpZyA9IHsgLi4udGhpcy5jb25maWcsIC4uLmNvbmZpZyB9IGFzIFJlc3RTZXJ2aWNlQ29uZmlnO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqIFJldHVybiB0aGUgY3VycmVudCBSZXN0IENsaWVudCBjb25maWd1cmF0aW9uIHBhcmFtZXRlcnMuICAqL1xuICBwdWJsaWMgZ2V0Q29uZmlnKCk6IFJlc3RTZXJ2aWNlQ29uZmlnIHtcbiAgICByZXR1cm4gdGhpcy5jb25maWc7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBBUEkgVG9rZW4gZnJvbSBjb29raWVzXG4gICAqL1xuICBwdWJsaWMgZ2V0IHRva2VuKCk6IHN0cmluZyB7XG4gICAgbGV0IHRva2VuID0gJyc7XG5cbiAgICBzd2l0Y2ggKHRoaXMuY29uZmlnLnRva2VuU3RvcmFnZSkge1xuICAgICAgY2FzZSBUeXBlVG9rZW5TdG9yYWdlLmNvb2tpZTpcbiAgICAgICAgdG9rZW4gPSB0aGlzLmNvb2tpZXMuZ2V0KHRoaXMuY29uZmlnLnRva2VuTmFtZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBUeXBlVG9rZW5TdG9yYWdlLmxvY2FsU3RvcmFnZTpcbiAgICAgICAgdG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmNvbmZpZy50b2tlbk5hbWUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVHlwZVRva2VuU3RvcmFnZS5zZXNzaW9uU3RvcmFnZTpcbiAgICAgICAgdG9rZW4gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKHRoaXMuY29uZmlnLnRva2VuTmFtZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIFRva2VuIFN0b3JhZ2UgbWV0aG9kJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuICF0b2tlbiB8fCB0eXBlb2YgdG9rZW4gPT09ICd1bmRlZmluZWQnID8gJycgOiB0b2tlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTYXZlIHRoZSBBUEkgVG9rZW4gY29va2llXG4gICAqL1xuICBwdWJsaWMgc2V0IHRva2VuKHRva2VuOiBzdHJpbmcpIHtcbiAgICBjb25zdCBkZWNvZGVkID0gSnd0SGVscGVyLmRlY29kZVRva2VuKHRva2VuKTtcbiAgICBjb25zdCBleHBpcmVzID0gZnJvbVVuaXhUaW1lKGRlY29kZWQuZXhwKTtcblxuICAgIHN3aXRjaCAodGhpcy5jb25maWcudG9rZW5TdG9yYWdlKSB7XG4gICAgICBjYXNlIFR5cGVUb2tlblN0b3JhZ2UuY29va2llOlxuICAgICAgICB0aGlzLmNvb2tpZXMucHV0KFxuICAgICAgICAgIHRoaXMuY29uZmlnLnRva2VuTmFtZSxcbiAgICAgICAgICB0b2tlbixcbiAgICAgICAgICB7IHNlY3VyZTogdGhpcy5jb25maWcuc2VjdXJlQ29va2llLCBleHBpcmVzIH1cbiAgICAgICAgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFR5cGVUb2tlblN0b3JhZ2UubG9jYWxTdG9yYWdlOlxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmNvbmZpZy50b2tlbk5hbWUsIHRva2VuKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFR5cGVUb2tlblN0b3JhZ2Uuc2Vzc2lvblN0b3JhZ2U6XG4gICAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0odGhpcy5jb25maWcudG9rZW5OYW1lLCB0b2tlbik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIFRva2VuIFN0b3JhZ2UgbWV0aG9kJyk7XG4gICAgfVxuICB9XG5cblxuICAvKipcbiAgICogUmVtb3ZlIHRoZSBBdXRoZW50aWNhdGlvbiB0b2tlbiBjb29raWVcbiAgICovXG4gIHB1YmxpYyByZXZva2UoKTogdm9pZCB7XG4gICAgc3dpdGNoICh0aGlzLmNvbmZpZy50b2tlblN0b3JhZ2UpIHtcbiAgICAgIGNhc2UgVHlwZVRva2VuU3RvcmFnZS5jb29raWU6XG4gICAgICAgIHRoaXMuY29va2llcy5yZW1vdmVBbGwoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFR5cGVUb2tlblN0b3JhZ2UubG9jYWxTdG9yYWdlOlxuICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLmNvbmZpZy50b2tlbk5hbWUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVHlwZVRva2VuU3RvcmFnZS5zZXNzaW9uU3RvcmFnZTpcbiAgICAgICAgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLmNvbmZpZy50b2tlbk5hbWUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBUb2tlbiBTdG9yYWdlIG1ldGhvZCcpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXF1ZXN0IGFuIEF1dGhvcml6YXRpb24gdG9rZW5cbiAgICogVGhlIGRlZmF1bHQgYXV0aG9yaXphdGlvbiBVUkkgaXMgJ1tBUElfRU5EX1BPSU5UXS9hdXRob3JpemUnXG4gICAqIEBwYXJhbSB1c2VybmFtZSBVc2VybmFtZVxuICAgKiBAcGFyYW0gcGFzc3dvcmQgUGFzc3dvcmRcbiAgICovXG4gIHB1YmxpYyBhdXRob3JpemUodXNlcm5hbWU6IHN0cmluZywgcGFzc3dvcmQ6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMucG9zdCh0aGlzLmNvbmZpZy5hdXRoVXJpLCB7IHVzZXJuYW1lLCBwYXNzd29yZCB9KVxuICAgICAgLnBpcGUoXG4gICAgICAgIHRhcChwYXlsb2FkID0+IHtcbiAgICAgICAgICB0aGlzLnRva2VuID0gcGF5bG9hZDtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gIH1cblxuICAvKiogVmFsaWRhdGUgdGhlIEF1dGhlbnRpY2F0aW9uIHRva2VuIGFnYWluc3QgdGhlIEFQSSAqL1xuICBwdWJsaWMgdmFsaWRhdGVUb2tlbih1cmw6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMuc2VjdXJlZCgpLnJlcXVlc3QoSHR0cE1ldGhvZC5Qb3N0LCB1cmwpO1xuICB9XG5cbiAgLyoqIFJlbW92ZXMgYXV0aG9yaXphdGlvbiB0b2tlbiAqL1xuICBwdWJsaWMgZGVhdXRob3JpemUodXJsOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLnNlY3VyZWQoKS5yZXF1ZXN0KEh0dHBNZXRob2QuR2V0LCB1cmwpXG4gICAgICAucGlwZShcbiAgICAgICAgdGFwKCgpID0+IHtcbiAgICAgICAgICB0aGlzLnJldm9rZSgpO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgfVxuXG4gIC8qKiBDaGVjayBpZiB0aGUgY2xpZW50IGlzIGFscmVhZHkgQXV0aGVudGljYXRlICAqL1xuICBwdWJsaWMgaXNBdXRob3JpemVkKCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy50b2tlbjtcbiAgICBjb25zdCBkZWNvZGVkID0gSnd0SGVscGVyLmRlY29kZVRva2VuKHRva2VuKTtcbiAgICByZXR1cm4gZGVjb2RlZCAhPT0gbnVsbCAmJiAhaXNBZnRlcihuZXcgRGF0ZSgpLCBmcm9tVW5peFRpbWUoZGVjb2RlZC5leHApKTtcbiAgfVxuXG4gIC8qKiBDYW5jZWwgYWxsIHBlbmRpbmcgcmVxdWVzdHMgKi9cbiAgcHVibGljIGNhbmNlbFBlbmRpbmdSZXF1ZXN0cygpOiB2b2lkIHtcbiAgICB0aGlzLmNhbmNlbFBlbmRpbmckLm5leHQodHJ1ZSk7XG4gIH1cblxuXG4gIHB1YmxpYyBjYWNoZWQoaW52YWxpZGF0ZSA9IGZhbHNlKSB7XG4gICAgdGhpcy5jYWNoZWRSZXF1ZXN0ID0gdHJ1ZTtcbiAgICB0aGlzLmludmFsaWRhdGVDYWNoZSA9IGludmFsaWRhdGU7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFNldCB0aGUgcmVxdWVzdCBtb2RlIHRvIFNFQ1VSRUQgZm9yIHRoZSBuZXh0IHJlcXVlc3QuXG4gICAqXG4gICAqIFNlY3VyZWQgTW9kZSBmb3JjZSB0aGUgbmV4dCByZXF1ZXN0IHRvIGluY2x1ZGUgdGhlIGF1dGhlbnRpY2F0aW9uIHRva2VuLlxuICAgKiBUaGUgdG9rZW4gbXVzdCBiZSByZXF1ZXN0ZWQgcHJldmlvdXNseSB1c2luZyB0aGUgXCJhdXRob3JpemVcIiBtZXRob2QuXG4gICAqL1xuICBwdWJsaWMgc2VjdXJlZCgpOiBSZXN0Q2xpZW50U2VydmljZSB7XG4gICAgdGhpcy5zZWN1cmVSZXF1ZXN0ID0gdHJ1ZTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgcmVxdWVzdCBtb2RlIHRvIFBVQkxJQyBmb3IgdGhlIG5leHQgcmVxdWVzdC5cbiAgICpcbiAgICogUHVibGljIGlzIHRoZSBkZWZhdWx0IHJlcXVlc3QgbW9kZSBhbmQgZW5zdXJlIHRoYXQgbm8gYXV0aGVudGljYXRpb24gdG9rZW5cbiAgICogd2lsbCBiZSBwYXNzIG9uIHRoZSBuZXh0IHJlcXVlc3QuXG4gICAqL1xuICBwdWJsaWMgcHVibGljKCk6IFJlc3RDbGllbnRTZXJ2aWNlIHtcbiAgICB0aGlzLnNlY3VyZVJlcXVlc3QgPSBmYWxzZTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEFQSSByZXF1ZXN0IHVzaW5nIEdFVCBtZXRob2RcbiAgICpcbiAgICogQHBhcmFtIHVybFxuICAgKiBAcGFyYW0gZGF0YSBBIGxpc3Qgb2YgcGFyYW1ldGVzXG4gICAqL1xuICBwdWJsaWMgZ2V0KHVybDogc3RyaW5nLCBkYXRhPzoge30pOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QoSHR0cE1ldGhvZC5HZXQsIHVybCwgZGF0YSk7XG4gIH1cblxuICAvKipcbiAgICogQVBJIHJlcXVlc3QgdXNpbmcgUE9TVCBtZXRob2RcbiAgICpcbiAgICogQHBhcmFtIHVybFxuICAgKiBAcGFyYW0gZGF0YVxuICAgKiBAcGFyYW0gcmVzcG9uc2VUeXBlXG4gICAqIEBwYXJhbSBodHRwT3B0aW9uc1xuICAgKi9cbiAgcHVibGljIHBvc3QodXJsOiBzdHJpbmcsIGRhdGE/OiB7fSwgcmVzcG9uc2VUeXBlPzogc3RyaW5nLCBodHRwT3B0aW9uczogSUh0dHBPcHRpb25zID0ge30pOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QoSHR0cE1ldGhvZC5Qb3N0LCB1cmwsIGRhdGEsIHJlc3BvbnNlVHlwZSwgaHR0cE9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFQSSByZXF1ZXN0IHVzaW5nIFBVVCBtZXRob2RcbiAgICpcbiAgICogQHBhcmFtIHVybFxuICAgKiBAcGFyYW0gZGF0YVxuICAgKiBAcGFyYW0gcmVzcG9uc2VUeXBlXG4gICAqIEBwYXJhbSBodHRwT3B0aW9uc1xuICAgKi9cbiAgcHVibGljIHB1dCh1cmw6IHN0cmluZywgZGF0YT86IHt9LCByZXNwb25zZVR5cGU/OiBzdHJpbmcsIGh0dHBPcHRpb25zOiBJSHR0cE9wdGlvbnMgPSB7fSk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChIdHRwTWV0aG9kLlB1dCwgdXJsLCBkYXRhLCByZXNwb25zZVR5cGUsIGh0dHBPcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBUEkgcmVxdWVzdCB1c2luZyBERUxFVEUgbWV0aG9kXG4gICAqXG4gICAqIEBwYXJhbSB1cmxcbiAgICogQHBhcmFtIGRhdGFcbiAgICogQHBhcmFtIHJlc3BvbnNlVHlwZVxuICAgKi9cbiAgcHVibGljIGRlbGV0ZSh1cmw6IHN0cmluZywgZGF0YT86IHt9LCByZXNwb25zZVR5cGU/OiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QoSHR0cE1ldGhvZC5EZWxldGUsIHVybCwgZGF0YSwgcmVzcG9uc2VUeXBlKTtcbiAgfVxuXG4gIC8qKiBTZXQgdGhlIHVwbG9hZCBmaWxlIG1vZGUgKi9cbiAgcHVibGljIHdpdGhGaWxlcygpOiBSZXN0Q2xpZW50U2VydmljZSB7XG4gICAgdGhpcy53aXRoRmlsZXNSZXF1ZXN0ID0gdHJ1ZTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIEZvcm1EYXRhIG9iamVjdCB0byBiZSBzZW5kIGFzIHJlcXVlc3QgcGF5bG9hZCBkYXRhXG4gICAqL1xuICBwcm90ZWN0ZWQgY3JlYXRlRm9ybURhdGEob2JqZWN0OiBhbnksIGZvcm0/OiBGb3JtRGF0YSwgbmFtZXNwYWNlPzogc3RyaW5nKTogRm9ybURhdGEge1xuICAgIGNvbnN0IGZvcm1EYXRhID0gZm9ybSB8fCBuZXcgRm9ybURhdGEoKTtcblxuICAgIGZvciAoY29uc3QgcHJvcGVydHkgaW4gb2JqZWN0KSB7XG5cbiAgICAgIGlmICghb2JqZWN0Lmhhc093blByb3BlcnR5KHByb3BlcnR5KSB8fCAhb2JqZWN0W3Byb3BlcnR5XSkgeyBjb250aW51ZTsgfVxuXG4gICAgICBjb25zdCBmb3JtS2V5ID0gbmFtZXNwYWNlID8gYCR7bmFtZXNwYWNlfVske3Byb3BlcnR5fV1gIDogcHJvcGVydHk7XG4gICAgICBpZiAob2JqZWN0W3Byb3BlcnR5XSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKGZvcm1LZXksIG9iamVjdFtwcm9wZXJ0eV0udG9JU09TdHJpbmcoKSk7XG4gICAgICB9IGVsc2UgaWYgKG9iamVjdFtwcm9wZXJ0eV0gaW5zdGFuY2VvZiBGaWxlTGlzdCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9iamVjdFtwcm9wZXJ0eV0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoYCR7cHJvcGVydHl9W11gLCBvYmplY3RbcHJvcGVydHldLml0ZW0oaSkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICB0eXBlb2Ygb2JqZWN0W3Byb3BlcnR5XSA9PT0gJ29iamVjdCcgJiYgIShvYmplY3RbcHJvcGVydHldIGluc3RhbmNlb2YgRmlsZSkpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVGb3JtRGF0YShvYmplY3RbcHJvcGVydHldLCBmb3JtRGF0YSwgZm9ybUtleSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3JtRGF0YS5hcHBlbmQoZm9ybUtleSwgb2JqZWN0W3Byb3BlcnR5XSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmb3JtRGF0YTtcbiAgfVxuXG5cblxuICBwcm90ZWN0ZWQgYnVpbGRVcmwodXJsOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IGVuZFBvaW50ID0gdGhpcy5jb25maWcubW9ja0RhdGEgPyAnYXNzZXRzL21vY2stZGF0YScgOiB0aGlzLmNvbmZpZy5lbmRQb2ludC5yZXBsYWNlKC9cXC8kLywgJycpO1xuXG4gICAgbGV0IG5VcmwgPSBgJHtlbmRQb2ludH0vJHt1cmwucmVwbGFjZSgvXlxcLy9nLCAnJyl9YDtcbiAgICBjb25zdCBtYXRjaCA9IG5VcmwubWF0Y2goL1xcLihbMC05YS16XSspKD86W1xcPyNdfCQpL2kpO1xuXG4gICAgaWYgKHRoaXMuY29uZmlnLm1vY2tEYXRhICYmIG1hdGNoID09IG51bGwpIHtcbiAgICAgIG5VcmwgPSBgJHtuVXJsfS5qc29uYDtcbiAgICB9XG5cbiAgICByZXR1cm4gblVybDtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgcmVxdWVzdCBoZWFkZXJzIGJhc2VkIG9uIGNvbmZpZ3VyYXRpb24gcGFyYW1ldGVyc1xuICAgKi9cbiAgcHJpdmF0ZSBidWlsZEhlYWRlcnMoKSB7XG4gICAgY29uc3QgaGVhZGVyID0geyAuLi50aGlzLmJhc2VIZWFkZXIgfTtcblxuICAgIGlmICh0aGlzLmNvbmZpZy5sYW5ndWFnZSkgeyBoZWFkZXJbJ0FjY2VwdC1MYW5ndWFnZSddID0gdGhpcy5jb25maWcubGFuZ3VhZ2U7IH1cblxuICAgIGlmICh0aGlzLnNlY3VyZVJlcXVlc3QpIHtcbiAgICAgIGNvbnN0IHRva2VuID0gdGhpcy50b2tlbjtcbiAgICAgIGlmICghdG9rZW4pIHtcbiAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICdFeGVjdXRpbmcgYSBzZWN1cmUgcmVxdWVzdCB3aXRob3V0IFRPS0VOLiAnXG4gICAgICAgICAgKyAnQXV0aG9yaXphdGlvbiBoZWFkZXIgd2lsbCBub3QgYmUgc2V0ISdcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGhlYWRlci5BdXRob3JpemF0aW9uID0gYEJlYXJlciAke3Rva2VufWA7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2VjdXJlUmVxdWVzdCA9IGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiBoZWFkZXI7XG4gIH1cblxuXG5cbiAgLyoqIFJhdyByZXF1ZXN0IG1ldGhvZCAqL1xuICBwcm90ZWN0ZWQgcmVxdWVzdChcbiAgICBtZXRob2Q6IEh0dHBNZXRob2QsIHVybDogc3RyaW5nLCBkYXRhPzogYW55LCByZXNwb25zZVR5cGU/OiBzdHJpbmcsXG4gICAgaHR0cE9wdGlvbnM6IElIdHRwT3B0aW9ucyA9IHt9XG4gICk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgY29uc3QgbXNEZWxheSA9IE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiAyMDAwKSArIDEwMDApO1xuICAgIGNvbnN0IGhlYWRlciA9IHRoaXMuYnVpbGRIZWFkZXJzKCk7XG5cbiAgICBjb25zdCByVHlwZSA9IChyZXNwb25zZVR5cGUgPyByZXNwb25zZVR5cGUgOiAnanNvbicpIGFzICd0ZXh0JztcblxuICAgIGlmICh0aGlzLndpdGhGaWxlc1JlcXVlc3QpIHsgZGF0YSA9IHRoaXMuY3JlYXRlRm9ybURhdGEoZGF0YSk7IHRoaXMud2l0aEZpbGVzUmVxdWVzdCA9IGZhbHNlOyB9XG5cbiAgICBsZXQgY2FjaGVLZXkgPSAnJztcbiAgICBpZiAodGhpcy5jYWNoZWRSZXF1ZXN0KSB7XG4gICAgICBjYWNoZUtleSA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KG1ldGhvZCArICdfJyArIHVybCArICdfJyArIChtZXRob2QgPT09IEh0dHBNZXRob2QuR2V0ID8gSlNPTi5zdHJpbmdpZnkoZGF0YSkgOiAnJykpKSk7XG4gICAgICBpZiAoIXRoaXMuaW52YWxpZGF0ZUNhY2hlKSB7XG4gICAgICAgIGNvbnN0IGNhY2hlZCA9IHRoaXMuY2FjaGUuZ2V0KGNhY2hlS2V5KTtcbiAgICAgICAgaWYgKGNhY2hlZCkge1xuICAgICAgICAgIHRoaXMuY2FjaGVkUmVxdWVzdCA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybiBvZihjYWNoZWQpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNhY2hlLmludmFsaWRhdGUoY2FjaGVLZXkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICBib2R5OiBtZXRob2QgPT09IEh0dHBNZXRob2QuR2V0ID8ge30gOiBkYXRhLFxuICAgICAgcmVzcG9uc2VUeXBlOiByVHlwZSxcbiAgICAgIHBhcmFtczogbWV0aG9kID09PSBIdHRwTWV0aG9kLkdldCA/IGRhdGEgOiB7fSxcbiAgICAgIGhlYWRlcnM6IGhlYWRlclxuICAgIH07XG5cbiAgICByZXR1cm4gdGhpcy5odHRwXG4gICAgICAucmVxdWVzdChcbiAgICAgICAgdGhpcy5jb25maWcubW9ja0RhdGEgPyBIdHRwTWV0aG9kLkdldCA6IG1ldGhvZCwgdGhpcy5idWlsZFVybCh1cmwpLFxuICAgICAgICB7IC4uLm9wdGlvbnMsIC4uLmh0dHBPcHRpb25zIH1cbiAgICAgIClcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLmNhbmNlbFBlbmRpbmckKSlcbiAgICAgIC5waXBlKGRlbGF5KHRoaXMuY29uZmlnLm1vY2tEYXRhID8gbXNEZWxheSA6IDApKVxuICAgICAgLnBpcGUodGFwKHJlc3AgPT4ge1xuICAgICAgICBpZiAodGhpcy5jYWNoZWRSZXF1ZXN0KSB7XG4gICAgICAgICAgdGhpcy5jYWNoZWRSZXF1ZXN0ID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5jYWNoZS5zZXQoY2FjaGVLZXksIHJlc3ApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICApKVxuICAgICAgLnBpcGUoY2F0Y2hFcnJvcigoZXJyKSA9PiB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICB0aGlzLmNvbmZpZy5VbmF1dGhvcml6ZWRSZWRpcmVjdFVyaVxuICAgICAgICAgICYmIHVybCAhPT0gdGhpcy5jb25maWcuYXV0aFVyaVxuICAgICAgICAgICYmIGVyci5zdGF0dXMgPT09IDQwMVxuICAgICAgICApIHtcbiAgICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbdGhpcy5jb25maWcuVW5hdXRob3JpemVkUmVkaXJlY3RVcmldKS50aGVuKCgpID0+IHsgfSk7XG4gICAgICAgICAgdGhpcy5jYW5jZWxQZW5kaW5nUmVxdWVzdHMoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihlcnIpO1xuICAgICAgfSkpO1xuICB9XG59XG4iXX0=