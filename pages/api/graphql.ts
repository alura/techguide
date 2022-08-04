import { apolloServer } from "@api/api";
import { PageConfig } from "next";

const startServer = apolloServer.start();

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }

  await startServer;
  await apolloServer.createHandler({
    path: "/api/graphql/",
  })(req, res);
}

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};
