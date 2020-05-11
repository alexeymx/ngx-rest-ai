import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CookieModule, CookieService } from 'ngx-cookie';
import { RestServiceConfig } from './ngx-rest.config';
import { FileDownload } from './file-download.service';
import { FileUpload } from './file-upload.service';
import * as i0 from "@angular/core";
import * as i1 from "ngx-cookie";
var NgxRestModule = /** @class */ (function () {
    function NgxRestModule() {
    }
    NgxRestModule.forRoot = function (config) {
        return {
            ngModule: NgxRestModule,
            providers: [
                { provide: RestServiceConfig, useValue: config }
            ]
        };
    };
    /** @nocollapse */ NgxRestModule.ɵmod = i0.ɵɵdefineNgModule({ type: NgxRestModule });
    /** @nocollapse */ NgxRestModule.ɵinj = i0.ɵɵdefineInjector({ factory: function NgxRestModule_Factory(t) { return new (t || NgxRestModule)(); }, providers: [
            HttpClient,
            CookieService,
            FileDownload,
            FileUpload,
            RouterModule
        ], imports: [[
                HttpClientModule,
                CookieModule.forRoot()
            ]] });
    return NgxRestModule;
}());
export { NgxRestModule };
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(NgxRestModule, { imports: [HttpClientModule, i1.CookieModule] }); })();
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(NgxRestModule, [{
        type: NgModule,
        args: [{
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
            }]
    }], null, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXJlc3QubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXJlc3QvIiwic291cmNlcyI6WyJsaWIvbmd4LXJlc3QubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQXVCLE1BQU0sZUFBZSxDQUFDO0FBQzlELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDcEUsT0FBTyxFQUFFLFlBQVksRUFBRSxhQUFhLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFFekQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDdEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQzs7O0FBRW5EO0lBQUE7S0FzQkM7SUFSZSxxQkFBTyxHQUFyQixVQUFzQixNQUEwQjtRQUM5QyxPQUFPO1lBQ0wsUUFBUSxFQUFFLGFBQWE7WUFDdkIsU0FBUyxFQUFFO2dCQUNULEVBQUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUU7YUFDakQ7U0FDRixDQUFDO0lBQ0osQ0FBQzt3RUFSVSxhQUFhO2dJQUFiLGFBQWEsbUJBUmI7WUFDVCxVQUFVO1lBQ1YsYUFBYTtZQUNiLFlBQVk7WUFDWixVQUFVO1lBQ1YsWUFBWTtTQUNiLFlBVlE7Z0JBQ1AsZ0JBQWdCO2dCQUNoQixZQUFZLENBQUMsT0FBTyxFQUFFO2FBQ3ZCO3dCQWJIO0NBK0JDLEFBdEJELElBc0JDO1NBVFksYUFBYTt3RkFBYixhQUFhLGNBWHRCLGdCQUFnQjtrREFXUCxhQUFhO2NBYnpCLFFBQVE7ZUFBQztnQkFDUixPQUFPLEVBQUU7b0JBQ1AsZ0JBQWdCO29CQUNoQixZQUFZLENBQUMsT0FBTyxFQUFFO2lCQUN2QjtnQkFDRCxTQUFTLEVBQUU7b0JBQ1QsVUFBVTtvQkFDVixhQUFhO29CQUNiLFlBQVk7b0JBQ1osVUFBVTtvQkFDVixZQUFZO2lCQUNiO2FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSwgTW9kdWxlV2l0aFByb3ZpZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm91dGVyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBDbGllbnRNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBDb29raWVNb2R1bGUsIENvb2tpZVNlcnZpY2UgfSBmcm9tICduZ3gtY29va2llJztcblxuaW1wb3J0IHsgUmVzdFNlcnZpY2VDb25maWcgfSBmcm9tICcuL25neC1yZXN0LmNvbmZpZyc7XG5pbXBvcnQgeyBGaWxlRG93bmxvYWQgfSBmcm9tICcuL2ZpbGUtZG93bmxvYWQuc2VydmljZSc7XG5pbXBvcnQgeyBGaWxlVXBsb2FkIH0gZnJvbSAnLi9maWxlLXVwbG9hZC5zZXJ2aWNlJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIEh0dHBDbGllbnRNb2R1bGUsXG4gICAgQ29va2llTW9kdWxlLmZvclJvb3QoKVxuICBdLFxuICBwcm92aWRlcnM6IFtcbiAgICBIdHRwQ2xpZW50LFxuICAgIENvb2tpZVNlcnZpY2UsXG4gICAgRmlsZURvd25sb2FkLFxuICAgIEZpbGVVcGxvYWQsXG4gICAgUm91dGVyTW9kdWxlXG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgTmd4UmVzdE1vZHVsZSB7XG4gIHB1YmxpYyBzdGF0aWMgZm9yUm9vdChjb25maWc/OiBSZXN0U2VydmljZUNvbmZpZyk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogTmd4UmVzdE1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7IHByb3ZpZGU6IFJlc3RTZXJ2aWNlQ29uZmlnLCB1c2VWYWx1ZTogY29uZmlnIH1cbiAgICAgIF1cbiAgICB9O1xuICB9XG59XG4iXX0=