import { ModuleWithProviders } from '@angular/core';
import { RestServiceConfig } from './ngx-rest.config';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "ngx-cookie";
export declare class NgxRestModule {
    static forRoot(config?: RestServiceConfig): i0.ModuleWithProviders<NgxRestModule>;
    static ɵmod: i0.ɵɵNgModuleDefWithMeta<NgxRestModule, never, [typeof i1.HttpClientModule, typeof i2.CookieModule], never>;
    static ɵinj: i0.ɵɵInjectorDef<NgxRestModule>;
}
