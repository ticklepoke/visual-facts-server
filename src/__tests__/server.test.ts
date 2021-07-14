import { Ok, okAsync } from 'neverthrow';
import { createExpressServer } from '../server';
import * as git from '../utils/git';

describe('createExpressServer', () => {
	it('should always create a server', async () => {
		const initRootFolderSpy = jest
			.spyOn(git, 'initRootFolder')
			.mockReturnValue(okAsync(undefined));

		const server = await createExpressServer();
		expect(server).toBeInstanceOf(Ok);
		server.isOk() && server.value.close();
		initRootFolderSpy.mockRestore();
	});
});
