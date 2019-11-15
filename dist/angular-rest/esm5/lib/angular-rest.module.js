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
var AngularRestModule = /** @class */ (function () {
    function AngularRestModule() {
    }
    /**
     * @param {?=} config
     * @return {?}
     */
    AngularRestModule.forRoot = /**
     * @param {?=} config
     * @return {?}
     */
    function (config) {
        return {
            ngModule: AngularRestModule,
            providers: [
                { provide: RestServiceConfig, useValue: config }
            ]
        };
    };
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
    return AngularRestModule;
}());
export { AngularRestModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1yZXN0Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1yZXN0LyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItcmVzdC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQXVCLE1BQU0sZUFBZSxDQUFDO0FBQzlELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDcEUsT0FBTyxFQUFFLFlBQVksRUFBRSxhQUFhLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFFekQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDMUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUVuRDtJQUFBO0lBc0JBLENBQUM7Ozs7O0lBUmUseUJBQU87Ozs7SUFBckIsVUFBc0IsTUFBMEI7UUFDOUMsT0FBTztZQUNMLFFBQVEsRUFBRSxpQkFBaUI7WUFDM0IsU0FBUyxFQUFFO2dCQUNULEVBQUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUU7YUFDakQ7U0FDRixDQUFDO0lBQ0osQ0FBQzs7Z0JBckJGLFFBQVEsU0FBQztvQkFDUixPQUFPLEVBQUU7d0JBQ1AsZ0JBQWdCO3dCQUNoQixZQUFZLENBQUMsT0FBTyxFQUFFO3FCQUN2QjtvQkFDRCxTQUFTLEVBQUU7d0JBQ1QsVUFBVTt3QkFDVixhQUFhO3dCQUNiLFlBQVk7d0JBQ1osVUFBVTt3QkFDVixZQUFZO3FCQUNiO2lCQUNGOztJQVVELHdCQUFDO0NBQUEsQUF0QkQsSUFzQkM7U0FUWSxpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSwgTW9kdWxlV2l0aFByb3ZpZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm91dGVyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBDbGllbnRNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBDb29raWVNb2R1bGUsIENvb2tpZVNlcnZpY2UgfSBmcm9tICduZ3gtY29va2llJztcblxuaW1wb3J0IHsgUmVzdFNlcnZpY2VDb25maWcgfSBmcm9tICcuL2FuZ3VsYXItcmVzdC5jb25maWcnO1xuaW1wb3J0IHsgRmlsZURvd25sb2FkIH0gZnJvbSAnLi9maWxlLWRvd25sb2FkLnNlcnZpY2UnO1xuaW1wb3J0IHsgRmlsZVVwbG9hZCB9IGZyb20gJy4vZmlsZS11cGxvYWQuc2VydmljZSc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBIdHRwQ2xpZW50TW9kdWxlLFxuICAgIENvb2tpZU1vZHVsZS5mb3JSb290KClcbiAgXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgSHR0cENsaWVudCxcbiAgICBDb29raWVTZXJ2aWNlLFxuICAgIEZpbGVEb3dubG9hZCxcbiAgICBGaWxlVXBsb2FkLFxuICAgIFJvdXRlck1vZHVsZVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIEFuZ3VsYXJSZXN0TW9kdWxlIHtcbiAgcHVibGljIHN0YXRpYyBmb3JSb290KGNvbmZpZz86IFJlc3RTZXJ2aWNlQ29uZmlnKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBBbmd1bGFyUmVzdE1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7IHByb3ZpZGU6IFJlc3RTZXJ2aWNlQ29uZmlnLCB1c2VWYWx1ZTogY29uZmlnIH1cbiAgICAgIF1cbiAgICB9O1xuICB9XG59XG4iXX0=