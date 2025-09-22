import { dirname } from 'path';
import {
  apply,
  chain,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  template,
  Tree,
  url,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { addRootProvider } from '@schematics/angular/utility';
import { getAppModulePath, isStandaloneApp } from '@schematics/angular/utility/ng-ast-utils';
import { getMainFilePath } from '@schematics/angular/utility/standalone/util';
import { addModuleImportToRootModule } from '../utils/ast.cjs';
import { getJsonFile } from '../utils/index.cjs';
import { Schema } from './schema.cjs';

export function factory(options: Schema): Rule {
  return chain([
    addDependencies(options),
    addSetupFiles(options),
    importHttpClient(options),
    importSetup(options),
  ]);
}

export function createDependenciesMap(options: Schema): Record<string, string> {
  return {
    'apollo-angular': '^9.0.0',
    '@apollo/client': '^4.0.1',
    graphql: `^${options.graphql ?? '16.0.0'}`,
  };
}

/**
 * Add all necessary node packages
 * as dependencies in the package.json
 * and installs them by running `npm install`.
 */
function addDependencies(options: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    const packageJsonPath = 'package.json';
    const packageJson = getJsonFile(host, packageJsonPath);

    packageJson.dependencies = packageJson.dependencies || {};

    const dependenciesMap = createDependenciesMap(options);
    for (const dependency in dependenciesMap) {
      if (dependenciesMap.hasOwnProperty(dependency)) {
        const version = dependenciesMap[dependency];
        if (!packageJson.dependencies[dependency]) {
          packageJson.dependencies[dependency] = version;
        }
      }
    }

    // save the changed file
    host.overwrite(packageJsonPath, JSON.stringify(packageJson, null, 2));

    // schedule `npm install`
    context.addTask(new NodePackageInstallTask());

    return host;
  };
}

function addSetupFiles(options: Schema): Rule {
  return async (host: Tree) => {
    const mainPath = await getMainFilePath(host, options.project);
    const appModuleDirectory = dirname(mainPath) + '/app';
    if (isStandaloneApp(host, mainPath)) {
      const templateSource = apply(url('./files/standalone'), [
        template({
          endpoint: options.endpoint,
        }),
        move(appModuleDirectory),
      ]);

      return mergeWith(templateSource);
    } else {
      const appModulePath = getAppModulePath(host, mainPath);
      const appModuleDirectory = dirname(appModulePath);
      const templateSource = apply(url('./files/module'), [
        template({
          endpoint: options.endpoint,
        }),
        move(appModuleDirectory),
      ]);

      return mergeWith(templateSource);
    }
  };
}

function importSetup(options: Schema): Rule {
  return async (host: Tree) => {
    const mainPath = await getMainFilePath(host, options.project);
    if (isStandaloneApp(host, mainPath)) {
      return addRootProvider(options.project, ({ code, external }) => {
        return code`${external('provideApollo', 'apollo-angular')}(() => {
      const httpLink = ${external('inject', '@angular/core')}(${external('HttpLink', 'apollo-angular/http')});

      return {
        link: httpLink.create({
          uri: '<%= endpoint %>',
        }),
        cache: new ${external('InMemoryCache', '@apollo/client')}(),
      };
    })`;
      });
    } else {
      await addModuleImportToRootModule(host, 'GraphQLModule', './graphql.module', options.project);
    }
  };
}

function importHttpClient(options: Schema): Rule {
  return async (host: Tree) => {
    const mainPath = await getMainFilePath(host, options.project);
    if (isStandaloneApp(host, mainPath)) {
      return addRootProvider(options.project, ({ code, external }) => {
        return code`${external('provideHttpClient', '@angular/common/http')}()`;
      });
    } else {
      await addModuleImportToRootModule(
        host,
        'HttpClientModule',
        '@angular/common/http',
        options.project,
      );
    }
  };
}
