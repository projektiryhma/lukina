/* eslint-disable no-undef */

describe("Render NotFoundPage and move back to start page", () => {
  it("renders", () => {
    cy.visit("/#/nonexisting");
    cy.get(".NotFoundHeader").should(
      "contain",
      "Hups, valitsemaasi sivua ei löydy",
    );

    cy.get(".NotFoundButton").click();

    cy.get(".StartHeader").should("contain", "Harjoittele ja kehity");
  });
});
