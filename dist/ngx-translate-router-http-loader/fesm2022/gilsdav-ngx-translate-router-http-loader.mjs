import { LocalizeParser } from '@gilsdav/ngx-translate-router';

class LocalizeRouterHttpLoader extends LocalizeParser {
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

/*
 * Public API Surface of ngx-translate-router-http-loader
 */

/**
 * Generated bundle index. Do not edit.
 */

export { LocalizeRouterHttpLoader };
//# sourceMappingURL=gilsdav-ngx-translate-router-http-loader.mjs.map
