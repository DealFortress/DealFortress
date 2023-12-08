"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var schematics_1 = require("@angular-devkit/schematics");
var tasks_1 = require("@angular-devkit/schematics/tasks");
var schematics_core_1 = require("../../schematics-core");
var project_1 = require("../../schematics-core/utility/project");
var standalone_1 = require("../../schematics-core/utility/standalone");
var standalone_2 = require("@schematics/angular/private/standalone");
function addNgRxDataToPackageJson() {
    return function (host, context) {
        (0, schematics_core_1.addPackageToPackageJson)(host, 'dependencies', '@ngrx/data', schematics_core_1.platformVersion);
        context.addTask(new tasks_1.NodePackageInstallTask());
        return host;
    };
}
function addEntityDataToNgModule(options) {
    return function (host) {
        throwIfModuleNotSpecified(host, options.module);
        var modulePath = options.module;
        var text = host.read(modulePath).toString();
        var source = ts.createSourceFile(modulePath, text, ts.ScriptTarget.Latest, true);
        var moduleToImport = options.effects
            ? 'EntityDataModule'
            : 'EntityDataModuleWithoutEffects';
        var effectsModuleImport = (0, schematics_core_1.insertImport)(source, modulePath, moduleToImport, '@ngrx/data');
        var _a = __read((0, schematics_core_1.addImportToModule)(source, modulePath, options.entityConfig
            ? [moduleToImport, 'forRoot(entityConfig)'].join('.')
            : moduleToImport, ''), 1), dateEntityNgModuleImport = _a[0];
        var changes = [effectsModuleImport, dateEntityNgModuleImport];
        if (options.entityConfig) {
            var entityConfigImport = (0, schematics_core_1.insertImport)(source, modulePath, 'entityConfig', './entity-metadata');
            changes.push(entityConfigImport);
        }
        (0, schematics_core_1.commitChanges)(host, source.fileName, changes);
        return host;
    };
}
function addStandaloneConfig(options) {
    return function (host) {
        var mainFile = (0, project_1.getProjectMainFile)(host, options);
        if (host.exists(mainFile)) {
            var providerFn = 'provideEntityData';
            if ((0, standalone_2.callsProvidersFunction)(host, mainFile, providerFn)) {
                // exit because the store config is already provided
                return host;
            }
            var providerOptions = __spreadArray(__spreadArray([], __read((options.entityConfig
                ? [ts.factory.createIdentifier("entityConfig")]
                : [ts.factory.createIdentifier("{}")])), false), __read((options.effects
                ? [ts.factory.createIdentifier("withEffects()")]
                : [])), false);
            var patchedConfigFile = (0, standalone_2.addFunctionalProvidersToStandaloneBootstrap)(host, mainFile, providerFn, '@ngrx/data', providerOptions);
            var configFileContent = host.read(patchedConfigFile);
            var source = ts.createSourceFile(patchedConfigFile, (configFileContent === null || configFileContent === void 0 ? void 0 : configFileContent.toString('utf-8')) || '', ts.ScriptTarget.Latest, true);
            var recorder_1 = host.beginUpdate(patchedConfigFile);
            var changes = [];
            if (options.effects) {
                var withEffectsImport = (0, schematics_core_1.insertImport)(source, patchedConfigFile, 'withEffects', '@ngrx/data');
                changes.push(withEffectsImport);
            }
            if (options.entityConfig) {
                var entityConfigImport = (0, schematics_core_1.insertImport)(source, patchedConfigFile, 'entityConfig', './entity-metadata');
                changes.push(entityConfigImport);
            }
            changes.forEach(function (change) {
                recorder_1.insertLeft(change.pos, change.toAdd);
            });
            host.commitUpdate(recorder_1);
            return host;
        }
        throw new schematics_1.SchematicsException("Main file not found for a project ".concat(options.project));
    };
}
var renames = {
    NgrxDataModule: 'EntityDataModule',
    NgrxDataModuleWithoutEffects: 'EntityDataModuleWithoutEffects',
    NgrxDataModuleConfig: 'EntityDataModuleConfig',
};
function removeAngularNgRxDataFromPackageJson() {
    return function (host) {
        if (host.exists('package.json')) {
            var sourceText = host.read('package.json').toString('utf-8');
            var json = JSON.parse(sourceText);
            if (json['dependencies'] && json['dependencies']['ngrx-data']) {
                delete json['dependencies']['ngrx-data'];
            }
            host.overwrite('package.json', JSON.stringify(json, null, 2));
        }
        return host;
    };
}
function renameNgrxDataModule() {
    return function (host) {
        (0, schematics_core_1.visitTSSourceFiles)(host, function (sourceFile) {
            var ngrxDataImports = sourceFile.statements
                .filter(ts.isImportDeclaration)
                .filter(function (_a) {
                var moduleSpecifier = _a.moduleSpecifier;
                return moduleSpecifier.getText(sourceFile) === "'ngrx-data'";
            });
            if (ngrxDataImports.length === 0) {
                return;
            }
            var changes = __spreadArray(__spreadArray(__spreadArray([], __read(findNgrxDataImports(sourceFile, ngrxDataImports)), false), __read(findNgrxDataImportDeclarations(sourceFile, ngrxDataImports)), false), __read(findNgrxDataReplacements(sourceFile)), false);
            (0, schematics_core_1.commitChanges)(host, sourceFile.fileName, changes);
        });
    };
}
function findNgrxDataImports(sourceFile, imports) {
    var changes = imports.map(function (specifier) {
        return (0, schematics_core_1.createReplaceChange)(sourceFile, specifier.moduleSpecifier, "'ngrx-data'", "'@ngrx/data'");
    });
    return changes;
}
function findNgrxDataImportDeclarations(sourceFile, imports) {
    var changes = imports
        .map(function (p) { return p.importClause.namedBindings.elements; })
        .reduce(function (imports, curr) { return imports.concat(curr); }, [])
        .map(function (specifier) {
        if (!ts.isImportSpecifier(specifier)) {
            return { hit: false };
        }
        var ngrxDataImports = Object.keys(renames);
        if (ngrxDataImports.includes(specifier.name.text)) {
            return { hit: true, specifier: specifier, text: specifier.name.text };
        }
        // if import is renamed
        if (specifier.propertyName &&
            ngrxDataImports.includes(specifier.propertyName.text)) {
            return { hit: true, specifier: specifier, text: specifier.propertyName.text };
        }
        return { hit: false };
    })
        .filter(function (_a) {
        var hit = _a.hit;
        return hit;
    })
        .map(function (_a) {
        var specifier = _a.specifier, text = _a.text;
        return (0, schematics_core_1.createReplaceChange)(sourceFile, specifier, text, renames[text]);
    });
    return changes;
}
function findNgrxDataReplacements(sourceFile) {
    var renameKeys = Object.keys(renames);
    var changes = [];
    ts.forEachChild(sourceFile, function (node) { return find(node, changes); });
    return changes;
    function find(node, changes) {
        var change = undefined;
        if (ts.isPropertyAssignment(node) &&
            renameKeys.includes(node.initializer.getText(sourceFile))) {
            change = {
                node: node.initializer,
                text: node.initializer.getText(sourceFile),
            };
        }
        if (ts.isPropertyAccessExpression(node) &&
            renameKeys.includes(node.expression.getText(sourceFile))) {
            change = {
                node: node.expression,
                text: node.expression.getText(sourceFile),
            };
        }
        if (ts.isVariableDeclaration(node) &&
            node.type &&
            renameKeys.includes(node.type.getText(sourceFile))) {
            change = {
                node: node.type,
                text: node.type.getText(sourceFile),
            };
        }
        if (change) {
            changes.push((0, schematics_core_1.createReplaceChange)(sourceFile, change.node, change.text, renames[change.text]));
        }
        ts.forEachChild(node, function (childNode) { return find(childNode, changes); });
    }
}
function throwIfModuleNotSpecified(host, module) {
    if (!module) {
        throw new Error('Module not specified');
    }
    if (!host.exists(module)) {
        throw new Error('Specified module does not exist');
    }
    var text = host.read(module);
    if (text === null) {
        throw new schematics_1.SchematicsException("File ".concat(module, " does not exist."));
    }
}
function createEntityConfigFile(options, path) {
    return (0, schematics_1.mergeWith)((0, schematics_1.apply)((0, schematics_1.url)('./files'), [
        (0, schematics_1.applyTemplates)(__assign(__assign({}, schematics_core_1.stringUtils), options)),
        (0, schematics_1.move)(path),
    ]));
}
function default_1(options) {
    return function (host, context) {
        options.name = '';
        options.path = (0, schematics_core_1.getProjectPath)(host, options);
        var mainFile = (0, project_1.getProjectMainFile)(host, options);
        var isStandalone = (0, standalone_1.isStandaloneApp)(host, mainFile);
        options.effects = options.effects === undefined ? true : options.effects;
        options.module =
            options.module && !isStandalone
                ? (0, schematics_core_1.findModuleFromOptions)(host, options)
                : options.module;
        var parsedPath = (0, schematics_core_1.parseName)(options.path, '');
        options.path = parsedPath.path;
        var configOrModuleUpdate = isStandalone
            ? addStandaloneConfig(options)
            : addEntityDataToNgModule(options);
        return (0, schematics_1.chain)([
            options && options.skipPackageJson ? (0, schematics_1.noop)() : addNgRxDataToPackageJson(),
            options.migrateNgrxData
                ? (0, schematics_1.chain)([
                    removeAngularNgRxDataFromPackageJson(),
                    renameNgrxDataModule(),
                ])
                : (0, schematics_1.branchAndMerge)((0, schematics_1.chain)([configOrModuleUpdate])),
            options.entityConfig
                ? createEntityConfigFile(options, parsedPath.path)
                : (0, schematics_1.noop)(),
        ])(host, context);
    };
}
exports.default = default_1;
//# sourceMappingURL=index.js.map