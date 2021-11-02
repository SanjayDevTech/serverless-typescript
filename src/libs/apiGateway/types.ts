export type ApiResponse<T extends any> = {
  status: boolean;
  error?: string | null;
  data?: T | null;
};
