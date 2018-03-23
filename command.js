#!/usr/bin/env node

const program = require('commander');
const path = require('path');

program
  .version(require('./package.json').version)
  .option('-n, --build-number <value>', 'Build sequential number', parseInt)
  .option('-b, --build-branch <name>', 'Branch name from the SCM repository')
  .parse(process.argv);

let sourcePackageFile = path.join(process.cwd(), 'package.json');
let sourcePackage = require(sourcePackageFile); 
let version = require('.')(
    sourcePackage.version,
    program.buildNumber,
    program.buildBranch
)

console.log(version.build);
console.log(version.publish);
