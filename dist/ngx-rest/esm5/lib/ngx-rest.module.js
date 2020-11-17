import { __decorate } from "tslib";
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
    NgxRestModule_1 = NgxRestModule;
    NgxRestModule.forRoot = function (config) {
        return {
            ngModule: NgxRestModule_1,
            providers: [
                { provide: RestServiceConfig, useValue: config }
            ]
        };
    };
    var NgxRestModule_1;
    NgxRestModule = NgxRestModule_1 = __decorate([
        NgModule({
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
    ], NgxRestModule);
    return NgxRestModule;
}());
export { NgxRestModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXJlc3QubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXJlc3QvIiwic291cmNlcyI6WyJsaWIvbmd4LXJlc3QubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUF1QixNQUFNLGVBQWUsQ0FBQztBQUM5RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3BFLE9BQU8sRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBRXpELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUN2RCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFlbkQ7SUFBQTtJQVNBLENBQUM7c0JBVFksYUFBYTtJQUNWLHFCQUFPLEdBQXJCLFVBQXNCLE1BQTBCO1FBQzlDLE9BQU87WUFDTCxRQUFRLEVBQUUsZUFBYTtZQUN2QixTQUFTLEVBQUU7Z0JBQ1QsRUFBRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRTthQUNqRDtTQUNGLENBQUM7SUFDSixDQUFDOztJQVJVLGFBQWE7UUFiekIsUUFBUSxDQUFDO1lBQ1IsT0FBTyxFQUFFO2dCQUNQLGdCQUFnQjtnQkFDaEIsWUFBWSxDQUFDLE9BQU8sRUFBRTthQUN2QjtZQUNELFNBQVMsRUFBRTtnQkFDVCxVQUFVO2dCQUNWLGFBQWE7Z0JBQ2IsWUFBWTtnQkFDWixVQUFVO2dCQUNWLFlBQVk7YUFDYjtTQUNGLENBQUM7T0FDVyxhQUFhLENBU3pCO0lBQUQsb0JBQUM7Q0FBQSxBQVRELElBU0M7U0FUWSxhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJvdXRlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBIdHRwQ2xpZW50TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgQ29va2llTW9kdWxlLCBDb29raWVTZXJ2aWNlIH0gZnJvbSAnbmd4LWNvb2tpZSc7XG5cbmltcG9ydCB7IFJlc3RTZXJ2aWNlQ29uZmlnIH0gZnJvbSAnLi9uZ3gtcmVzdC5jb25maWcnO1xuaW1wb3J0IHsgRmlsZURvd25sb2FkIH0gZnJvbSAnLi9maWxlLWRvd25sb2FkLnNlcnZpY2UnO1xuaW1wb3J0IHsgRmlsZVVwbG9hZCB9IGZyb20gJy4vZmlsZS11cGxvYWQuc2VydmljZSc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBIdHRwQ2xpZW50TW9kdWxlLFxuICAgIENvb2tpZU1vZHVsZS5mb3JSb290KClcbiAgXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgSHR0cENsaWVudCxcbiAgICBDb29raWVTZXJ2aWNlLFxuICAgIEZpbGVEb3dubG9hZCxcbiAgICBGaWxlVXBsb2FkLFxuICAgIFJvdXRlck1vZHVsZVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIE5neFJlc3RNb2R1bGUge1xuICBwdWJsaWMgc3RhdGljIGZvclJvb3QoY29uZmlnPzogUmVzdFNlcnZpY2VDb25maWcpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IE5neFJlc3RNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgeyBwcm92aWRlOiBSZXN0U2VydmljZUNvbmZpZywgdXNlVmFsdWU6IGNvbmZpZyB9XG4gICAgICBdXG4gICAgfTtcbiAgfVxufVxuIl19