export class GilsdavReuseStrategy {
    // private handlers: {[key: string]: DetachedRouteHandle} = {};
    constructor() {
    }
    shouldDetach(route) {
        // console.log('shouldDetach', route);
        return false;
    }
    store(route, handle) {
        // console.log('store', route, handle);
        // console.log('store url', this.getKey(route));
        // this.handlers[this.getKey(route)] = handle;
    }
    shouldAttach(route) {
        // console.log('shouldAttach', route, this.getKey(route));
        // return !!this.handlers[this.getKey(route)];
        return false;
    }
    retrieve(route) {
        // console.log('retrieve', route);
        // console.log('retrieve url', this.getKey(route));
        // const result = this.handlers[this.getKey(route)];
        // delete this.handlers[this.getKey(route)];
        // return result;
        return null;
    }
    shouldReuseRoute(future, curr) {
        // console.log('shouldReuseRoute', future, curr, this.getKey(future) === this.getKey(curr));
        // console.log('shouldReuseRoute', future && curr ? this.getKey(future) === this.getKey(curr) : false);
        return future && curr ? this.getKey(future) === this.getKey(curr) : false;
    }
    getKey(route) {
        // console.log(route.parent.component.toString());
        if (route.firstChild && route.firstChild.routeConfig && route.firstChild.routeConfig.path &&
            route.firstChild.routeConfig.path.indexOf('**') !== -1) { // WildCard
            return 'WILDCARD';
        }
        else if (!route.data.localizeRouter && (!route.parent || !route.parent.parent) && !route.data.skipRouteLocalization) { // Lang route
            return 'LANG';
        }
        else if (route.routeConfig.matcher) {
            let keyM = `${this.getKey(route.parent)}/${route.routeConfig.matcher.name}`;
            if (route.data.discriminantPathKey) {
                keyM = `${keyM}-${route.data.discriminantPathKey}`;
            }
            return keyM;
        }
        else if (route.data.localizeRouter) {
            let key = `${this.getKey(route.parent)}/${route.data.localizeRouter.path}`;
            if (route.data.discriminantPathKey) {
                key = `${key}-${route.data.discriminantPathKey}`;
            }
            return key;
        }
        else {
            let key = route.routeConfig.path;
            if (route.parent) {
                key = `${this.getKey(route.parent)}/${route.routeConfig.path}`;
            }
            if (route.data.discriminantPathKey) {
                key = `${key}-${route.data.discriminantPathKey}`;
            }
            return key;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2lsc2Rhdi1yZXVzZS1zdHJhdGVneS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC10cmFuc2xhdGUtcm91dGVyL3NyYy9saWIvZ2lsc2Rhdi1yZXVzZS1zdHJhdGVneS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxNQUFNLE9BQU8sb0JBQW9CO0lBQy9CLCtEQUErRDtJQUMvRDtJQUNBLENBQUM7SUFDRCxZQUFZLENBQUMsS0FBNkI7UUFDeEMsc0NBQXNDO1FBQ3RDLE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUNELEtBQUssQ0FBQyxLQUE2QixFQUFFLE1BQTJCO1FBQzlELHVDQUF1QztRQUN2QyxnREFBZ0Q7UUFDaEQsOENBQThDO0lBQ2hELENBQUM7SUFDRCxZQUFZLENBQUMsS0FBNkI7UUFDeEMsMERBQTBEO1FBQzFELDhDQUE4QztRQUM5QyxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFDRCxRQUFRLENBQUMsS0FBNkI7UUFDcEMsa0NBQWtDO1FBQ2xDLG1EQUFtRDtRQUNuRCxvREFBb0Q7UUFDcEQsNENBQTRDO1FBQzVDLGlCQUFpQjtRQUNqQixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFDRCxnQkFBZ0IsQ0FBQyxNQUE4QixFQUFFLElBQTRCO1FBQzNFLDRGQUE0RjtRQUM1Rix1R0FBdUc7UUFDdkcsT0FBTyxNQUFNLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUM1RSxDQUFDO0lBQ08sTUFBTSxDQUFDLEtBQTZCO1FBQzFDLGtEQUFrRDtRQUNsRCxJQUFJLEtBQUssQ0FBQyxVQUFVLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxXQUFXLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSTtZQUNyRixLQUFLLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUUsV0FBVztZQUN2RSxPQUFPLFVBQVUsQ0FBQztTQUNuQjthQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGNBQWMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLHFCQUFxQixFQUFFLEVBQUUsYUFBYTtZQUNwSSxPQUFPLE1BQU0sQ0FBQztTQUNmO2FBQU0sSUFBSSxLQUFLLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRTtZQUNwQyxJQUFJLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQzVFLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRTtnQkFDbEMsSUFBSSxHQUFHLEdBQUcsSUFBSSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQzthQUNwRDtZQUNELE9BQU8sSUFBSSxDQUFDO1NBQ2I7YUFBTSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3BDLElBQUksR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDM0UsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFO2dCQUNsQyxHQUFHLEdBQUcsR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO2FBQ2xEO1lBQ0QsT0FBTyxHQUFHLENBQUM7U0FDWjthQUFNO1lBQ0wsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7WUFDakMsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFO2dCQUNoQixHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ2hFO1lBQ0QsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFO2dCQUNsQyxHQUFHLEdBQUcsR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO2FBQ2xEO1lBQ0QsT0FBTyxHQUFHLENBQUM7U0FDWjtJQUNILENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJvdXRlUmV1c2VTdHJhdGVneSwgRGV0YWNoZWRSb3V0ZUhhbmRsZSwgQWN0aXZhdGVkUm91dGVTbmFwc2hvdCB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcblxyXG5leHBvcnQgY2xhc3MgR2lsc2RhdlJldXNlU3RyYXRlZ3kgaW1wbGVtZW50cyBSb3V0ZVJldXNlU3RyYXRlZ3kge1xyXG4gIC8vIHByaXZhdGUgaGFuZGxlcnM6IHtba2V5OiBzdHJpbmddOiBEZXRhY2hlZFJvdXRlSGFuZGxlfSA9IHt9O1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gIH1cclxuICBzaG91bGREZXRhY2gocm91dGU6IEFjdGl2YXRlZFJvdXRlU25hcHNob3QpOiBib29sZWFuIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdzaG91bGREZXRhY2gnLCByb3V0ZSk7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG4gIHN0b3JlKHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LCBoYW5kbGU6IERldGFjaGVkUm91dGVIYW5kbGUpOiB2b2lkIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdzdG9yZScsIHJvdXRlLCBoYW5kbGUpO1xyXG4gICAgLy8gY29uc29sZS5sb2coJ3N0b3JlIHVybCcsIHRoaXMuZ2V0S2V5KHJvdXRlKSk7XHJcbiAgICAvLyB0aGlzLmhhbmRsZXJzW3RoaXMuZ2V0S2V5KHJvdXRlKV0gPSBoYW5kbGU7XHJcbiAgfVxyXG4gIHNob3VsZEF0dGFjaChyb3V0ZTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCk6IGJvb2xlYW4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ3Nob3VsZEF0dGFjaCcsIHJvdXRlLCB0aGlzLmdldEtleShyb3V0ZSkpO1xyXG4gICAgLy8gcmV0dXJuICEhdGhpcy5oYW5kbGVyc1t0aGlzLmdldEtleShyb3V0ZSldO1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuICByZXRyaWV2ZShyb3V0ZTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCk6IERldGFjaGVkUm91dGVIYW5kbGUge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ3JldHJpZXZlJywgcm91dGUpO1xyXG4gICAgLy8gY29uc29sZS5sb2coJ3JldHJpZXZlIHVybCcsIHRoaXMuZ2V0S2V5KHJvdXRlKSk7XHJcbiAgICAvLyBjb25zdCByZXN1bHQgPSB0aGlzLmhhbmRsZXJzW3RoaXMuZ2V0S2V5KHJvdXRlKV07XHJcbiAgICAvLyBkZWxldGUgdGhpcy5oYW5kbGVyc1t0aGlzLmdldEtleShyb3V0ZSldO1xyXG4gICAgLy8gcmV0dXJuIHJlc3VsdDtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuICBzaG91bGRSZXVzZVJvdXRlKGZ1dHVyZTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCwgY3VycjogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCk6IGJvb2xlYW4ge1xyXG4gICAgLy8gY29uc29sZS5sb2coJ3Nob3VsZFJldXNlUm91dGUnLCBmdXR1cmUsIGN1cnIsIHRoaXMuZ2V0S2V5KGZ1dHVyZSkgPT09IHRoaXMuZ2V0S2V5KGN1cnIpKTtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdzaG91bGRSZXVzZVJvdXRlJywgZnV0dXJlICYmIGN1cnIgPyB0aGlzLmdldEtleShmdXR1cmUpID09PSB0aGlzLmdldEtleShjdXJyKSA6IGZhbHNlKTtcclxuICAgIHJldHVybiBmdXR1cmUgJiYgY3VyciA/IHRoaXMuZ2V0S2V5KGZ1dHVyZSkgPT09IHRoaXMuZ2V0S2V5KGN1cnIpIDogZmFsc2U7XHJcbiAgfVxyXG4gIHByaXZhdGUgZ2V0S2V5KHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90KSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhyb3V0ZS5wYXJlbnQuY29tcG9uZW50LnRvU3RyaW5nKCkpO1xyXG4gICAgaWYgKHJvdXRlLmZpcnN0Q2hpbGQgJiYgcm91dGUuZmlyc3RDaGlsZC5yb3V0ZUNvbmZpZyAmJiByb3V0ZS5maXJzdENoaWxkLnJvdXRlQ29uZmlnLnBhdGggJiZcclxuICAgICAgICByb3V0ZS5maXJzdENoaWxkLnJvdXRlQ29uZmlnLnBhdGguaW5kZXhPZignKionKSAhPT0gLTEpIHsgLy8gV2lsZENhcmRcclxuICAgICAgcmV0dXJuICdXSUxEQ0FSRCc7XHJcbiAgICB9IGVsc2UgaWYgKCFyb3V0ZS5kYXRhLmxvY2FsaXplUm91dGVyICYmICghcm91dGUucGFyZW50IHx8ICFyb3V0ZS5wYXJlbnQucGFyZW50KSAmJiAhcm91dGUuZGF0YS5za2lwUm91dGVMb2NhbGl6YXRpb24pIHsgLy8gTGFuZyByb3V0ZVxyXG4gICAgICByZXR1cm4gJ0xBTkcnO1xyXG4gICAgfSBlbHNlIGlmIChyb3V0ZS5yb3V0ZUNvbmZpZy5tYXRjaGVyKSB7XHJcbiAgICAgIGxldCBrZXlNID0gYCR7dGhpcy5nZXRLZXkocm91dGUucGFyZW50KX0vJHtyb3V0ZS5yb3V0ZUNvbmZpZy5tYXRjaGVyLm5hbWV9YDtcclxuICAgICAgaWYgKHJvdXRlLmRhdGEuZGlzY3JpbWluYW50UGF0aEtleSkge1xyXG4gICAgICAgIGtleU0gPSBgJHtrZXlNfS0ke3JvdXRlLmRhdGEuZGlzY3JpbWluYW50UGF0aEtleX1gO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBrZXlNO1xyXG4gICAgfSBlbHNlIGlmIChyb3V0ZS5kYXRhLmxvY2FsaXplUm91dGVyKSB7XHJcbiAgICAgIGxldCBrZXkgPSBgJHt0aGlzLmdldEtleShyb3V0ZS5wYXJlbnQpfS8ke3JvdXRlLmRhdGEubG9jYWxpemVSb3V0ZXIucGF0aH1gO1xyXG4gICAgICBpZiAocm91dGUuZGF0YS5kaXNjcmltaW5hbnRQYXRoS2V5KSB7XHJcbiAgICAgICAga2V5ID0gYCR7a2V5fS0ke3JvdXRlLmRhdGEuZGlzY3JpbWluYW50UGF0aEtleX1gO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBrZXk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBsZXQga2V5ID0gcm91dGUucm91dGVDb25maWcucGF0aDtcclxuICAgICAgaWYgKHJvdXRlLnBhcmVudCkge1xyXG4gICAgICAgIGtleSA9IGAke3RoaXMuZ2V0S2V5KHJvdXRlLnBhcmVudCl9LyR7cm91dGUucm91dGVDb25maWcucGF0aH1gO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChyb3V0ZS5kYXRhLmRpc2NyaW1pbmFudFBhdGhLZXkpIHtcclxuICAgICAgICBrZXkgPSBgJHtrZXl9LSR7cm91dGUuZGF0YS5kaXNjcmltaW5hbnRQYXRoS2V5fWA7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGtleTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19