// next.config.js

const withGraphQL = require("next-plugin-graphql");

module.exports = withGraphQL({
  webpack(config, options) {
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: "graphql-tag/loader",
        },
      ],
    });

    return config;
  },
});
