export type ListResponse<T = unknown> = {
  count: number;
  results: T[];
};
