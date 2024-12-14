const { exec } = require("child_process");

(async () => {
  console.log("Fetching...");

  const pageId = "927ff724d87341d99ecb5ba6741b0d08";
  const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    headers: {
      Authorization:
        "Bearer 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",
      "Notion-Version": "2022-06-28",
    },
  });

  console.log(response.status);
  console.log(response.statusText);
  console.log(await response.json());
})();

//  \
//     --distribution-id EDFDVBD6EXAMPLE \
//     --paths "/example-path/example-file.jpg" "/example-path/example-file2.png"
