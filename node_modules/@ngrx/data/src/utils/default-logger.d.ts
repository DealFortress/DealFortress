import { Logger } from './interfaces';
import * as i0 from "@angular/core";
export declare class DefaultLogger implements Logger {
    error(message?: any, extra?: any): void;
    log(message?: any, extra?: any): void;
    warn(message?: any, extra?: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DefaultLogger, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DefaultLogger>;
}
