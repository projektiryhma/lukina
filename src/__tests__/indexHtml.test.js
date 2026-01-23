const fs = require("fs");
const path = require("path");

test("public/index.html exists", () => {
  const indexPath = path.resolve(__dirname, "../../public/index.html");
  expect(fs.existsSync(indexPath)).toBe(true);
});
