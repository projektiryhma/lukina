const { defineConfig } = require("cypress");
const { GenerateCtrfReport } = require("cypress-ctrf-json-reporter");

module.exports = defineConfig({
  allowCypressEnv: false,

  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    setupNodeEvents(on, config) {
      new GenerateCtrfReport({
        on,
        outputFile: "ctrf-report-cypress.json",
      });
      if (process.env.CYPRESS_COVERAGE === "true") {
        require("@cypress/code-coverage/task")(on, config);
      }
      return config;
    },
  },
});
