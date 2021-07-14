import { Request, Response } from 'express';
import { isLeft } from 'fp-ts/lib/Either';
import * as t from 'io-ts';
import * as java from '../language-utils/java';
import * as git from '../utils/git';
import * as utils from '../utils/utils';

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

	const facts = await _getFacts(repo_url, commit_hash);
	if (facts.isOk()) {
		return res.status(200).json({
			message: `Received repo_url: ${repo_url}, commit_hash: ${commit_hash}`,
			facts: facts.value,
		});
	}
	return res.status(400).json({
		message: `Err: ${facts.error}`,
	});
}

function _getFacts(repoUrl: string, commitHash: string) {
	return git
		.checkoutRepo(repoUrl, commitHash)
		.andThen((repoDir) => java.mavenBuild(repoDir))
		.andThen((repoDir) => utils.generateFacts(repoDir));
}
