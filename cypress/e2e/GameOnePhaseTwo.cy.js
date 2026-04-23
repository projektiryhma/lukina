/* eslint-disable no-undef */
describe("Press button check correct answers", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/data/data.json", { fixture: "testdata.json" }).as(
      "fetchData",
    );

    cy.visit("/#/InfoPageGameOne");

    cy.wait("@fetchData").wait(1000);

    cy.get(".DifButton").first().click();

    cy.get(".interactive-word")
      .contains("test")
      .click()
      .should("have.class", "is-selected", "true");
    cy.get(".interactive-word")
      .contains("error")
      .click()
      .should("have.class", "is-selected", "true");

    cy.contains("Tarkista").click();

    cy.get(".modal-close-btn").click();
  });
  it("write correct answer in input field", () => {
    cy.get(".progress").should("contain", "Korjattava sana 1/2");
    cy.get(".word-input").type("test");
    cy.get(".check-button").click();
    cy.get(".modal-container").should("be.visible");
    cy.get(".modal-container").should(
      "contain",
      "Sana oikein. Jatka seuraavaan sanaan.",
    );
    cy.get(".modal-close-btn").click();

    cy.get(".progress").should("contain", "Korjattava sana 2/2");
    cy.get(".word-input").type("error");
    cy.get(".check-button").click();
    cy.get(".modal-container").should("be.visible");
    cy.get(".modal-container").should(
      "contain",
      "Sana oikein. Jatka seuraavaan sanaan.",
    );
    cy.get(".modal-close-btn").click();
  });
  it("write wrong answer in input field", () => {
    cy.get(".progress").should("contain", "Korjattava sana 1/2");
    cy.get(".word-input").type("wrong");
    cy.get(".check-button").click();
    cy.get(".modal-container").should("be.visible");
    cy.get(".modal-container").should(
      "contain",
      "Sana on väärin. Voit tarvittaessa pyytää vihjeen.",
    );
    cy.get(".modal-close-btn").click();
    cy.get(".progress").should("contain", "Korjattava sana 1/2");
  });
  it("write correct answer after wrong answer", () => {
    cy.get(".progress").should("contain", "Korjattava sana 1/2");
    cy.get(".word-input").type("wrong");
    cy.get(".check-button").click();
    cy.get(".modal-container").should("be.visible");
    cy.get(".modal-container").should(
      "contain",
      "Sana on väärin. Voit tarvittaessa pyytää vihjeen.",
    );
    cy.get(".modal-close-btn").click();
    cy.get(".progress").should("contain", "Korjattava sana 1/2");

    cy.get(".word-input").clear().type("test");
    cy.get(".check-button").click();
    cy.get(".modal-container").should("be.visible");
    cy.get(".modal-container").should(
      "contain",
      "Sana oikein. Jatka seuraavaan sanaan.",
    );
    cy.get(".modal-close-btn").click();
  });
  it("write right answer with capital letters", () => {
    cy.get(".progress").should("contain", "Korjattava sana 1/2");
    cy.get(".word-input").type("TeSt");
    cy.get(".check-button").click();
    cy.get(".modal-container").should("be.visible");
    cy.get(".modal-container").should(
      "contain",
      "Sana oikein. Jatka seuraavaan sanaan.",
    );
    cy.get(".modal-close-btn").click();
  });
  it("write right answer with extra spaces", () => {
    cy.get(".progress").should("contain", "Korjattava sana 1/2");
    cy.get(".word-input").type("  test  ");
    cy.get(".check-button").click();
    cy.get(".modal-container").should("be.visible");
    cy.get(".modal-container").should(
      "contain",
      "Sana oikein. Jatka seuraavaan sanaan.",
    );
    cy.get(".modal-close-btn").click();
  });
});
