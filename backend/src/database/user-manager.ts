import path from "path";

import type { User } from "../types/user";
import { emailRegex, uzPhoneRegex } from "../utils/common-regex";

import { JsonDBManager } from "./json-manager";

type Users = User[];
type UserFilter = Partial<User>;

class UserManager {
  protected jsonFilePath: string = path.resolve(
    __dirname,
    "./raw-data/users.json"
  );
  public users: Users;
  private static _userManager: UserManager;
  private readonly jsonManager: JsonDBManager<User>;

  private constructor() {
    this.jsonManager = new JsonDBManager(this.jsonFilePath);
    this.users = this.jsonManager.getJson();
  }

  private validateEmail(email?: string) {
    if (email && email.length <= 255 && emailRegex.test(email)) {
      return email;
    }
  }

  private validatePhone(phone?: number | string) {
    let strPhone;
    if (phone && uzPhoneRegex.test((strPhone = phone.toString()))) {
      return parseInt(strPhone.replace(/\D/g, ""), 10);
    }
  }

  public filterUsers(filter?: UserFilter) {
    const users = this.users;
    if (!filter) return users;
    const filterArray = Object.entries(filter);
    if (!filterArray.length) return users;
    const cleanedArray = filterArray.filter(
      ([_, value]) => value || value === 0
    );
    if (!cleanedArray.length) return [];
    return users.filter((user) => {
      return cleanedArray.every(
        ([key, value]) => user[key as keyof User] === value
      );
    });
  }

  public searchUsers(email?: string, phone?: number | string): Users {
    if (!(email || phone)) return this.users;

    const cleanedEmail = this.validateEmail(email);
    const cleanedPhone = this.validatePhone(phone);

    return this.filterUsers({
      email: cleanedEmail,
      phone: cleanedPhone,
    });
  }

  public static getManager(): UserManager {
    return this._userManager || (this._userManager = new UserManager());
  }
}

export const userManager = UserManager.getManager();
