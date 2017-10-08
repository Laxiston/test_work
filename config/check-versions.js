import cls from 'cli-color';
import semver from 'semver';
import shell from 'shelljs';

const packageConfig = require('../package.json');

function exec(cmd) {
    return require('child_process')
        .execSync(cmd)
        .toString()
        .trim();
}

const versionRequirements = [{
    name: 'node',
    currentVersion: semver.clean(process.version),
    versionRequirement: packageConfig.engines.node
}];

if (shell.which('npm')) {
    versionRequirements.push({
        name: 'npm',
        currentVersion: exec('npm --version'),
        versionRequirement: packageConfig.engines.npm
    });
}

export default () => {
    let warnings = [];

    for (let i = 0; i < versionRequirements.length; i++) {
        let mod = versionRequirements[i];

        if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
            warnings.push(mod.name + ': ' +
                cls.red(mod.currentVersion) + ' should be ' +
                cls.green(mod.versionRequirement)
            );
        }
    }

    if (warnings.length) {
        console.log('');
        console.log(cls.yellow('To use this template, you must update following to modules:'));
        console.log();
        for (let i = 0; i < warnings.length; i++) {
            const warning = warnings[i];
            console.log('  ' + warning);
        }
        console.log();
        process.exit(1);
    }
}
