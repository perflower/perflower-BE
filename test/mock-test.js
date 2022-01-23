const request = require("supertest");
const app = require("../app");

describe("GET /", () => {
  it("Hello, Kangaroo라는 응답이 와야한다.", () => {
    request(app).get("/").expect("Hello, Kangaroo");
  });
});
