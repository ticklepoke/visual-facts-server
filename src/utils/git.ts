import fs from 'fs';
import { okAsync } from 'neverthrow';
import path from 'path';
import { mkdir } from './fs';
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

export function initRootFolder() {
	if (!fs.existsSync(ROOT_PATH)) {
		return mkdir(ROOT_PATH);
	}
	return okAsync<void, unknown>(undefined);
}
