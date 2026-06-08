import { cpSync } from 'node:fs';

cpSync('schematics/README.md', 'build/schematics/README.md');
cpSync('schematics/collection.json', 'build/schematics/collection.json');
cpSync('schematics/install/schema.json', 'build/schematics/install/schema.json');
