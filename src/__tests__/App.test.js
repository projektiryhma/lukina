import { render, screen } from "@testing-library/react";
import App from "../App";

// Mock the dataCache module
jest.mock("../db/dataCache", () => ({
  initAndCacheData: jest.fn().mockReturnValue(Promise.resolve()),
}));

// Mock the page components
jest.mock("../pages/StartPage", () => ({
  StartPage: () => <div>StartPage Mock</div>,
}));

jest.mock("../pages/InfoPageGameOne", () => ({
  InfoPageGameOne: () => <div>InfoPageGameOne Mock</div>,
}));

// Clean mocks before each test to ensure test isolation
describe("App", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Renders StartPage at root path /", () => {
    render(<App />);
    expect(screen.getByText("StartPage Mock")).toBeInTheDocument();
  });

  test("Renders InfoPageGameOne at path /InfoPageGameOne", () => {
    window.location.hash = "#/InfoPageGameOne";
    render(<App />);
    expect(screen.getByText("InfoPageGameOne Mock")).toBeInTheDocument();
  });

  /*
  Testit kirjoitetaan samalla tavalla yllä olevalla kaavalla.
  Nappi haetaan muuttujaan esim screen.getByText("napin teksti") ja sitten klikkausta
  voidaan simuloida esim firevent.click(nappi)
  Muuten muoto voi olla melko sama, eli renderöidään haluttu komponentti
  ja lopussa tarkistetaan että sivulla on näkyvissä haluttu asia.
  */
});
