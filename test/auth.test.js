const auth = require("../service/auth"); 
const repo = require("../repo/auth");
const jwt = require("jsonwebtoken");
const errExep = require("../errExep");

jest.mock("../repo/auth");
jest.mock("jsonwebtoken");

const { root, jwt: jwtConf } = require("../config.load");

describe("Auth Service", () => {

  // ---------------------------
  // CREATE
  // ---------------------------
  test("create(): role invalid", async () => {
    await expect(auth.create("u", "p", 99))
      .rejects.toThrow(errExep.ROLE_INVALID);
  });

  test("create(): duplicate username", async () => {
    repo.create.mockRejectedValue({ code: "ER_DUP_ENTRY" });

    await expect(auth.create("u", "p", 1))
      .rejects.toThrow(errExep.USER_USED);
  });

  test("create(): success", async () => {
    repo.create.mockResolvedValue(10);

    const result = await auth.create("user", "pass", 1);
    expect(result).toEqual({ id: 10, username: "user", role: 1 });
  });

  // ---------------------------
  // LOGIN
  // ---------------------------
  test("login(): root wrong password", async () => {
    await expect(auth.login(root.username, "wrong"))
      .rejects.toThrow(errExep.PASSWORD_INVALID);
  });

  test("login(): root success", async () => {
    const token = "signedToken";
    jwt.sign.mockReturnValue(token);

    const result = await auth.login(root.username, root.password);

    expect(result.token).toBe(token);
    expect(result.payload).toEqual({
      id: -1,
      username: root.username,
      role: 0
    });
  });

  test("login(): user not found", async () => {
    repo.get_by_username.mockResolvedValue([]);

    await expect(auth.login("abc", "123"))
      .rejects.toThrow(errExep.USER_NOT_FOUND);
  });

  test("login(): password invalid", async () => {
    repo.get_by_username.mockResolvedValue([
      { id: 1, password: "555", role: 1 }
    ]);

    await expect(auth.login("abc", "123"))
      .rejects.toThrow(errExep.PASSWORD_INVALID);
  });

  test("login(): success", async () => {
    repo.get_by_username.mockResolvedValue([
      { id: 20, password: "999", role: 1 }
    ]);
    jwt.sign.mockReturnValue("token123");

    const result = await auth.login("abc", "999");

    expect(result.payload).toEqual({
      id: 20,
      username: "abc",
      role: 1
    });
    expect(result.token).toBe("token123");
  });

  // ---------------------------
  // ME
  // ---------------------------
  test("me(): token invalid", async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("invalid");
    });

    await expect(auth.me("badtoken"))
      .rejects.toThrow(errExep.TOKEN_INVALID);
  });

  test("me(): user not found", async () => {
    jwt.verify.mockReturnValue({ id: 10, username: "user" });
    repo.get_by_id.mockResolvedValue([]);

    await expect(auth.me("token"))
      .rejects.toThrow(errExep.USER_NOT_FOUND);
  });

  test("me(): success", async () => {
    jwt.verify.mockReturnValue({ id: 10, username: "user" });
    repo.get_by_id.mockResolvedValue([{ id: 10 }]);

    const result = await auth.me("token");
    expect(result).toEqual({ id: 10, username: "user" });
  });

  // ---------------------------
  // LISTING + REMOVE
  // ---------------------------
  test("listing(): success", async () => {
    repo.listing.mockResolvedValue([1, 2, 3]);

    const result = await auth.listing();
    expect(result).toEqual([1, 2, 3]);
  });

  test("remove(): success", async () => {
    repo.remove_by_id.mockResolvedValue(true);

    const result = await auth.remove(99);
    expect(result).toBe(true);
  });

});
