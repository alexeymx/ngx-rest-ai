import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CookieModule, CookieService } from 'ngx-cookie';

import { RestServiceConfig } from './angular-rest.config';
import { FileDownload } from './file-download.service';
import { FileUpload } from './file-upload.service';

@NgModule({
  imports: [
    HttpClientModule,
    CookieModule.forRoot()
  ],
  providers: [
    HttpClient,
    CookieService,
    FileDownload,
    FileUpload,
    RouterModule
  ]
})
export class AngularRestModule {
  public static forRoot(config?: RestServiceConfig): ModuleWithProviders {
    return {
      ngModule: AngularRestModule,
      providers: [
        { provide: RestServiceConfig, useValue: config }
      ]
    };
  }
}
