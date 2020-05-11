import * as i0 from "@angular/core";
export declare class CacheService {
    private cache;
    set(key: string, data: any): void;
    get(key: string): null | any;
    invalidate(key: string): void;
    static ɵfac: i0.ɵɵFactoryDef<CacheService, never>;
    static ɵprov: i0.ɵɵInjectableDef<CacheService>;
}
