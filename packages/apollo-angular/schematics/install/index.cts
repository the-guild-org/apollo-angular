import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { addRootProvider } from '@schematics/angular/utility';
import { isStandaloneApp } from '@schematics/angular/utility/ng-ast-utils';
import { getMainFilePath } from '@schematics/angular/utility/standalone/util';
import { getJsonFile } from '../utils/index.cjs';
import { Schema } from './schema.cjs';

export function factory(options: Schema): Rule {
  return chain([
    assertStandaloneApp(options),
    addDependencies(options),
    addProvideHttpClient(options),
    addProvideApollo(options),
  ]);
}

export function createDependenciesMap(options: Schema): Record<string, string> {
  return {
    'apollo-angular': '^9.0.0',
    '@apollo/client': '^4.0.1',
    graphql: `^${options.graphql ?? '16.0.0'}`,
  };
}

function assertStandaloneApp(options: Schema): Rule {
  return async (host: Tree) => {
    const mainPath = await getMainFilePath(host, options.project);
    if (!isStandaloneApp(host, mainPath)) {
      throw new Error('Only standalone application are supported');
    }

    return host;
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

function addProvideApollo(options: Schema): Rule {
  return async () => {
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
  };
}

function addProvideHttpClient(options: Schema): Rule {
  return async () => {
    return addRootProvider(options.project, ({ code, external }) => {
      return code`${external('provideHttpClient', '@angular/common/http')}()`;
    });
  };
}
