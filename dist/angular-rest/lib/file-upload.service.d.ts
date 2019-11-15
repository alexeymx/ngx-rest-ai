import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/index';
/**
 * FileUpload request options structure
 */
export interface IUploadOptions {
    listParameterName?: any;
    params?: {
        [key: string]: any;
    };
    headers?: any;
}
/**
 * FileUpload request state enum
 */
export declare enum FileUploadState {
    initialize = "initialize",
    inProgress = "inProgress",
    completed = "completed"
}
export declare class FileUpload {
    private http;
    /**
     * Service class constructor
     */
    constructor(http: HttpClient);
    /**
     * Convert bytes size to human readable format
     */
    static humanReadableFormat(bytes: number): string;
    /**
     * Convert bytes size to human readable format
     */
    static calculateSize(files: FileList): number;
    /**
     * Create a FormData object to be send as request payload data
     */
    protected createFormData(object: any, form?: FormData, namespace?: string): FormData;
    /**
     * Upload the file list
     */
    private upload;
    /**
     * Upload the files using POST HTTP method
     */
    post(url: string, files: FileList, options?: IUploadOptions): Observable<any>;
    /**
     * Upload the files using PUT HTTP method
     */
    put(url: string, files: FileList, options?: IUploadOptions): Observable<any>;
}
