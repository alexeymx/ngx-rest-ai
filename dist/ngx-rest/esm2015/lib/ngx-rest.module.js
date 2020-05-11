import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CookieModule, CookieService } from 'ngx-cookie';
import { RestServiceConfig } from './ngx-rest.config';
import { FileDownload } from './file-download.service';
import { FileUpload } from './file-upload.service';
import * as i0 from "@angular/core";
import * as i1 from "ngx-cookie";
export class NgxRestModule {
    static forRoot(config) {
        return {
            ngModule: NgxRestModule,
            providers: [
                { provide: RestServiceConfig, useValue: config }
            ]
        };
    }
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXJlc3QubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXJlc3QvIiwic291cmNlcyI6WyJsaWIvbmd4LXJlc3QubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQXVCLE1BQU0sZUFBZSxDQUFDO0FBQzlELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDcEUsT0FBTyxFQUFFLFlBQVksRUFBRSxhQUFhLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFFekQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDdEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQzs7O0FBZW5ELE1BQU0sT0FBTyxhQUFhO0lBQ2pCLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBMEI7UUFDOUMsT0FBTztZQUNMLFFBQVEsRUFBRSxhQUFhO1lBQ3ZCLFNBQVMsRUFBRTtnQkFDVCxFQUFFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFO2FBQ2pEO1NBQ0YsQ0FBQztJQUNKLENBQUM7O29FQVJVLGFBQWE7NEhBQWIsYUFBYSxtQkFSYjtRQUNULFVBQVU7UUFDVixhQUFhO1FBQ2IsWUFBWTtRQUNaLFVBQVU7UUFDVixZQUFZO0tBQ2IsWUFWUTtZQUNQLGdCQUFnQjtZQUNoQixZQUFZLENBQUMsT0FBTyxFQUFFO1NBQ3ZCO3dGQVNVLGFBQWEsY0FYdEIsZ0JBQWdCO2tEQVdQLGFBQWE7Y0FiekIsUUFBUTtlQUFDO2dCQUNSLE9BQU8sRUFBRTtvQkFDUCxnQkFBZ0I7b0JBQ2hCLFlBQVksQ0FBQyxPQUFPLEVBQUU7aUJBQ3ZCO2dCQUNELFNBQVMsRUFBRTtvQkFDVCxVQUFVO29CQUNWLGFBQWE7b0JBQ2IsWUFBWTtvQkFDWixVQUFVO29CQUNWLFlBQVk7aUJBQ2I7YUFDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSb3V0ZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cENsaWVudE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IENvb2tpZU1vZHVsZSwgQ29va2llU2VydmljZSB9IGZyb20gJ25neC1jb29raWUnO1xuXG5pbXBvcnQgeyBSZXN0U2VydmljZUNvbmZpZyB9IGZyb20gJy4vbmd4LXJlc3QuY29uZmlnJztcbmltcG9ydCB7IEZpbGVEb3dubG9hZCB9IGZyb20gJy4vZmlsZS1kb3dubG9hZC5zZXJ2aWNlJztcbmltcG9ydCB7IEZpbGVVcGxvYWQgfSBmcm9tICcuL2ZpbGUtdXBsb2FkLnNlcnZpY2UnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgSHR0cENsaWVudE1vZHVsZSxcbiAgICBDb29raWVNb2R1bGUuZm9yUm9vdCgpXG4gIF0sXG4gIHByb3ZpZGVyczogW1xuICAgIEh0dHBDbGllbnQsXG4gICAgQ29va2llU2VydmljZSxcbiAgICBGaWxlRG93bmxvYWQsXG4gICAgRmlsZVVwbG9hZCxcbiAgICBSb3V0ZXJNb2R1bGVcbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBOZ3hSZXN0TW9kdWxlIHtcbiAgcHVibGljIHN0YXRpYyBmb3JSb290KGNvbmZpZz86IFJlc3RTZXJ2aWNlQ29uZmlnKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBOZ3hSZXN0TW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHsgcHJvdmlkZTogUmVzdFNlcnZpY2VDb25maWcsIHVzZVZhbHVlOiBjb25maWcgfVxuICAgICAgXVxuICAgIH07XG4gIH1cbn1cbiJdfQ==