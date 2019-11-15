import { Injectable, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie';
import { Observable, Subject, throwError, of } from 'rxjs';
import { takeUntil, tap, catchError, delay } from 'rxjs/operators';
import { isAfter, fromUnixTime } from 'date-fns';

import { IHttpOptions } from './http-options.interface';
import { HttpMethod } from './http-method.enum';
import { JwtHelper } from './jwt-helper.class';
import { RestServiceConfig, TypeTokenStorage } from './angular-rest.config';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class RestClientService {
  /** Handler used to stop all pending requests */
  protected cancelPending$: Subject<boolean> = new Subject<boolean>();

  /**  Default requests header */
  protected baseHeader = {
    'Cache-Control': 'no-cache',
    accept: 'application/json',
    Pragma: 'no-cache',
    Authorization: '',
    'Accept-Language': '*'
  };

  /** Service configuration parameters */
  protected config: RestServiceConfig;

  /** When true, the request header will include the authentication token */
  protected secureRequest = false;

  /** Holds a list of files to be upload on request */
  protected withFilesRequest = false;

  /** Prefer cache */
  protected cachedRequest = false;

  /** Invalidate cache */
  protected invalidateCache = false;

  constructor(
    private http: HttpClient,
    private cookies: CookieService,
    private cache: CacheService,
    private readonly router: Router,
    @Optional() config: RestServiceConfig
  ) {
    this.config = {
      endPoint: '',
      tokenName: 'AuthToken',
      tokenStorage: TypeTokenStorage.cookie,
      secureCookie: false,
      mockData: false,
      validationTokenUri: '/info',
      authUri: '/authorize',
      UnauthorizedRedirectUri: null
    } as RestServiceConfig;

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
  public setConfig(config: RestServiceConfig): RestClientService {
    this.config = { ...this.config, ...config } as RestServiceConfig;
    return this;
  }

  /** Return the current Rest Client configuration parameters.  */
  public getConfig(): RestServiceConfig {
    return this.config;
  }

  /**
   * Get the API Token from cookies
   */
  public get token(): string {
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
  public set token(token: string) {
    const decoded = JwtHelper.decodeToken(token);
    const expires = fromUnixTime(decoded.exp);

    switch (this.config.tokenStorage) {
      case TypeTokenStorage.cookie:
        this.cookies.put(
          this.config.tokenName,
          token,
          { secure: this.config.secureCookie, expires }
        );
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
  public revoke(): void {
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
  public authorize(username: string, password: string): Observable<any> {
    return this.post(this.config.authUri, { username, password })
      .pipe(
        tap(payload => {
          this.token = payload.token;
        })
      );
  }

  /** Validate the Authentication token against the API */
  public validateToken(url: string): Observable<any> {
    return this.secured().request(HttpMethod.Post, url);
  }

  /** Removes authorization token */
  public deauthorize(url: string): Observable<any> {
    return this.secured().request(HttpMethod.Get, url)
      .pipe(
        tap(() => {
          this.revoke();
        })
      );
  }

  /** Check if the client is already Authenticate  */
  public isAuthorized(): boolean {
    const token = this.token;
    const decoded = JwtHelper.decodeToken(token);
    return decoded !== null && !isAfter(new Date(), fromUnixTime(decoded.exp));
  }

  /** Cancel all pending requests */
  public cancelPendingRequests(): void {
    this.cancelPending$.next(true);
  }


  public cached(invalidate = false) {
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
  public secured(): RestClientService {
    this.secureRequest = true;

    return this;
  }

  /**
   * Set the request mode to PUBLIC for the next request.
   *
   * Public is the default request mode and ensure that no authentication token
   * will be pass on the next request.
   */
  public public(): RestClientService {
    this.secureRequest = false;

    return this;
  }

  /**
   * API request using GET method
   *
   * @param url
   * @param data A list of parametes
   */
  public get(url: string, data?: {}): Observable<any> {
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
  public post(url: string, data?: {}, responseType?: string, httpOptions: IHttpOptions = {}): Observable<any> {
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
  public put(url: string, data?: {}, responseType?: string, httpOptions: IHttpOptions = {}): Observable<any> {
    return this.request(HttpMethod.Put, url, data, responseType, httpOptions);
  }

  /**
   * API request using DELETE method
   *
   * @param url
   * @param data
   * @param responseType
   */
  public delete(url: string, data?: {}, responseType?: string): Observable<any> {
    return this.request(HttpMethod.Delete, url, data, responseType);
  }

  /** Set the upload file mode */
  public withFiles(): RestClientService {
    this.withFilesRequest = true;

    return this;
  }

  /**
   * Create a FormData object to be send as request payload data
   */
  protected createFormData(object: any, form?: FormData, namespace?: string): FormData {
    const formData = form || new FormData();

    for (const property in object) {

      if (!object.hasOwnProperty(property) || !object[property]) { continue; }

      const formKey = namespace ? `${namespace}[${property}]` : property;
      if (object[property] instanceof Date) {
        formData.append(formKey, object[property].toISOString());
      } else if (object[property] instanceof FileList) {
        for (let i = 0; i < object[property].length; i++) {
          formData.append(`${property}[]`, object[property].item(i));
        }
      } else if (
        typeof object[property] === 'object' && !(object[property] instanceof File)) {
        this.createFormData(object[property], formData, formKey);
      } else {
        formData.append(formKey, object[property]);
      }
    }
    return formData;
  }



  protected buildUrl(url: string): string {
    let nUrl = `${this.config.endPoint.replace(/\/$/, '')}/${url.replace(/^\//g, '')}`;
    const match = nUrl.match(/\.([0-9a-z]+)(?:[\?#]|$)/i);

    if (this.config.mockData && match == null) {
      nUrl = `${nUrl}.json`;
    }

    return nUrl;
  }


  /**
   * Return the request headers based on configuration parameters
   */
  private buildHeaders() {
    const header = { ...this.baseHeader };

    if (this.config.language) { header['Accept-Language'] = this.config.language; }

    if (this.secureRequest) {
      const token = this.token;
      if (!token) {
        console.warn(
          'Executing a secure request without TOKEN. '
          + 'Authorization header will not be set!'
        );
      } else {
        header.Authorization = `Bearer ${token}`;
      }

      this.secureRequest = false;
    }

    return header;
  }



  /** Raw request method */
  protected request(
    method: HttpMethod, url: string, data?: any, responseType?: string,
    httpOptions: IHttpOptions = {}
  ): Observable<any> {
    const msDelay = Math.floor((Math.random() * 2000) + 1000);
    const header = this.buildHeaders();

    const rType = (responseType ? responseType : 'json') as 'text';

    if (this.withFilesRequest) { data = this.createFormData(data); this.withFilesRequest = false; }

    let cacheKey = '';
    if (this.cachedRequest) {
      cacheKey = btoa(unescape(encodeURIComponent(method + '_' + url + '_' + (method === HttpMethod.Get ? JSON.stringify(data) : ''))));
      if (!this.invalidateCache) {
        const cached = this.cache.get(cacheKey);
        if (cached) {
          this.cachedRequest = false;
          return of(cached);
        }
      } else {
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
      .request(
        this.config.mockData ? HttpMethod.Get : method, this.buildUrl(url),
        { ...options, ...httpOptions }
      )
      .pipe(takeUntil(this.cancelPending$))
      .pipe(delay(this.config.mockData ? msDelay : 0))
      .pipe(tap((resp: any) => {
        if (this.cachedRequest) {
          this.cachedRequest = false;
          this.cache.set(cacheKey, resp);
        }
      }
      ))
      .pipe(catchError((err) => {
        if (
          this.config.UnauthorizedRedirectUri
          && url !== this.config.authUri
          && err.status === 401
        ) {
          this.router.navigate([this.config.UnauthorizedRedirectUri]).then(() => { });
          this.cancelPendingRequests();
        }
        return throwError(err);
      }));
  }
}
