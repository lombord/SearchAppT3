import { Router } from "express";

import { userManager } from "../database/user-manager";
import type { UserListResponse } from "../types/user";

const router = Router();

const ensureString = (value: any): string =>
  typeof value === "string" ? value : "";

router.get("/", (req, res) => {
  const email = req.query.email;
  const phone = req.query.phone;

  const users = userManager.searchUsers(
    ensureString(email),
    ensureString(phone)
  );
  const respData: UserListResponse = {
    count: users.length,
    results: users,
  };
  res.send(respData);
});

export default router;
