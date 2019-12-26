/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpRequest, HttpHeaders } from '@angular/common/http';
import { map, distinctUntilChanged, filter } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
/**
 * FileUpload request options structure
 * @record
 */
export function IUploadOptions() { }
if (false) {
    /** @type {?|undefined} */
    IUploadOptions.prototype.listParameterName;
    /** @type {?|undefined} */
    IUploadOptions.prototype.params;
    /** @type {?|undefined} */
    IUploadOptions.prototype.headers;
}
/** @enum {string} */
var FileUploadState = {
    initialize: 'initialize',
    inProgress: 'inProgress',
    completed: 'completed',
};
export { FileUploadState };
var FileUpload = /** @class */ (function () {
    /**
     * Service class constructor
     */
    function FileUpload(http) {
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
    FileUpload.humanReadableFormat = /**
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
     * Convert bytes size to human readable format
     */
    /**
     * Convert bytes size to human readable format
     * @param {?} files
     * @return {?}
     */
    FileUpload.calculateSize = /**
     * Convert bytes size to human readable format
     * @param {?} files
     * @return {?}
     */
    function (files) {
        /** @type {?} */
        var size = 0;
        Array.from(files).forEach((/**
         * @param {?} file
         * @return {?}
         */
        function (file) { size += file.size; }));
        return size;
    };
    /**
     * Create a FormData object to be send as request payload data
     */
    /**
     * Create a FormData object to be send as request payload data
     * @protected
     * @param {?} object
     * @param {?=} form
     * @param {?=} namespace
     * @return {?}
     */
    FileUpload.prototype.createFormData = /**
     * Create a FormData object to be send as request payload data
     * @protected
     * @param {?} object
     * @param {?=} form
     * @param {?=} namespace
     * @return {?}
     */
    function (object, form, namespace) {
        /** @type {?} */
        var formData = form || new FormData();
        for (var property in object) {
            if (!object.hasOwnProperty(property) || !object[property]) {
                continue;
            }
            /** @type {?} */
            var formKey = namespace ? namespace + "[" + property + "]" : property;
            if (object[property] instanceof Date) {
                formData.append(formKey, object[property].toISOString());
            }
            else if (object[property] instanceof FileList) {
                for (var i = 0; i < object[property].length; i++) {
                    formData.append(property + "[]", object[property].item(i));
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
    };
    /**
     * Upload the file list
     */
    /**
     * Upload the file list
     * @private
     * @param {?} method
     * @param {?} url
     * @param {?} files
     * @param {?=} options
     * @return {?}
     */
    FileUpload.prototype.upload = /**
     * Upload the file list
     * @private
     * @param {?} method
     * @param {?} url
     * @param {?} files
     * @param {?=} options
     * @return {?}
     */
    function (method, url, files, options) {
        method = method.toLowerCase();
        if (['post', 'put'].indexOf(method) === -1) {
            throw new Error("FileUpload: Method \"" + method + "\" not allow, use \"POST\" or \"PUT\"");
        }
        /** @type {?} */
        var result = { state: null, files: files, total: 0, loaded: 0, progress: 0 };
        /** @type {?} */
        var Params = {};
        Params[options.listParameterName ? options.listParameterName : 'files'] = files;
        /** @type {?} */
        var res = new HttpRequest(method, url, this.createFormData(options.params ? tslib_1.__assign({}, Params, options.params) : Params), { reportProgress: true, headers: new HttpHeaders(options.headers ? options.headers : {}) });
        return this.http
            .request(res)
            .pipe(map((/**
         * @param {?} event
         * @return {?}
         */
        function (event) {
            switch (event.type) {
                case HttpEventType.Sent:
                    result = tslib_1.__assign({}, result, { state: FileUploadState.initialize });
                    break;
                case HttpEventType.UploadProgress:
                    result = tslib_1.__assign({}, result, {
                        state: event.total !== event.loaded ? FileUploadState.inProgress : FileUploadState.completed,
                        total: event.total,
                        loaded: event.loaded,
                        progress: Math.round(100 * event.loaded / event.total)
                    });
                    break;
                case HttpEventType.Response:
                    if (result.state !== FileUploadState.completed) {
                        result = tslib_1.__assign({}, result, { state: FileUploadState.completed });
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
     * @param {?} files
     * @param {?=} options
     * @return {?}
     */
    FileUpload.prototype.post = /**
     * Upload the files using POST HTTP method
     * @param {?} url
     * @param {?} files
     * @param {?=} options
     * @return {?}
     */
    function (url, files, options) {
        return this.upload('post', url, files, options);
    };
    /**
     * Upload the files using PUT HTTP method
     */
    /**
     * Upload the files using PUT HTTP method
     * @param {?} url
     * @param {?} files
     * @param {?=} options
     * @return {?}
     */
    FileUpload.prototype.put = /**
     * Upload the files using PUT HTTP method
     * @param {?} url
     * @param {?} files
     * @param {?=} options
     * @return {?}
     */
    function (url, files, options) {
        return this.upload('put', url, files, options);
    };
    FileUpload.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    FileUpload.ctorParameters = function () { return [
        { type: HttpClient }
    ]; };
    return FileUpload;
}());
export { FileUpload };
if (false) {
    /**
     * @type {?}
     * @private
     */
    FileUpload.prototype.http;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS11cGxvYWQuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1yZXN0LyIsInNvdXJjZXMiOlsibGliL2ZpbGUtdXBsb2FkLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxVQUFVLEVBQUUsYUFBYSxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUUzRixPQUFPLEVBQUUsR0FBRyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ25FLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLE1BQU0sQ0FBQzs7Ozs7QUFLekMsb0NBSUM7OztJQUhHLDJDQUF3Qjs7SUFDeEIsZ0NBQThCOztJQUM5QixpQ0FBYzs7OztJQU9kLFlBQWEsWUFBWTtJQUN6QixZQUFhLFlBQVk7SUFDekIsV0FBWSxXQUFXOzs7QUFHM0I7SUFHSTs7T0FFRztJQUNILG9CQUFxQixJQUFnQjtRQUFoQixTQUFJLEdBQUosSUFBSSxDQUFZO0lBQU0sQ0FBQztJQUU1Qzs7T0FFRzs7Ozs7O0lBQ1csOEJBQW1COzs7OztJQUFqQyxVQUFrQyxLQUFhOztZQUNyQyxDQUFDLEdBQUcsQ0FBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUUsR0FBRyxDQUFDO1FBQ2pELE9BQU8sQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQztJQUMxRixDQUFDO0lBRUQ7O09BRUc7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QUFNLEVBQUssRUFBRSxLQUFLLEVBQUUsZUFBZSxDQUFDLFNBQVMsRUFBRSxDQUFFLENBQUM7cUJBQ25FO29CQUNELE1BQU07YUFDYjtZQUNELE9BQU8sTUFBTSxDQUFDO1FBQ2xCLENBQUMsRUFBQyxFQUNGLE1BQU07Ozs7UUFBQyxVQUFDLEdBQUcsSUFBSyxPQUFBLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEVBQXZCLENBQXVCLEVBQUMsRUFDeEMsb0JBQW9CLEVBQUUsQ0FDekIsQ0FBQztJQUNWLENBQUM7SUFFRDs7T0FFRzs7Ozs7Ozs7SUFDSSx5QkFBSTs7Ozs7OztJQUFYLFVBQWEsR0FBVyxFQUFFLEtBQWUsRUFBRSxPQUF3QjtRQUMvRCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVEOztPQUVHOzs7Ozs7OztJQUNJLHdCQUFHOzs7Ozs7O0lBQVYsVUFBWSxHQUFXLEVBQUUsS0FBZSxFQUFFLE9BQXdCO1FBQzlELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNuRCxDQUFDOztnQkFySEosVUFBVTs7OztnQkF2QkYsVUFBVTs7SUE4SW5CLGlCQUFDO0NBQUEsQUF2SEQsSUF1SEM7U0F0SFksVUFBVTs7Ozs7O0lBS04sMEJBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cEV2ZW50VHlwZSwgSHR0cFJlcXVlc3QsIEh0dHBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbWFwLCBkaXN0aW5jdFVudGlsQ2hhbmdlZCwgZmlsdGVyIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgaXNOdWxsT3JVbmRlZmluZWQgfSBmcm9tICd1dGlsJztcblxuLyoqXG4gKiBGaWxlVXBsb2FkIHJlcXVlc3Qgb3B0aW9ucyBzdHJ1Y3R1cmVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJVXBsb2FkT3B0aW9ucyB7XG4gICAgbGlzdFBhcmFtZXRlck5hbWU/OiBhbnk7XG4gICAgcGFyYW1zPzoge1trZXk6IHN0cmluZ106IGFueX07XG4gICAgaGVhZGVycz86IGFueTtcbn1cblxuLyoqXG4gKiBGaWxlVXBsb2FkIHJlcXVlc3Qgc3RhdGUgZW51bVxuICovXG5leHBvcnQgZW51bSBGaWxlVXBsb2FkU3RhdGUge1xuICAgIGluaXRpYWxpemUgPSAnaW5pdGlhbGl6ZScsXG4gICAgaW5Qcm9ncmVzcyA9ICdpblByb2dyZXNzJyxcbiAgICBjb21wbGV0ZWQgPSAnY29tcGxldGVkJ1xufVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRmlsZVVwbG9hZCB7XG5cbiAgICAvKipcbiAgICAgKiBTZXJ2aWNlIGNsYXNzIGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCApIHsgIH1cblxuICAgIC8qKlxuICAgICAqIENvbnZlcnQgYnl0ZXMgc2l6ZSB0byBodW1hbiByZWFkYWJsZSBmb3JtYXRcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGh1bWFuUmVhZGFibGVGb3JtYXQoYnl0ZXM6IG51bWJlcikge1xuICAgICAgICBjb25zdCBlID0gKCBNYXRoLmxvZyhieXRlcykgLyBNYXRoLmxvZygxZTMpICkgfCAwO1xuICAgICAgICByZXR1cm4gKyhieXRlcyAvIE1hdGgucG93KDFlMywgZSkpLnRvRml4ZWQoMikgKyAnICcgKyAoJ2tNR1RQRVpZJ1tlIC0gMV0gfHwgJycpICsgJ0InO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbnZlcnQgYnl0ZXMgc2l6ZSB0byBodW1hbiByZWFkYWJsZSBmb3JtYXRcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGNhbGN1bGF0ZVNpemUoZmlsZXM6IEZpbGVMaXN0KSB7XG4gICAgICAgIGxldCBzaXplID0gMDtcbiAgICAgICAgQXJyYXkuZnJvbShmaWxlcykuZm9yRWFjaCgoZmlsZSkgPT4geyBzaXplICs9IGZpbGUuc2l6ZTsgfSk7XG4gICAgICAgIHJldHVybiBzaXplO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIEZvcm1EYXRhIG9iamVjdCB0byBiZSBzZW5kIGFzIHJlcXVlc3QgcGF5bG9hZCBkYXRhXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGNyZWF0ZUZvcm1EYXRhKG9iamVjdDogYW55LCBmb3JtPzogRm9ybURhdGEsIG5hbWVzcGFjZT86IHN0cmluZyk6IEZvcm1EYXRhIHtcbiAgICAgICAgY29uc3QgZm9ybURhdGEgPSBmb3JtIHx8IG5ldyBGb3JtRGF0YSgpO1xuXG4gICAgICAgIGZvciAoY29uc3QgcHJvcGVydHkgaW4gb2JqZWN0KSB7XG5cbiAgICAgICAgICAgIGlmICghb2JqZWN0Lmhhc093blByb3BlcnR5KHByb3BlcnR5KSB8fCAhb2JqZWN0W3Byb3BlcnR5XSkgeyBjb250aW51ZTsgfVxuXG4gICAgICAgICAgICBjb25zdCBmb3JtS2V5ID0gbmFtZXNwYWNlID8gYCR7bmFtZXNwYWNlfVske3Byb3BlcnR5fV1gIDogcHJvcGVydHk7XG4gICAgICAgICAgICBpZiAob2JqZWN0W3Byb3BlcnR5XSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoZm9ybUtleSwgb2JqZWN0W3Byb3BlcnR5XS50b0lTT1N0cmluZygpKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIG9iamVjdFtwcm9wZXJ0eV0gaW5zdGFuY2VvZiBGaWxlTGlzdCApIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9iamVjdFtwcm9wZXJ0eV0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgZm9ybURhdGEuYXBwZW5kKGAke3Byb3BlcnR5fVtdYCwgb2JqZWN0W3Byb3BlcnR5XS5pdGVtKGkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgIHR5cGVvZiBvYmplY3RbcHJvcGVydHldID09PSAnb2JqZWN0JyAmJiAhKG9iamVjdFtwcm9wZXJ0eV0gaW5zdGFuY2VvZiBGaWxlKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlRm9ybURhdGEob2JqZWN0W3Byb3BlcnR5XSwgZm9ybURhdGEsIGZvcm1LZXkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoZm9ybUtleSwgb2JqZWN0W3Byb3BlcnR5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZvcm1EYXRhO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVwbG9hZCB0aGUgZmlsZSBsaXN0XG4gICAgICovXG4gICAgcHJpdmF0ZSB1cGxvYWQoIG1ldGhvZDogc3RyaW5nLCB1cmw6IHN0cmluZywgZmlsZXM6IEZpbGVMaXN0LCBvcHRpb25zPzogSVVwbG9hZE9wdGlvbnMgKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICAgICAgbWV0aG9kID0gbWV0aG9kLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmICggWyAncG9zdCcsICdwdXQnIF0uaW5kZXhPZiggbWV0aG9kICkgPT09IC0xICkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBGaWxlVXBsb2FkOiBNZXRob2QgXCIkeyBtZXRob2QgfVwiIG5vdCBhbGxvdywgdXNlIFwiUE9TVFwiIG9yIFwiUFVUXCJgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCByZXN1bHQgPSB7IHN0YXRlOiBudWxsLCBmaWxlczogZmlsZXMsIHRvdGFsOiAwLCBsb2FkZWQ6IDAsIHByb2dyZXNzOiAwIH07XG5cbiAgICAgICAgY29uc3QgUGFyYW1zID0geyAgfTtcblxuICAgICAgICBQYXJhbXNbb3B0aW9ucy5saXN0UGFyYW1ldGVyTmFtZSA/IG9wdGlvbnMubGlzdFBhcmFtZXRlck5hbWUgOiAnZmlsZXMnXSA9IGZpbGVzO1xuXG4gICAgICAgIGNvbnN0IHJlcyA9IG5ldyBIdHRwUmVxdWVzdChcbiAgICAgICAgICAgIG1ldGhvZCwgdXJsLFxuICAgICAgICAgICAgdGhpcy5jcmVhdGVGb3JtRGF0YSggb3B0aW9ucy5wYXJhbXMgPyB7IC4uLlBhcmFtcywgLi4ub3B0aW9ucy5wYXJhbXMgfSA6IFBhcmFtcyApLFxuICAgICAgICAgICAgeyByZXBvcnRQcm9ncmVzczogdHJ1ZSwgaGVhZGVyczogbmV3IEh0dHBIZWFkZXJzKG9wdGlvbnMuaGVhZGVycyA/IG9wdGlvbnMuaGVhZGVycyA6IHt9KSB9XG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cFxuICAgICAgICAgICAgLnJlcXVlc3QocmVzKVxuICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgICAgbWFwKCggZXZlbnQgKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoZXZlbnQudHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBIdHRwRXZlbnRUeXBlLlNlbnQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0geyAuLi5yZXN1bHQsIC4uLnsgc3RhdGU6IEZpbGVVcGxvYWRTdGF0ZS5pbml0aWFsaXplIH0gfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgSHR0cEV2ZW50VHlwZS5VcGxvYWRQcm9ncmVzczpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLnJlc3VsdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4ue1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGU6IGV2ZW50LnRvdGFsICE9PSBldmVudC5sb2FkZWQgPyBGaWxlVXBsb2FkU3RhdGUuaW5Qcm9ncmVzcyA6IEZpbGVVcGxvYWRTdGF0ZS5jb21wbGV0ZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3RhbDogZXZlbnQudG90YWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2FkZWQ6IGV2ZW50LmxvYWRlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2dyZXNzOiBNYXRoLnJvdW5kKDEwMCAqIGV2ZW50LmxvYWRlZCAvIGV2ZW50LnRvdGFsKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgSHR0cEV2ZW50VHlwZS5SZXNwb25zZTpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIHJlc3VsdC5zdGF0ZSAhPT0gRmlsZVVwbG9hZFN0YXRlLmNvbXBsZXRlZCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0geyAuLi5yZXN1bHQsIC4uLnsgc3RhdGU6IEZpbGVVcGxvYWRTdGF0ZS5jb21wbGV0ZWQgfSB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIGZpbHRlcigodmFsKSA9PiAhaXNOdWxsT3JVbmRlZmluZWQodmFsKSksXG4gICAgICAgICAgICAgICAgZGlzdGluY3RVbnRpbENoYW5nZWQoKVxuICAgICAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVcGxvYWQgdGhlIGZpbGVzIHVzaW5nIFBPU1QgSFRUUCBtZXRob2RcbiAgICAgKi9cbiAgICBwdWJsaWMgcG9zdCggdXJsOiBzdHJpbmcsIGZpbGVzOiBGaWxlTGlzdCwgb3B0aW9ucz86IElVcGxvYWRPcHRpb25zICk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnVwbG9hZCgncG9zdCcsIHVybCwgZmlsZXMsIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVwbG9hZCB0aGUgZmlsZXMgdXNpbmcgUFVUIEhUVFAgbWV0aG9kXG4gICAgICovXG4gICAgcHVibGljIHB1dCggdXJsOiBzdHJpbmcsIGZpbGVzOiBGaWxlTGlzdCwgb3B0aW9ucz86IElVcGxvYWRPcHRpb25zICk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnVwbG9hZCgncHV0JywgdXJsLCBmaWxlcywgb3B0aW9ucyk7XG4gICAgfVxuXG59XG4iXX0=