import { Request, Response } from 'express';
import { isLeft } from 'fp-ts/lib/Either';
import * as t from 'io-ts';
import * as utils from '../utils';


const FactQueryValidator = t.type({
	repo_url: t.string,
	commit_hash: t.string,
});
type FactQueryValidator = t.TypeOf<typeof FactQueryValidator>;

export async function getFacts(req: Request, res: Response) {
	const validationResult = FactQueryValidator.decode(req.query);
	if (isLeft(validationResult)) {
		return res.status(400).json({
			message: 'Missing query params',
		});
	}
	const { repo_url, commit_hash } = validationResult.right;

	try {
		console.log({ repo_url, commit_hash });
		const facts = await _getFacts(repo_url, commit_hash);
		return res.status(200).json({
			message: `Received repo_url: ${repo_url}, commit_hash: ${commit_hash}`,
			facts: facts,
		});
	} catch (err) {
		return res.status(400).json({
			message: `Something went wrong... ${err}`,
		});
	}
}

async function _getFacts(repoUrl: string, commitHash: string) {
	const repoDir = await utils.checkoutRepo(repoUrl, commitHash);
	await utils.mavenBuild(repoDir);
	const facts = await utils.generateFacts(repoDir);
	return facts;
}