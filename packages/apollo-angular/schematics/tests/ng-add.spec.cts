
import {CompilerOptions} from 'typescript';
import {UnitTestTree} from '@angular-devkit/schematics/testing';
import {createDependenciesMap} from '../install/index.cjs';
import {getFileContent, getJsonFile, runNgAdd} from '../utils/index.cjs';

describe('ng-add with module', () => {
    let tree: UnitTestTree;

    beforeEach(async () => {
        tree = await runNgAdd(false);
    });

    it('should update package.json dependencies', async () => {
        const packageJsonPath = '/package.json';
        expect(tree.files).toContain(packageJsonPath);

        const packageJson = getJsonFile(tree, packageJsonPath);
        const {dependencies} = packageJson;

        const dependenciesMap = createDependenciesMap({
            project: 'my-project',
            graphql: '16',
        });

        for (const dependency in dependenciesMap) {
            if (dependenciesMap.hasOwnProperty(dependency)) {
                const version = dependenciesMap[dependency];

                expect(dependencies[dependency]).toBe(version);
            }
        }
    });

    it('should add NgModule with GraphQL setup', async () => {
        const modulePath = '/projects/apollo/src/app/graphql.module.ts';
        expect(tree.files).toContain(modulePath);

        const content = getFileContent(tree, modulePath);
        expect(content).toMatch('export class GraphQLModule');
    });

    it('should import the NgModule with GraphQL setup to the root module', async () => {
        const content = getFileContent(tree, '/projects/apollo/src/app/app.module.ts');
        expect(content).toMatch(/import { GraphQLModule } from '.\/graphql.module'/);
    });

    it('should import HttpClientModule to the root module', async () => {
        const content = getFileContent(tree, '/projects/apollo/src/app/app.module.ts');

        expect(content).toMatch(/import { HttpClientModule } from '@angular\/common\/http'/);
    });
});

describe('ng-add with standalone', () => {
    let tree: UnitTestTree;

    beforeEach(async () => {
        tree = await runNgAdd(true);
    });

    it('should update package.json dependencies', async () => {
        const packageJsonPath = '/package.json';
        expect(tree.files).toContain(packageJsonPath);

        const packageJson = getJsonFile(tree, packageJsonPath);
        const {dependencies} = packageJson;

        const dependenciesMap = createDependenciesMap({
            project: 'my-project',
            graphql: '16',
        });

        for (const dependency in dependenciesMap) {
            if (dependenciesMap.hasOwnProperty(dependency)) {
                const version = dependenciesMap[dependency];

                expect(dependencies[dependency]).toBe(version);
            }
        }
    });

    it('should use `provideApollo()` to provide Apollo', async () => {
        const content = getFileContent(tree, '/projects/apollo/src/app/app.config.ts');

        expect(content).toMatch(/provideApollo\(\(\) => {/);
    });

    it('should import HttpClientModule to the root module', async () => {
        const content = getFileContent(tree, '/projects/apollo/src/app/app.config.ts');

        expect(content).toMatch(/import { provideHttpClient } from '@angular\/common\/http'/);
    });
});
