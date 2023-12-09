import { SSTConfig } from "sst";
import { Config, NextjsSite } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "sst-bind-bug-repro",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const NEW_SECRET = new Config.Secret(stack, "NEW_SECRET");

      const site = new NextjsSite(stack, "site", {
        bind: [NEW_SECRET],
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
