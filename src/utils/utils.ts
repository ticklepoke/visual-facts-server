import fs from 'fs';
import { ok } from 'neverthrow';
import path from 'path';
import { exec } from './os';

// Constants
const CSLICER_JAR = path.join(
	__dirname,
	'./vendors/cslicer/cslicer-1.0.0-jar-with-dependencies.jar'
);
const JAVA = 'java';

export function generateFacts(pathToSrc: string) {
	console.log('Generating facts');
	const pathToConfig = path.resolve(pathToSrc, 'cslicer-config.properties');
	console.log(pathToConfig);
	const configFileContent = `repoPath = ${path.resolve(
		pathToSrc,
		'.git'
	)}\nclassRoot = ${path.resolve(pathToSrc, 'target/classes')}`;

	fs.writeFileSync(pathToConfig, configFileContent);

	const cmdList = [
		// TODO: find out what the Java path really is...
		'JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_231.jdk/Contents/Home',
		// TODO: point to the maven executable in ./vendors...
		'M2_HOME=/Users/ming/Desktop/FYP/app/src/vendors/apache-maven-3.6.3/bin',
		JAVA,
		'-jar',
		CSLICER_JAR,
		'-c',
		pathToConfig,
		'-p',
		'-e',
		'fact',
		'-ext=dep',
	];
	const cmd = cmdList.join(' ');
	console.log({ cmd });

	return exec(cmd).andThen(() => {
		const factLocation = path.resolve(pathToSrc, '.facts/20-deps.ta');
		const facts = fs.readFileSync(factLocation);
		return ok(facts.toString());
	});
}
