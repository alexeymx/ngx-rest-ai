import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = new Map<string, any[]>();

  public set(key: string, data: any) {
    this.cache.set(key, data);
  }

  public get(key: string): null | any {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    } else {
      return null;
    }
  }

  public invalidate(key: string) {
    if (this.cache.has(key)) {
    }
  }
}
