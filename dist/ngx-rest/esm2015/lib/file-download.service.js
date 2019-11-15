/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpRequest, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, distinctUntilChanged, filter } from 'rxjs/operators';
import { isNullOrUndefined, isUndefined } from 'util';
/**
 * FileDownload request options structure
 * @record
 */
export function IDownloadOptions() { }
if (false) {
    /** @type {?|undefined} */
    IDownloadOptions.prototype.params;
    /** @type {?|undefined} */
    IDownloadOptions.prototype.headers;
}
/** @enum {string} */
const FileDownloadState = {
    initialize: 'initialize',
    inProgress: 'inProgress',
    completed: 'completed',
};
export { FileDownloadState };
export class FileDownload {
    /**
     * Service class constructor
     * @param {?} http
     */
    constructor(http) {
        this.http = http;
    }
    /**
     * Convert bytes size to human readable format
     * @param {?} bytes
     * @return {?}
     */
    static humanReadableFormat(bytes) {
        /** @type {?} */
        const e = (Math.log(bytes) / Math.log(1e3)) | 0;
        return +(bytes / Math.pow(1e3, e)).toFixed(2) + ' ' + ('kMGTPEZY'[e - 1] || '') + 'B';
    }
    /**
     * Save the Blob data
     * @param {?} saveAs
     * @param {?} data
     * @return {?}
     */
    static blobSave(saveAs, data) {
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(data, saveAs);
        }
        else {
            /** @type {?} */
            const url = window.URL.createObjectURL(data);
            /** @type {?} */
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.setAttribute('style', 'display: none');
            a.href = url;
            a.download = saveAs;
            a.click();
            setTimeout((/**
             * @return {?}
             */
            () => { window.URL.revokeObjectURL(url); document.body.removeChild(a); }), 400);
        }
    }
    /**
     * Request the file to be downloaded
     * @private
     * @param {?} method
     * @param {?} url
     * @param {?} saveAs
     * @param {?=} options
     * @return {?}
     */
    download(method, url, saveAs, options = {}) {
        method = method.toLowerCase();
        if (['get', 'post', 'put'].indexOf(method) === -1) {
            throw new Error(`FileDownload: Method "${method}" not allow, use "GET", "POST" or "PUT"`);
        }
        /** @type {?} */
        let result = { state: null, saveAs: saveAs, total: 0, loaded: 0, progress: 0 };
        /** @type {?} */
        let Params = new HttpParams();
        /** @type {?} */
        const Options = {
            reportProgress: true,
            headers: new HttpHeaders(options.headers || {})
        };
        if (options.params) {
            Object.keys(options.params).forEach((/**
             * @param {?} key
             * @return {?}
             */
            (key) => { Params = Params.set(key, options.params[key]); }));
        }
        /** @type {?} */
        const res = method === 'GET'
            ? new HttpRequest(method, url, Object.assign({}, Options, { responseType: 'blob', params: Params }))
            : new HttpRequest(method, url, options.params || {}, Object.assign({}, Options, { responseType: 'blob' }));
        return this.http
            .request(res)
            .pipe(map((/**
         * @param {?} event
         * @return {?}
         */
        (event) => {
            switch (event.type) {
                case HttpEventType.Sent:
                    result = Object.assign({}, result, { state: FileDownloadState.initialize });
                    break;
                case HttpEventType.DownloadProgress:
                    if (!isUndefined(event.total)) {
                        result = Object.assign({}, result, {
                            state: FileDownloadState.inProgress,
                            total: event.total,
                            loaded: event.loaded,
                            progress: Math.round(100 * event.loaded / event.total)
                        });
                    }
                    break;
                case HttpEventType.Response:
                    if (result.state !== FileDownloadState.completed) {
                        result = Object.assign({}, result, { state: FileDownloadState.completed });
                        FileDownload.blobSave(saveAs, event.body);
                    }
                    break;
            }
            return result;
        })), filter((/**
         * @param {?} val
         * @return {?}
         */
        (val) => !isNullOrUndefined(val))), distinctUntilChanged());
    }
    /**
     * Upload the files using POST HTTP method
     * @param {?} url
     * @param {?} saveAs
     * @param {?=} options
     * @return {?}
     */
    get(url, saveAs, options = {}) {
        return this.download('get', url, saveAs, options);
    }
    /**
     * Upload the files using POST HTTP method
     * @param {?} url
     * @param {?} saveAs
     * @param {?=} options
     * @return {?}
     */
    post(url, saveAs, options = {}) {
        return this.download('post', url, saveAs, options);
    }
    /**
     * Upload the files using PUT HTTP method
     * @param {?} url
     * @param {?} saveAs
     * @param {?=} options
     * @return {?}
     */
    put(url, saveAs, options = {}) {
        return this.download('put', url, saveAs, options);
    }
}
FileDownload.decorators = [
    { type: Injectable }
];
/** @nocollapse */
FileDownload.ctorParameters = () => [
    { type: HttpClient }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    FileDownload.prototype.http;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS1kb3dubG9hZC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXJlc3QvIiwic291cmNlcyI6WyJsaWIvZmlsZS1kb3dubG9hZC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxVQUFVLEVBQUUsYUFBYSxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFFdkcsT0FBTyxFQUFFLEdBQUcsRUFBRSxvQkFBb0IsRUFBRSxNQUFNLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNuRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsV0FBVyxFQUFFLE1BQU0sTUFBTSxDQUFDOzs7OztBQUt0RCxzQ0FHQzs7O0lBRkcsa0NBQThCOztJQUM5QixtQ0FBYzs7OztJQU9kLFlBQWEsWUFBWTtJQUN6QixZQUFhLFlBQVk7SUFDekIsV0FBWSxXQUFXOzs7QUFJM0IsTUFBTSxPQUFPLFlBQVk7Ozs7O0lBS3JCLFlBQXFCLElBQWdCO1FBQWhCLFNBQUksR0FBSixJQUFJLENBQVk7SUFBTSxDQUFDOzs7Ozs7SUFLckMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLEtBQWE7O2NBQ3JDLENBQUMsR0FBRyxDQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBRSxHQUFHLENBQUM7UUFDakQsT0FBTyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQzFGLENBQUM7Ozs7Ozs7SUFLTSxNQUFNLENBQUMsUUFBUSxDQUFFLE1BQWMsRUFBRSxJQUFTO1FBRTdDLElBQUksTUFBTSxDQUFDLFNBQVMsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLGdCQUFnQixFQUFFO1lBQ3ZELE1BQU0sQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQ25EO2FBQU07O2tCQUNHLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUM7O2tCQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQztZQUU3RSxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QixDQUFDLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxlQUFlLENBQUMsQ0FBQztZQUN6QyxDQUFDLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztZQUNiLENBQUMsQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDO1lBQ3BCLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNWLFVBQVU7OztZQUFDLEdBQUcsRUFBRSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUUsR0FBRyxDQUFDLENBQUM7U0FDN0Y7SUFDTCxDQUFDOzs7Ozs7Ozs7O0lBS08sUUFBUSxDQUFDLE1BQWMsRUFBRSxHQUFXLEVBQUUsTUFBYyxFQUFFLFVBQTRCLEVBQUU7UUFDeEYsTUFBTSxHQUFHLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUM5QixJQUFLLENBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUUsQ0FBQyxPQUFPLENBQUUsTUFBTSxDQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUc7WUFDckQsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBMEIsTUFBTyx5Q0FBeUMsQ0FBQyxDQUFDO1NBQy9GOztZQUVHLE1BQU0sR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRTs7WUFDMUUsTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFOztjQUV2QixPQUFPLEdBQUc7WUFDWixjQUFjLEVBQUUsSUFBSTtZQUNwQixPQUFPLEVBQUUsSUFBSSxXQUFXLENBQUUsT0FBTyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUM7U0FDbkQ7UUFFRCxJQUFLLE9BQU8sQ0FBQyxNQUFNLEVBQUc7WUFDbEIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTzs7OztZQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsR0FBRyxNQUFNLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUM7U0FDcEc7O2NBRUssR0FBRyxHQUFHLE1BQU0sS0FBSyxLQUFLO1lBQ3hCLENBQUMsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxvQkFBTyxPQUFPLEVBQUssRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsRUFBRztZQUMzRixDQUFDLENBQUMsSUFBSSxXQUFXLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxPQUFPLENBQUMsTUFBTSxJQUFJLEVBQUUsb0JBQU8sT0FBTyxFQUFLLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxFQUFHO1FBRXJHLE9BQU8sSUFBSSxDQUFDLElBQUk7YUFDWCxPQUFPLENBQUMsR0FBRyxDQUFDO2FBQ1osSUFBSSxDQUNELEdBQUc7Ozs7UUFBQyxDQUFFLEtBQUssRUFBRyxFQUFFO1lBQ1osUUFBUSxLQUFLLENBQUMsSUFBSSxFQUFFO2dCQUNoQixLQUFLLGFBQWEsQ0FBQyxJQUFJO29CQUNuQixNQUFNLHFCQUFRLE1BQU0sRUFBSyxFQUFFLEtBQUssRUFBRSxpQkFBaUIsQ0FBQyxVQUFVLEVBQUUsQ0FBRSxDQUFDO29CQUNuRSxNQUFNO2dCQUNWLEtBQUssYUFBYSxDQUFDLGdCQUFnQjtvQkFDL0IsSUFBSyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUc7d0JBQzdCLE1BQU0scUJBQ0MsTUFBTSxFQUNOOzRCQUNDLEtBQUssRUFBRSxpQkFBaUIsQ0FBQyxVQUFVOzRCQUNuQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUs7NEJBQ2xCLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTTs0QkFDcEIsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQzt5QkFDekQsQ0FDSixDQUFDO3FCQUNMO29CQUNELE1BQU07Z0JBQ1YsS0FBSyxhQUFhLENBQUMsUUFBUTtvQkFDdkIsSUFBSyxNQUFNLENBQUMsS0FBSyxLQUFLLGlCQUFpQixDQUFDLFNBQVMsRUFBRzt3QkFDaEQsTUFBTSxxQkFBUSxNQUFNLEVBQUssRUFBRSxLQUFLLEVBQUUsaUJBQWlCLENBQUMsU0FBUyxFQUFFLENBQUUsQ0FBQzt3QkFDbEUsWUFBWSxDQUFDLFFBQVEsQ0FBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBRSxDQUFDO3FCQUMvQztvQkFDRCxNQUFNO2FBQ2I7WUFDRCxPQUFPLE1BQU0sQ0FBQztRQUNsQixDQUFDLEVBQUMsRUFDRixNQUFNOzs7O1FBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEVBQUMsRUFDeEMsb0JBQW9CLEVBQUUsQ0FDekIsQ0FBQztJQUNWLENBQUM7Ozs7Ozs7O0lBS00sR0FBRyxDQUFFLEdBQVcsRUFBRSxNQUFjLEVBQUUsVUFBNEIsRUFBRTtRQUNuRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDdEQsQ0FBQzs7Ozs7Ozs7SUFLTSxJQUFJLENBQUUsR0FBVyxFQUFFLE1BQWMsRUFBRSxVQUE0QixFQUFFO1FBQ3BFLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN2RCxDQUFDOzs7Ozs7OztJQUtNLEdBQUcsQ0FBRSxHQUFXLEVBQUUsTUFBYyxFQUFFLFVBQTRCLEVBQUU7UUFDbkUsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3RELENBQUM7OztZQWxISixVQUFVOzs7O1lBdEJGLFVBQVU7Ozs7Ozs7SUE0QkYsNEJBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cEV2ZW50VHlwZSwgSHR0cFJlcXVlc3QsIEh0dHBIZWFkZXJzLCBIdHRwUGFyYW1zIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbWFwLCBkaXN0aW5jdFVudGlsQ2hhbmdlZCwgZmlsdGVyIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgaXNOdWxsT3JVbmRlZmluZWQsIGlzVW5kZWZpbmVkIH0gZnJvbSAndXRpbCc7XG5cbi8qKlxuICogRmlsZURvd25sb2FkIHJlcXVlc3Qgb3B0aW9ucyBzdHJ1Y3R1cmVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJRG93bmxvYWRPcHRpb25zIHtcbiAgICBwYXJhbXM/OiB7W2tleTogc3RyaW5nXTogYW55fTtcbiAgICBoZWFkZXJzPzogYW55O1xufVxuXG4vKipcbiAqIEZpbGVEb3dubG9hZCByZXF1ZXN0IHN0YXRlIGVudW1cbiAqL1xuZXhwb3J0IGVudW0gRmlsZURvd25sb2FkU3RhdGUge1xuICAgIGluaXRpYWxpemUgPSAnaW5pdGlhbGl6ZScsXG4gICAgaW5Qcm9ncmVzcyA9ICdpblByb2dyZXNzJyxcbiAgICBjb21wbGV0ZWQgPSAnY29tcGxldGVkJyxcbn1cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEZpbGVEb3dubG9hZCB7XG5cbiAgICAvKipcbiAgICAgKiBTZXJ2aWNlIGNsYXNzIGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCApIHsgIH1cblxuICAgIC8qKlxuICAgICAqIENvbnZlcnQgYnl0ZXMgc2l6ZSB0byBodW1hbiByZWFkYWJsZSBmb3JtYXRcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGh1bWFuUmVhZGFibGVGb3JtYXQoYnl0ZXM6IG51bWJlcikge1xuICAgICAgICBjb25zdCBlID0gKCBNYXRoLmxvZyhieXRlcykgLyBNYXRoLmxvZygxZTMpICkgfCAwO1xuICAgICAgICByZXR1cm4gKyhieXRlcyAvIE1hdGgucG93KDFlMywgZSkpLnRvRml4ZWQoMikgKyAnICcgKyAoJ2tNR1RQRVpZJ1tlIC0gMV0gfHwgJycpICsgJ0InO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNhdmUgdGhlIEJsb2IgZGF0YVxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgYmxvYlNhdmUoIHNhdmVBczogc3RyaW5nLCBkYXRhOiBhbnkgKSB7XG5cbiAgICAgICAgaWYgKHdpbmRvdy5uYXZpZ2F0b3IgJiYgd2luZG93Lm5hdmlnYXRvci5tc1NhdmVPck9wZW5CbG9iKSB7XG4gICAgICAgICAgICB3aW5kb3cubmF2aWdhdG9yLm1zU2F2ZU9yT3BlbkJsb2IoZGF0YSwgc2F2ZUFzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKGRhdGEpLCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGEpO1xuICAgICAgICAgICAgYS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ2Rpc3BsYXk6IG5vbmUnKTtcbiAgICAgICAgICAgIGEuaHJlZiA9IHVybDtcbiAgICAgICAgICAgIGEuZG93bmxvYWQgPSBzYXZlQXM7XG4gICAgICAgICAgICBhLmNsaWNrKCk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgd2luZG93LlVSTC5yZXZva2VPYmplY3RVUkwodXJsKTsgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChhKTsgfSwgNDAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlcXVlc3QgdGhlIGZpbGUgdG8gYmUgZG93bmxvYWRlZFxuICAgICAqL1xuICAgIHByaXZhdGUgZG93bmxvYWQobWV0aG9kOiBzdHJpbmcsIHVybDogc3RyaW5nLCBzYXZlQXM6IHN0cmluZywgb3B0aW9uczogSURvd25sb2FkT3B0aW9ucyA9IHt9KTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICAgICAgbWV0aG9kID0gbWV0aG9kLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmICggWyAnZ2V0JywgJ3Bvc3QnLCAncHV0JyBdLmluZGV4T2YoIG1ldGhvZCApID09PSAtMSApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRmlsZURvd25sb2FkOiBNZXRob2QgXCIkeyBtZXRob2QgfVwiIG5vdCBhbGxvdywgdXNlIFwiR0VUXCIsIFwiUE9TVFwiIG9yIFwiUFVUXCJgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCByZXN1bHQgPSB7IHN0YXRlOiBudWxsLCBzYXZlQXM6IHNhdmVBcywgdG90YWw6IDAsIGxvYWRlZDogMCwgcHJvZ3Jlc3M6IDAgfSxcbiAgICAgICAgICAgIFBhcmFtcyA9IG5ldyBIdHRwUGFyYW1zKCk7XG5cbiAgICAgICAgY29uc3QgT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHJlcG9ydFByb2dyZXNzOiB0cnVlLFxuICAgICAgICAgICAgaGVhZGVyczogbmV3IEh0dHBIZWFkZXJzKCBvcHRpb25zLmhlYWRlcnMgfHwge30pXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKCBvcHRpb25zLnBhcmFtcyApIHtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKG9wdGlvbnMucGFyYW1zKS5mb3JFYWNoKChrZXkpID0+IHsgUGFyYW1zID0gUGFyYW1zLnNldChrZXksIG9wdGlvbnMucGFyYW1zW2tleV0pOyB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlcyA9IG1ldGhvZCA9PT0gJ0dFVCdcbiAgICAgICAgICAgID8gbmV3IEh0dHBSZXF1ZXN0KG1ldGhvZCwgdXJsLCB7IC4uLk9wdGlvbnMsIC4uLnsgcmVzcG9uc2VUeXBlOiAnYmxvYicsIHBhcmFtczogUGFyYW1zIH0gfSlcbiAgICAgICAgICAgIDogbmV3IEh0dHBSZXF1ZXN0KG1ldGhvZCwgdXJsLCBvcHRpb25zLnBhcmFtcyB8fCB7fSwgeyAuLi5PcHRpb25zLCAuLi57IHJlc3BvbnNlVHlwZTogJ2Jsb2InIH0gfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cFxuICAgICAgICAgICAgLnJlcXVlc3QocmVzKVxuICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgICAgbWFwKCggZXZlbnQgKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoZXZlbnQudHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBIdHRwRXZlbnRUeXBlLlNlbnQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0geyAuLi5yZXN1bHQsIC4uLnsgc3RhdGU6IEZpbGVEb3dubG9hZFN0YXRlLmluaXRpYWxpemUgfSB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBIdHRwRXZlbnRUeXBlLkRvd25sb2FkUHJvZ3Jlc3M6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCAhaXNVbmRlZmluZWQoZXZlbnQudG90YWwpICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5yZXN1bHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGU6IEZpbGVEb3dubG9hZFN0YXRlLmluUHJvZ3Jlc3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG90YWw6IGV2ZW50LnRvdGFsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRlZDogZXZlbnQubG9hZGVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2dyZXNzOiBNYXRoLnJvdW5kKDEwMCAqIGV2ZW50LmxvYWRlZCAvIGV2ZW50LnRvdGFsKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgSHR0cEV2ZW50VHlwZS5SZXNwb25zZTpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHJlc3VsdC5zdGF0ZSAhPT0gRmlsZURvd25sb2FkU3RhdGUuY29tcGxldGVkICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB7IC4uLnJlc3VsdCwgLi4ueyBzdGF0ZTogRmlsZURvd25sb2FkU3RhdGUuY29tcGxldGVkIH0gfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRmlsZURvd25sb2FkLmJsb2JTYXZlKCBzYXZlQXMsIGV2ZW50LmJvZHkgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBmaWx0ZXIoKHZhbCkgPT4gIWlzTnVsbE9yVW5kZWZpbmVkKHZhbCkpLFxuICAgICAgICAgICAgICAgIGRpc3RpbmN0VW50aWxDaGFuZ2VkKClcbiAgICAgICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBsb2FkIHRoZSBmaWxlcyB1c2luZyBQT1NUIEhUVFAgbWV0aG9kXG4gICAgICovXG4gICAgcHVibGljIGdldCggdXJsOiBzdHJpbmcsIHNhdmVBczogc3RyaW5nLCBvcHRpb25zOiBJRG93bmxvYWRPcHRpb25zID0ge30gKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZG93bmxvYWQoJ2dldCcsIHVybCwgc2F2ZUFzLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVcGxvYWQgdGhlIGZpbGVzIHVzaW5nIFBPU1QgSFRUUCBtZXRob2RcbiAgICAgKi9cbiAgICBwdWJsaWMgcG9zdCggdXJsOiBzdHJpbmcsIHNhdmVBczogc3RyaW5nLCBvcHRpb25zOiBJRG93bmxvYWRPcHRpb25zID0ge30gKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZG93bmxvYWQoJ3Bvc3QnLCB1cmwsIHNhdmVBcywgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBsb2FkIHRoZSBmaWxlcyB1c2luZyBQVVQgSFRUUCBtZXRob2RcbiAgICAgKi9cbiAgICBwdWJsaWMgcHV0KCB1cmw6IHN0cmluZywgc2F2ZUFzOiBzdHJpbmcsIG9wdGlvbnM6IElEb3dubG9hZE9wdGlvbnMgPSB7fSApOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5kb3dubG9hZCgncHV0JywgdXJsLCBzYXZlQXMsIG9wdGlvbnMpO1xuICAgIH1cblxufVxuIl19