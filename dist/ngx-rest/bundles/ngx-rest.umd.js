(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common/http'), require('rxjs/operators'), require('util'), require('rxjs'), require('date-fns'), require('ngx-cookie'), require('@angular/router')) :
    typeof define === 'function' && define.amd ? define('ngx-rest', ['exports', '@angular/core', '@angular/common/http', 'rxjs/operators', 'util', 'rxjs', 'date-fns', 'ngx-cookie', '@angular/router'], factory) :
    (global = global || self, factory(global['ngx-rest'] = {}, global.ng.core, global.ng.common.http, global.rxjs.operators, global.util, global.rxjs, global.dateFns, global.ngxCookie, global.ng.router));
}(this, (function (exports, core, http, operators, util, rxjs, dateFns, ngxCookie, router) { 'use strict';

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
     * FileUpload request state enum
     */

    (function (FileUploadState) {
        FileUploadState["initialize"] = "initialize";
        FileUploadState["inProgress"] = "inProgress";
        FileUploadState["completed"] = "completed";
    })(exports.FileUploadState || (exports.FileUploadState = {}));
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
        FileUpload.humanReadableFormat = function (bytes) {
            var e = (Math.log(bytes) / Math.log(1e3)) | 0;
            return +(bytes / Math.pow(1e3, e)).toFixed(2) + ' ' + ('kMGTPEZY'[e - 1] || '') + 'B';
        };
        /**
         * Convert bytes size to human readable format
         */
        FileUpload.calculateSize = function (files) {
            var size = 0;
            Array.from(files).forEach(function (file) { size += file.size; });
            return size;
        };
        /**
         * Create a FormData object to be send as request payload data
         */
        FileUpload.prototype.createFormData = function (object, form, namespace) {
            var formData = form || new FormData();
            for (var property in object) {
                if (!object.hasOwnProperty(property) || !object[property]) {
                    continue;
                }
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
        FileUpload.prototype.upload = function (method, url, files, options) {
            method = method.toLowerCase();
            if (['post', 'put'].indexOf(method) === -1) {
                throw new Error("FileUpload: Method \"" + method + "\" not allow, use \"POST\" or \"PUT\"");
            }
            var result = { state: null, files: files, total: 0, loaded: 0, progress: 0 };
            var Params = {};
            Params[options.listParameterName ? options.listParameterName : 'files'] = files;
            var res = new http.HttpRequest(method, url, this.createFormData(options.params ? __assign(__assign({}, Params), options.params) : Params), { reportProgress: true, headers: new http.HttpHeaders(options.headers ? options.headers : {}) });
            return this.http
                .request(res)
                .pipe(operators.map(function (event) {
                switch (event.type) {
                    case http.HttpEventType.Sent:
                        result = __assign(__assign({}, result), { state: exports.FileUploadState.initialize });
                        break;
                    case http.HttpEventType.UploadProgress:
                        result = __assign(__assign({}, result), {
                            state: event.total !== event.loaded ? exports.FileUploadState.inProgress : exports.FileUploadState.completed,
                            total: event.total,
                            loaded: event.loaded,
                            progress: Math.round(100 * event.loaded / event.total)
                        });
                        break;
                    case http.HttpEventType.Response:
                        if (result.state !== exports.FileUploadState.completed) {
                            result = __assign(__assign({}, result), { state: exports.FileUploadState.completed });
                        }
                        break;
                }
                return result;
            }), operators.filter(function (val) { return !util.isNullOrUndefined(val); }), operators.distinctUntilChanged());
        };
        /**
         * Upload the files using POST HTTP method
         */
        FileUpload.prototype.post = function (url, files, options) {
            return this.upload('post', url, files, options);
        };
        /**
         * Upload the files using PUT HTTP method
         */
        FileUpload.prototype.put = function (url, files, options) {
            return this.upload('put', url, files, options);
        };
        /** @nocollapse */ FileUpload.ɵfac = function FileUpload_Factory(t) { return new (t || FileUpload)(core.ɵɵinject(http.HttpClient)); };
        /** @nocollapse */ FileUpload.ɵprov = core.ɵɵdefineInjectable({ token: FileUpload, factory: FileUpload.ɵfac });
        return FileUpload;
    }());
    /*@__PURE__*/ (function () { core.ɵsetClassMetadata(FileUpload, [{
            type: core.Injectable
        }], function () { return [{ type: http.HttpClient }]; }, null); })();

    /**
     * FileDownload request state enum
     */

    (function (FileDownloadState) {
        FileDownloadState["initialize"] = "initialize";
        FileDownloadState["inProgress"] = "inProgress";
        FileDownloadState["completed"] = "completed";
    })(exports.FileDownloadState || (exports.FileDownloadState = {}));
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
        FileDownload.humanReadableFormat = function (bytes) {
            var e = (Math.log(bytes) / Math.log(1e3)) | 0;
            return +(bytes / Math.pow(1e3, e)).toFixed(2) + ' ' + ('kMGTPEZY'[e - 1] || '') + 'B';
        };
        /**
         * Save the Blob data
         */
        FileDownload.blobSave = function (saveAs, data) {
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(data, saveAs);
            }
            else {
                var url_1 = window.URL.createObjectURL(data), a_1 = document.createElement('a');
                document.body.appendChild(a_1);
                a_1.setAttribute('style', 'display: none');
                a_1.href = url_1;
                a_1.download = saveAs;
                a_1.click();
                setTimeout(function () { window.URL.revokeObjectURL(url_1); document.body.removeChild(a_1); }, 400);
            }
        };
        /**
         * Request the file to be downloaded
         */
        FileDownload.prototype.download = function (method, url, saveAs, options) {
            if (options === void 0) { options = {}; }
            method = method.toLowerCase();
            if (['get', 'post', 'put'].indexOf(method) === -1) {
                throw new Error("FileDownload: Method \"" + method + "\" not allow, use \"GET\", \"POST\" or \"PUT\"");
            }
            var result = { state: null, saveAs: saveAs, total: 0, loaded: 0, progress: 0 }, Params = new http.HttpParams();
            var Options = {
                reportProgress: true,
                headers: new http.HttpHeaders(options.headers || {})
            };
            if (options.params) {
                Object.keys(options.params).forEach(function (key) { Params = Params.set(key, options.params[key]); });
            }
            var res = method === 'GET'
                ? new http.HttpRequest(method, url, __assign(__assign({}, Options), { responseType: 'blob', params: Params }))
                : new http.HttpRequest(method, url, options.params || {}, __assign(__assign({}, Options), { responseType: 'blob' }));
            return this.http
                .request(res)
                .pipe(operators.map(function (event) {
                switch (event.type) {
                    case http.HttpEventType.Sent:
                        result = __assign(__assign({}, result), { state: exports.FileDownloadState.initialize });
                        break;
                    case http.HttpEventType.DownloadProgress:
                        if (!util.isUndefined(event.total)) {
                            result = __assign(__assign({}, result), {
                                state: exports.FileDownloadState.inProgress,
                                total: event.total,
                                loaded: event.loaded,
                                progress: Math.round(100 * event.loaded / event.total)
                            });
                        }
                        break;
                    case http.HttpEventType.Response:
                        if (result.state !== exports.FileDownloadState.completed) {
                            result = __assign(__assign({}, result), { state: exports.FileDownloadState.completed });
                            FileDownload.blobSave(saveAs, event.body);
                        }
                        break;
                }
                return result;
            }), operators.filter(function (val) { return !util.isNullOrUndefined(val); }), operators.distinctUntilChanged());
        };
        /**
         * Upload the files using POST HTTP method
         */
        FileDownload.prototype.get = function (url, saveAs, options) {
            if (options === void 0) { options = {}; }
            return this.download('get', url, saveAs, options);
        };
        /**
         * Upload the files using POST HTTP method
         */
        FileDownload.prototype.post = function (url, saveAs, options) {
            if (options === void 0) { options = {}; }
            return this.download('post', url, saveAs, options);
        };
        /**
         * Upload the files using PUT HTTP method
         */
        FileDownload.prototype.put = function (url, saveAs, options) {
            if (options === void 0) { options = {}; }
            return this.download('put', url, saveAs, options);
        };
        /** @nocollapse */ FileDownload.ɵfac = function FileDownload_Factory(t) { return new (t || FileDownload)(core.ɵɵinject(http.HttpClient)); };
        /** @nocollapse */ FileDownload.ɵprov = core.ɵɵdefineInjectable({ token: FileDownload, factory: FileDownload.ɵfac });
        return FileDownload;
    }());
    /*@__PURE__*/ (function () { core.ɵsetClassMetadata(FileDownload, [{
            type: core.Injectable
        }], function () { return [{ type: http.HttpClient }]; }, null); })();


    (function (TypeTokenStorage) {
        TypeTokenStorage["cookie"] = "cookie";
        TypeTokenStorage["localStorage"] = "localStorage";
        TypeTokenStorage["sessionStorage"] = "sessionStorage";
    })(exports.TypeTokenStorage || (exports.TypeTokenStorage = {}));
    var RestServiceConfig = /** @class */ (function () {
        function RestServiceConfig() {
        }
        return RestServiceConfig;
    }());

    var HttpMethod;
    (function (HttpMethod) {
        HttpMethod["Get"] = "get";
        HttpMethod["Post"] = "post";
        HttpMethod["Put"] = "put";
        HttpMethod["Delete"] = "selete";
        HttpMethod["Patch"] = "patch";
    })(HttpMethod || (HttpMethod = {}));

    var JwtHelper = /** @class */ (function () {
        function JwtHelper() {
        }
        JwtHelper.decodeToken = function (token) {
            if (token === void 0) { token = ''; }
            if (token === null || token === '') {
                return null;
            }
            var parts = token.split('.');
            if (parts.length !== 3) {
                return null;
            }
            var decoded = this.urlBase64Decode(parts[1]);
            if (!decoded) {
                return null;
            }
            return JSON.parse(decoded);
        };
        JwtHelper.urlBase64Decode = function (str) {
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
            var data = atob(output);
            return decodeURIComponent(data);
        };
        return JwtHelper;
    }());

    var RestClientService = /** @class */ (function () {
        function RestClientService(http, cookies, router, config) {
            this.http = http;
            this.cookies = cookies;
            this.router = router;
            /** Handler used to stop all pending requests */
            this.cancelPending$ = new rxjs.Subject();
            /**  Default requests header */
            this.baseHeader = {
                'Cache-Control': 'no-cache',
                accept: 'application/json',
                Pragma: 'no-cache',
                Authorization: '',
                'Accept-Language': '*'
            };
            /** When true, the request header will include the authentication token */
            this.secureRequest = false;
            /** Holds a list of files to be upload on request */
            this.withFilesRequest = false;
            this.config = {
                endPoint: '',
                tokenName: 'AuthToken',
                tokenStorage: exports.TypeTokenStorage.cookie,
                secureCookie: false,
                mockData: false,
                validationTokenUri: '/info',
                authUri: '/authenticate',
                UnauthorizedRedirectUri: null
            };
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
        RestClientService.prototype.setConfig = function (config) {
            this.config = __assign(__assign({}, this.config), config);
            return this;
        };
        /** Return the current Rest Client configuration parameters.  */
        RestClientService.prototype.getConfig = function () {
            return this.config;
        };
        Object.defineProperty(RestClientService.prototype, "token", {
            /**
             * Get the API Token from cookies
             */
            get: function () {
                var token = '';
                switch (this.config.tokenStorage) {
                    case exports.TypeTokenStorage.cookie:
                        token = this.cookies.get(this.config.tokenName);
                        break;
                    case exports.TypeTokenStorage.localStorage:
                        token = localStorage.getItem(this.config.tokenName);
                        break;
                    case exports.TypeTokenStorage.sessionStorage:
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
            set: function (token) {
                var decoded = JwtHelper.decodeToken(token);
                var expires = dateFns.fromUnixTime(decoded.exp);
                switch (this.config.tokenStorage) {
                    case exports.TypeTokenStorage.cookie:
                        this.cookies.put(this.config.tokenName, token, { secure: this.config.secureCookie, expires: expires });
                        break;
                    case exports.TypeTokenStorage.localStorage:
                        localStorage.setItem(this.config.tokenName, token);
                        break;
                    case exports.TypeTokenStorage.sessionStorage:
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
        RestClientService.prototype.revoke = function () {
            switch (this.config.tokenStorage) {
                case exports.TypeTokenStorage.cookie:
                    this.cookies.removeAll();
                    break;
                case exports.TypeTokenStorage.localStorage:
                    localStorage.removeItem(this.config.tokenName);
                    break;
                case exports.TypeTokenStorage.sessionStorage:
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
         * @deprecated Use `authenticate` method instead
         */
        RestClientService.prototype.authorize = function (username, password) {
            return this.authenticate(username, password);
        };
        /**
         * Request an authentication token
         * The default authentication URI is '[API_END_POINT]/authenticate'
         * @param username Username
         * @param password Password
         */
        RestClientService.prototype.authenticate = function (username, password) {
            var _this = this;
            return this.post(this.config.authUri, { username: username, password: password })
                .pipe(operators.tap(function (payload) {
                _this.token = payload;
            }));
        };
        /** Validate the Authentication token against the API */
        RestClientService.prototype.validateToken = function (url) {
            return this.secured().request(HttpMethod.Post, url);
        };
        /**
         * Removes authorization token
         * @param url a url to report to
         * @deprecated use `deauthenticate` method instead
         */
        RestClientService.prototype.deauthorize = function (url) {
            return this.deauthenticate(url);
        };
        /**
         * Removes authorization token and reports logout to the server
         * @param url a url to report to
         */
        RestClientService.prototype.deauthenticate = function (url) {
            var _this = this;
            return this.secured().request(HttpMethod.Get, url)
                .pipe(operators.tap(function () {
                _this.revoke();
            }));
        };
        /**
         * Check if the client is already authenticated
         * @deprecated use `isAuthenticated` method instead
         */
        RestClientService.prototype.isAuthorized = function () {
            var token = this.token;
            var decoded = JwtHelper.decodeToken(token);
            return decoded !== null && !dateFns.isAfter(new Date(), dateFns.fromUnixTime(decoded.exp));
        };
        /**
         * Check if the client is already authenticated
         */
        RestClientService.prototype.isAuthenticated = function () {
            var token = this.token;
            var decoded = JwtHelper.decodeToken(token);
            return decoded !== null && !dateFns.isAfter(new Date(), dateFns.fromUnixTime(decoded.exp));
        };
        /** Cancel all pending requests */
        RestClientService.prototype.cancelPendingRequests = function () {
            this.cancelPending$.next(true);
        };
        /**
         * Set the request mode to SECURED for the next request.
         *
         * Secured Mode force the next request to include the authentication token.
         * The token must be requested previously using the "authorize" method.
         */
        RestClientService.prototype.secured = function () {
            this.secureRequest = true;
            return this;
        };
        /**
         * Set the request mode to PUBLIC for the next request.
         *
         * Public is the default request mode and ensure that no authentication token
         * will be pass on the next request.
         */
        RestClientService.prototype.public = function () {
            this.secureRequest = false;
            return this;
        };
        /**
         * API request using GET method
         *
         * @param url
         * @param data A list of parametes
         */
        RestClientService.prototype.get = function (url, data) {
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
        RestClientService.prototype.post = function (url, data, responseType, httpOptions) {
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
        RestClientService.prototype.put = function (url, data, responseType, httpOptions) {
            if (httpOptions === void 0) { httpOptions = {}; }
            return this.request(HttpMethod.Put, url, data, responseType, httpOptions);
        };
        /**
         * API request using PATCH method
         *
         * @param url
         * @param data
         * @param responseType
         * @param httpOptions
         */
        RestClientService.prototype.patch = function (url, data, responseType, httpOptions) {
            if (httpOptions === void 0) { httpOptions = {}; }
            return this.request(HttpMethod.Patch, url, data, responseType, httpOptions);
        };
        /**
         * API request using DELETE method
         *
         * @param url
         * @param data
         * @param responseType
         */
        RestClientService.prototype.delete = function (url, data, responseType) {
            return this.request(HttpMethod.Delete, url, data, responseType);
        };
        /** Set the upload file mode */
        RestClientService.prototype.withFiles = function () {
            this.withFilesRequest = true;
            return this;
        };
        /**
         * Create a FormData object to be send as request payload data
         */
        RestClientService.prototype.createFormData = function (object, form, namespace) {
            var formData = form || new FormData();
            for (var property in object) {
                if (!object.hasOwnProperty(property) || !object[property]) {
                    continue;
                }
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
        RestClientService.prototype.buildUrl = function (url) {
            var endPoint = this.config.mockData ? 'assets/mock-data' : this.config.endPoint.replace(/\/$/, '');
            var nUrl = endPoint + "/" + url.replace(/^\//g, '');
            var match = nUrl.match(/\.([0-9a-z]+)(?:[\?#]|$)/i);
            if (this.config.mockData && match == null) {
                nUrl = nUrl + ".json";
            }
            return nUrl;
        };
        /**
         * Return the request headers based on configuration parameters
         */
        RestClientService.prototype.buildHeaders = function () {
            var header = __assign({}, this.baseHeader);
            if (this.config.language) {
                header['Accept-Language'] = this.config.language;
            }
            if (this.secureRequest) {
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
        RestClientService.prototype.request = function (method, url, data, responseType, httpOptions) {
            var _this = this;
            if (httpOptions === void 0) { httpOptions = {}; }
            var msDelay = Math.floor((Math.random() * 2000) + 1000);
            var header = this.buildHeaders();
            var rType = (responseType ? responseType : 'json');
            if (this.withFilesRequest) {
                data = this.createFormData(data);
                this.withFilesRequest = false;
            }
            var options = {
                body: method === HttpMethod.Get ? {} : data,
                responseType: rType,
                params: method === HttpMethod.Get ? data : {},
                headers: header
            };
            return this.http
                .request(this.config.mockData ? HttpMethod.Get : method, this.buildUrl(url), __assign(__assign({}, options), httpOptions))
                .pipe(operators.takeUntil(this.cancelPending$))
                .pipe(operators.delay(this.config.mockData ? msDelay : 0))
                .pipe(operators.catchError(function (err) {
                if (_this.config.UnauthenticatedRedirectUri
                    && url !== _this.config.authUri
                    && err.status === 401) {
                    _this.router.navigate([_this.config.UnauthenticatedRedirectUri]).then(function () { });
                    _this.cancelPendingRequests();
                }
                if (_this.config.UnauthorizedRedirectUri
                    && url !== _this.config.authUri
                    && err.status === 403) {
                    _this.router.navigate([_this.config.UnauthorizedRedirectUri]).then(function () { });
                    _this.cancelPendingRequests();
                }
                return rxjs.throwError(err);
            }));
        };
        /** @nocollapse */ RestClientService.ɵfac = function RestClientService_Factory(t) { return new (t || RestClientService)(core.ɵɵinject(http.HttpClient), core.ɵɵinject(ngxCookie.CookieService), core.ɵɵinject(router.Router), core.ɵɵinject(RestServiceConfig, 8)); };
        /** @nocollapse */ RestClientService.ɵprov = core.ɵɵdefineInjectable({ token: RestClientService, factory: RestClientService.ɵfac, providedIn: 'root' });
        return RestClientService;
    }());
    /*@__PURE__*/ (function () { core.ɵsetClassMetadata(RestClientService, [{
            type: core.Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], function () { return [{ type: http.HttpClient }, { type: ngxCookie.CookieService }, { type: router.Router }, { type: RestServiceConfig, decorators: [{
                    type: core.Optional
                }] }]; }, null); })();

    var NgxRestModule = /** @class */ (function () {
        function NgxRestModule() {
        }
        NgxRestModule.forRoot = function (config) {
            return {
                ngModule: NgxRestModule,
                providers: [
                    { provide: RestServiceConfig, useValue: config }
                ]
            };
        };
        /** @nocollapse */ NgxRestModule.ɵmod = core.ɵɵdefineNgModule({ type: NgxRestModule });
        /** @nocollapse */ NgxRestModule.ɵinj = core.ɵɵdefineInjector({ factory: function NgxRestModule_Factory(t) { return new (t || NgxRestModule)(); }, providers: [
                http.HttpClient,
                ngxCookie.CookieService,
                FileDownload,
                FileUpload,
                router.RouterModule
            ], imports: [[
                    http.HttpClientModule,
                    ngxCookie.CookieModule.forRoot()
                ]] });
        return NgxRestModule;
    }());
    (function () { (typeof ngJitMode === "undefined" || ngJitMode) && core.ɵɵsetNgModuleScope(NgxRestModule, { imports: [http.HttpClientModule, ngxCookie.CookieModule] }); })();
    /*@__PURE__*/ (function () { core.ɵsetClassMetadata(NgxRestModule, [{
            type: core.NgModule,
            args: [{
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
                }]
        }], null, null); })();

    exports.FileDownload = FileDownload;
    exports.FileUpload = FileUpload;
    exports.NgxRestModule = NgxRestModule;
    exports.RestClientService = RestClientService;
    exports.RestServiceConfig = RestServiceConfig;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngx-rest.umd.js.map
