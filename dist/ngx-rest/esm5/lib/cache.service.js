/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
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
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    /** @nocollapse */ CacheService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function CacheService_Factory() { return new CacheService(); }, token: CacheService, providedIn: "root" });
    return CacheService;
}());
export { CacheService };
if (false) {
    /**
     * @type {?}
     * @private
     */
    CacheService.prototype.cache;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1yZXN0LyIsInNvdXJjZXMiOlsibGliL2NhY2hlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBRTNDO0lBQUE7UUFJVSxVQUFLLEdBQUcsSUFBSSxHQUFHLEVBQWlCLENBQUM7S0FrQjFDOzs7Ozs7SUFoQlEsMEJBQUc7Ozs7O0lBQVYsVUFBVyxHQUFXLEVBQUUsSUFBUztRQUMvQixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDNUIsQ0FBQzs7Ozs7SUFFTSwwQkFBRzs7OztJQUFWLFVBQVcsR0FBVztRQUNwQixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3ZCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDNUI7YUFBTTtZQUNMLE9BQU8sSUFBSSxDQUFDO1NBQ2I7SUFDSCxDQUFDOzs7OztJQUVNLGlDQUFVOzs7O0lBQWpCLFVBQWtCLEdBQVc7UUFDM0IsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtTQUN4QjtJQUNILENBQUM7O2dCQXJCRixVQUFVLFNBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25COzs7dUJBSkQ7Q0F3QkMsQUF0QkQsSUFzQkM7U0FuQlksWUFBWTs7Ozs7O0lBQ3ZCLDZCQUF5QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgQ2FjaGVTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBjYWNoZSA9IG5ldyBNYXA8c3RyaW5nLCBhbnlbXT4oKTtcblxuICBwdWJsaWMgc2V0KGtleTogc3RyaW5nLCBkYXRhOiBhbnkpIHtcbiAgICB0aGlzLmNhY2hlLnNldChrZXksIGRhdGEpO1xuICB9XG5cbiAgcHVibGljIGdldChrZXk6IHN0cmluZyk6IG51bGwgfCBhbnkge1xuICAgIGlmICh0aGlzLmNhY2hlLmhhcyhrZXkpKSB7XG4gICAgICByZXR1cm4gdGhpcy5jYWNoZS5nZXQoa2V5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGludmFsaWRhdGUoa2V5OiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5jYWNoZS5oYXMoa2V5KSkge1xuICAgIH1cbiAgfVxufVxuIl19