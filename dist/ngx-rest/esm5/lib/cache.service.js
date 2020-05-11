import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
var CacheService = /** @class */ (function () {
    function CacheService() {
        this.cache = new Map();
    }
    CacheService.prototype.set = function (key, data) {
        this.cache.set(key, data);
    };
    CacheService.prototype.get = function (key) {
        if (this.cache.has(key)) {
            return this.cache.get(key);
        }
        else {
            return null;
        }
    };
    CacheService.prototype.invalidate = function (key) {
        if (this.cache.has(key)) {
        }
    };
    /** @nocollapse */ CacheService.ɵfac = function CacheService_Factory(t) { return new (t || CacheService)(); };
    /** @nocollapse */ CacheService.ɵprov = i0.ɵɵdefineInjectable({ token: CacheService, factory: CacheService.ɵfac, providedIn: 'root' });
    return CacheService;
}());
export { CacheService };
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(CacheService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], null, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1yZXN0LyIsInNvdXJjZXMiOlsibGliL2NhY2hlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFFM0M7SUFBQTtRQUlVLFVBQUssR0FBRyxJQUFJLEdBQUcsRUFBaUIsQ0FBQztLQWtCMUM7SUFoQlEsMEJBQUcsR0FBVixVQUFXLEdBQVcsRUFBRSxJQUFTO1FBQy9CLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRU0sMEJBQUcsR0FBVixVQUFXLEdBQVc7UUFDcEIsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUN2QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQzVCO2FBQU07WUFDTCxPQUFPLElBQUksQ0FBQztTQUNiO0lBQ0gsQ0FBQztJQUVNLGlDQUFVLEdBQWpCLFVBQWtCLEdBQVc7UUFDM0IsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtTQUN4QjtJQUNILENBQUM7K0ZBbEJVLFlBQVk7MkVBQVosWUFBWSxXQUFaLFlBQVksbUJBRlgsTUFBTTt1QkFIcEI7Q0F3QkMsQUF0QkQsSUFzQkM7U0FuQlksWUFBWTtrREFBWixZQUFZO2NBSHhCLFVBQVU7ZUFBQztnQkFDVixVQUFVLEVBQUUsTUFBTTthQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgQ2FjaGVTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBjYWNoZSA9IG5ldyBNYXA8c3RyaW5nLCBhbnlbXT4oKTtcblxuICBwdWJsaWMgc2V0KGtleTogc3RyaW5nLCBkYXRhOiBhbnkpIHtcbiAgICB0aGlzLmNhY2hlLnNldChrZXksIGRhdGEpO1xuICB9XG5cbiAgcHVibGljIGdldChrZXk6IHN0cmluZyk6IG51bGwgfCBhbnkge1xuICAgIGlmICh0aGlzLmNhY2hlLmhhcyhrZXkpKSB7XG4gICAgICByZXR1cm4gdGhpcy5jYWNoZS5nZXQoa2V5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGludmFsaWRhdGUoa2V5OiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5jYWNoZS5oYXMoa2V5KSkge1xuICAgIH1cbiAgfVxufVxuIl19