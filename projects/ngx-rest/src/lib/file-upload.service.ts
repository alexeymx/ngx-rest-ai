import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, distinctUntilChanged, filter } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';

/**
 * FileUpload request options structure
 */
export interface IUploadOptions {
    listParameterName?: any;
    params?: {[key: string]: any};
    headers?: any;
}

/**
 * FileUpload request state enum
 */
export enum FileUploadState {
    initialize = 'initialize',
    inProgress = 'inProgress',
    completed = 'completed'
}

@Injectable()
export class FileUpload {

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
     * Convert bytes size to human readable format
     */
    public static calculateSize(files: FileList) {
        let size = 0;
        Array.from(files).forEach((file) => { size += file.size; });
        return size;
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
            } else if ( object[property] instanceof FileList ) {
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

    /**
     * Upload the file list
     */
    private upload( method: string, url: string, files: FileList, options?: IUploadOptions ): Observable<any> {
        method = method.toLowerCase();
        if ( [ 'post', 'put' ].indexOf( method ) === -1 ) {
            throw new Error(`FileUpload: Method "${ method }" not allow, use "POST" or "PUT"`);
        }

        let result = { state: null, files: files, total: 0, loaded: 0, progress: 0 };

        const Params = {  };

        Params[options.listParameterName ? options.listParameterName : 'files'] = files;

        const res = new HttpRequest(
            method, url,
            this.createFormData( options.params ? { ...Params, ...options.params } : Params ),
            { reportProgress: true, headers: new HttpHeaders(options.headers ? options.headers : {}) }
        );

        return this.http
            .request(res)
            .pipe(
                map(( event ) => {
                    switch (event.type) {
                        case HttpEventType.Sent:
                            result = { ...result, ...{ state: FileUploadState.initialize } };
                            break;
                        case HttpEventType.UploadProgress:
                            result = {
                                ...result,
                                ...{
                                    state: event.total !== event.loaded ? FileUploadState.inProgress : FileUploadState.completed,
                                    total: event.total,
                                    loaded: event.loaded,
                                    progress: Math.round(100 * event.loaded / event.total)
                                }
                            };
                            break;
                        case HttpEventType.Response:
                            if ( result.state !== FileUploadState.completed ) {
                                result = { ...result, ...{ state: FileUploadState.completed } };
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
    public post( url: string, files: FileList, options?: IUploadOptions ): Observable<any> {
        return this.upload('post', url, files, options);
    }

    /**
     * Upload the files using PUT HTTP method
     */
    public put( url: string, files: FileList, options?: IUploadOptions ): Observable<any> {
        return this.upload('put', url, files, options);
    }

}
