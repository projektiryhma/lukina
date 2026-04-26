/* eslint-disable no-undef */
beforeEach(() => {
  cy.intercept("GET", "**/data/data.json", { fixture: "testdata.json" })
    // eslint-disable-next-line prettier/prettier
    .as("fetchData");
  cy.visit("/#/");
  cy.wait("@fetchData").wait(1000);
});

describe("Press button to move to game page", () => {
  it("renders", () => {
    cy.visit("/#/");
    cy.get(".StartButton").should("be.visible");

    cy.get(".StartButton").click();

    cy.get(".InfoHeader").should("be.visible");
  });
});
describe("Open game info and instructions", () => {
  it("open game instructions", () => {
    cy.get(".InfoButton").should("contain", "Lue ohjeet");

    cy.get(".InfoButton").click();

    cy.get(".modal-header").should("contain", "Pelin ohjeet");

    cy.get(".modal-close-btn").click();

    cy.get(".modal-header").should("not.exist");
  });
  it("open app info", () => {
    cy.get(".AppInfoButton").should("contain", "Tietoa sovelluksesta");

    cy.get(".AppInfoButton").click();

    cy.get(".modal-header").should("contain", "Tietoa sovelluksesta");

    cy.get(".modal-close-btn").click();

    cy.get(".modal-header").should("not.exist");
  });
});
