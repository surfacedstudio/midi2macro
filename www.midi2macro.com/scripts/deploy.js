const { exec } = require("child_process");

(async () => {
  console.log("Deploying...");

  const environment = (process.argv[2] || "").split("=")[1];

  if (environment !== "prod" && environment !== "dev") {
    throw new Error("Invalid usage: deploy.js --environment=[prod|dev]");
  }

  // Syncing S3
  console.log("Syncing S3 files");

  const targetBucket = environment === "prod" ? "www.midi2macro.com" : "dev.midi2macro.com";
  const cloudfrontDistribution = environment === "prod" ? "ESI182D4MWHFH" : "ESI182D4MWHFH";

  await new Promise((resolve, reject) => {
    exec(`aws s3 sync build s3://${targetBucket}`, (error, stdout, stderr) => {
      if (error) return reject(error);
      console.log(stdout);
      resolve();
    });
  });

  // Invalidate cloudfront distribution
  console.log("Invalidating Cloudfront distribution...");

  await new Promise((resolve, reject) => {
    exec(`aws cloudfront create-invalidation --distribution-id ${cloudfrontDistribution} --paths "/*"`, (error, stdout, stderr) => {
      if (error) return reject(error);
      console.log(stdout);
      resolve();
    });
  });

  console.log("Done");
})();
