import { expect } from "chai";

export async function loginAndGetCookie(requester) {
  const loginResponse = await requester.post("/session/login").send({ email: "test@test.com", password: "123" });
  const cookieResult = loginResponse.headers["set-cookie"];
  expect(cookieResult).to.be.ok;
  expect(cookieResult.length).to.be.above(0);
  const authCookie = cookieResult[0].split("=");
  expect(authCookie.length).to.be.above(0);
  expect(authCookie[0]).to.be.ok.and.eql("eCommerceCookieToken");
  expect(authCookie[1]).to.be.ok;
  return { name: authCookie[0], value: authCookie[1] };
}
