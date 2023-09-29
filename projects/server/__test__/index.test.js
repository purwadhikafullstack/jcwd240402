const request = require("supertest");
const app = require("../src/index");
const { sequelize } = require("../src/models");

describe("TEST Call API", () => {
  test("GET main route", async () => {
    const res = await request(app).get("/api");

    expect(res).toBeTruthy();
    expect(res.status).toBe(200);
    expect(res.text).toMatch("Hello, this is my API");
  });
});
