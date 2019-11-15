import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CookieModule, CookieService } from 'ngx-cookie';

import { RestClientService } from './ngx-rest.service';

describe('RestClientService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      CookieModule.forRoot(),
      RouterTestingModule
    ],
    providers: [RestClientService, CookieService]
  }));

  it('should be created', () => {
    const service: RestClientService = TestBed.get(RestClientService);
    expect(service).toBeTruthy();
  });
});
