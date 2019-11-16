(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common/http'), require('rxjs/operators'), require('util'), require('@angular/router'), require('ngx-cookie'), require('rxjs'), require('date-fns')) :
    typeof define === 'function' && define.amd ? define('ngx-rest', ['exports', '@angular/core', '@angular/common/http', 'rxjs/operators', 'util', '@angular/router', 'ngx-cookie', 'rxjs', 'date-fns'], factory) :
    (global = global || self, factory(global['ngx-rest'] = {}, global.ng.core, global.ng.common.http, global.rxjs.operators, global.util, global.ng.router, global.ngxCookie, global.rxjs, global.dateFns));
}(this, (function (exports, core, http, operators, util, router, ngxCookie, rxjs, dateFns) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __exportStar(m, exports) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }

    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m) return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    }

    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }

    function __asyncValues(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    }

    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    function __importStar(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result.default = mod;
        return result;
    }

    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * FileUpload request options structure
     * @record
     */
    function IUploadOptions() { }
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
            var res = new http.HttpRequest(method, url, this.createFormData(options.params ? __assign({}, Params, options.params) : Params), { reportProgress: true, headers: new http.HttpHeaders(options.headers ? options.headers : {}) });
            return this.http
                .request(res)
                .pipe(operators.map((/**
             * @param {?} event
             * @return {?}
             */
            function (event) {
                switch (event.type) {
                    case http.HttpEventType.Sent:
                        result = __assign({}, result, { state: FileUploadState.initialize });
                        break;
                    case http.HttpEventType.UploadProgress:
                        result = __assign({}, result, {
                            state: event.total !== event.loaded ? FileUploadState.inProgress : FileUploadState.completed,
                            total: event.total,
                            loaded: event.loaded,
                            progress: Math.round(100 * event.loaded / event.total)
                        });
                        break;
                    case http.HttpEventType.Response:
                        if (result.state !== FileUploadState.completed) {
                            result = __assign({}, result, { state: FileUploadState.completed });
                        }
                        break;
                }
                return result;
            })), operators.filter((/**
             * @param {?} val
             * @return {?}
             */
            function (val) { return !util.isNullOrUndefined(val); })), operators.distinctUntilChanged());
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
            { type: core.Injectable }
        ];
        /** @nocollapse */
        FileUpload.ctorParameters = function () { return [
            { type: http.HttpClient }
        ]; };
        return FileUpload;
    }());
    if (false) {
        /**
         * @type {?}
         * @private
         */
        FileUpload.prototype.http;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * FileDownload request options structure
     * @record
     */
    function IDownloadOptions() { }
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
            var Params = new http.HttpParams();
            /** @type {?} */
            var Options = {
                reportProgress: true,
                headers: new http.HttpHeaders(options.headers || {})
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
                ? new http.HttpRequest(method, url, __assign({}, Options, { responseType: 'blob', params: Params }))
                : new http.HttpRequest(method, url, options.params || {}, __assign({}, Options, { responseType: 'blob' }));
            return this.http
                .request(res)
                .pipe(operators.map((/**
             * @param {?} event
             * @return {?}
             */
            function (event) {
                switch (event.type) {
                    case http.HttpEventType.Sent:
                        result = __assign({}, result, { state: FileDownloadState.initialize });
                        break;
                    case http.HttpEventType.DownloadProgress:
                        if (!util.isUndefined(event.total)) {
                            result = __assign({}, result, {
                                state: FileDownloadState.inProgress,
                                total: event.total,
                                loaded: event.loaded,
                                progress: Math.round(100 * event.loaded / event.total)
                            });
                        }
                        break;
                    case http.HttpEventType.Response:
                        if (result.state !== FileDownloadState.completed) {
                            result = __assign({}, result, { state: FileDownloadState.completed });
                            FileDownload.blobSave(saveAs, event.body);
                        }
                        break;
                }
                return result;
            })), operators.filter((/**
             * @param {?} val
             * @return {?}
             */
            function (val) { return !util.isNullOrUndefined(val); })), operators.distinctUntilChanged());
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
            { type: core.Injectable }
        ];
        /** @nocollapse */
        FileDownload.ctorParameters = function () { return [
            { type: http.HttpClient }
        ]; };
        return FileDownload;
    }());
    if (false) {
        /**
         * @type {?}
         * @private
         */
        FileDownload.prototype.http;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @enum {string} */
    var TypeTokenStorage = {
        cookie: 'cookie',
        localStorage: 'localStorage',
        sessionStorage: 'sessionStorage',
    };
    var RestServiceConfig = /** @class */ (function () {
        function RestServiceConfig() {
        }
        return RestServiceConfig;
    }());
    if (false) {
        /** @type {?} */
        RestServiceConfig.prototype.endPoint;
        /** @type {?} */
        RestServiceConfig.prototype.mockData;
        /** @type {?} */
        RestServiceConfig.prototype.tokenStorage;
        /** @type {?} */
        RestServiceConfig.prototype.tokenName;
        /** @type {?} */
        RestServiceConfig.prototype.secureCookie;
        /** @type {?} */
        RestServiceConfig.prototype.language;
        /** @type {?} */
        RestServiceConfig.prototype.authUri;
        /** @type {?} */
        RestServiceConfig.prototype.validationTokenUri;
        /** @type {?} */
        RestServiceConfig.prototype.UnauthorizedRedirectUri;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @enum {string} */
    var HttpMethod = {
        Get: 'get',
        Post: 'post',
        Put: 'put',
        Delete: 'Delete',
    };

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var JwtHelper = /** @class */ (function () {
        function JwtHelper() {
        }
        /**
         * @param {?=} token
         * @return {?}
         */
        JwtHelper.decodeToken = /**
         * @param {?=} token
         * @return {?}
         */
        function (token) {
            if (token === void 0) { token = ''; }
            if (token === null || token === '') {
                return null;
            }
            /** @type {?} */
            var parts = token.split('.');
            if (parts.length !== 3) {
                return null;
            }
            /** @type {?} */
            var decoded = this.urlBase64Decode(parts[1]);
            if (!decoded) {
                return null;
            }
            return JSON.parse(decoded);
        };
        /**
         * @private
         * @param {?} str
         * @return {?}
         */
        JwtHelper.urlBase64Decode = /**
         * @private
         * @param {?} str
         * @return {?}
         */
        function (str) {
            /** @type {?} */
            var output = str;
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    return null;
            }
            /** @type {?} */
            var data = atob(output);
            return decodeURIComponent(data);
        };
        return JwtHelper;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var CacheService = /** @class */ (function () {
        function CacheService() {
            this.cache = new Map();
        }
        /**
         * @param {?} key
         * @param {?} data
         * @return {?}
         */
        CacheService.prototype.set = /**
         * @param {?} key
         * @param {?} data
         * @return {?}
         */
        function (key, data) {
            this.cache.set(key, data);
        };
        /**
         * @param {?} key
         * @return {?}
         */
        CacheService.prototype.get = /**
         * @param {?} key
         * @return {?}
         */
        function (key) {
            if (this.cache.has(key)) {
                return this.cache.get(key);
            }
            else {
                return null;
            }
        };
        /**
         * @param {?} key
         * @return {?}
         */
        CacheService.prototype.invalidate = /**
         * @param {?} key
         * @return {?}
         */
        function (key) {
            if (this.cache.has(key)) {
            }
        };
        CacheService.decorators = [
            { type: core.Injectable, args: [{
                        providedIn: 'root'
                    },] }
        ];
        /** @nocollapse */ CacheService.ngInjectableDef = core.ɵɵdefineInjectable({ factory: function CacheService_Factory() { return new CacheService(); }, token: CacheService, providedIn: "root" });
        return CacheService;
    }());
    if (false) {
        /**
         * @type {?}
         * @private
         */
        CacheService.prototype.cache;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var RestClientService = /** @class */ (function () {
        function RestClientService(http, cookies, cache, router, config) {
            this.http = http;
            this.cookies = cookies;
            this.cache = cache;
            this.router = router;
            /**
             * Handler used to stop all pending requests
             */
            this.cancelPending$ = new rxjs.Subject();
            /**
             * Default requests header
             */
            this.baseHeader = {
                'Cache-Control': 'no-cache',
                accept: 'application/json',
                Pragma: 'no-cache',
                Authorization: '',
                'Accept-Language': '*'
            };
            /**
             * When true, the request header will include the authentication token
             */
            this.secureRequest = false;
            /**
             * Holds a list of files to be upload on request
             */
            this.withFilesRequest = false;
            /**
             * Prefer cache
             */
            this.cachedRequest = false;
            /**
             * Invalidate cache
             */
            this.invalidateCache = false;
            this.config = (/** @type {?} */ ({
                endPoint: '',
                tokenName: 'AuthToken',
                tokenStorage: TypeTokenStorage.cookie,
                secureCookie: false,
                mockData: false,
                validationTokenUri: '/info',
                authUri: '/authorize',
                UnauthorizedRedirectUri: null
            }));
            if (config) {
                this.setConfig(config);
            }
        }
        /**
         * Set the Rest Client configuration parameters.
         *
         * CAUTION: This method overrides the current configuration settings
         * and this settings will apply to all following requests
         */
        /**
         * Set the Rest Client configuration parameters.
         *
         * CAUTION: This method overrides the current configuration settings
         * and this settings will apply to all following requests
         * @param {?} config
         * @return {?}
         */
        RestClientService.prototype.setConfig = /**
         * Set the Rest Client configuration parameters.
         *
         * CAUTION: This method overrides the current configuration settings
         * and this settings will apply to all following requests
         * @param {?} config
         * @return {?}
         */
        function (config) {
            this.config = (/** @type {?} */ (__assign({}, this.config, config)));
            return this;
        };
        /** Return the current Rest Client configuration parameters.  */
        /**
         * Return the current Rest Client configuration parameters.
         * @return {?}
         */
        RestClientService.prototype.getConfig = /**
         * Return the current Rest Client configuration parameters.
         * @return {?}
         */
        function () {
            return this.config;
        };
        Object.defineProperty(RestClientService.prototype, "token", {
            /**
             * Get the API Token from cookies
             */
            get: /**
             * Get the API Token from cookies
             * @return {?}
             */
            function () {
                /** @type {?} */
                var token = '';
                switch (this.config.tokenStorage) {
                    case TypeTokenStorage.cookie:
                        token = this.cookies.get(this.config.tokenName);
                        break;
                    case TypeTokenStorage.localStorage:
                        token = localStorage.getItem(this.config.tokenName);
                        break;
                    case TypeTokenStorage.sessionStorage:
                        token = sessionStorage.getItem(this.config.tokenName);
                        break;
                    default:
                        throw new Error('Invalid Token Storage method');
                }
                return !token || typeof token === 'undefined' ? '' : token;
            },
            /**
             * Save the API Token cookie
             */
            set: /**
             * Save the API Token cookie
             * @param {?} token
             * @return {?}
             */
            function (token) {
                /** @type {?} */
                var decoded = JwtHelper.decodeToken(token);
                /** @type {?} */
                var expires = dateFns.fromUnixTime(decoded.exp);
                switch (this.config.tokenStorage) {
                    case TypeTokenStorage.cookie:
                        this.cookies.put(this.config.tokenName, token, { secure: this.config.secureCookie, expires: expires });
                        break;
                    case TypeTokenStorage.localStorage:
                        localStorage.setItem(this.config.tokenName, token);
                        break;
                    case TypeTokenStorage.sessionStorage:
                        sessionStorage.setItem(this.config.tokenName, token);
                        break;
                    default:
                        throw new Error('Invalid Token Storage method');
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Remove the Authentication token cookie
         */
        /**
         * Remove the Authentication token cookie
         * @return {?}
         */
        RestClientService.prototype.revoke = /**
         * Remove the Authentication token cookie
         * @return {?}
         */
        function () {
            switch (this.config.tokenStorage) {
                case TypeTokenStorage.cookie:
                    this.cookies.removeAll();
                    break;
                case TypeTokenStorage.localStorage:
                    localStorage.removeItem(this.config.tokenName);
                    break;
                case TypeTokenStorage.sessionStorage:
                    sessionStorage.removeItem(this.config.tokenName);
                    break;
                default:
                    throw new Error('Invalid Token Storage method');
            }
        };
        /**
         * Request an Authorization token
         * The default authorization URI is '[API_END_POINT]/authorize'
         * @param username Username
         * @param password Password
         */
        /**
         * Request an Authorization token
         * The default authorization URI is '[API_END_POINT]/authorize'
         * @param {?} username Username
         * @param {?} password Password
         * @return {?}
         */
        RestClientService.prototype.authorize = /**
         * Request an Authorization token
         * The default authorization URI is '[API_END_POINT]/authorize'
         * @param {?} username Username
         * @param {?} password Password
         * @return {?}
         */
        function (username, password) {
            var _this = this;
            return this.post(this.config.authUri, { username: username, password: password })
                .pipe(operators.tap((/**
             * @param {?} payload
             * @return {?}
             */
            function (payload) {
                _this.token = payload;
            })));
        };
        /** Validate the Authentication token against the API */
        /**
         * Validate the Authentication token against the API
         * @param {?} url
         * @return {?}
         */
        RestClientService.prototype.validateToken = /**
         * Validate the Authentication token against the API
         * @param {?} url
         * @return {?}
         */
        function (url) {
            return this.secured().request(HttpMethod.Post, url);
        };
        /** Removes authorization token */
        /**
         * Removes authorization token
         * @param {?} url
         * @return {?}
         */
        RestClientService.prototype.deauthorize = /**
         * Removes authorization token
         * @param {?} url
         * @return {?}
         */
        function (url) {
            var _this = this;
            return this.secured().request(HttpMethod.Get, url)
                .pipe(operators.tap((/**
             * @return {?}
             */
            function () {
                _this.revoke();
            })));
        };
        /** Check if the client is already Authenticate  */
        /**
         * Check if the client is already Authenticate
         * @return {?}
         */
        RestClientService.prototype.isAuthorized = /**
         * Check if the client is already Authenticate
         * @return {?}
         */
        function () {
            /** @type {?} */
            var token = this.token;
            /** @type {?} */
            var decoded = JwtHelper.decodeToken(token);
            return decoded !== null && !dateFns.isAfter(new Date(), dateFns.fromUnixTime(decoded.exp));
        };
        /** Cancel all pending requests */
        /**
         * Cancel all pending requests
         * @return {?}
         */
        RestClientService.prototype.cancelPendingRequests = /**
         * Cancel all pending requests
         * @return {?}
         */
        function () {
            this.cancelPending$.next(true);
        };
        /**
         * @template THIS
         * @this {THIS}
         * @param {?=} invalidate
         * @return {THIS}
         */
        RestClientService.prototype.cached = /**
         * @template THIS
         * @this {THIS}
         * @param {?=} invalidate
         * @return {THIS}
         */
        function (invalidate) {
            if (invalidate === void 0) { invalidate = false; }
            (/** @type {?} */ (this)).cachedRequest = true;
            (/** @type {?} */ (this)).invalidateCache = invalidate;
            return (/** @type {?} */ (this));
        };
        /**
         * Set the request mode to SECURED for the next request.
         *
         * Secured Mode force the next request to include the authentication token.
         * The token must be requested previously using the "authorize" method.
         */
        /**
         * Set the request mode to SECURED for the next request.
         *
         * Secured Mode force the next request to include the authentication token.
         * The token must be requested previously using the "authorize" method.
         * @return {?}
         */
        RestClientService.prototype.secured = /**
         * Set the request mode to SECURED for the next request.
         *
         * Secured Mode force the next request to include the authentication token.
         * The token must be requested previously using the "authorize" method.
         * @return {?}
         */
        function () {
            this.secureRequest = true;
            return this;
        };
        /**
         * Set the request mode to PUBLIC for the next request.
         *
         * Public is the default request mode and ensure that no authentication token
         * will be pass on the next request.
         */
        /**
         * Set the request mode to PUBLIC for the next request.
         *
         * Public is the default request mode and ensure that no authentication token
         * will be pass on the next request.
         * @return {?}
         */
        RestClientService.prototype.public = /**
         * Set the request mode to PUBLIC for the next request.
         *
         * Public is the default request mode and ensure that no authentication token
         * will be pass on the next request.
         * @return {?}
         */
        function () {
            this.secureRequest = false;
            return this;
        };
        /**
         * API request using GET method
         *
         * @param url
         * @param data A list of parametes
         */
        /**
         * API request using GET method
         *
         * @param {?} url
         * @param {?=} data A list of parametes
         * @return {?}
         */
        RestClientService.prototype.get = /**
         * API request using GET method
         *
         * @param {?} url
         * @param {?=} data A list of parametes
         * @return {?}
         */
        function (url, data) {
            return this.request(HttpMethod.Get, url, data);
        };
        /**
         * API request using POST method
         *
         * @param url
         * @param data
         * @param responseType
         * @param httpOptions
         */
        /**
         * API request using POST method
         *
         * @param {?} url
         * @param {?=} data
         * @param {?=} responseType
         * @param {?=} httpOptions
         * @return {?}
         */
        RestClientService.prototype.post = /**
         * API request using POST method
         *
         * @param {?} url
         * @param {?=} data
         * @param {?=} responseType
         * @param {?=} httpOptions
         * @return {?}
         */
        function (url, data, responseType, httpOptions) {
            if (httpOptions === void 0) { httpOptions = {}; }
            return this.request(HttpMethod.Post, url, data, responseType, httpOptions);
        };
        /**
         * API request using PUT method
         *
         * @param url
         * @param data
         * @param responseType
         * @param httpOptions
         */
        /**
         * API request using PUT method
         *
         * @param {?} url
         * @param {?=} data
         * @param {?=} responseType
         * @param {?=} httpOptions
         * @return {?}
         */
        RestClientService.prototype.put = /**
         * API request using PUT method
         *
         * @param {?} url
         * @param {?=} data
         * @param {?=} responseType
         * @param {?=} httpOptions
         * @return {?}
         */
        function (url, data, responseType, httpOptions) {
            if (httpOptions === void 0) { httpOptions = {}; }
            return this.request(HttpMethod.Put, url, data, responseType, httpOptions);
        };
        /**
         * API request using DELETE method
         *
         * @param url
         * @param data
         * @param responseType
         */
        /**
         * API request using DELETE method
         *
         * @param {?} url
         * @param {?=} data
         * @param {?=} responseType
         * @return {?}
         */
        RestClientService.prototype.delete = /**
         * API request using DELETE method
         *
         * @param {?} url
         * @param {?=} data
         * @param {?=} responseType
         * @return {?}
         */
        function (url, data, responseType) {
            return this.request(HttpMethod.Delete, url, data, responseType);
        };
        /** Set the upload file mode */
        /**
         * Set the upload file mode
         * @return {?}
         */
        RestClientService.prototype.withFiles = /**
         * Set the upload file mode
         * @return {?}
         */
        function () {
            this.withFilesRequest = true;
            return this;
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
        RestClientService.prototype.createFormData = /**
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
         * @protected
         * @param {?} url
         * @return {?}
         */
        RestClientService.prototype.buildUrl = /**
         * @protected
         * @param {?} url
         * @return {?}
         */
        function (url) {
            /** @type {?} */
            var endPoint = this.config.mockData ? 'assets/mock-data/' : this.config.endPoint.replace(/\/$/, '');
            /** @type {?} */
            var nUrl = endPoint + "/" + url.replace(/^\//g, '');
            /** @type {?} */
            var match = nUrl.match(/\.([0-9a-z]+)(?:[\?#]|$)/i);
            if (this.config.mockData && match == null) {
                nUrl = nUrl + ".json";
            }
            return nUrl;
        };
        /**
         * Return the request headers based on configuration parameters
         */
        /**
         * Return the request headers based on configuration parameters
         * @private
         * @return {?}
         */
        RestClientService.prototype.buildHeaders = /**
         * Return the request headers based on configuration parameters
         * @private
         * @return {?}
         */
        function () {
            /** @type {?} */
            var header = __assign({}, this.baseHeader);
            if (this.config.language) {
                header['Accept-Language'] = this.config.language;
            }
            if (this.secureRequest) {
                /** @type {?} */
                var token = this.token;
                if (!token) {
                    console.warn('Executing a secure request without TOKEN. '
                        + 'Authorization header will not be set!');
                }
                else {
                    header.Authorization = "Bearer " + token;
                }
                this.secureRequest = false;
            }
            return header;
        };
        /** Raw request method */
        /**
         * Raw request method
         * @protected
         * @param {?} method
         * @param {?} url
         * @param {?=} data
         * @param {?=} responseType
         * @param {?=} httpOptions
         * @return {?}
         */
        RestClientService.prototype.request = /**
         * Raw request method
         * @protected
         * @param {?} method
         * @param {?} url
         * @param {?=} data
         * @param {?=} responseType
         * @param {?=} httpOptions
         * @return {?}
         */
        function (method, url, data, responseType, httpOptions) {
            var _this = this;
            if (httpOptions === void 0) { httpOptions = {}; }
            /** @type {?} */
            var msDelay = Math.floor((Math.random() * 2000) + 1000);
            /** @type {?} */
            var header = this.buildHeaders();
            /** @type {?} */
            var rType = (/** @type {?} */ ((responseType ? responseType : 'json')));
            if (this.withFilesRequest) {
                data = this.createFormData(data);
                this.withFilesRequest = false;
            }
            /** @type {?} */
            var cacheKey = '';
            if (this.cachedRequest) {
                cacheKey = btoa(unescape(encodeURIComponent(method + '_' + url + '_' + (method === HttpMethod.Get ? JSON.stringify(data) : ''))));
                if (!this.invalidateCache) {
                    /** @type {?} */
                    var cached = this.cache.get(cacheKey);
                    if (cached) {
                        this.cachedRequest = false;
                        return rxjs.of(cached);
                    }
                }
                else {
                    this.cache.invalidate(cacheKey);
                }
            }
            /** @type {?} */
            var options = {
                body: method === HttpMethod.Get ? {} : data,
                responseType: rType,
                params: method === HttpMethod.Get ? data : {},
                headers: header
            };
            return this.http
                .request(this.config.mockData ? HttpMethod.Get : method, this.buildUrl(url), __assign({}, options, httpOptions))
                .pipe(operators.takeUntil(this.cancelPending$))
                .pipe(operators.delay(this.config.mockData ? msDelay : 0))
                .pipe(operators.tap((/**
             * @param {?} resp
             * @return {?}
             */
            function (resp) {
                if (_this.cachedRequest) {
                    _this.cachedRequest = false;
                    _this.cache.set(cacheKey, resp);
                }
            })))
                .pipe(operators.catchError((/**
             * @param {?} err
             * @return {?}
             */
            function (err) {
                if (_this.config.UnauthorizedRedirectUri
                    && url !== _this.config.authUri
                    && err.status === 401) {
                    _this.router.navigate([_this.config.UnauthorizedRedirectUri]).then((/**
                     * @return {?}
                     */
                    function () { }));
                    _this.cancelPendingRequests();
                }
                return rxjs.throwError(err);
            })));
        };
        RestClientService.decorators = [
            { type: core.Injectable, args: [{
                        providedIn: 'root'
                    },] }
        ];
        /** @nocollapse */
        RestClientService.ctorParameters = function () { return [
            { type: http.HttpClient },
            { type: ngxCookie.CookieService },
            { type: CacheService },
            { type: router.Router },
            { type: RestServiceConfig, decorators: [{ type: core.Optional }] }
        ]; };
        /** @nocollapse */ RestClientService.ngInjectableDef = core.ɵɵdefineInjectable({ factory: function RestClientService_Factory() { return new RestClientService(core.ɵɵinject(http.HttpClient), core.ɵɵinject(ngxCookie.CookieService), core.ɵɵinject(CacheService), core.ɵɵinject(router.Router), core.ɵɵinject(RestServiceConfig, 8)); }, token: RestClientService, providedIn: "root" });
        return RestClientService;
    }());
    if (false) {
        /**
         * Handler used to stop all pending requests
         * @type {?}
         * @protected
         */
        RestClientService.prototype.cancelPending$;
        /**
         * Default requests header
         * @type {?}
         * @protected
         */
        RestClientService.prototype.baseHeader;
        /**
         * Service configuration parameters
         * @type {?}
         * @protected
         */
        RestClientService.prototype.config;
        /**
         * When true, the request header will include the authentication token
         * @type {?}
         * @protected
         */
        RestClientService.prototype.secureRequest;
        /**
         * Holds a list of files to be upload on request
         * @type {?}
         * @protected
         */
        RestClientService.prototype.withFilesRequest;
        /**
         * Prefer cache
         * @type {?}
         * @protected
         */
        RestClientService.prototype.cachedRequest;
        /**
         * Invalidate cache
         * @type {?}
         * @protected
         */
        RestClientService.prototype.invalidateCache;
        /**
         * @type {?}
         * @private
         */
        RestClientService.prototype.http;
        /**
         * @type {?}
         * @private
         */
        RestClientService.prototype.cookies;
        /**
         * @type {?}
         * @private
         */
        RestClientService.prototype.cache;
        /**
         * @type {?}
         * @private
         */
        RestClientService.prototype.router;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var NgxRestModule = /** @class */ (function () {
        function NgxRestModule() {
        }
        /**
         * @param {?=} config
         * @return {?}
         */
        NgxRestModule.forRoot = /**
         * @param {?=} config
         * @return {?}
         */
        function (config) {
            return {
                ngModule: NgxRestModule,
                providers: [
                    { provide: RestServiceConfig, useValue: config }
                ]
            };
        };
        NgxRestModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [
                            http.HttpClientModule,
                            ngxCookie.CookieModule.forRoot()
                        ],
                        providers: [
                            http.HttpClient,
                            ngxCookie.CookieService,
                            FileDownload,
                            FileUpload,
                            router.RouterModule
                        ]
                    },] }
        ];
        return NgxRestModule;
    }());

    exports.FileDownload = FileDownload;
    exports.FileDownloadState = FileDownloadState;
    exports.FileUpload = FileUpload;
    exports.FileUploadState = FileUploadState;
    exports.NgxRestModule = NgxRestModule;
    exports.RestClientService = RestClientService;
    exports.RestServiceConfig = RestServiceConfig;
    exports.TypeTokenStorage = TypeTokenStorage;
    exports.ɵa = CacheService;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngx-rest.umd.js.map
