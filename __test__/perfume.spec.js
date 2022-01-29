const app = require("../app");
const request = require("supertest");

describe("GET /", () => {
  it("Hello, Kangaroo라는 응답이 와야한다.", () => {
    request(app).get("/").expect("Hello, Kangaroo");
  });
});
