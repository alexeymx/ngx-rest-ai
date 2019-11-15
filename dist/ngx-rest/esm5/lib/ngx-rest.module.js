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
var NgxRestModule = /** @class */ (function () {
    function NgxRestModule() {
    }
    /**
     * @param {?=} config
     * @return {?}
     */
    NgxRestModule.forRoot = /**
     * @param {?=} config
     * @return {?}
     */
    function (config) {
        return {
            ngModule: NgxRestModule,
            providers: [
                { provide: RestServiceConfig, useValue: config }
            ]
        };
    };
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
    return NgxRestModule;
}());
export { NgxRestModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXJlc3QubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXJlc3QvIiwic291cmNlcyI6WyJsaWIvbmd4LXJlc3QubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUF1QixNQUFNLGVBQWUsQ0FBQztBQUM5RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3BFLE9BQU8sRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBRXpELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUN2RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFbkQ7SUFBQTtJQXNCQSxDQUFDOzs7OztJQVJlLHFCQUFPOzs7O0lBQXJCLFVBQXNCLE1BQTBCO1FBQzlDLE9BQU87WUFDTCxRQUFRLEVBQUUsYUFBYTtZQUN2QixTQUFTLEVBQUU7Z0JBQ1QsRUFBRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRTthQUNqRDtTQUNGLENBQUM7SUFDSixDQUFDOztnQkFyQkYsUUFBUSxTQUFDO29CQUNSLE9BQU8sRUFBRTt3QkFDUCxnQkFBZ0I7d0JBQ2hCLFlBQVksQ0FBQyxPQUFPLEVBQUU7cUJBQ3ZCO29CQUNELFNBQVMsRUFBRTt3QkFDVCxVQUFVO3dCQUNWLGFBQWE7d0JBQ2IsWUFBWTt3QkFDWixVQUFVO3dCQUNWLFlBQVk7cUJBQ2I7aUJBQ0Y7O0lBVUQsb0JBQUM7Q0FBQSxBQXRCRCxJQXNCQztTQVRZLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSwgTW9kdWxlV2l0aFByb3ZpZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm91dGVyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBDbGllbnRNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBDb29raWVNb2R1bGUsIENvb2tpZVNlcnZpY2UgfSBmcm9tICduZ3gtY29va2llJztcblxuaW1wb3J0IHsgUmVzdFNlcnZpY2VDb25maWcgfSBmcm9tICcuL25neC1yZXN0LmNvbmZpZyc7XG5pbXBvcnQgeyBGaWxlRG93bmxvYWQgfSBmcm9tICcuL2ZpbGUtZG93bmxvYWQuc2VydmljZSc7XG5pbXBvcnQgeyBGaWxlVXBsb2FkIH0gZnJvbSAnLi9maWxlLXVwbG9hZC5zZXJ2aWNlJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIEh0dHBDbGllbnRNb2R1bGUsXG4gICAgQ29va2llTW9kdWxlLmZvclJvb3QoKVxuICBdLFxuICBwcm92aWRlcnM6IFtcbiAgICBIdHRwQ2xpZW50LFxuICAgIENvb2tpZVNlcnZpY2UsXG4gICAgRmlsZURvd25sb2FkLFxuICAgIEZpbGVVcGxvYWQsXG4gICAgUm91dGVyTW9kdWxlXG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgTmd4UmVzdE1vZHVsZSB7XG4gIHB1YmxpYyBzdGF0aWMgZm9yUm9vdChjb25maWc/OiBSZXN0U2VydmljZUNvbmZpZyk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogTmd4UmVzdE1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7IHByb3ZpZGU6IFJlc3RTZXJ2aWNlQ29uZmlnLCB1c2VWYWx1ZTogY29uZmlnIH1cbiAgICAgIF1cbiAgICB9O1xuICB9XG59XG4iXX0=