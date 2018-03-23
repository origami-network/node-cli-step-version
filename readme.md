Get Version
==

Helper command line tool to get version from the `package.json` file in the current working directory.

It can be used as continuous integration/delivery step to return versions to the pipeline.


## Usage

The simple usage is to define custom script that will install and run the command at once.

In the `package.json` add new script:

```json
{
    ...
    "scripts": {
        "cli-step-version": "npm install --no-save --silent @origami-network/cli-step-version && cli-step-version"
        ...
    }
    ...
}
```

Now it is possible to get version from command line.

```shell
> npm run cli-step-version
```

As the result the last two lines on the console will display version for:

 * **build** - including build number and branch that can be used to uniquely associate output with the build process. 
 * **publish** - the version that should be used to publish artifacts in registries. Like node package to NPM registry. 

This will allow to run the script without calling `npm install` before.


### Parameters

It is possible to pass additional parameters to the script when calling `npm run`, by adding `--` and the arguments of the script:

 * `-n`, `--build-number <value>` - sequential number, added as the last digit in the version number,
 * `-b`, `--build-branch <name>` - additional value indicating the branch or label for the version, added after eventual build number separated by "`-`" character.

In addition, fallowing informational parameters can be used:

 * `-h`, `--help` - output usage information,
 * `-V`, `--version` - output version of the script.


## Examples

### Command line

if the `package.json` has defined version `1.2.3`, then calling fallowing command:

```shell
> npm run cli-step-version -- -build-number 10 -build-branch feature/new-function
```

Will provide two last line of the output:

```

1.2.3.10-feature-new-function
1.2.3
```


### Jenkinsfile

For Windows slave node add fallowing code to `Jenkinsfile`.

```groovy
def output = bat (
    script: "npm run cli-step-version -- --build-number ${env.BUILD_NUMBER} --build-branch ${env.BRANCH_NAME}",
    returnStdout: true
).tokenize().takeRight(2)
def version = [
    build: output.first(),
    publish: output.last()
]
```

On Un*x slave nodes `bat` step should be replaced with `sh` step.

> By default Jenkins script policy do not allow methods `takeRight` and `first`. After first run they need to be accepted.
