import { TestBed } from '@angular/core/testing';

import { RestClientService } from './angular-rest.service';

describe('AngularRestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RestClientService = TestBed.get(RestClientService);
    expect(service).toBeTruthy();
  });
});
