import { Pipe, ChangeDetectorRef } from '@angular/core';
import { LocalizeRouterService } from './localize-router.service';
import { equals } from './util';
import * as i0 from "@angular/core";
import * as i1 from "./localize-router.service";
const VIEW_DESTROYED_STATE = 128;
export class LocalizeRouterPipe {
    /**
     * CTOR
     */
    constructor(localize, _ref) {
        this.localize = localize;
        this._ref = _ref;
        this.value = '';
        this.subscription = this.localize.routerEvents.subscribe(() => {
            this.transform(this.lastKey);
        });
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    /**
     * Transform current url to localized one
     */
    transform(query) {
        if (!query || query.length === 0 || !this.localize.parser.currentLang) {
            return query;
        }
        if (equals(query, this.lastKey) && equals(this.lastLanguage, this.localize.parser.currentLang)) {
            return this.value;
        }
        this.lastKey = query;
        this.lastLanguage = this.localize.parser.currentLang;
        /** translate key and update values */
        this.value = this.localize.translateRoute(query);
        this.lastKey = query;
        // if view is already destroyed, ignore firing change detection
        const view = this._ref._view;
        if (view && (view.state & VIEW_DESTROYED_STATE)) {
            return this.value;
        }
        setTimeout(() => {
            this._ref.detectChanges();
        }, 0);
        return this.value;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: LocalizeRouterPipe, deps: [{ token: i1.LocalizeRouterService }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "16.2.10", ngImport: i0, type: LocalizeRouterPipe, name: "localize", pure: false }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.10", ngImport: i0, type: LocalizeRouterPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'localize',
                    pure: false // required to update the value when the promise is resolved
                }]
        }], ctorParameters: function () { return [{ type: i1.LocalizeRouterService }, { type: i0.ChangeDetectorRef }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxpemUtcm91dGVyLnBpcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtdHJhbnNsYXRlLXJvdXRlci9zcmMvbGliL2xvY2FsaXplLXJvdXRlci5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBaUIsSUFBSSxFQUFFLGlCQUFpQixFQUFhLE1BQU0sZUFBZSxDQUFDO0FBQ2xGLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBRWxFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxRQUFRLENBQUM7OztBQUVoQyxNQUFNLG9CQUFvQixHQUFHLEdBQUcsQ0FBQztBQU1qQyxNQUFNLE9BQU8sa0JBQWtCO0lBTTdCOztPQUVHO0lBQ0gsWUFBb0IsUUFBK0IsRUFBVSxJQUF1QjtRQUFoRSxhQUFRLEdBQVIsUUFBUSxDQUF1QjtRQUFVLFNBQUksR0FBSixJQUFJLENBQW1CO1FBUjVFLFVBQUssR0FBbUIsRUFBRSxDQUFDO1FBU2pDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUM1RCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMvQixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3JCLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDakM7SUFDSCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxTQUFTLENBQUMsS0FBcUI7UUFDN0IsSUFBSSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRTtZQUNyRSxPQUFPLEtBQUssQ0FBQztTQUNkO1FBQ0QsSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRTtZQUM5RixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7U0FDbkI7UUFDRCxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUNyQixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQztRQUVyRCxzQ0FBc0M7UUFDdEMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUNyQiwrREFBK0Q7UUFDL0QsTUFBTSxJQUFJLEdBQUksSUFBSSxDQUFDLElBQVksQ0FBQyxLQUFLLENBQUM7UUFDdEMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLG9CQUFvQixDQUFDLEVBQUU7WUFDL0MsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO1NBQ25CO1FBQ0QsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDNUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBRUwsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3BCLENBQUM7K0dBL0NVLGtCQUFrQjs2R0FBbEIsa0JBQWtCOzs0RkFBbEIsa0JBQWtCO2tCQUo5QixJQUFJO21CQUFDO29CQUNKLElBQUksRUFBRSxVQUFVO29CQUNoQixJQUFJLEVBQUUsS0FBSyxDQUFDLDREQUE0RDtpQkFDekUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQaXBlVHJhbnNmb3JtLCBQaXBlLCBDaGFuZ2VEZXRlY3RvclJlZiwgT25EZXN0cm95IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IExvY2FsaXplUm91dGVyU2VydmljZSB9IGZyb20gJy4vbG9jYWxpemUtcm91dGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgZXF1YWxzIH0gZnJvbSAnLi91dGlsJztcclxuXHJcbmNvbnN0IFZJRVdfREVTVFJPWUVEX1NUQVRFID0gMTI4O1xyXG5cclxuQFBpcGUoe1xyXG4gIG5hbWU6ICdsb2NhbGl6ZScsXHJcbiAgcHVyZTogZmFsc2UgLy8gcmVxdWlyZWQgdG8gdXBkYXRlIHRoZSB2YWx1ZSB3aGVuIHRoZSBwcm9taXNlIGlzIHJlc29sdmVkXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBMb2NhbGl6ZVJvdXRlclBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtLCBPbkRlc3Ryb3kge1xyXG4gIHByaXZhdGUgdmFsdWU6IHN0cmluZyB8IGFueVtdID0gJyc7XHJcbiAgcHJpdmF0ZSBsYXN0S2V5OiBzdHJpbmcgfCBhbnlbXTtcclxuICBwcml2YXRlIGxhc3RMYW5ndWFnZTogc3RyaW5nO1xyXG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XHJcblxyXG4gIC8qKlxyXG4gICAqIENUT1JcclxuICAgKi9cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGxvY2FsaXplOiBMb2NhbGl6ZVJvdXRlclNlcnZpY2UsIHByaXZhdGUgX3JlZjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcclxuICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gdGhpcy5sb2NhbGl6ZS5yb3V0ZXJFdmVudHMuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgdGhpcy50cmFuc2Zvcm0odGhpcy5sYXN0S2V5KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgbmdPbkRlc3Ryb3koKSB7XHJcbiAgICBpZiAodGhpcy5zdWJzY3JpcHRpb24pIHtcclxuICAgICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRyYW5zZm9ybSBjdXJyZW50IHVybCB0byBsb2NhbGl6ZWQgb25lXHJcbiAgICovXHJcbiAgdHJhbnNmb3JtKHF1ZXJ5OiBzdHJpbmcgfCBhbnlbXSk6IHN0cmluZyB8IGFueVtdIHtcclxuICAgIGlmICghcXVlcnkgfHwgcXVlcnkubGVuZ3RoID09PSAwIHx8ICF0aGlzLmxvY2FsaXplLnBhcnNlci5jdXJyZW50TGFuZykge1xyXG4gICAgICByZXR1cm4gcXVlcnk7XHJcbiAgICB9XHJcbiAgICBpZiAoZXF1YWxzKHF1ZXJ5LCB0aGlzLmxhc3RLZXkpICYmIGVxdWFscyh0aGlzLmxhc3RMYW5ndWFnZSwgdGhpcy5sb2NhbGl6ZS5wYXJzZXIuY3VycmVudExhbmcpKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlO1xyXG4gICAgfVxyXG4gICAgdGhpcy5sYXN0S2V5ID0gcXVlcnk7XHJcbiAgICB0aGlzLmxhc3RMYW5ndWFnZSA9IHRoaXMubG9jYWxpemUucGFyc2VyLmN1cnJlbnRMYW5nO1xyXG5cclxuICAgIC8qKiB0cmFuc2xhdGUga2V5IGFuZCB1cGRhdGUgdmFsdWVzICovXHJcbiAgICB0aGlzLnZhbHVlID0gdGhpcy5sb2NhbGl6ZS50cmFuc2xhdGVSb3V0ZShxdWVyeSk7XHJcbiAgICB0aGlzLmxhc3RLZXkgPSBxdWVyeTtcclxuICAgIC8vIGlmIHZpZXcgaXMgYWxyZWFkeSBkZXN0cm95ZWQsIGlnbm9yZSBmaXJpbmcgY2hhbmdlIGRldGVjdGlvblxyXG4gICAgY29uc3QgdmlldyA9ICh0aGlzLl9yZWYgYXMgYW55KS5fdmlldztcclxuICAgIGlmICh2aWV3ICYmICh2aWV3LnN0YXRlICYgVklFV19ERVNUUk9ZRURfU1RBVEUpKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlO1xyXG4gICAgfVxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIHRoaXMuX3JlZi5kZXRlY3RDaGFuZ2VzKCk7XHJcbiAgICB9LCAwKVxyXG5cclxuICAgIHJldHVybiB0aGlzLnZhbHVlO1xyXG4gIH1cclxufVxyXG4iXX0=