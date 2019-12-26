export declare class CacheService {
    private cache;
    set(key: string, data: any): void;
    get(key: string): null | any;
    invalidate(key: string): void;
}
