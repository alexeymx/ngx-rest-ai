import { TestBed, inject } from '@angular/core/testing';

import { CacheService } from './cache.service';

describe('CacheService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CacheService = TestBed.get(CacheService);
    expect(service).toBeTruthy();
  });

  it('should save arrays', inject([CacheService], (service: CacheService) => {
    const item = [1, 2, 3];
    const key = 'arrKey1';

    service.set(key, item);
    expect(service.get(key)).toBe(item);
  }));

  it('should save objects', inject([CacheService], (service: CacheService) => {
    const item = { id: 1 };
    const key = 'arrKey2';

    service.set(key, item);
    expect(service.get(key)).toBe(item);
  }));

  it('should save values', inject([CacheService], (service: CacheService) => {
    const item = 1;
    const key = 'arrKey3';

    service.set(key, item);
    expect(service.get(key)).toBe(item);
  }));


  it('should handle unexistent keys', inject([CacheService], (service: CacheService) => {
    const key = 'keyThatDoesNotExist';
    expect(service.get(key)).toBeNull();
  }));
});
