import supertest from "supertest";
import { Digipet, setDigipet } from "../digipet/model";
import app from "../server";

/**
 * This file has integration tests for ignoring a digipet.
 *
 * It is intended to test the following behaviour:
 *  1. ignoring a digipet leads to decrease nutrition, happiness and discipline
 */

describe("When a user ignores a digipet repeatedly, all it's stats decrease by 10 each time until it eventually hits 0", () => {
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

  test("1st GET /digipet/ignore informs them about the ignore and shows decrease in all stats for digipet", async () => {
    const response = await supertest(app).get("/digipet/ignore");
    expect(response.body.digipet).toHaveProperty("happiness", 20);
    expect(response.body.digipet).toHaveProperty("nutrition", 15);
    expect(response.body.digipet).toHaveProperty("discipline", 0);
  });

  test("2nd GET /digipet/ignore shows continued stats change", async () => {
    const response = await supertest(app).get("/digipet/ignore");
    expect(response.body.digipet).toHaveProperty("happiness", 10);
    expect(response.body.digipet).toHaveProperty("nutrition", 5);
    expect(response.body.digipet).toHaveProperty("discipline", 0);
  });

  test("3rd GET /digipet/ignore shows nutrition hitting a floor of 0", async () => {
    const response = await supertest(app).get("/digipet/ignore");
    expect(response.body.digipet).toHaveProperty("happiness", 0);
    expect(response.body.digipet).toHaveProperty("nutrition", 0);
    expect(response.body.digipet).toHaveProperty("discipline", 0);
  });

  test("4th GET /digipet/ignore shows no further increase in stats", async () => {
    const response = await supertest(app).get("/digipet/ignore");
    expect(response.body.digipet).toHaveProperty("happiness", 0);
    expect(response.body.digipet).toHaveProperty("nutrition", 0);
    expect(response.body.digipet).toHaveProperty("discipline", 0);
  });
});
