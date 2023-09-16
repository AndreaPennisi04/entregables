import chai from "chai";
import supertest from "supertest";
import config from "../config/config.js";
import { loginAndGetCookie } from "../utils/testingLoginHelper.js";

const { API_URL, API_VERSION } = config;

const expect = chai.expect;
const requester = supertest(`${API_URL}`);

describe("Product endpoint testing", () => {
  let cookie;

  before(async () => {
    cookie = await loginAndGetCookie(requester);
  });

  describe("Testing ADMIN level access", () => {
    it("I need to be authenticated", async () => {
      const { statusCode, ok, _body } = await requester.get(`/api/${API_VERSION}/product`);
      expect(statusCode).not.to.equal(200);
    });
    it("I can get all products from the database", async () => {
      const { statusCode, ok, _body } = await requester
        .get(`/api/${API_VERSION}/product`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);
      expect(statusCode).to.equal(200);
      expect(_body.status).to.be.ok.and.eql("success");
      expect(_body.payload).to.be.ok.and.to.be.an("array").length.above(0);
    });
    it("I can get a product by id", async () => {
      const { statusCode, ok, _body } = await requester
        .get(`/api/${API_VERSION}/product/64d919672b7197857668852f`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);
      expect(statusCode).to.equal(200);
      expect(_body.code).to.be.ok.and.eql(9);
    });
    let insertedProduct;
    it("I can insert a product", async () => {
      const { statusCode, ok, _body } = await requester
        .post(`/api/${API_VERSION}/product`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`])
        .send({
          title: "Kia EV6",
          description:
            "Kia electric vehicles, or EVs, run solely on electricity. This offers quiet operation, zero tailgate emissions and breath-taking performance.Electric vehicle technology has come on leaps and bounds. With technologies like our e-GMP platform, EVs can go long distances and charge in a matter of minutes thanks to a fast-expanding and easy-to-access network of public charging stations",
          price: 50000,
          thumbnail:
            "https://www.kia.com/content/dam/kwcms/kme/uk/en/assets/eco_refresh/infographics/images/cars/which-car-ev6.png",
          code: 777888,
          stock: "10",
        });
      expect(statusCode).to.equal(200);
      expect(_body.code).to.be.ok.and.eql(777888);
      insertedProduct = _body;
    });
    it("I can delete a product", async () => {
      const { statusCode, ok, _body } = await requester
        .delete(`/api/${API_VERSION}/product/${insertedProduct._id}`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);
      expect(statusCode).to.equal(204);
    });
  });
});
