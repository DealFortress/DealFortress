import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class DefaultLogger {
    error(message, extra) {
        if (message) {
            extra ? console.error(message, extra) : console.error(message);
        }
    }
    log(message, extra) {
        if (message) {
            extra ? console.log(message, extra) : console.log(message);
        }
    }
    warn(message, extra) {
        if (message) {
            extra ? console.warn(message, extra) : console.warn(message);
        }
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: DefaultLogger, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: DefaultLogger }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: DefaultLogger, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1sb2dnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2RhdGEvc3JjL3V0aWxzL2RlZmF1bHQtbG9nZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBSTNDLE1BQU0sT0FBTyxhQUFhO0lBQ3hCLEtBQUssQ0FBQyxPQUFhLEVBQUUsS0FBVztRQUM5QixJQUFJLE9BQU8sRUFBRTtZQUNYLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDaEU7SUFDSCxDQUFDO0lBRUQsR0FBRyxDQUFDLE9BQWEsRUFBRSxLQUFXO1FBQzVCLElBQUksT0FBTyxFQUFFO1lBQ1gsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUM1RDtJQUNILENBQUM7SUFFRCxJQUFJLENBQUMsT0FBYSxFQUFFLEtBQVc7UUFDN0IsSUFBSSxPQUFPLEVBQUU7WUFDWCxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzlEO0lBQ0gsQ0FBQztpSUFqQlUsYUFBYTtxSUFBYixhQUFhOzsyRkFBYixhQUFhO2tCQUR6QixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIERlZmF1bHRMb2dnZXIgaW1wbGVtZW50cyBMb2dnZXIge1xuICBlcnJvcihtZXNzYWdlPzogYW55LCBleHRyYT86IGFueSkge1xuICAgIGlmIChtZXNzYWdlKSB7XG4gICAgICBleHRyYSA/IGNvbnNvbGUuZXJyb3IobWVzc2FnZSwgZXh0cmEpIDogY29uc29sZS5lcnJvcihtZXNzYWdlKTtcbiAgICB9XG4gIH1cblxuICBsb2cobWVzc2FnZT86IGFueSwgZXh0cmE/OiBhbnkpIHtcbiAgICBpZiAobWVzc2FnZSkge1xuICAgICAgZXh0cmEgPyBjb25zb2xlLmxvZyhtZXNzYWdlLCBleHRyYSkgOiBjb25zb2xlLmxvZyhtZXNzYWdlKTtcbiAgICB9XG4gIH1cblxuICB3YXJuKG1lc3NhZ2U/OiBhbnksIGV4dHJhPzogYW55KSB7XG4gICAgaWYgKG1lc3NhZ2UpIHtcbiAgICAgIGV4dHJhID8gY29uc29sZS53YXJuKG1lc3NhZ2UsIGV4dHJhKSA6IGNvbnNvbGUud2FybihtZXNzYWdlKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==