import supertest from "supertest";
import { INITIAL_DIGIPET, setDigipet, Digipet } from "../digipet/model";
import app from "../server";

describe("User can rehome their digipet and be left with no digipet.", () => {
  beforeAll(() => {
    // setup: give an initial digipet
    const startingDigipet: Digipet = {
      happiness: 30,
      nutrition: 25,
      discipline: 10,
    };
    setDigipet(startingDigipet);
  });

  test("GET /digipet informs them that they have a digipet with expected stats", async () => {
    const response = await supertest(app).get("/digipet");
    expect(response.body.message).toMatch(/your digipet/i);
    expect(response.body.digipet).toHaveProperty("happiness", 30);
    expect(response.body.digipet).toHaveProperty("nutrition", 25);
    expect(response.body.digipet).toHaveProperty("discipline", 10);
  });

  test("1st GET /digipet/rehome informs them that they have rehomed their digipet and have no digipet left.", async () => {
    const response = await supertest(app).get("/digipet/rehome");
    expect(response.body.message).toMatch(/rehomed/i);
    expect(response.body.digipet).toBeNull();
  });

  test("2nd GET /digipet now informs them that they don't currently have a digipet", async () => {
    const response = await supertest(app).get("/digipet");
    expect(response.body.message).toMatch(/don't have/i);
    expect(response.body.digipet).not.toBeDefined();
  });

  test("2nd GET /digipet/rehome now informs them that they can't rehome a digipet if they don't have one", async () => {
    const response = await supertest(app).get("/digipet/rehome");
    expect(response.body.message).not.toMatch(/success/i);
    expect(response.body.message).toMatch(/don't have a digipet to rehome/i);
  });
});
