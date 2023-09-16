import chai from "chai";
import supertest from "supertest";
import config from "../config/config.js";

const { API_URL, API_VERSION } = config;

const expect = chai.expect;
const requester = supertest(`${API_URL}`);

const disposableUser = {
  email: "dispose@user.com",
  password: "123",
  role: "ADMIN",
};

describe("Session endpoint testing", () => {
  let cookie;
  let userId;

  describe("Testing ADMIN level access", () => {
    it("I can register", async () => {
      const registerResponse = await requester.post("/session/register").send({
        first_name: "Testing",
        last_name: "User",
        age: 40,
        ...disposableUser,
      });
      expect(registerResponse.statusCode).to.be.eql(204);
      const cookieResult = registerResponse.headers["set-cookie"];
      expect(cookieResult).to.be.ok;
      expect(cookieResult.length).to.be.above(0);
      const authCookie = cookieResult[0].split("=");
      expect(authCookie.length).to.be.above(0);
      expect(authCookie[0]).to.be.ok.and.eql("eCommerceCookieToken");
      expect(authCookie[1]).to.be.ok;
    });

    it("I can login", async () => {
      const loginResponse = await requester
        .post("/session/login")
        .send({ email: disposableUser.email, password: disposableUser.password });
      expect(loginResponse.statusCode).to.be.eql(204);
      const cookieResult = loginResponse.headers["set-cookie"];
      expect(cookieResult).to.be.ok;
      expect(cookieResult.length).to.be.above(0);
      const authCookie = cookieResult[0].split("=");
      expect(authCookie.length).to.be.above(0);
      expect(authCookie[0]).to.be.ok.and.eql("eCommerceCookieToken");
      expect(authCookie[1]).to.be.ok;
      cookie = { name: authCookie[0], value: authCookie[1] };
    });

    it("I can get my user information", async () => {
      const { statusCode, ok, _body } = await requester
        .get("/session")
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);
      expect(statusCode).to.be.eql(200);
      expect(_body.userId).to.be.ok;
      userId = _body.userId;
    });

    it("I can delete a user", async () => {
      const { statusCode, ok, _body } = await requester
        .delete(`/session/remove/${userId}`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);
      expect(statusCode).to.equal(204);
    });
  });
});
