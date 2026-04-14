/* eslint-disable no-undef */
describe("Press button to move to game page", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/data/data.json", { fixture: "testdata.json" }).as(
      "fetchData",
    );

    cy.visit("/#/InfoPageGameOne");
    cy.wait("@fetchData").wait(1000);
  });
  it("short sentences", () => {
    cy.get(".DifButton").should("contain", "Lyhyt");

    cy.get(".DifButton").first().click();

    cy.get(".word-container").should("contain", "Easy");
    cy.get(".word-container").should("contain", "error");

    cy.get(".interactive-word")
      .contains("Easy")
      .click()
      .should("have.class", "is-selected", "true");
    cy.get(".interactive-word")
      .contains("error")
      .click()
      .should("have.class", "is-selected", "true");
  });
  it("medium sentences", () => {
    cy.get(".DifButton").should("contain", "Keskipitkä");

    cy.get(".DifButton").eq(1).click();

    cy.get(".word-container").should("contain", "Medium");
    cy.get(".word-container").should("contain", "error");

    cy.get(".interactive-word")
      .contains("Medium")
      .click()
      .should("have.class", "is-selected", "true");
    cy.get(".interactive-word")
      .contains("error")
      .click()
      .should("have.class", "is-selected", "true");
  });
  it("long sentences", () => {
    cy.get(".DifButton").should("contain", "Pitkä");

    cy.get(".DifButton").eq(2).click();

    cy.get(".word-container").should("contain", "Hard");
    cy.get(".word-container").should("contain", "error");

    cy.get(".interactive-word")
      .contains("Hard")
      .click()
      .should("have.class", "is-selected", "true");
    cy.get(".interactive-word")
      .contains("error")
      .click()
      .should("have.class", "is-selected", "true");
  });
});
