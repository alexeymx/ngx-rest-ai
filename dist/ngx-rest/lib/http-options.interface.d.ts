import { HttpHeaders, HttpParams } from '@angular/common/http';
export declare interface IHttpOptions {
    body?: any;
    headers?: HttpHeaders | {
        [header: string]: string | Array<string>;
    };
    params?: HttpParams | {
        [param: string]: string | Array<string>;
    };
    observe?: 'body' | 'events' | 'response';
    reportProgress?: boolean;
    responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
    withCredentials?: boolean;
}
