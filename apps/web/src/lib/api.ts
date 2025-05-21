export const api = {
  get: async (url: string) => {
    console.log(`Hello from API GET: ${url}`);
    return { success: true, data: {} };
  },
  post: async (url: string, data: any) => {
    console.log(`Hello from API POST: ${url}`, data);
    return { success: true, data: {} };
  },
}; 