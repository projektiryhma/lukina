const { defineConfig } = require("cypress");

process.env.NODE_ENV = "development";
const webpackConfig = require("react-scripts/config/webpack.config")(
  "development"
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

  e2e: {
    baseUrl: "http://localhost:3000",
    testIsolation: true,
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    setupNodeEvents(on) {
      const { setupCtrfPlugin } = require("cypress-ctrf-json-reporter/plugin");
      setupCtrfPlugin(on, { outputDir: "ctrf", outputFile: "cypress-ctrf-report.json" });
      if (process.env.CYPRESS_COVERAGE === "true") {
        require("@cypress/code-coverage/task")(on, {});
      }
    },
  },
});
