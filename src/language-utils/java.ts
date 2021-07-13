import { spawn } from 'child_process';
import path from 'path';

const MAVEN_BIN = path.join(__dirname, './vendors/apache-maven-3.6.3/bin/mvn');

export function mavenBuild(pathToSrc: string) {
	const mvnCompile = spawn(MAVEN_BIN, ['compiler:compile'], {
		cwd: pathToSrc,
	});
	return new Promise((resolve, reject) => {
		// Detect error
		mvnCompile.stderr.on('data', (data) => {
			reject(data);
		});
		// On close
		mvnCompile.on('close', () => {
			// if (code !== 0) {
			//   reject();
			// } else {
			//   resolve();
			// }
			resolve(true);
		});
	});
}
