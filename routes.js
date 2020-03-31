import express from "express";
import fs from "fs";
import * as utils from "./utils";

const router = express.Router();

async function getFacts(repoUrl, commitHash) {
  const repoDir = await utils.checkoutRepo(repoUrl, commitHash);
  await utils.mavenBuild(repoDir);
  const facts = await utils.generateFacts(repoDir);
  return facts;
}

router.get("/facts", async (req, res) => {
  const repo_url = req.query && req.query.repo_url;
  const commit_hash = req.query && req.query.commit_hash;

  try {
    console.log({ repo_url, commit_hash });
    const facts = await getFacts(repo_url, commit_hash);
    return res.status(200).json({
      message: `Received repo_url: ${repo_url}, commit_hash: ${commit_hash}`,
      facts: facts,
    });
  } catch (err) {
    return res.status(400).json({
      message: `Something went wrong... ${err}`,
    });
  }
});

export default router;
