import cors from 'cors';
import express from 'express';
import routes from './routes';
import { initRootFolder } from './utils/git';

(async function createApp() {
	const res = await initRootFolder();
	if (res.isErr()) {
		return;
	}
	const app = express();
	const port = 8080;

	app.use(cors());
	app.use(express.json());
	app.use(routes);

	app.listen(port, () => {
		console.log(`Server running on port ${port}`);
	});
	return app;
})();
