/* eslint-disable no-undef */

describe("Test data loading integration", () => {
  it("loads data", () => {
    cy.intercept("GET", "**/data/data.json", { fixture: "testdata.json" })
      // eslint-disable-next-line prettier/prettier
      .as("fetchData");

    cy.visit("/#/");

    cy.wait("@fetchData").wait(1000);

    cy.checkIndexedDB().then((result) => {
      expect(result.exists).to.be.true;
      expect(result.stores).to.have.length.greaterThan(0);
    });

    checkStore("0", "Easy test item");
    checkStore("1", "Medium test item");
    checkStore("2", "Hard test item");
  });

  const checkStore = (storeName, expectedText) => {
    cy.checkIndexedDB(storeName).then((result) => {
      expect(result.storeExists).to.be.true;
      expect(result.count).to.be.greaterThan(0);
      expect(result.data[0]).to.have.property("Virheetön teksti");
      expect(result.data[0]["Virheetön teksti"]).to.equal(expectedText);
    });
  };

  it("handles empty data", () => {
    cy.window().then((win) => {
      cy.spy(win.console, "error").as("consoleError");
    });

    cy.intercept("GET", "**/data/data.json", { fixture: "testdata_empty.json" })
      // eslint-disable-next-line prettier/prettier
     .as("fetchData")

    cy.visit("/#/");

    cy.wait("@fetchData").wait(1000);

    cy.get(".App").should("exist");
    cy.get(".header-text").should("contain", "LUKINA");

    cy.get("@consoleError").should("not.have.been.called");

    cy.checkIndexedDB().then((result) => {
      expect(result.exists).to.be.true;
      expect(result.stores).to.have.length.greaterThan(0);
    });

    cy.checkIndexedDB("0").then((result) => {
      expect(result.storeExists).to.be.false;
    });
  });
});
