/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CookieModule, CookieService } from 'ngx-cookie';
import { RestServiceConfig } from './angular-rest.config';
import { FileDownload } from './file-download.service';
import { FileUpload } from './file-upload.service';
export class AngularRestModule {
    /**
     * @param {?=} config
     * @return {?}
     */
    static forRoot(config) {
        return {
            ngModule: AngularRestModule,
            providers: [
                { provide: RestServiceConfig, useValue: config }
            ]
        };
    }
}
AngularRestModule.decorators = [
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1yZXN0Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1yZXN0LyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItcmVzdC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQXVCLE1BQU0sZUFBZSxDQUFDO0FBQzlELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDcEUsT0FBTyxFQUFFLFlBQVksRUFBRSxhQUFhLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFFekQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDMUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQWVuRCxNQUFNLE9BQU8saUJBQWlCOzs7OztJQUNyQixNQUFNLENBQUMsT0FBTyxDQUFDLE1BQTBCO1FBQzlDLE9BQU87WUFDTCxRQUFRLEVBQUUsaUJBQWlCO1lBQzNCLFNBQVMsRUFBRTtnQkFDVCxFQUFFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFO2FBQ2pEO1NBQ0YsQ0FBQztJQUNKLENBQUM7OztZQXJCRixRQUFRLFNBQUM7Z0JBQ1IsT0FBTyxFQUFFO29CQUNQLGdCQUFnQjtvQkFDaEIsWUFBWSxDQUFDLE9BQU8sRUFBRTtpQkFDdkI7Z0JBQ0QsU0FBUyxFQUFFO29CQUNULFVBQVU7b0JBQ1YsYUFBYTtvQkFDYixZQUFZO29CQUNaLFVBQVU7b0JBQ1YsWUFBWTtpQkFDYjthQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJvdXRlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwQ2xpZW50TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgQ29va2llTW9kdWxlLCBDb29raWVTZXJ2aWNlIH0gZnJvbSAnbmd4LWNvb2tpZSc7XG5cbmltcG9ydCB7IFJlc3RTZXJ2aWNlQ29uZmlnIH0gZnJvbSAnLi9hbmd1bGFyLXJlc3QuY29uZmlnJztcbmltcG9ydCB7IEZpbGVEb3dubG9hZCB9IGZyb20gJy4vZmlsZS1kb3dubG9hZC5zZXJ2aWNlJztcbmltcG9ydCB7IEZpbGVVcGxvYWQgfSBmcm9tICcuL2ZpbGUtdXBsb2FkLnNlcnZpY2UnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgSHR0cENsaWVudE1vZHVsZSxcbiAgICBDb29raWVNb2R1bGUuZm9yUm9vdCgpXG4gIF0sXG4gIHByb3ZpZGVyczogW1xuICAgIEh0dHBDbGllbnQsXG4gICAgQ29va2llU2VydmljZSxcbiAgICBGaWxlRG93bmxvYWQsXG4gICAgRmlsZVVwbG9hZCxcbiAgICBSb3V0ZXJNb2R1bGVcbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBBbmd1bGFyUmVzdE1vZHVsZSB7XG4gIHB1YmxpYyBzdGF0aWMgZm9yUm9vdChjb25maWc/OiBSZXN0U2VydmljZUNvbmZpZyk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogQW5ndWxhclJlc3RNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgeyBwcm92aWRlOiBSZXN0U2VydmljZUNvbmZpZywgdXNlVmFsdWU6IGNvbmZpZyB9XG4gICAgICBdXG4gICAgfTtcbiAgfVxufVxuIl19