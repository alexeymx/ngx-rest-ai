/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
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
var FileDownloadState = {
    initialize: 'initialize',
    inProgress: 'inProgress',
    completed: 'completed',
};
export { FileDownloadState };
var FileDownload = /** @class */ (function () {
    /**
     * Service class constructor
     */
    function FileDownload(http) {
        this.http = http;
    }
    /**
     * Convert bytes size to human readable format
     */
    /**
     * Convert bytes size to human readable format
     * @param {?} bytes
     * @return {?}
     */
    FileDownload.humanReadableFormat = /**
     * Convert bytes size to human readable format
     * @param {?} bytes
     * @return {?}
     */
    function (bytes) {
        /** @type {?} */
        var e = (Math.log(bytes) / Math.log(1e3)) | 0;
        return +(bytes / Math.pow(1e3, e)).toFixed(2) + ' ' + ('kMGTPEZY'[e - 1] || '') + 'B';
    };
    /**
     * Save the Blob data
     */
    /**
     * Save the Blob data
     * @param {?} saveAs
     * @param {?} data
     * @return {?}
     */
    FileDownload.blobSave = /**
     * Save the Blob data
     * @param {?} saveAs
     * @param {?} data
     * @return {?}
     */
    function (saveAs, data) {
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(data, saveAs);
        }
        else {
            /** @type {?} */
            var url_1 = window.URL.createObjectURL(data);
            /** @type {?} */
            var a_1 = document.createElement('a');
            document.body.appendChild(a_1);
            a_1.setAttribute('style', 'display: none');
            a_1.href = url_1;
            a_1.download = saveAs;
            a_1.click();
            setTimeout((/**
             * @return {?}
             */
            function () { window.URL.revokeObjectURL(url_1); document.body.removeChild(a_1); }), 400);
        }
    };
    /**
     * Request the file to be downloaded
     */
    /**
     * Request the file to be downloaded
     * @private
     * @param {?} method
     * @param {?} url
     * @param {?} saveAs
     * @param {?=} options
     * @return {?}
     */
    FileDownload.prototype.download = /**
     * Request the file to be downloaded
     * @private
     * @param {?} method
     * @param {?} url
     * @param {?} saveAs
     * @param {?=} options
     * @return {?}
     */
    function (method, url, saveAs, options) {
        if (options === void 0) { options = {}; }
        method = method.toLowerCase();
        if (['get', 'post', 'put'].indexOf(method) === -1) {
            throw new Error("FileDownload: Method \"" + method + "\" not allow, use \"GET\", \"POST\" or \"PUT\"");
        }
        /** @type {?} */
        var result = { state: null, saveAs: saveAs, total: 0, loaded: 0, progress: 0 };
        /** @type {?} */
        var Params = new HttpParams();
        /** @type {?} */
        var Options = {
            reportProgress: true,
            headers: new HttpHeaders(options.headers || {})
        };
        if (options.params) {
            Object.keys(options.params).forEach((/**
             * @param {?} key
             * @return {?}
             */
            function (key) { Params = Params.set(key, options.params[key]); }));
        }
        /** @type {?} */
        var res = method === 'GET'
            ? new HttpRequest(method, url, tslib_1.__assign({}, Options, { responseType: 'blob', params: Params }))
            : new HttpRequest(method, url, options.params || {}, tslib_1.__assign({}, Options, { responseType: 'blob' }));
        return this.http
            .request(res)
            .pipe(map((/**
         * @param {?} event
         * @return {?}
         */
        function (event) {
            switch (event.type) {
                case HttpEventType.Sent:
                    result = tslib_1.__assign({}, result, { state: FileDownloadState.initialize });
                    break;
                case HttpEventType.DownloadProgress:
                    if (!isUndefined(event.total)) {
                        result = tslib_1.__assign({}, result, {
                            state: FileDownloadState.inProgress,
                            total: event.total,
                            loaded: event.loaded,
                            progress: Math.round(100 * event.loaded / event.total)
                        });
                    }
                    break;
                case HttpEventType.Response:
                    if (result.state !== FileDownloadState.completed) {
                        result = tslib_1.__assign({}, result, { state: FileDownloadState.completed });
                        FileDownload.blobSave(saveAs, event.body);
                    }
                    break;
            }
            return result;
        })), filter((/**
         * @param {?} val
         * @return {?}
         */
        function (val) { return !isNullOrUndefined(val); })), distinctUntilChanged());
    };
    /**
     * Upload the files using POST HTTP method
     */
    /**
     * Upload the files using POST HTTP method
     * @param {?} url
     * @param {?} saveAs
     * @param {?=} options
     * @return {?}
     */
    FileDownload.prototype.get = /**
     * Upload the files using POST HTTP method
     * @param {?} url
     * @param {?} saveAs
     * @param {?=} options
     * @return {?}
     */
    function (url, saveAs, options) {
        if (options === void 0) { options = {}; }
        return this.download('get', url, saveAs, options);
    };
    /**
     * Upload the files using POST HTTP method
     */
    /**
     * Upload the files using POST HTTP method
     * @param {?} url
     * @param {?} saveAs
     * @param {?=} options
     * @return {?}
     */
    FileDownload.prototype.post = /**
     * Upload the files using POST HTTP method
     * @param {?} url
     * @param {?} saveAs
     * @param {?=} options
     * @return {?}
     */
    function (url, saveAs, options) {
        if (options === void 0) { options = {}; }
        return this.download('post', url, saveAs, options);
    };
    /**
     * Upload the files using PUT HTTP method
     */
    /**
     * Upload the files using PUT HTTP method
     * @param {?} url
     * @param {?} saveAs
     * @param {?=} options
     * @return {?}
     */
    FileDownload.prototype.put = /**
     * Upload the files using PUT HTTP method
     * @param {?} url
     * @param {?} saveAs
     * @param {?=} options
     * @return {?}
     */
    function (url, saveAs, options) {
        if (options === void 0) { options = {}; }
        return this.download('put', url, saveAs, options);
    };
    FileDownload.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    FileDownload.ctorParameters = function () { return [
        { type: HttpClient }
    ]; };
    return FileDownload;
}());
export { FileDownload };
if (false) {
    /**
     * @type {?}
     * @private
     */
    FileDownload.prototype.http;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS1kb3dubG9hZC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXJlc3QvIiwic291cmNlcyI6WyJsaWIvZmlsZS1kb3dubG9hZC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsVUFBVSxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRXZHLE9BQU8sRUFBRSxHQUFHLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbkUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFdBQVcsRUFBRSxNQUFNLE1BQU0sQ0FBQzs7Ozs7QUFLdEQsc0NBR0M7OztJQUZHLGtDQUE4Qjs7SUFDOUIsbUNBQWM7Ozs7SUFPZCxZQUFhLFlBQVk7SUFDekIsWUFBYSxZQUFZO0lBQ3pCLFdBQVksV0FBVzs7O0FBRzNCO0lBR0k7O09BRUc7SUFDSCxzQkFBcUIsSUFBZ0I7UUFBaEIsU0FBSSxHQUFKLElBQUksQ0FBWTtJQUFNLENBQUM7SUFFNUM7O09BRUc7Ozs7OztJQUNXLGdDQUFtQjs7Ozs7SUFBakMsVUFBa0MsS0FBYTs7WUFDckMsQ0FBQyxHQUFHLENBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFFLEdBQUcsQ0FBQztRQUNqRCxPQUFPLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUM7SUFDMUYsQ0FBQztJ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QVYsVUFBWSxHQUFXLEVBQUUsTUFBYyxFQUFFLE9BQThCO1FBQTlCLHdCQUFBLEVBQUEsWUFBOEI7UUFDbkUsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRDs7T0FFRzs7Ozs7Ozs7SUFDSSwyQkFBSTs7Ozs7OztJQUFYLFVBQWEsR0FBVyxFQUFFLE1BQWMsRUFBRSxPQUE4QjtRQUE5Qix3QkFBQSxFQUFBLFlBQThCO1FBQ3BFLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQ7O09BRUc7Ozs7Ozs7O0lBQ0ksMEJBQUc7Ozs7Ozs7SUFBVixVQUFZLEdBQVcsRUFBRSxNQUFjLEVBQUUsT0FBOEI7UUFBOUIsd0JBQUEsRUFBQSxZQUE4QjtRQUNuRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDdEQsQ0FBQzs7Z0JBbEhKLFVBQVU7Ozs7Z0JBdEJGLFVBQVU7O0lBMEluQixtQkFBQztDQUFBLEFBcEhELElBb0hDO1NBbkhZLFlBQVk7Ozs7OztJQUtSLDRCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBFdmVudFR5cGUsIEh0dHBSZXF1ZXN0LCBIdHRwSGVhZGVycywgSHR0cFBhcmFtcyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzL2luZGV4JztcbmltcG9ydCB7IG1hcCwgZGlzdGluY3RVbnRpbENoYW5nZWQsIGZpbHRlciB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IGlzTnVsbE9yVW5kZWZpbmVkLCBpc1VuZGVmaW5lZCB9IGZyb20gJ3V0aWwnO1xuXG4vKipcbiAqIEZpbGVEb3dubG9hZCByZXF1ZXN0IG9wdGlvbnMgc3RydWN0dXJlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSURvd25sb2FkT3B0aW9ucyB7XG4gICAgcGFyYW1zPzoge1trZXk6IHN0cmluZ106IGFueX07XG4gICAgaGVhZGVycz86IGFueTtcbn1cblxuLyoqXG4gKiBGaWxlRG93bmxvYWQgcmVxdWVzdCBzdGF0ZSBlbnVtXG4gKi9cbmV4cG9ydCBlbnVtIEZpbGVEb3dubG9hZFN0YXRlIHtcbiAgICBpbml0aWFsaXplID0gJ2luaXRpYWxpemUnLFxuICAgIGluUHJvZ3Jlc3MgPSAnaW5Qcm9ncmVzcycsXG4gICAgY29tcGxldGVkID0gJ2NvbXBsZXRlZCcsXG59XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBGaWxlRG93bmxvYWQge1xuXG4gICAgLyoqXG4gICAgICogU2VydmljZSBjbGFzcyBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKCBwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQgKSB7ICB9XG5cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0IGJ5dGVzIHNpemUgdG8gaHVtYW4gcmVhZGFibGUgZm9ybWF0XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBodW1hblJlYWRhYmxlRm9ybWF0KGJ5dGVzOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgZSA9ICggTWF0aC5sb2coYnl0ZXMpIC8gTWF0aC5sb2coMWUzKSApIHwgMDtcbiAgICAgICAgcmV0dXJuICsoYnl0ZXMgLyBNYXRoLnBvdygxZTMsIGUpKS50b0ZpeGVkKDIpICsgJyAnICsgKCdrTUdUUEVaWSdbZSAtIDFdIHx8ICcnKSArICdCJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTYXZlIHRoZSBCbG9iIGRhdGFcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGJsb2JTYXZlKCBzYXZlQXM6IHN0cmluZywgZGF0YTogYW55ICkge1xuXG4gICAgICAgIGlmICh3aW5kb3cubmF2aWdhdG9yICYmIHdpbmRvdy5uYXZpZ2F0b3IubXNTYXZlT3JPcGVuQmxvYikge1xuICAgICAgICAgICAgd2luZG93Lm5hdmlnYXRvci5tc1NhdmVPck9wZW5CbG9iKGRhdGEsIHNhdmVBcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSB3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChkYXRhKSwgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcblxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKTtcbiAgICAgICAgICAgIGEuc2V0QXR0cmlidXRlKCdzdHlsZScsICdkaXNwbGF5OiBub25lJyk7XG4gICAgICAgICAgICBhLmhyZWYgPSB1cmw7XG4gICAgICAgICAgICBhLmRvd25sb2FkID0gc2F2ZUFzO1xuICAgICAgICAgICAgYS5jbGljaygpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IHdpbmRvdy5VUkwucmV2b2tlT2JqZWN0VVJMKHVybCk7IGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoYSk7IH0sIDQwMCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXF1ZXN0IHRoZSBmaWxlIHRvIGJlIGRvd25sb2FkZWRcbiAgICAgKi9cbiAgICBwcml2YXRlIGRvd25sb2FkKG1ldGhvZDogc3RyaW5nLCB1cmw6IHN0cmluZywgc2F2ZUFzOiBzdHJpbmcsIG9wdGlvbnM6IElEb3dubG9hZE9wdGlvbnMgPSB7fSk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgICAgIG1ldGhvZCA9IG1ldGhvZC50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAoIFsgJ2dldCcsICdwb3N0JywgJ3B1dCcgXS5pbmRleE9mKCBtZXRob2QgKSA9PT0gLTEgKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEZpbGVEb3dubG9hZDogTWV0aG9kIFwiJHsgbWV0aG9kIH1cIiBub3QgYWxsb3csIHVzZSBcIkdFVFwiLCBcIlBPU1RcIiBvciBcIlBVVFwiYCk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcmVzdWx0ID0geyBzdGF0ZTogbnVsbCwgc2F2ZUFzOiBzYXZlQXMsIHRvdGFsOiAwLCBsb2FkZWQ6IDAsIHByb2dyZXNzOiAwIH0sXG4gICAgICAgICAgICBQYXJhbXMgPSBuZXcgSHR0cFBhcmFtcygpO1xuXG4gICAgICAgIGNvbnN0IE9wdGlvbnMgPSB7XG4gICAgICAgICAgICByZXBvcnRQcm9ncmVzczogdHJ1ZSxcbiAgICAgICAgICAgIGhlYWRlcnM6IG5ldyBIdHRwSGVhZGVycyggb3B0aW9ucy5oZWFkZXJzIHx8IHt9KVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICggb3B0aW9ucy5wYXJhbXMgKSB7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhvcHRpb25zLnBhcmFtcykuZm9yRWFjaCgoa2V5KSA9PiB7IFBhcmFtcyA9IFBhcmFtcy5zZXQoa2V5LCBvcHRpb25zLnBhcmFtc1trZXldKTsgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZXMgPSBtZXRob2QgPT09ICdHRVQnXG4gICAgICAgICAgICA/IG5ldyBIdHRwUmVxdWVzdChtZXRob2QsIHVybCwgeyAuLi5PcHRpb25zLCAuLi57IHJlc3BvbnNlVHlwZTogJ2Jsb2InLCBwYXJhbXM6IFBhcmFtcyB9IH0pXG4gICAgICAgICAgICA6IG5ldyBIdHRwUmVxdWVzdChtZXRob2QsIHVybCwgb3B0aW9ucy5wYXJhbXMgfHwge30sIHsgLi4uT3B0aW9ucywgLi4ueyByZXNwb25zZVR5cGU6ICdibG9iJyB9IH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHBcbiAgICAgICAgICAgIC5yZXF1ZXN0KHJlcylcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgIG1hcCgoIGV2ZW50ICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGV2ZW50LnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgSHR0cEV2ZW50VHlwZS5TZW50OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHsgLi4ucmVzdWx0LCAuLi57IHN0YXRlOiBGaWxlRG93bmxvYWRTdGF0ZS5pbml0aWFsaXplIH0gfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgSHR0cEV2ZW50VHlwZS5Eb3dubG9hZFByb2dyZXNzOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggIWlzVW5kZWZpbmVkKGV2ZW50LnRvdGFsKSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4ucmVzdWx0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4ue1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlOiBGaWxlRG93bmxvYWRTdGF0ZS5pblByb2dyZXNzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsOiBldmVudC50b3RhbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2FkZWQ6IGV2ZW50LmxvYWRlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9ncmVzczogTWF0aC5yb3VuZCgxMDAgKiBldmVudC5sb2FkZWQgLyBldmVudC50b3RhbClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEh0dHBFdmVudFR5cGUuUmVzcG9uc2U6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCByZXN1bHQuc3RhdGUgIT09IEZpbGVEb3dubG9hZFN0YXRlLmNvbXBsZXRlZCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0geyAuLi5yZXN1bHQsIC4uLnsgc3RhdGU6IEZpbGVEb3dubG9hZFN0YXRlLmNvbXBsZXRlZCB9IH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEZpbGVEb3dubG9hZC5ibG9iU2F2ZSggc2F2ZUFzLCBldmVudC5ib2R5ICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgZmlsdGVyKCh2YWwpID0+ICFpc051bGxPclVuZGVmaW5lZCh2YWwpKSxcbiAgICAgICAgICAgICAgICBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpXG4gICAgICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVwbG9hZCB0aGUgZmlsZXMgdXNpbmcgUE9TVCBIVFRQIG1ldGhvZFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQoIHVybDogc3RyaW5nLCBzYXZlQXM6IHN0cmluZywgb3B0aW9uczogSURvd25sb2FkT3B0aW9ucyA9IHt9ICk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmRvd25sb2FkKCdnZXQnLCB1cmwsIHNhdmVBcywgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBsb2FkIHRoZSBmaWxlcyB1c2luZyBQT1NUIEhUVFAgbWV0aG9kXG4gICAgICovXG4gICAgcHVibGljIHBvc3QoIHVybDogc3RyaW5nLCBzYXZlQXM6IHN0cmluZywgb3B0aW9uczogSURvd25sb2FkT3B0aW9ucyA9IHt9ICk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmRvd25sb2FkKCdwb3N0JywgdXJsLCBzYXZlQXMsIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVwbG9hZCB0aGUgZmlsZXMgdXNpbmcgUFVUIEhUVFAgbWV0aG9kXG4gICAgICovXG4gICAgcHVibGljIHB1dCggdXJsOiBzdHJpbmcsIHNhdmVBczogc3RyaW5nLCBvcHRpb25zOiBJRG93bmxvYWRPcHRpb25zID0ge30gKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZG93bmxvYWQoJ3B1dCcsIHVybCwgc2F2ZUFzLCBvcHRpb25zKTtcbiAgICB9XG5cbn1cbiJdfQ==