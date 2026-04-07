/* eslint-disable no-undef */
describe("Press button check correct answers", () => {
  it("not all correct answers selected", () => {
    cy.intercept("GET", "**/data/data.json", { fixture: "testdata.json" }).as(
      "fetchData",
    );

    cy.visit("/#/InfoPageGameOne");

    cy.wait("@fetchData").wait(1000);

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

    cy.contains("Tarkista").click();

    cy.get(".modal-container").should("be.visible");
  });
});
