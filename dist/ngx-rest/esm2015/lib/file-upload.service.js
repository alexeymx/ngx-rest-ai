/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
const FileUploadState = {
    initialize: 'initialize',
    inProgress: 'inProgress',
    completed: 'completed',
};
export { FileUploadState };
export class FileUpload {
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
     * Convert bytes size to human readable format
     * @param {?} files
     * @return {?}
     */
    static calculateSize(files) {
        /** @type {?} */
        let size = 0;
        Array.from(files).forEach((/**
         * @param {?} file
         * @return {?}
         */
        (file) => { size += file.size; }));
        return size;
    }
    /**
     * Create a FormData object to be send as request payload data
     * @protected
     * @param {?} object
     * @param {?=} form
     * @param {?=} namespace
     * @return {?}
     */
    createFormData(object, form, namespace) {
        /** @type {?} */
        const formData = form || new FormData();
        for (const property in object) {
            if (!object.hasOwnProperty(property) || !object[property]) {
                continue;
            }
            /** @type {?} */
            const formKey = namespace ? `${namespace}[${property}]` : property;
            if (object[property] instanceof Date) {
                formData.append(formKey, object[property].toISOString());
            }
            else if (object[property] instanceof FileList) {
                for (let i = 0; i < object[property].length; i++) {
                    formData.append(`${property}[]`, object[property].item(i));
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
    }
    /**
     * Upload the file list
     * @private
     * @param {?} method
     * @param {?} url
     * @param {?} files
     * @param {?=} options
     * @return {?}
     */
    upload(method, url, files, options) {
        method = method.toLowerCase();
        if (['post', 'put'].indexOf(method) === -1) {
            throw new Error(`FileUpload: Method "${method}" not allow, use "POST" or "PUT"`);
        }
        /** @type {?} */
        let result = { state: null, files: files, total: 0, loaded: 0, progress: 0 };
        /** @type {?} */
        const Params = {};
        Params[options.listParameterName ? options.listParameterName : 'files'] = files;
        /** @type {?} */
        const res = new HttpRequest(method, url, this.createFormData(options.params ? Object.assign({}, Params, options.params) : Params), { reportProgress: true, headers: new HttpHeaders(options.headers ? options.headers : {}) });
        return this.http
            .request(res)
            .pipe(map((/**
         * @param {?} event
         * @return {?}
         */
        (event) => {
            switch (event.type) {
                case HttpEventType.Sent:
                    result = Object.assign({}, result, { state: FileUploadState.initialize });
                    break;
                case HttpEventType.UploadProgress:
                    result = Object.assign({}, result, {
                        state: event.total !== event.loaded ? FileUploadState.inProgress : FileUploadState.completed,
                        total: event.total,
                        loaded: event.loaded,
                        progress: Math.round(100 * event.loaded / event.total)
                    });
                    break;
                case HttpEventType.Response:
                    if (result.state !== FileUploadState.completed) {
                        result = Object.assign({}, result, { state: FileUploadState.completed });
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
     * @param {?} files
     * @param {?=} options
     * @return {?}
     */
    post(url, files, options) {
        return this.upload('post', url, files, options);
    }
    /**
     * Upload the files using PUT HTTP method
     * @param {?} url
     * @param {?} files
     * @param {?=} options
     * @return {?}
     */
    put(url, files, options) {
        return this.upload('put', url, files, options);
    }
}
FileUpload.decorators = [
    { type: Injectable }
];
/** @nocollapse */
FileUpload.ctorParameters = () => [
    { type: HttpClient }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    FileUpload.prototype.http;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS11cGxvYWQuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1yZXN0LyIsInNvdXJjZXMiOlsibGliL2ZpbGUtdXBsb2FkLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRTNGLE9BQU8sRUFBRSxHQUFHLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbkUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sTUFBTSxDQUFDOzs7OztBQUt6QyxvQ0FJQzs7O0lBSEcsMkNBQXdCOztJQUN4QixnQ0FBOEI7O0lBQzlCLGlDQUFjOzs7O0lBT2QsWUFBYSxZQUFZO0lBQ3pCLFlBQWEsWUFBWTtJQUN6QixXQUFZLFdBQVc7OztBQUkzQixNQUFNLE9BQU8sVUFBVTs7Ozs7SUFLbkIsWUFBcUIsSUFBZ0I7UUFBaEIsU0FBSSxHQUFKLElBQUksQ0FBWTtJQUFNLENBQUM7Ozs7OztJQUtyQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsS0FBYTs7Y0FDckMsQ0FBQyxHQUFHLENBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFFLEdBQUcsQ0FBQztRQUNqRCxPQUFPLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUM7SUFDMUYsQ0FBQzs7Ozs7O0lBS00sTUFBTSxD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QUFFLENBQUUsQ0FBQztxQkFDbkU7b0JBQ0QsTUFBTTthQUNiO1lBQ0QsT0FBTyxNQUFNLENBQUM7UUFDbEIsQ0FBQyxFQUFDLEVBQ0YsTUFBTTs7OztRQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxFQUFDLEVBQ3hDLG9CQUFvQixFQUFFLENBQ3pCLENBQUM7SUFDVixDQUFDOzs7Ozs7OztJQUtNLElBQUksQ0FBRSxHQUFXLEVBQUUsS0FBZSxFQUFFLE9BQXdCO1FBQy9ELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNwRCxDQUFDOzs7Ozs7OztJQUtNLEdBQUcsQ0FBRSxHQUFXLEVBQUUsS0FBZSxFQUFFLE9BQXdCO1FBQzlELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNuRCxDQUFDOzs7WUFySEosVUFBVTs7OztZQXZCRixVQUFVOzs7Ozs7O0lBNkJGLDBCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBFdmVudFR5cGUsIEh0dHBSZXF1ZXN0LCBIdHRwSGVhZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IG1hcCwgZGlzdGluY3RVbnRpbENoYW5nZWQsIGZpbHRlciB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IGlzTnVsbE9yVW5kZWZpbmVkIH0gZnJvbSAndXRpbCc7XG5cbi8qKlxuICogRmlsZVVwbG9hZCByZXF1ZXN0IG9wdGlvbnMgc3RydWN0dXJlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSVVwbG9hZE9wdGlvbnMge1xuICAgIGxpc3RQYXJhbWV0ZXJOYW1lPzogYW55O1xuICAgIHBhcmFtcz86IHtba2V5OiBzdHJpbmddOiBhbnl9O1xuICAgIGhlYWRlcnM/OiBhbnk7XG59XG5cbi8qKlxuICogRmlsZVVwbG9hZCByZXF1ZXN0IHN0YXRlIGVudW1cbiAqL1xuZXhwb3J0IGVudW0gRmlsZVVwbG9hZFN0YXRlIHtcbiAgICBpbml0aWFsaXplID0gJ2luaXRpYWxpemUnLFxuICAgIGluUHJvZ3Jlc3MgPSAnaW5Qcm9ncmVzcycsXG4gICAgY29tcGxldGVkID0gJ2NvbXBsZXRlZCdcbn1cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEZpbGVVcGxvYWQge1xuXG4gICAgLyoqXG4gICAgICogU2VydmljZSBjbGFzcyBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKCBwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQgKSB7ICB9XG5cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0IGJ5dGVzIHNpemUgdG8gaHVtYW4gcmVhZGFibGUgZm9ybWF0XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBodW1hblJlYWRhYmxlRm9ybWF0KGJ5dGVzOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgZSA9ICggTWF0aC5sb2coYnl0ZXMpIC8gTWF0aC5sb2coMWUzKSApIHwgMDtcbiAgICAgICAgcmV0dXJuICsoYnl0ZXMgLyBNYXRoLnBvdygxZTMsIGUpKS50b0ZpeGVkKDIpICsgJyAnICsgKCdrTUdUUEVaWSdbZSAtIDFdIHx8ICcnKSArICdCJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0IGJ5dGVzIHNpemUgdG8gaHVtYW4gcmVhZGFibGUgZm9ybWF0XG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBjYWxjdWxhdGVTaXplKGZpbGVzOiBGaWxlTGlzdCkge1xuICAgICAgICBsZXQgc2l6ZSA9IDA7XG4gICAgICAgIEFycmF5LmZyb20oZmlsZXMpLmZvckVhY2goKGZpbGUpID0+IHsgc2l6ZSArPSBmaWxlLnNpemU7IH0pO1xuICAgICAgICByZXR1cm4gc2l6ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBGb3JtRGF0YSBvYmplY3QgdG8gYmUgc2VuZCBhcyByZXF1ZXN0IHBheWxvYWQgZGF0YVxuICAgICAqL1xuICAgIHByb3RlY3RlZCBjcmVhdGVGb3JtRGF0YShvYmplY3Q6IGFueSwgZm9ybT86IEZvcm1EYXRhLCBuYW1lc3BhY2U/OiBzdHJpbmcpOiBGb3JtRGF0YSB7XG4gICAgICAgIGNvbnN0IGZvcm1EYXRhID0gZm9ybSB8fCBuZXcgRm9ybURhdGEoKTtcblxuICAgICAgICBmb3IgKGNvbnN0IHByb3BlcnR5IGluIG9iamVjdCkge1xuXG4gICAgICAgICAgICBpZiAoIW9iamVjdC5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkgfHwgIW9iamVjdFtwcm9wZXJ0eV0pIHsgY29udGludWU7IH1cblxuICAgICAgICAgICAgY29uc3QgZm9ybUtleSA9IG5hbWVzcGFjZSA/IGAke25hbWVzcGFjZX1bJHtwcm9wZXJ0eX1dYCA6IHByb3BlcnR5O1xuICAgICAgICAgICAgaWYgKG9iamVjdFtwcm9wZXJ0eV0gaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgICAgICAgICAgZm9ybURhdGEuYXBwZW5kKGZvcm1LZXksIG9iamVjdFtwcm9wZXJ0eV0udG9JU09TdHJpbmcoKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBvYmplY3RbcHJvcGVydHldIGluc3RhbmNlb2YgRmlsZUxpc3QgKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvYmplY3RbcHJvcGVydHldLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZChgJHtwcm9wZXJ0eX1bXWAsIG9iamVjdFtwcm9wZXJ0eV0uaXRlbShpKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICB0eXBlb2Ygb2JqZWN0W3Byb3BlcnR5XSA9PT0gJ29iamVjdCcgJiYgIShvYmplY3RbcHJvcGVydHldIGluc3RhbmNlb2YgRmlsZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZUZvcm1EYXRhKG9iamVjdFtwcm9wZXJ0eV0sIGZvcm1EYXRhLCBmb3JtS2V5KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9ybURhdGEuYXBwZW5kKGZvcm1LZXksIG9iamVjdFtwcm9wZXJ0eV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmb3JtRGF0YTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVcGxvYWQgdGhlIGZpbGUgbGlzdFxuICAgICAqL1xuICAgIHByaXZhdGUgdXBsb2FkKCBtZXRob2Q6IHN0cmluZywgdXJsOiBzdHJpbmcsIGZpbGVzOiBGaWxlTGlzdCwgb3B0aW9ucz86IElVcGxvYWRPcHRpb25zICk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgICAgIG1ldGhvZCA9IG1ldGhvZC50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAoIFsgJ3Bvc3QnLCAncHV0JyBdLmluZGV4T2YoIG1ldGhvZCApID09PSAtMSApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRmlsZVVwbG9hZDogTWV0aG9kIFwiJHsgbWV0aG9kIH1cIiBub3QgYWxsb3csIHVzZSBcIlBPU1RcIiBvciBcIlBVVFwiYCk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcmVzdWx0ID0geyBzdGF0ZTogbnVsbCwgZmlsZXM6IGZpbGVzLCB0b3RhbDogMCwgbG9hZGVkOiAwLCBwcm9ncmVzczogMCB9O1xuXG4gICAgICAgIGNvbnN0IFBhcmFtcyA9IHsgIH07XG5cbiAgICAgICAgUGFyYW1zW29wdGlvbnMubGlzdFBhcmFtZXRlck5hbWUgPyBvcHRpb25zLmxpc3RQYXJhbWV0ZXJOYW1lIDogJ2ZpbGVzJ10gPSBmaWxlcztcblxuICAgICAgICBjb25zdCByZXMgPSBuZXcgSHR0cFJlcXVlc3QoXG4gICAgICAgICAgICBtZXRob2QsIHVybCxcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlRm9ybURhdGEoIG9wdGlvbnMucGFyYW1zID8geyAuLi5QYXJhbXMsIC4uLm9wdGlvbnMucGFyYW1zIH0gOiBQYXJhbXMgKSxcbiAgICAgICAgICAgIHsgcmVwb3J0UHJvZ3Jlc3M6IHRydWUsIGhlYWRlcnM6IG5ldyBIdHRwSGVhZGVycyhvcHRpb25zLmhlYWRlcnMgPyBvcHRpb25zLmhlYWRlcnMgOiB7fSkgfVxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHBcbiAgICAgICAgICAgIC5yZXF1ZXN0KHJlcylcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgIG1hcCgoIGV2ZW50ICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGV2ZW50LnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgSHR0cEV2ZW50VHlwZS5TZW50OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHsgLi4ucmVzdWx0LCAuLi57IHN0YXRlOiBGaWxlVXBsb2FkU3RhdGUuaW5pdGlhbGl6ZSB9IH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEh0dHBFdmVudFR5cGUuVXBsb2FkUHJvZ3Jlc3M6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5yZXN1bHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlOiBldmVudC50b3RhbCAhPT0gZXZlbnQubG9hZGVkID8gRmlsZVVwbG9hZFN0YXRlLmluUHJvZ3Jlc3MgOiBGaWxlVXBsb2FkU3RhdGUuY29tcGxldGVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG90YWw6IGV2ZW50LnRvdGFsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9hZGVkOiBldmVudC5sb2FkZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9ncmVzczogTWF0aC5yb3VuZCgxMDAgKiBldmVudC5sb2FkZWQgLyBldmVudC50b3RhbClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIEh0dHBFdmVudFR5cGUuUmVzcG9uc2U6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCByZXN1bHQuc3RhdGUgIT09IEZpbGVVcGxvYWRTdGF0ZS5jb21wbGV0ZWQgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHsgLi4ucmVzdWx0LCAuLi57IHN0YXRlOiBGaWxlVXBsb2FkU3RhdGUuY29tcGxldGVkIH0gfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBmaWx0ZXIoKHZhbCkgPT4gIWlzTnVsbE9yVW5kZWZpbmVkKHZhbCkpLFxuICAgICAgICAgICAgICAgIGRpc3RpbmN0VW50aWxDaGFuZ2VkKClcbiAgICAgICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBsb2FkIHRoZSBmaWxlcyB1c2luZyBQT1NUIEhUVFAgbWV0aG9kXG4gICAgICovXG4gICAgcHVibGljIHBvc3QoIHVybDogc3RyaW5nLCBmaWxlczogRmlsZUxpc3QsIG9wdGlvbnM/OiBJVXBsb2FkT3B0aW9ucyApOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgICAgICByZXR1cm4gdGhpcy51cGxvYWQoJ3Bvc3QnLCB1cmwsIGZpbGVzLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVcGxvYWQgdGhlIGZpbGVzIHVzaW5nIFBVVCBIVFRQIG1ldGhvZFxuICAgICAqL1xuICAgIHB1YmxpYyBwdXQoIHVybDogc3RyaW5nLCBmaWxlczogRmlsZUxpc3QsIG9wdGlvbnM/OiBJVXBsb2FkT3B0aW9ucyApOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgICAgICByZXR1cm4gdGhpcy51cGxvYWQoJ3B1dCcsIHVybCwgZmlsZXMsIG9wdGlvbnMpO1xuICAgIH1cblxufVxuIl19