import { exec } from 'child_process';

// TODO: check if exec can be sync
export function execCommandAsync(command: string) {
	return new Promise((resolve, reject) => {
		exec(command, (err) => {
			if (err) {
				reject(err);
			} else {
				resolve(true);
			}
		});
	});
}
