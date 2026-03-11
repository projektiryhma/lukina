const { defineConfig } = require("cypress");

process.env.NODE_ENV = "development";
const webpackConfig = require("react-scripts/config/webpack.config")(
  "development",
);

const babelLoaderRule = webpackConfig.module.rules
  .find((rule) => rule.oneOf)
  .oneOf.find(
    (rule) =>
      rule.loader && rule.loader.includes("babel-loader") && rule.include
  );

if (babelLoaderRule) {
  // Change include from just src/ to also include cypress/
  const path = require("path");
  babelLoaderRule.include = [
    babelLoaderRule.include,
    path.resolve(__dirname, "cypress"),
  ];
}

module.exports = defineConfig({
  allowCypressEnv: false,

  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
      webpackConfig,
    },
    specPattern: "cypress/component/**/*.cy.{js,jsx,ts,tsx}",
  },
});
