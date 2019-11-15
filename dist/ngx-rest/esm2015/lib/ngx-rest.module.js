/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CookieModule, CookieService } from 'ngx-cookie';
import { RestServiceConfig } from './ngx-rest.config';
import { FileDownload } from './file-download.service';
import { FileUpload } from './file-upload.service';
export class NgxRestModule {
    /**
     * @param {?=} config
     * @return {?}
     */
    static forRoot(config) {
        return {
            ngModule: NgxRestModule,
            providers: [
                { provide: RestServiceConfig, useValue: config }
            ]
        };
    }
}
NgxRestModule.decorators = [
    { type: NgModule, args: [{
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
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXJlc3QubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXJlc3QvIiwic291cmNlcyI6WyJsaWIvbmd4LXJlc3QubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUF1QixNQUFNLGVBQWUsQ0FBQztBQUM5RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3BFLE9BQU8sRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBRXpELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUN2RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFlbkQsTUFBTSxPQUFPLGFBQWE7Ozs7O0lBQ2pCLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBMEI7UUFDOUMsT0FBTztZQUNMLFFBQVEsRUFBRSxhQUFhO1lBQ3ZCLFNBQVMsRUFBRTtnQkFDVCxFQUFFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFO2FBQ2pEO1NBQ0YsQ0FBQztJQUNKLENBQUM7OztZQXJCRixRQUFRLFNBQUM7Z0JBQ1IsT0FBTyxFQUFFO29CQUNQLGdCQUFnQjtvQkFDaEIsWUFBWSxDQUFDLE9BQU8sRUFBRTtpQkFDdkI7Z0JBQ0QsU0FBUyxFQUFFO29CQUNULFVBQVU7b0JBQ1YsYUFBYTtvQkFDYixZQUFZO29CQUNaLFVBQVU7b0JBQ1YsWUFBWTtpQkFDYjthQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJvdXRlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwQ2xpZW50TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgQ29va2llTW9kdWxlLCBDb29raWVTZXJ2aWNlIH0gZnJvbSAnbmd4LWNvb2tpZSc7XG5cbmltcG9ydCB7IFJlc3RTZXJ2aWNlQ29uZmlnIH0gZnJvbSAnLi9uZ3gtcmVzdC5jb25maWcnO1xuaW1wb3J0IHsgRmlsZURvd25sb2FkIH0gZnJvbSAnLi9maWxlLWRvd25sb2FkLnNlcnZpY2UnO1xuaW1wb3J0IHsgRmlsZVVwbG9hZCB9IGZyb20gJy4vZmlsZS11cGxvYWQuc2VydmljZSc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBIdHRwQ2xpZW50TW9kdWxlLFxuICAgIENvb2tpZU1vZHVsZS5mb3JSb290KClcbiAgXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgSHR0cENsaWVudCxcbiAgICBDb29raWVTZXJ2aWNlLFxuICAgIEZpbGVEb3dubG9hZCxcbiAgICBGaWxlVXBsb2FkLFxuICAgIFJvdXRlck1vZHVsZVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIE5neFJlc3RNb2R1bGUge1xuICBwdWJsaWMgc3RhdGljIGZvclJvb3QoY29uZmlnPzogUmVzdFNlcnZpY2VDb25maWcpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IE5neFJlc3RNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgeyBwcm92aWRlOiBSZXN0U2VydmljZUNvbmZpZywgdXNlVmFsdWU6IGNvbmZpZyB9XG4gICAgICBdXG4gICAgfTtcbiAgfVxufVxuIl19