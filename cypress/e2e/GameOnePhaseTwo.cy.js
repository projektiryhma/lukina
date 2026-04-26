/* eslint-disable no-undef */
beforeEach(() => {
  cy.intercept("GET", "**/data/data.json", { fixture: "testdata.json" }).as(
    "fetchData",
  );

  cy.visit("/#/InfoPageGameOne");

  cy.wait("@fetchData").wait(1000);

  cy.get(".DifButton").first().click();

  cy.get(".interactive-word")
    .contains("tste")
    .click()
    .should("have.class", "is-selected", "true");
  cy.get(".interactive-word")
    .contains("err")
    .click()
    .should("have.class", "is-selected", "true");

  cy.contains("Tarkista").click();

  cy.get(".modal-close-btn").click();
});

describe("Press button check correct answers", () => {
  it("write correct answer in input field", () => {
    cy.get(".progress").should("contain", "Korjattava sana 1/2");
    cy.get(".word-input").type("test");
    cy.get(".check-button").click();
    cy.get(".modal-container").should("be.visible");
    cy.get(".modal-container").should("contain", "Jatka seuraavaan sanaan.");
    cy.get(".modal-close-btn").click();

    cy.get(".progress").should("contain", "Korjattava sana 2/2");
    cy.get(".word-input").type("error");
    cy.get(".check-button").click();
    cy.get(".modal-container").should("be.visible");
    cy.get(".modal-container").should(
      "contain",
      "Jatka lukemaan korjattu teksti.",
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
      "Yritä uudelleen. Voit tarvittaessa pyytää vihjeen.",
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
      "Yritä uudelleen. Voit tarvittaessa pyytää vihjeen.",
    );
    cy.get(".modal-close-btn").click();
    cy.get(".progress").should("contain", "Korjattava sana 1/2");

    cy.get(".word-input").clear().type("test");
    cy.get(".check-button").click();
    cy.get(".modal-container").should("be.visible");
    cy.get(".modal-container").should("contain", "Jatka seuraavaan sanaan.");
    cy.get(".modal-close-btn").click();
  });
  it("write right answer with capital letters", () => {
    cy.get(".progress").should("contain", "Korjattava sana 1/2");
    cy.get(".word-input").type("TeSt");
    cy.get(".check-button").click();
    cy.get(".modal-container").should("be.visible");
    cy.get(".modal-container").should("contain", "Jatka seuraavaan sanaan.");
    cy.get(".modal-close-btn").click();
  });
  it("write right answer with extra spaces", () => {
    cy.get(".progress").should("contain", "Korjattava sana 1/2");
    cy.get(".word-input").type("  test  ");
    cy.get(".check-button").click();
    cy.get(".modal-container").should("be.visible");
    cy.get(".modal-container").should("contain", "Jatka seuraavaan sanaan.");
    cy.get(".modal-close-btn").click();
  });
  it("write no answer and press check", () => {
    cy.get(".progress").should("contain", "Korjattava sana 1/2");
    cy.get(".check-button").click();
    cy.contains("Kirjoita sana oikein.").should("be.visible");
  });
});
describe("test hint and switching word buttons", () => {
  it("open hint and check that current word is the same", () => {
    cy.get(".progress").should("contain", "Korjattava sana 1/2");
    cy.get(".help-button").first().click();
    cy.get(".modal-container").should("be.visible");
    cy.get(".modal-container").should("contain", "test");
    cy.get(".modal-close-btn").click();
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
    cy.get(".help-button").first().click();
    cy.get(".modal-container").should("be.visible");
    cy.get(".modal-container").should("contain", "error");
    cy.get(".modal-close-btn").click();
  });
  it("Restart the game", () => {
    cy.contains("Vaihda tekstiä").click();
    cy.url().should("include", "/GamePageGameOne");
    cy.get(".PhaseOneHeader").should("be.visible");
  });
});
