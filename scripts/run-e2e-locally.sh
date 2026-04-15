#!/usr/bin/env bash

set -xe

pnpm run --filter apollo-angular build
pnpm pack --filter apollo-angular --out apollo-angular.tgz
pnpm cache delete apollo-angular
rm -rf /tmp/testapp

(cd /tmp/ && ng new testapp --package-manager pnpm --defaults --minimal --skip-git)
cp apollo-angular.tgz /tmp/testapp/
(cd /tmp/testapp && ng add /tmp/testapp/apollo-angular.tgz --graphql '16.0.0' --defaults --verbose --skip-confirmation)
(cd /tmp/testapp && pnpm ng run testapp:build:production)
(cd /tmp/testapp && ng add @cypress/schematic --defaults --verbose --skip-confirmation)
./scripts/prepare-e2e.js /tmp/testapp 16
(cd /tmp/testapp && pnpm cypress install)
(cd /tmp/testapp && pnpm ng run testapp:cypress-run:production)
rm -rf /tmp/testapp
