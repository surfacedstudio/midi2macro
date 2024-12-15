# Deploy Infra

```sh
cd infra
yarn deploy-dev | yarn deploy-prod
```

Will deploy

- {dev|www}.{domainName} S3 bucket
- Cloudfront distribution (needs us-east-1 SSL)
- Cloudfront custom function to redirect on-www/dev to www
- {api-dev|api}.{domainName} Api Gateway (needs ap-southeast-2 SSL)
- R53 entry to CNAME the Cloudfront distribution
- R53 entry to CNAME the API gateway
