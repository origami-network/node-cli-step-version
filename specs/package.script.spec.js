const { expect } = require('chai');

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs-extra');


const packagePath = path.join(process.cwd(), '.package');
const packageFile = path.join(packagePath, 'package.json');
const package = {
    "name": "test-package",
    "version": "1.2.3",
    "scripts": {
        "cli-step-version": "npm install --no-save --silent ../.. && cli-step-version"
    }
}

function execNpmRunGetVersion(args) {
    let command = 'npm run cli-step-version'
    if (args) {
        command += ' -- '
        command += args
    }

    console.log('> ' + command);

    var stdio = execSync(
        command,
        {
            cwd: packagePath,
            encoding: 'utf-8'
        })
    console.log(stdio);

    var nonEmptyLines = stdio
        .split('\n')
        .map(i => i.trim())
        .filter(i => i);
        
    return {
        publish: nonEmptyLines.pop(),  
        build: nonEmptyLines.pop()
    }
} 

describe('Get Version - package script', () => {

    beforeEach(() => {
        fs.emptyDirSync(packagePath);
        fs.writeFileSync(packageFile, JSON.stringify(package, null, 2) , 'utf-8');
    });

    it('executes without arguments', () => {
        let version = execNpmRunGetVersion();

        expect(version.build).to.equal('1.2.3');
        expect(version.publish).to.equal(version.build);
    });

    it('executes with build number', () => {
        let version = execNpmRunGetVersion('-n 10');

        expect(version.build).to.equal('1.2.3.10');
        expect(version.publish).to.equal('1.2.3');
    });

    it('executes with build branch', () => {
        let version = execNpmRunGetVersion('-b feature/example');

        expect(version.build).to.equal('1.2.3-feature-example');
        expect(version.publish).to.equal('1.2.3');
    });

    it('executes with build number and branch', () => {
        let version = execNpmRunGetVersion('-n 0 -b feature/example');

        expect(version.build).to.equal('1.2.3.0-feature-example');
        expect(version.publish).to.equal('1.2.3');
    });

});
