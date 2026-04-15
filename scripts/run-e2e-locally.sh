#!/usr/bin/env bash

set -xe

pnpm run --filter apollo-angular build
pnpm pack --filter apollo-angular --out apollo-angular.tgz
pnpm cache delete apollo-angular
rm -rf testapp
ng new testapp --package-manager pnpm --defaults --minimal --skip-git
(cd testapp && ng add ../apollo-angular.tgz --graphql '16.0.0' --defaults --verbose --skip-confirmation)
(cd testapp && pnpm ng run testapp:build:production)
(cd testapp && ng add @cypress/schematic --defaults --verbose --skip-confirmation)
./scripts/prepare-e2e.js testapp 16
(cd testapp && pnpm ng run testapp:cypress-run:production)
rm -rf testapp
