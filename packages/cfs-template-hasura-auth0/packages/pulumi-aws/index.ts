import * as pulumi from "@pulumi/pulumi";
import fs from "fs";

import Auth0 from "./src/components/auth0";
import Certificate from "./src/components/certificate";
import Fargate from "./src/components/fargate";
import Rds from "./src/components/rds";
import StaticWebsite from "./src/components/staticWebsite";

const config = new pulumi.Config();
const domain = config.require("targetDomain");
const serverDomain = `api.${domain}`;
export const graphqlUrl = `https://${serverDomain}/v1/graphql`;
export const webUrl = `https://${domain}`;
const auth0Domain = config.require("auth0Domain");

const serverCertificate = new Certificate("server-certificate", {
  domain,
});
const webCertificate = new Certificate("web-certificate", {
  domain,
});

const dbName = config.require("dbName");
const dbUsername = config.require("dbUsername");
const dbPassword = config.requireSecret("dbPassword");
const { connectionString, cluster } = new Rds("server-db", {
  dbName,
  dbUsername,
  dbPassword,
});
const hasuraGraphqlAdminSecret = config.requireSecret(
  "hasuraGraphqlAdminSecret"
);
new Fargate("server", {
  certificate: serverCertificate,
  domain: serverDomain,
  webUrl,
  connectionString,
  cluster,
  graphqlUrl,
  auth0Domain,
  hasuraGraphqlAdminSecret,
});

const auth0MobileCallback = config.require("auth0MobileCallback");
const { webClientId, mobileClientId } = new Auth0("auth0", {
  webUrl,
  graphqlUrl,
  auth0MobileCallback,
});

new StaticWebsite("web", {
  certificate: webCertificate,
  domain,
  graphqlUrl,
  auth0Domain,
  webClientId,
});

mobileClientId.apply((clientId) => {
  fs.writeFileSync(
    "../mobile/.env",
    // Broken up for readability.
    `${[
      `GRAPHQL_URL=${graphqlUrl}`,
      `AUTH0_AUDIENCE=${graphqlUrl}`,
      `AUTH0_DOMAIN=${auth0Domain}`,
      "# AUTH0_CLIENT_ID can be publicly shared (checked into git)",
      "# https://community.auth0.com/t/client-id-vs-secret/9558/2",
      `AUTH0_CLIENT_ID=${clientId}`,
    ].join("\n")}\n`
  );
});
