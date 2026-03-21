/* eslint-disable no-undef */

describe("Press button to move to game page", () => {
  it("renders", () => {
    cy.visit("/#/");
    cy.get(".StartButton").should("contain", "Aloita pelaaminen");

    cy.get(".StartButton").click();

    cy.get(".InfoHeader").should("contain", "Etsi ja korjaa");
  });
});
