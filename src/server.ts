import cors from 'cors';
import express from 'express';
import { ok } from 'neverthrow';
import routes from './routes';
import { initRootFolder } from './utils/git';

export function createExpressServer() {
	return initRootFolder().andThen(() => {
		const app = express();
		const port = 8080;

		app.use(cors());
		app.use(express.json());
		app.use(routes);

		const server = app.listen(port, () => {
			console.log(`Server running on port ${port}`);
		});

		return ok(server);
	});
}
