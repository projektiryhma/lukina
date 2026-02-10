import { getFromStore } from "../db/dataCache";

test("exports getFromStore function", () => {
  expect(typeof getFromStore).toBe("function");
});
