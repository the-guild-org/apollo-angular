import { dirname } from 'path';
import { CompilerOptions } from 'typescript';
import { tags } from '@angular-devkit/core';
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
    includeAsyncIterableLib(),
    allowSyntheticDefaultImports(),
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

function includeAsyncIterableLib(): Rule {
  const requiredLib = 'esnext.asynciterable';

  function updateFn(tsconfig: any): boolean {
    const compilerOptions: CompilerOptions = tsconfig.compilerOptions;

    if (
      compilerOptions &&
      compilerOptions.lib &&
      !compilerOptions.lib.find(lib => lib.toLowerCase() === requiredLib)
    ) {
      compilerOptions.lib.push(requiredLib);
      return true;
    }

    return false;
  }

  return (host: Tree) => {
    if (
      !updateTSConfig('tsconfig.json', host, updateFn) &&
      !updateTSConfig('tsconfig.base.json', host, updateFn)
    ) {
      console.error(
        '\n' +
          tags.stripIndent`
              We couldn't find '${requiredLib}' in the list of library files to be included in the compilation.
              It's required by '@apollo/client' package so please add it to your tsconfig.
            ` +
          '\n',
      );
    }

    return host;
  };
}

function updateTSConfig(
  tsconfigPath: string,
  host: Tree,
  updateFn: (tsconfig: any) => boolean,
): boolean {
  try {
    const tsconfig = getJsonFile(host, tsconfigPath);

    if (updateFn(tsconfig)) {
      host.overwrite(tsconfigPath, JSON.stringify(tsconfig, null, 2));

      return true;
    }
  } catch (error) {
    //
  }

  return false;
}

function allowSyntheticDefaultImports(): Rule {
  function updateFn(tsconfig: any): boolean {
    if (
      tsconfig?.compilerOptions &&
      tsconfig?.compilerOptions?.lib &&
      !tsconfig.compilerOptions.allowSyntheticDefaultImports
    ) {
      tsconfig.compilerOptions.allowSyntheticDefaultImports = true;
      return true;
    }

    return false;
  }

  return (host: Tree) => {
    if (
      !updateTSConfig('tsconfig.json', host, updateFn) &&
      !updateTSConfig('tsconfig.base.json', host, updateFn)
    ) {
      console.error(
        '\n' +
          tags.stripIndent`
              We couldn't enable 'allowSyntheticDefaultImports' flag.
              It's required by '@apollo/client' package so please add it to your tsconfig.
            ` +
          '\n',
      );
    }

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
