import chai from "chai";
import supertest from "supertest";
import config from "../config/config.js";
import { loginAndGetCookie } from "../utils/testingLoginHelper.js";

const { API_URL, API_VERSION } = config;

const expect = chai.expect;
const requester = supertest(`${API_URL}`);

describe("Cart endpoint testing", () => {
  let cookie;

  before(async () => {
    cookie = await loginAndGetCookie(requester);
  });

  describe("Testing ADMIN level access", () => {
    it("I need to be authenticated", async () => {
      const { statusCode, ok, _body } = await requester.get(`/api/${API_VERSION}/cart`);
      expect(statusCode).not.to.equal(200);
    });
    let cartId;
    it("I can create a cart", async () => {
      const { statusCode, ok, _body } = await requester
        .post(`/api/${API_VERSION}/cart`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);

      expect(statusCode).to.equal(200);
    });
    it("I can get my cart from the database", async () => {
      const { statusCode, ok, _body } = await requester
        .get(`/api/${API_VERSION}/cart`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);
      expect(statusCode).to.equal(200);
      expect(_body.status).to.be.ok.and.eql("success");
      expect(_body.payload).to.be.ok.and.to.be.an("array").length.above(0);
      cartId = _body.payload[0]._id;
    });
    it("I can insert a product by id", async () => {
      const { statusCode, ok, _body } = await requester
        .post(`/api/${API_VERSION}/cart/${cartId}/product/64d919672b7197857668852f`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);
      expect(statusCode).to.equal(200);
    });
    it("I can delete a cart", async () => {
      const { statusCode, ok, _body } = await requester
        .delete(`/api/${API_VERSION}/cart/${cartId}/removeCart`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);
      expect(statusCode).to.equal(204);
    });
  });
});
