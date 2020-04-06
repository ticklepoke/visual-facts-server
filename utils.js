import { exec, spawn } from "child_process";
import fs from "fs";
import path from "path";

// Constants
const MAVEN_BIN = path.join(__dirname, "./vendors/apache-maven-3.6.3/bin/mvn");
const CSLICER_JAR = path.join(
  __dirname,
  "./vendors/cslicer/cslicer-1.0.0-jar-with-dependencies.jar",
);
const JAVA = "java";

export function execCommandAsync(command) {
  return new Promise((resolve, reject) => {
    exec(command, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

export async function checkoutRepo(repoUrl, commitHash) {
  const localDir = path.join("/tmp", repoUrl);
  // Check whether the repo has already been checked-out
  if (!fs.existsSync(localDir)) {
    await execCommandAsync(`git clone ${repoUrl} ${localDir}`);
  } else {
    await execCommandAsync(`cd ${localDir} && git fetch`);
  }
  // Go to that directory & checkout specific commit
  await execCommandAsync(`cd ${localDir} && git checkout ${commitHash}`);
  // Return path
  console.log({ localDir });
  return localDir;
}

export function mavenBuild(pathToSrc) {
  const mvnCompile = spawn(MAVEN_BIN, ["compiler:compile"], {
    cwd: pathToSrc,
  });
  return new Promise((resolve, reject) => {
    // Detect error
    mvnCompile.stderr.on("data", (data) => {
      reject(data);
    });
    // On close
    mvnCompile.on("close", (code) => {
      // if (code !== 0) {
      //   reject();
      // } else {
      //   resolve();
      // }
      resolve();
    });
  });
}

export async function generateFacts(pathToSrc) {
  console.log("Generating facts");
  const pathToConfig = path.resolve(pathToSrc, "cslicer-config.properties");
  console.log(pathToConfig);
  const configFileContent = `repoPath = ${path.resolve(
    pathToSrc,
    ".git",
  )}\nclassRoot = ${path.resolve(pathToSrc, "target/classes")}`;

  fs.writeFileSync(pathToConfig, configFileContent);

  const cmdList = [
    // TODO: find out what the Java path really is...
    "JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_231.jdk/Contents/Home",
    // TODO: point to the maven executable in ./vendors...
    "M2_HOME=/Users/ming/Desktop/FYP/app/src/vendors/apache-maven-3.6.3/bin",
    JAVA,
    "-jar",
    CSLICER_JAR,
    "-c",
    pathToConfig,
    "-p",
    "-e",
    "fact",
    "-ext=dep",
  ];
  const cmd = cmdList.join(" ");
  console.log({ cmd });
  // Run command
  await execCommandAsync(cmd);
  // Get facts
  const factLocation = path.resolve(pathToSrc, ".facts/20-deps.ta");
  const facts = fs.readFileSync(factLocation);
  return facts.toString();
}
