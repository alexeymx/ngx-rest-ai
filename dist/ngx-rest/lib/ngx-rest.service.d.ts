import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie';
import { Observable, Subject } from 'rxjs';
import { IHttpOptions } from './http-options.interface';
import { HttpMethod } from './http-method.enum';
import { RestServiceConfig } from './ngx-rest.config';
import { CacheService } from './cache.service';
export declare class RestClientService {
    private http;
    private cookies;
    private cache;
    private readonly router;
    /** Handler used to stop all pending requests */
    protected cancelPending$: Subject<boolean>;
    /**  Default requests header */
    protected baseHeader: {
        'Cache-Control': string;
        accept: string;
        Pragma: string;
        Authorization: string;
        'Accept-Language': string;
    };
    /** Service configuration parameters */
    protected config: RestServiceConfig;
    /** When true, the request header will include the authentication token */
    protected secureRequest: boolean;
    /** Holds a list of files to be upload on request */
    protected withFilesRequest: boolean;
    /** Prefer cache */
    protected cachedRequest: boolean;
    /** Invalidate cache */
    protected invalidateCache: boolean;
    constructor(http: HttpClient, cookies: CookieService, cache: CacheService, router: Router, config: RestServiceConfig);
    /**
     * Set the Rest Client configuration parameters.
     *
     * CAUTION: This method overrides the current configuration settings
     * and this settings will apply to all following requests
     */
    setConfig(config: RestServiceConfig): RestClientService;
    /** Return the current Rest Client configuration parameters.  */
    getConfig(): RestServiceConfig;
    /**
     * Get the API Token from cookies
     */
    /**
    * Save the API Token cookie
    */
    token: string;
    /**
     * Remove the Authentication token cookie
     */
    revoke(): void;
    /**
     * Request an Authorization token
     * The default authorization URI is '[API_END_POINT]/authorize'
     * @param username Username
     * @param password Password
     */
    authorize(username: string, password: string): Observable<any>;
    /** Validate the Authentication token against the API */
    validateToken(url: string): Observable<any>;
    /** Removes authorization token */
    deauthorize(url: string): Observable<any>;
    /** Check if the client is already Authenticate  */
    isAuthorized(): boolean;
    /** Cancel all pending requests */
    cancelPendingRequests(): void;
    cached(invalidate?: boolean): this;
    /**
     * Set the request mode to SECURED for the next request.
     *
     * Secured Mode force the next request to include the authentication token.
     * The token must be requested previously using the "authorize" method.
     */
    secured(): RestClientService;
    /**
     * Set the request mode to PUBLIC for the next request.
     *
     * Public is the default request mode and ensure that no authentication token
     * will be pass on the next request.
     */
    public(): RestClientService;
    /**
     * API request using GET method
     *
     * @param url
     * @param data A list of parametes
     */
    get(url: string, data?: {}): Observable<any>;
    /**
     * API request using POST method
     *
     * @param url
     * @param data
     * @param responseType
     * @param httpOptions
     */
    post(url: string, data?: {}, responseType?: string, httpOptions?: IHttpOptions): Observable<any>;
    /**
     * API request using PUT method
     *
     * @param url
     * @param data
     * @param responseType
     * @param httpOptions
     */
    put(url: string, data?: {}, responseType?: string, httpOptions?: IHttpOptions): Observable<any>;
    /**
     * API request using DELETE method
     *
     * @param url
     * @param data
     * @param responseType
     */
    delete(url: string, data?: {}, responseType?: string): Observable<any>;
    /** Set the upload file mode */
    withFiles(): RestClientService;
    /**
     * Create a FormData object to be send as request payload data
     */
    protected createFormData(object: any, form?: FormData, namespace?: string): FormData;
    protected buildUrl(url: string): string;
    /**
     * Return the request headers based on configuration parameters
     */
    private buildHeaders;
    /** Raw request method */
    protected request(method: HttpMethod, url: string, data?: any, responseType?: string, httpOptions?: IHttpOptions): Observable<any>;
}
