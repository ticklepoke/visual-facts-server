import fs from 'fs';
import { okAsync } from 'neverthrow';
import path from 'path';
import { mkdir, rmdir } from './fs';
import { exec } from './os';

const ROOT_PATH = path.resolve('/tmp/visual_facts');
export function checkoutRepo(repoUrl: string, commitHash: string) {
	const repoDir = path.join(ROOT_PATH, repoUrl);
	const res = (() => {
		if (!fs.existsSync(repoDir)) {
			return exec(`git clone ${repoUrl} ${repoDir}`);
		} else {
			return exec(`cd ${repoDir} && git fetch`);
		}
	})();

	return res
		.andThen(() => exec(`cd ${repoDir} && git checkout ${commitHash}`))
		.map(() => repoDir);
}

export function initRootFolder(rootPath = ROOT_PATH) {
	if (!fs.existsSync(rootPath)) {
		return mkdir(rootPath);
	}
	return okAsync<void, unknown>(undefined);
}

export function tearDownRootFolder(rootPath = ROOT_PATH) {
	if (fs.existsSync(rootPath)) {
		return rmdir(rootPath);
	}
	return okAsync<void, unknown>(undefined);
}
