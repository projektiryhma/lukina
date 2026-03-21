/* eslint-disable no-undef */

beforeEach(() => {});

describe("Press button to move to game page with short sentences", () => {
  it("renders", () => {
    cy.intercept("GET", "**/data/data.json", { fixture: "testdata.json" }).as(
      "fetchData",
    );

    // Visit the page that triggers the fetch
    cy.visit("/#/InfoPageGameOne");

    // Wait for the network request to happen
    cy.wait("@fetchData").wait(1000);

    cy.get(".DifButton").should("contain", "Lyhyt");
    cy.get(".DifButton").should("contain", "Keskipitkä");
    cy.get(".DifButton").should("contain", "Pitkä");

    cy.get(".DifButton").first().click();

    cy.get(".GameData").should("contain", "Easy test item with error");

    cy.get(".ErrorAmount")
      .invoke("text")
      .then((text) => {
        const value = Number(text);
        expect(value).to.be.within(1, 3);
      });
  });
});
