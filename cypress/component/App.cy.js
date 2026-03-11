/* eslint-disable no-undef */
import App from "../../src/App";

describe("Test data loading integration", () => {
  beforeEach(() => {
    cy.clearIndexedDB();

    cy.intercept("GET", "**/data/data.json", { fixture: "testdata.json" })
      // eslint-disable-next-line prettier/prettier
      .as("fetchData");
  });

  it("loads data", () => {
    cy.mount(<App />);

    cy.wait("@fetchData");

    cy.wait(1000);

    cy.checkIndexedDB().then((result) => {
      expect(result.exists).to.be.true;
      expect(result.stores).to.have.length.greaterThan(0);
    });

    cy.checkIndexedDB("0").then((result) => {
      expect(result.storeExists).to.be.true;
      expect(result.count).to.be.greaterThan(0);
      expect(result.data[0]).to.have.property("Virheetön teksti");
      expect(result.data[0]["Virheetön teksti"]).to.equal("Easy test item");
    });

    cy.checkIndexedDB("1").then((result) => {
      expect(result.storeExists).to.be.true;
      expect(result.count).to.be.greaterThan(0);
      expect(result.data[0]).to.have.property("Virheetön teksti");
      expect(result.data[0]["Virheetön teksti"]).to.equal("Medium test item");
    });
    cy.checkIndexedDB("2").then((result) => {
      expect(result.storeExists).to.be.true;
      expect(result.count).to.be.greaterThan(0);
      expect(result.data[0]).to.have.property("Virheetön teksti");
      expect(result.data[0]["Virheetön teksti"]).to.equal("Hard test item");
    });
  });
});
