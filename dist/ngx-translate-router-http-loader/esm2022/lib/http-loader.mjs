import { LocalizeParser } from '@gilsdav/ngx-translate-router';
export class LocalizeRouterHttpLoader extends LocalizeParser {
    /**
     * CTOR
     * @param translate
     * @param location
     * @param settings
     * @param http
     * @param path
     */
    constructor(translate, location, settings, http, path = 'assets/locales.json') {
        super(translate, location, settings);
        this.http = http;
        this.path = path;
    }
    /**
     * Initialize or append routes
     * @param routes
     */
    load(routes) {
        return new Promise((resolve) => {
            this.http.get(`${this.path}`)
                .subscribe((data) => {
                this.locales = data.locales;
                this.prefix = data.prefix || '';
                this.escapePrefix = data.escapePrefix || '';
                this.init(routes).then(resolve);
            });
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC1sb2FkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtdHJhbnNsYXRlLXJvdXRlci1odHRwLWxvYWRlci9zcmMvbGliL2h0dHAtbG9hZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxjQUFjLEVBQTBCLE1BQU0sK0JBQStCLENBQUM7QUFldkYsTUFBTSxPQUFPLHdCQUF5QixTQUFRLGNBQWM7SUFDMUQ7Ozs7Ozs7T0FPRztJQUNILFlBQ0UsU0FBMkIsRUFDM0IsUUFBa0IsRUFDbEIsUUFBZ0MsRUFDeEIsSUFBZ0IsRUFDaEIsT0FBZSxxQkFBcUI7UUFFNUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFIN0IsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUNoQixTQUFJLEdBQUosSUFBSSxDQUFnQztJQUc5QyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsSUFBSSxDQUFDLE1BQWM7UUFDakIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQVksRUFBRSxFQUFFO1lBQ2xDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2lCQUMxQixTQUFTLENBQUMsQ0FBQyxJQUFpQyxFQUFFLEVBQUU7Z0JBQy9DLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztnQkFDNUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQztnQkFDaEMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxJQUFJLEVBQUUsQ0FBQztnQkFDNUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExvY2FsaXplUGFyc2VyLCBMb2NhbGl6ZVJvdXRlclNldHRpbmdzIH0gZnJvbSAnQGdpbHNkYXYvbmd4LXRyYW5zbGF0ZS1yb3V0ZXInO1xyXG5pbXBvcnQgeyBUcmFuc2xhdGVTZXJ2aWNlIH0gZnJvbSAnQG5neC10cmFuc2xhdGUvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IFJvdXRlcyB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcbmltcG9ydCB7IExvY2F0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuXHJcbi8qKlxyXG4gKiBDb25maWcgaW50ZXJmYWNlXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIElMb2NhbGl6ZVJvdXRlclBhcnNlckNvbmZpZyB7XHJcbiAgbG9jYWxlczogQXJyYXk8c3RyaW5nPjtcclxuICBwcmVmaXg/OiBzdHJpbmc7XHJcbiAgZXNjYXBlUHJlZml4Pzogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTG9jYWxpemVSb3V0ZXJIdHRwTG9hZGVyIGV4dGVuZHMgTG9jYWxpemVQYXJzZXIge1xyXG4gIC8qKlxyXG4gICAqIENUT1JcclxuICAgKiBAcGFyYW0gdHJhbnNsYXRlXHJcbiAgICogQHBhcmFtIGxvY2F0aW9uXHJcbiAgICogQHBhcmFtIHNldHRpbmdzXHJcbiAgICogQHBhcmFtIGh0dHBcclxuICAgKiBAcGFyYW0gcGF0aFxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgdHJhbnNsYXRlOiBUcmFuc2xhdGVTZXJ2aWNlLFxyXG4gICAgbG9jYXRpb246IExvY2F0aW9uLFxyXG4gICAgc2V0dGluZ3M6IExvY2FsaXplUm91dGVyU2V0dGluZ3MsXHJcbiAgICBwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQsXHJcbiAgICBwcml2YXRlIHBhdGg6IHN0cmluZyA9ICdhc3NldHMvbG9jYWxlcy5qc29uJ1xyXG4gICAgKSB7XHJcbiAgICBzdXBlcih0cmFuc2xhdGUsIGxvY2F0aW9uLCBzZXR0aW5ncyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBJbml0aWFsaXplIG9yIGFwcGVuZCByb3V0ZXNcclxuICAgKiBAcGFyYW0gcm91dGVzXHJcbiAgICovXHJcbiAgbG9hZChyb3V0ZXM6IFJvdXRlcyk6IFByb21pc2U8YW55PiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmU6IGFueSkgPT4ge1xyXG4gICAgICB0aGlzLmh0dHAuZ2V0KGAke3RoaXMucGF0aH1gKVxyXG4gICAgICAgIC5zdWJzY3JpYmUoKGRhdGE6IElMb2NhbGl6ZVJvdXRlclBhcnNlckNvbmZpZykgPT4ge1xyXG4gICAgICAgICAgdGhpcy5sb2NhbGVzID0gZGF0YS5sb2NhbGVzO1xyXG4gICAgICAgICAgdGhpcy5wcmVmaXggPSBkYXRhLnByZWZpeCB8fCAnJztcclxuICAgICAgICAgIHRoaXMuZXNjYXBlUHJlZml4ID0gZGF0YS5lc2NhcGVQcmVmaXggfHwgJyc7XHJcbiAgICAgICAgICB0aGlzLmluaXQocm91dGVzKS50aGVuKHJlc29sdmUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==