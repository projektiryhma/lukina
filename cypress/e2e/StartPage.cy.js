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
