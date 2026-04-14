/* eslint-disable no-undef */
describe("Press button check correct answers", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/data/data.json", { fixture: "testdata.json" }).as(
      "fetchData",
    );

    cy.visit("/#/InfoPageGameOne");

    cy.wait("@fetchData").wait(1000);

    cy.get(".DifButton").first().click();
  });
  it("not all correct answers selected", () => {
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

    cy.get(".modal-container").should(
      "contain",
      "Löysit 1 / 2 virheellistä sanaa. Etsi loput virheelliset sanat",
    );

    cy.get(".modal-close-btn").click();

    cy.get(".modal-container").should("not.exist");

    cy.get(".interactive-word")
      .contains("Easy")
      .should("not.have.class", "is-selected");
    cy.get(".interactive-word")
      .contains("error")
      .should("have.class", "is-selected", "true");
  });

  it("all correct answers selected", () => {
    cy.get(".interactive-word")
      .contains("test")
      .click()
      .should("have.class", "is-selected", "true");
    cy.get(".interactive-word")
      .contains("error")
      .click()
      .should("have.class", "is-selected", "true");

    cy.contains("Tarkista").click();

    cy.get(".modal-container").should("be.visible");

    cy.get(".modal-container").should(
      "contain",
      "Löysit kaikki virheelliset sanat. Jatka seuraavaan vaiheeseen.",
    );

    cy.get(".modal-close-btn").click();

    cy.get(".modal-container").should("not.exist");
  });

  it("opening hint doesnt modify current selection", () => {
    cy.get(".interactive-word")
      .contains("test")
      .click()
      .should("have.class", "is-selected", "true");
    cy.get(".interactive-word")
      .contains("error")
      .click()
      .should("have.class", "is-selected", "true");

    cy.contains("Näytä vihje").click();

    cy.get(".modal-container").should("be.visible");

    cy.get(".modal-container").should(
      "contain",
      "Tekstissä on 2 virheellistä sanaa",
    );

    cy.get(".modal-close-btn").click();

    cy.get(".modal-container").should("not.exist");

    cy.get(".interactive-word")
      .contains("test")
      .should("have.class", "is-selected", "true");
    cy.get(".interactive-word")
      .contains("error")
      .should("have.class", "is-selected", "true");
  });

  it("zero selection", () => {
    cy.contains("Tarkista").click();
    cy.get(".modal-container").should("be.visible");

    cy.get(".modal-container").should(
      "contain",
      "Löysit 0 / 2 virheellistä sanaa. Etsi loput virheelliset sanat",
    );
  });
  it("selecting word and deselecting it", () => {
    cy.get(".interactive-word")
      .contains("test")
      .click()
      .should("have.class", "is-selected", "true");

    cy.get(".interactive-word")
      .contains("test")
      .click()
      .should("not.have.class", "is-selected");
  });
});
