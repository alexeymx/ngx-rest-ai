import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpRequest, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/index';
import { map, distinctUntilChanged, filter } from 'rxjs/operators';
import { isNullOrUndefined, isUndefined } from 'util';

/**
 * FileDownload request options structure
 */
export interface IDownloadOptions {
    params?: {[key: string]: any};
    headers?: any;
}

/**
 * FileDownload request state enum
 */
export enum FileDownloadState {
    initialize = 'initialize',
    inProgress = 'inProgress',
    completed = 'completed',
}

@Injectable()
export class FileDownload {

    /**
     * Service class constructor
     */
    constructor( private http: HttpClient ) {  }

    /**
     * Convert bytes size to human readable format
     */
    public static humanReadableFormat(bytes: number) {
        const e = ( Math.log(bytes) / Math.log(1e3) ) | 0;
        return +(bytes / Math.pow(1e3, e)).toFixed(2) + ' ' + ('kMGTPEZY'[e - 1] || '') + 'B';
    }

    /**
     * Save the Blob data
     */
    public static blobSave( saveAs: string, data: any ) {

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(data, saveAs);
        } else {
            const url = window.URL.createObjectURL(data), a = document.createElement('a');

            document.body.appendChild(a);
            a.setAttribute('style', 'display: none');
            a.href = url;
            a.download = saveAs;
            a.click();
            setTimeout(() => { window.URL.revokeObjectURL(url); document.body.removeChild(a); }, 400);
        }
    }

    /**
     * Request the file to be downloaded
     */
    private download(method: string, url: string, saveAs: string, options: IDownloadOptions = {}): Observable<any> {
        method = method.toLowerCase();
        if ( [ 'get', 'post', 'put' ].indexOf( method ) === -1 ) {
            throw new Error(`FileDownload: Method "${ method }" not allow, use "GET", "POST" or "PUT"`);
        }

        let result = { state: null, saveAs: saveAs, total: 0, loaded: 0, progress: 0 },
            Params = new HttpParams();

        const Options = {
            reportProgress: true,
            headers: new HttpHeaders( options.headers || {})
        };

        if ( options.params ) {
            Object.keys(options.params).forEach((key) => { Params = Params.set(key, options.params[key]); });
        }

        const res = method === 'GET'
            ? new HttpRequest(method, url, { ...Options, ...{ responseType: 'blob', params: Params } })
            : new HttpRequest(method, url, options.params || {}, { ...Options, ...{ responseType: 'blob' } });

        return this.http
            .request(res)
            .pipe(
                map(( event ) => {
                    switch (event.type) {
                        case HttpEventType.Sent:
                            result = { ...result, ...{ state: FileDownloadState.initialize } };
                            break;
                        case HttpEventType.DownloadProgress:
                            if ( !isUndefined(event.total) ) {
                                result = {
                                    ...result,
                                    ...{
                                        state: FileDownloadState.inProgress,
                                        total: event.total,
                                        loaded: event.loaded,
                                        progress: Math.round(100 * event.loaded / event.total)
                                    }
                                };
                            }
                            break;
                        case HttpEventType.Response:
                            if ( result.state !== FileDownloadState.completed ) {
                                result = { ...result, ...{ state: FileDownloadState.completed } };
                                FileDownload.blobSave( saveAs, event.body );
                            }
                            break;
                    }
                    return result;
                }),
                filter((val) => !isNullOrUndefined(val)),
                distinctUntilChanged()
            );
    }

    /**
     * Upload the files using POST HTTP method
     */
    public get( url: string, saveAs: string, options: IDownloadOptions = {} ): Observable<any> {
        return this.download('get', url, saveAs, options);
    }

    /**
     * Upload the files using POST HTTP method
     */
    public post( url: string, saveAs: string, options: IDownloadOptions = {} ): Observable<any> {
        return this.download('post', url, saveAs, options);
    }

    /**
     * Upload the files using PUT HTTP method
     */
    public put( url: string, saveAs: string, options: IDownloadOptions = {} ): Observable<any> {
        return this.download('put', url, saveAs, options);
    }

}
