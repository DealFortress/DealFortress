import { InjectionToken } from '@angular/core';
import { MetaReducer } from '@ngrx/store';
import { EntityCache } from './entity-cache';
export declare const ENTITY_CACHE_NAME = "entityCache";
export declare const ENTITY_CACHE_NAME_TOKEN: InjectionToken<string>;
export declare const ENTITY_CACHE_META_REDUCERS: InjectionToken<MetaReducer<any, any>[]>;
export declare const ENTITY_COLLECTION_META_REDUCERS: InjectionToken<MetaReducer<any, any>[]>;
export declare const INITIAL_ENTITY_CACHE_STATE: InjectionToken<EntityCache | (() => EntityCache)>;
