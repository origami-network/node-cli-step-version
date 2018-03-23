module.exports = function(sourcePackageVersion, buildNumber, buildBranch) {
    let version = {
        publish: sourcePackageVersion,
        build: sourcePackageVersion,
    };
    if ((buildNumber != null) && (typeof buildNumber !== 'undefined') && buildNumber >= 0) {
        version.build += '.' + buildNumber;
    }
    if (buildBranch) {
        buildBranch = buildBranch.trim();
        if (buildBranch) {
            version.build += ('-' + buildBranch)
                .replace(/\//g, "-")
        }
    }

    return version;
}