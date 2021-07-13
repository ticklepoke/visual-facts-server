import cors from 'cors';
import express from 'express';
import routes from './routes';

(function createApp() {
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
