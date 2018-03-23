const expect = require('chai').expect;

const GetVersion = require('./get-version.js');

describe('Get Version', () => {
    describe('when required', () => {
        it('should export a function', () => {
            expect(GetVersion).to.be.a('function');
        })
    });

    const sourcePackageVersion = "1.2.3"

    it('provides build and publish values', () => {
        let version = GetVersion(sourcePackageVersion);

        expect(version).to.not.be.null;
        expect(version.build).to.equal(sourcePackageVersion);
        expect(version.publish).to.equal(sourcePackageVersion);
    });

    it('use build number greater or equal 0', () => {
        const validBuildNumbers = [0, 1, 10]; 
        validBuildNumbers.forEach(buildNumber => {
            let version = GetVersion(sourcePackageVersion, buildNumber);
    
            expect(version.build).to.equal(sourcePackageVersion + '.' + buildNumber);
            expect(version.publish).to.equal(sourcePackageVersion);
        }); 
    });

    it('ignores build number less then 0', () => {
        const invalidBuildNumbers = [-1, -10];
        invalidBuildNumbers.forEach(buildNumber => {
            let version = GetVersion(sourcePackageVersion, buildNumber);
    
            expect(version.build).to.equal(sourcePackageVersion);
            expect(version.publish).to.equal(sourcePackageVersion);
        }); 
    });
    
    it('use build branch', () => {
        const buildBranches = [
            'branch',
            'some-branch'
        ]; 
        buildBranches.forEach(buildBranch => {
            let version = GetVersion(sourcePackageVersion, null, buildBranch);
    
            expect(version.build).to.equal(sourcePackageVersion + '-' + buildBranch);
            expect(version.publish).to.equal(sourcePackageVersion);
        }); 
    });

    it('normalize build branch', () => {
        const buildBranches = [
            { value: 'some/branch', normalized: 'some-branch' },
            { value: ' some/branch ', normalized: 'some-branch' } 
        ]; 
        buildBranches.forEach(buildBranch => {
            let version = GetVersion(sourcePackageVersion, null, buildBranch.value);
    
            expect(version.build).to.equal(sourcePackageVersion + '-' + buildBranch.normalized);
            expect(version.publish).to.equal(sourcePackageVersion);
        }); 
    });

    it('use build number and branch', () => {
        const builds = [
            { number: 0, branch: 'branch', suffix: '.0-branch' },
            { number: 1, branch: 'some/branch', suffix: '.1-some-branch' },
            { number: 10, branch: 'some-branch', suffix: '.10-some-branch' } 
        ]; 
        builds.forEach(build => {
            let version = GetVersion(sourcePackageVersion, build.number, build.branch);
    
            expect(version.build).to.equal(sourcePackageVersion + build.suffix);
            expect(version.publish).to.equal(sourcePackageVersion);
        }); 
    }); 

});
