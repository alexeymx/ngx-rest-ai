import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class CacheService {
    constructor() {
        this.cache = new Map();
    }
    set(key, data) {
        this.cache.set(key, data);
    }
    get(key) {
        if (this.cache.has(key)) {
            return this.cache.get(key);
        }
        else {
            return null;
        }
    }
    invalidate(key) {
        if (this.cache.has(key)) {
        }
    }
}
/** @nocollapse */ CacheService.ɵfac = function CacheService_Factory(t) { return new (t || CacheService)(); };
/** @nocollapse */ CacheService.ɵprov = i0.ɵɵdefineInjectable({ token: CacheService, factory: CacheService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(CacheService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], null, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FjaGUuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1yZXN0LyIsInNvdXJjZXMiOlsibGliL2NhY2hlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFLM0MsTUFBTSxPQUFPLFlBQVk7SUFIekI7UUFJVSxVQUFLLEdBQUcsSUFBSSxHQUFHLEVBQWlCLENBQUM7S0FrQjFDO0lBaEJRLEdBQUcsQ0FBQyxHQUFXLEVBQUUsSUFBUztRQUMvQixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVNLEdBQUcsQ0FBQyxHQUFXO1FBQ3BCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDdkIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUM1QjthQUFNO1lBQ0wsT0FBTyxJQUFJLENBQUM7U0FDYjtJQUNILENBQUM7SUFFTSxVQUFVLENBQUMsR0FBVztRQUMzQixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1NBQ3hCO0lBQ0gsQ0FBQzs7MkZBbEJVLFlBQVk7dUVBQVosWUFBWSxXQUFaLFlBQVksbUJBRlgsTUFBTTtrREFFUCxZQUFZO2NBSHhCLFVBQVU7ZUFBQztnQkFDVixVQUFVLEVBQUUsTUFBTTthQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgQ2FjaGVTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBjYWNoZSA9IG5ldyBNYXA8c3RyaW5nLCBhbnlbXT4oKTtcblxuICBwdWJsaWMgc2V0KGtleTogc3RyaW5nLCBkYXRhOiBhbnkpIHtcbiAgICB0aGlzLmNhY2hlLnNldChrZXksIGRhdGEpO1xuICB9XG5cbiAgcHVibGljIGdldChrZXk6IHN0cmluZyk6IG51bGwgfCBhbnkge1xuICAgIGlmICh0aGlzLmNhY2hlLmhhcyhrZXkpKSB7XG4gICAgICByZXR1cm4gdGhpcy5jYWNoZS5nZXQoa2V5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGludmFsaWRhdGUoa2V5OiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5jYWNoZS5oYXMoa2V5KSkge1xuICAgIH1cbiAgfVxufVxuIl19