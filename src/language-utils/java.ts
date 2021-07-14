import { spawn } from 'child_process';
import { ResultAsync } from 'neverthrow';
import path from 'path';

const MAVEN_BIN = path.join(__dirname, './vendors/apache-maven-3.6.3/bin/mvn');

function _mavenBuild(pathToSrc: string): Promise<string> {
	const mvnCompile = spawn(MAVEN_BIN, ['compiler:compile'], {
		cwd: pathToSrc,
	});
	return new Promise((resolve, reject) => {
		mvnCompile.stderr.on('data', (data) => {
			reject(data);
		});
		mvnCompile.on('close', () => {
			resolve(pathToSrc);
		});
	});
}

export function mavenBuild(pathToSrc: string) {
	return ResultAsync.fromPromise(
		_mavenBuild(pathToSrc),
		() => new Error('[MVN BUILD]: Unable to execute')
	);
}
