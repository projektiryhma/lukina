/* eslint-disable no-undef */
beforeEach(() => {
  cy.intercept("GET", "**/data/data.json", { fixture: "testdata.json" }).as(
    "fetchData",
  );
  cy.visit("/#/InfoPageGameOne");
  cy.wait("@fetchData").wait(1000);
});
describe("Restart new game after phase three, easy item", () => {
  beforeEach(() => {
    cy.get(".DifButton").first().click();

    cy.get(".interactive-word").contains("tste").click();
    cy.get(".interactive-word").contains("err").click();

    cy.contains("Tarkista").click();

    cy.get(".modal-close-btn").click();

    cy.get(".word-input").type("test");
    cy.get(".check-button").click();
    cy.get(".modal-close-btn").click();

    cy.get(".word-input").type("error");
    cy.get(".check-button").click();
    cy.get(".modal-close-btn").click();
  });

  it("Continue to next word and restart game with easy item", () => {
    cy.get(".p3datatext").should("contain", "Easy test item with error");

    cy.contains("Jatka").click();

    cy.url().should("include", "/endpage");

    cy.get(".EndButton").first().click();
    cy.url().should("include", "/GamePageGameOne");

    cy.get(".originalText").should("contain", "Easy tste item with err");
  });

  it("Continue to front page with easy item", () => {
    cy.contains("Etusivulle").click();

    cy.url().should("include", "/");
  });
});
describe("Restart new game after phase three, medium item", () => {
  beforeEach(() => {
    cy.get(".DifButton").eq(1).click();

    cy.get(".interactive-word").contains("test").click();
    cy.contains("Tarkista").click();
    cy.get(".modal-close-btn").click();

    cy.get(".word-input").type("test");
    cy.get(".check-button").click();
    cy.get(".modal-close-btn").click();
  });

  it("Continue to next word and restart game with medium item", () => {
    cy.get(".p3datatext").should("contain", "Medium test item");

    cy.contains("Jatka").click();

    cy.url().should("include", "/endpage");

    cy.get(".EndButton").first().click();
    cy.url().should("include", "/GamePageGameOne");

    cy.get(".originalText").should("contain", "Medium test item with error");
  });
});
