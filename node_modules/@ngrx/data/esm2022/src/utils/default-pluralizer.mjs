import { Inject, Injectable, Optional } from '@angular/core';
import { PLURAL_NAMES_TOKEN } from './interfaces';
import * as i0 from "@angular/core";
const uncountable = [
    // 'sheep',
    // 'fish',
    // 'deer',
    // 'moose',
    // 'rice',
    // 'species',
    'equipment',
    'information',
    'money',
    'series',
];
export class DefaultPluralizer {
    constructor(pluralNames) {
        this.pluralNames = {};
        // merge each plural names object
        if (pluralNames) {
            pluralNames.forEach((pn) => this.registerPluralNames(pn));
        }
    }
    /**
     * Pluralize a singular name using common English language pluralization rules
     * Examples: "company" -> "companies", "employee" -> "employees", "tax" -> "taxes"
     */
    pluralize(name) {
        const plural = this.pluralNames[name];
        if (plural) {
            return plural;
        }
        // singular and plural are the same
        if (uncountable.indexOf(name.toLowerCase()) >= 0) {
            return name;
            // vowel + y
        }
        else if (/[aeiou]y$/.test(name)) {
            return name + 's';
            // consonant + y
        }
        else if (name.endsWith('y')) {
            return name.substring(0, name.length - 1) + 'ies';
            // endings typically pluralized with 'es'
        }
        else if (/[s|ss|sh|ch|x|z]$/.test(name)) {
            return name + 'es';
        }
        else {
            return name + 's';
        }
    }
    /**
     * Register a mapping of entity type name to the entity name's plural
     * @param pluralNames {EntityPluralNames} plural names for entity types
     */
    registerPluralNames(pluralNames) {
        this.pluralNames = { ...this.pluralNames, ...(pluralNames || {}) };
    }
    /** @nocollapse */ static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: DefaultPluralizer, deps: [{ token: PLURAL_NAMES_TOKEN, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    /** @nocollapse */ static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: DefaultPluralizer }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: DefaultPluralizer, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [PLURAL_NAMES_TOKEN]
                }] }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1wbHVyYWxpemVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9kYXRhL3NyYy91dGlscy9kZWZhdWx0LXBsdXJhbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzdELE9BQU8sRUFBcUIsa0JBQWtCLEVBQUUsTUFBTSxjQUFjLENBQUM7O0FBRXJFLE1BQU0sV0FBVyxHQUFHO0lBQ2xCLFdBQVc7SUFDWCxVQUFVO0lBQ1YsVUFBVTtJQUNWLFdBQVc7SUFDWCxVQUFVO0lBQ1YsYUFBYTtJQUNiLFdBQVc7SUFDWCxhQUFhO0lBQ2IsT0FBTztJQUNQLFFBQVE7Q0FDVCxDQUFDO0FBR0YsTUFBTSxPQUFPLGlCQUFpQjtJQUc1QixZQUdFLFdBQWdDO1FBTGxDLGdCQUFXLEdBQXNCLEVBQUUsQ0FBQztRQU9sQyxpQ0FBaUM7UUFDakMsSUFBSSxXQUFXLEVBQUU7WUFDZixXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUMzRDtJQUNILENBQUM7SUFFRDs7O09BR0c7SUFDSCxTQUFTLENBQUMsSUFBWTtRQUNwQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RDLElBQUksTUFBTSxFQUFFO1lBQ1YsT0FBTyxNQUFNLENBQUM7U0FDZjtRQUNELG1DQUFtQztRQUNuQyxJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2hELE9BQU8sSUFBSSxDQUFDO1lBQ1osWUFBWTtTQUNiO2FBQU0sSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2pDLE9BQU8sSUFBSSxHQUFHLEdBQUcsQ0FBQztZQUNsQixnQkFBZ0I7U0FDakI7YUFBTSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDN0IsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUNsRCx5Q0FBeUM7U0FDMUM7YUFBTSxJQUFJLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN6QyxPQUFPLElBQUksR0FBRyxJQUFJLENBQUM7U0FDcEI7YUFBTTtZQUNMLE9BQU8sSUFBSSxHQUFHLEdBQUcsQ0FBQztTQUNuQjtJQUNILENBQUM7SUFFRDs7O09BR0c7SUFDSCxtQkFBbUIsQ0FBQyxXQUE4QjtRQUNoRCxJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxXQUFXLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQztJQUNyRSxDQUFDO2lJQTlDVSxpQkFBaUIsa0JBS2xCLGtCQUFrQjtxSUFMakIsaUJBQWlCOzsyRkFBakIsaUJBQWlCO2tCQUQ3QixVQUFVOzswQkFLTixRQUFROzswQkFDUixNQUFNOzJCQUFDLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEVudGl0eVBsdXJhbE5hbWVzLCBQTFVSQUxfTkFNRVNfVE9LRU4gfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuXG5jb25zdCB1bmNvdW50YWJsZSA9IFtcbiAgLy8gJ3NoZWVwJyxcbiAgLy8gJ2Zpc2gnLFxuICAvLyAnZGVlcicsXG4gIC8vICdtb29zZScsXG4gIC8vICdyaWNlJyxcbiAgLy8gJ3NwZWNpZXMnLFxuICAnZXF1aXBtZW50JyxcbiAgJ2luZm9ybWF0aW9uJyxcbiAgJ21vbmV5JyxcbiAgJ3NlcmllcycsXG5dO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRGVmYXVsdFBsdXJhbGl6ZXIge1xuICBwbHVyYWxOYW1lczogRW50aXR5UGx1cmFsTmFtZXMgPSB7fTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoUExVUkFMX05BTUVTX1RPS0VOKVxuICAgIHBsdXJhbE5hbWVzOiBFbnRpdHlQbHVyYWxOYW1lc1tdXG4gICkge1xuICAgIC8vIG1lcmdlIGVhY2ggcGx1cmFsIG5hbWVzIG9iamVjdFxuICAgIGlmIChwbHVyYWxOYW1lcykge1xuICAgICAgcGx1cmFsTmFtZXMuZm9yRWFjaCgocG4pID0+IHRoaXMucmVnaXN0ZXJQbHVyYWxOYW1lcyhwbikpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQbHVyYWxpemUgYSBzaW5ndWxhciBuYW1lIHVzaW5nIGNvbW1vbiBFbmdsaXNoIGxhbmd1YWdlIHBsdXJhbGl6YXRpb24gcnVsZXNcbiAgICogRXhhbXBsZXM6IFwiY29tcGFueVwiIC0+IFwiY29tcGFuaWVzXCIsIFwiZW1wbG95ZWVcIiAtPiBcImVtcGxveWVlc1wiLCBcInRheFwiIC0+IFwidGF4ZXNcIlxuICAgKi9cbiAgcGx1cmFsaXplKG5hbWU6IHN0cmluZykge1xuICAgIGNvbnN0IHBsdXJhbCA9IHRoaXMucGx1cmFsTmFtZXNbbmFtZV07XG4gICAgaWYgKHBsdXJhbCkge1xuICAgICAgcmV0dXJuIHBsdXJhbDtcbiAgICB9XG4gICAgLy8gc2luZ3VsYXIgYW5kIHBsdXJhbCBhcmUgdGhlIHNhbWVcbiAgICBpZiAodW5jb3VudGFibGUuaW5kZXhPZihuYW1lLnRvTG93ZXJDYXNlKCkpID49IDApIHtcbiAgICAgIHJldHVybiBuYW1lO1xuICAgICAgLy8gdm93ZWwgKyB5XG4gICAgfSBlbHNlIGlmICgvW2FlaW91XXkkLy50ZXN0KG5hbWUpKSB7XG4gICAgICByZXR1cm4gbmFtZSArICdzJztcbiAgICAgIC8vIGNvbnNvbmFudCArIHlcbiAgICB9IGVsc2UgaWYgKG5hbWUuZW5kc1dpdGgoJ3knKSkge1xuICAgICAgcmV0dXJuIG5hbWUuc3Vic3RyaW5nKDAsIG5hbWUubGVuZ3RoIC0gMSkgKyAnaWVzJztcbiAgICAgIC8vIGVuZGluZ3MgdHlwaWNhbGx5IHBsdXJhbGl6ZWQgd2l0aCAnZXMnXG4gICAgfSBlbHNlIGlmICgvW3N8c3N8c2h8Y2h8eHx6XSQvLnRlc3QobmFtZSkpIHtcbiAgICAgIHJldHVybiBuYW1lICsgJ2VzJztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG5hbWUgKyAncyc7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgbWFwcGluZyBvZiBlbnRpdHkgdHlwZSBuYW1lIHRvIHRoZSBlbnRpdHkgbmFtZSdzIHBsdXJhbFxuICAgKiBAcGFyYW0gcGx1cmFsTmFtZXMge0VudGl0eVBsdXJhbE5hbWVzfSBwbHVyYWwgbmFtZXMgZm9yIGVudGl0eSB0eXBlc1xuICAgKi9cbiAgcmVnaXN0ZXJQbHVyYWxOYW1lcyhwbHVyYWxOYW1lczogRW50aXR5UGx1cmFsTmFtZXMpOiB2b2lkIHtcbiAgICB0aGlzLnBsdXJhbE5hbWVzID0geyAuLi50aGlzLnBsdXJhbE5hbWVzLCAuLi4ocGx1cmFsTmFtZXMgfHwge30pIH07XG4gIH1cbn1cbiJdfQ==