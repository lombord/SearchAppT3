import type { ListResponse } from "./response";

export interface User {
  email: string;
  phone: number;
}

export type UserListResponse = ListResponse<User>;
