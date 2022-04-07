const app = require("../app");
const request = require("supertest");

describe("Go Fit Server API TEST", () => {
  test("should test that true === true", () => {
    expect(true).toBe(true);
  });

  test("should searched perfumes info", async (done) => {
    const response = await request(app).get("/api/search/list").send({
      word: "ㄷㅣㅇ",
    });
    expect(response.status).toEqual(200);
  });
});
