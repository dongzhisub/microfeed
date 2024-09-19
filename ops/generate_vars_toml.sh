# Use in CI
if test -f ".vars.toml"; then
    echo ".vars.toml exists."
    exit
fi

cat << EOF > .vars.toml
          CLOUDFLARE_PROJECT_NAME = "$CLOUDFLARE_PROJECT_NAME"
          CLOUDFLARE_ACCOUNT_ID = "$CLOUDFLARE_ACCOUNT_ID"
          CLOUDFLARE_API_TOKEN = "$CLOUDFLARE_API_TOKEN"

          R2_ACCESS_KEY_ID = "$R2_ACCESS_KEY_ID"
          R2_SECRET_ACCESS_KEY = "$R2_SECRET_ACCESS_KEY"
          R2_PUBLIC_BUCKET = "$R2_PUBLIC_BUCKET"

          R2_ENDPOINT = "s3.us-west-004.backblazeb2.com"
          R2_REGION = "us-west-004"
          SECRET_KEY = "2hot1mail9c"

          D1_DATABASE_NAME = "$D1_DATABASE_NAME"

          PRODUCTION_BRANCH = "$PRODUCTION_BRANCH"

          MICROFEED_VERSION = "v1"
          NODE_VERSION = "18.0"

          DEPLOYMENT_ENVIRONMENT = "$DEPLOYMENT_ENVIRONMENT"
EOF
