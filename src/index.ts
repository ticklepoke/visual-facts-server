import { debug } from 'console';
import { createExpressServer } from './server';
import { tearDownRootFolder } from './utils/git';

(async function () {
	const server = await createExpressServer();
	if (server.isErr()) {
		return process.exit(1);
	}

	async function tearDown() {
		debug('[TEARDOWN] Signal received, closing HTTP server');

		await tearDownRootFolder();

		debug('[TEARDOWN] Deleted repos');

		server.isOk() &&
			server.value.close(() => {
				debug('HTTP server closed');
			});
	}

	process.on('SIGINT', tearDown);
	process.on('SIGKILL', tearDown);
	process.on('SIGSTP', tearDown);
})();
