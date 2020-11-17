var NgxRestModule_1;
import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CookieModule, CookieService } from 'ngx-cookie';
import { RestServiceConfig } from './ngx-rest.config';
import { FileDownload } from './file-download.service';
import { FileUpload } from './file-upload.service';
let NgxRestModule = NgxRestModule_1 = class NgxRestModule {
    static forRoot(config) {
        return {
            ngModule: NgxRestModule_1,
            providers: [
                { provide: RestServiceConfig, useValue: config }
            ]
        };
    }
};
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
export { NgxRestModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXJlc3QubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXJlc3QvIiwic291cmNlcyI6WyJsaWIvbmd4LXJlc3QubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBdUIsTUFBTSxlQUFlLENBQUM7QUFDOUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNwRSxPQUFPLEVBQUUsWUFBWSxFQUFFLGFBQWEsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUV6RCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUN0RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDdkQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBZW5ELElBQWEsYUFBYSxxQkFBMUIsTUFBYSxhQUFhO0lBQ2pCLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBMEI7UUFDOUMsT0FBTztZQUNMLFFBQVEsRUFBRSxlQUFhO1lBQ3ZCLFNBQVMsRUFBRTtnQkFDVCxFQUFFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFO2FBQ2pEO1NBQ0YsQ0FBQztJQUNKLENBQUM7Q0FDRixDQUFBO0FBVFksYUFBYTtJQWJ6QixRQUFRLENBQUM7UUFDUixPQUFPLEVBQUU7WUFDUCxnQkFBZ0I7WUFDaEIsWUFBWSxDQUFDLE9BQU8sRUFBRTtTQUN2QjtRQUNELFNBQVMsRUFBRTtZQUNULFVBQVU7WUFDVixhQUFhO1lBQ2IsWUFBWTtZQUNaLFVBQVU7WUFDVixZQUFZO1NBQ2I7S0FDRixDQUFDO0dBQ1csYUFBYSxDQVN6QjtTQVRZLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSwgTW9kdWxlV2l0aFByb3ZpZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm91dGVyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBDbGllbnRNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBDb29raWVNb2R1bGUsIENvb2tpZVNlcnZpY2UgfSBmcm9tICduZ3gtY29va2llJztcblxuaW1wb3J0IHsgUmVzdFNlcnZpY2VDb25maWcgfSBmcm9tICcuL25neC1yZXN0LmNvbmZpZyc7XG5pbXBvcnQgeyBGaWxlRG93bmxvYWQgfSBmcm9tICcuL2ZpbGUtZG93bmxvYWQuc2VydmljZSc7XG5pbXBvcnQgeyBGaWxlVXBsb2FkIH0gZnJvbSAnLi9maWxlLXVwbG9hZC5zZXJ2aWNlJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIEh0dHBDbGllbnRNb2R1bGUsXG4gICAgQ29va2llTW9kdWxlLmZvclJvb3QoKVxuICBdLFxuICBwcm92aWRlcnM6IFtcbiAgICBIdHRwQ2xpZW50LFxuICAgIENvb2tpZVNlcnZpY2UsXG4gICAgRmlsZURvd25sb2FkLFxuICAgIEZpbGVVcGxvYWQsXG4gICAgUm91dGVyTW9kdWxlXG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgTmd4UmVzdE1vZHVsZSB7XG4gIHB1YmxpYyBzdGF0aWMgZm9yUm9vdChjb25maWc/OiBSZXN0U2VydmljZUNvbmZpZyk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogTmd4UmVzdE1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7IHByb3ZpZGU6IFJlc3RTZXJ2aWNlQ29uZmlnLCB1c2VWYWx1ZTogY29uZmlnIH1cbiAgICAgIF1cbiAgICB9O1xuICB9XG59XG4iXX0=