import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
/**
 * FileDownload request options structure
 */
export interface IDownloadOptions {
    params?: {
        [key: string]: any;
    };
    headers?: any;
}
/**
 * FileDownload request state enum
 */
export declare enum FileDownloadState {
    initialize = "initialize",
    inProgress = "inProgress",
    completed = "completed"
}
export declare class FileDownload {
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
     * Save the Blob data
     */
    static blobSave(saveAs: string, data: any): void;
    /**
     * Request the file to be downloaded
     */
    private download;
    /**
     * Upload the files using POST HTTP method
     */
    get(url: string, saveAs: string, options?: IDownloadOptions): Observable<any>;
    /**
     * Upload the files using POST HTTP method
     */
    post(url: string, saveAs: string, options?: IDownloadOptions): Observable<any>;
    /**
     * Upload the files using PUT HTTP method
     */
    put(url: string, saveAs: string, options?: IDownloadOptions): Observable<any>;
}
