const { exec } = require("child_process");

(async () => {
  console.log("Deploying...");

  // Syncing S3
  console.log("Syncing S3 files");

  await new Promise((resolve, reject) => {
    exec(
      `aws s3 sync build s3://www.catsintech.com`,
      (error, stdout, stderr) => {
        if (error) return reject(error);
        console.log(stdout);
        resolve();
      }
    );
  });

  // Invalidate cloudfront distribution
  console.log("Invalidating Cloudfront distribution...");

  await new Promise((resolve, reject) => {
    exec(
      `aws cloudfront create-invalidation --distribution-id E1WUCDC4SZM3F --paths "/*"`,
      (error, stdout, stderr) => {
        if (error) return reject(error);
        console.log(stdout);
        resolve();
      }
    );
  });

  console.log("Done");
})();

//  \
//     --distribution-id EDFDVBD6EXAMPLE \
//     --paths "/example-path/example-file.jpg" "/example-path/example-file2.png"
