#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

const cwd = process.cwd();
const [, , name, version] = process.argv;

function updateComponent() {
  let filepath = path.join(cwd, `./${name}/src/app/app.component.ts`);
  let suffix = 'Component';

  if (!fs.existsSync(filepath)) {
    filepath = path.join(cwd, `./${name}/src/app/app.ts`);
    suffix = '';
  }

  const code =
    `import { Apollo } from 'apollo-angular';\n` +
    `import { versionInfo } from 'graphql';\n` +
    fs
      .readFileSync(filepath, 'utf8')
      .replace(`App${suffix} {`, `App${suffix} { constructor(private readonly apollo: Apollo) {}`) +
    `\n (window as any).GRAPHQL_VERSION = versionInfo.major;`;

  fs.writeFileSync(filepath, code, 'utf8');
}

function updateCypress() {
  let filepath = path.join(cwd, `./${name}/cypress/e2e/spec.cy.ts`);
  const code = fs
    .readFileSync(filepath, 'utf8')
    .replace(
      `cy.contains('app is running')`,
      `cy.window().its('GRAPHQL_VERSION').should('equal', ${version})`,
    );

  fs.writeFileSync(filepath, code, 'utf8');

  fs.writeFileSync(
    path.join(cwd, `./${name}/cypress/support/index.ts`),
    `
    import failOnConsoleError from 'cypress-fail-on-console-error';
    failOnConsoleError();
  `,
    'utf8',
  );
}

updateComponent();
updateCypress();
