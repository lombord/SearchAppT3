import type { RequestHandler } from "express";

const simulateLongResponse: RequestHandler = async (req, res, next) => {
  await new Promise((r) => setTimeout(r, 5e3));
  next();
};

const middlewares: RequestHandler[] = [simulateLongResponse];

export default middlewares;
