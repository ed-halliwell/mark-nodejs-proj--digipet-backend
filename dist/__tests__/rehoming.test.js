"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const model_1 = require("../digipet/model");
const server_1 = __importDefault(require("../server"));
describe("User can rehome their digipet and be left with no digipet.", () => {
    beforeAll(() => {
        // setup: give an initial digipet
        const startingDigipet = {
            happiness: 30,
            nutrition: 25,
            discipline: 10,
        };
        model_1.setDigipet(startingDigipet);
    });
    test("GET /digipet informs them that they have a digipet with expected stats", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet");
        expect(response.body.message).toMatch(/your digipet/i);
        expect(response.body.digipet).toHaveProperty("happiness", 30);
        expect(response.body.digipet).toHaveProperty("nutrition", 25);
        expect(response.body.digipet).toHaveProperty("discipline", 10);
    }));
    test("1st GET /digipet/rehome informs them that they have rehomed their digipet and have no digipet left.", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/rehome");
        expect(response.body.message).toMatch(/rehomed/i);
        expect(response.body.digipet).toBeNull();
    }));
    test("2nd GET /digipet now informs them that they don't currently have a digipet", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet");
        expect(response.body.message).toMatch(/don't have/i);
        expect(response.body.digipet).not.toBeDefined();
    }));
    test("2nd GET /digipet/rehome now informs them that they can't rehome a digipet if they don't have one", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default).get("/digipet/rehome");
        expect(response.body.message).not.toMatch(/success/i);
        expect(response.body.message).toMatch(/don't have a digipet to rehome/i);
    }));
});
