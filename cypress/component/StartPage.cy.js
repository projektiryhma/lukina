/* eslint-disable no-undef */
import { MemoryRouter, Routes, Route } from "react-router-dom";
import StartPage from "../../src/pages/StartPage";
import { InfoPageGameOne } from "../../src/pages/InfoPageGameOne";

describe("Press button to move to game page", () => {
  it("renders", () => {
    cy.mount(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/InfoPageGameOne" element={<InfoPageGameOne />} />
        </Routes>
      </MemoryRouter>,
    );
    cy.get(".StartButton").should("contain", "Aloita pelaaminen");

    cy.get(".StartButton").click();

    cy.get(".InfoHeader").should("contain", "Etsi ja korjaa");
  });
});
