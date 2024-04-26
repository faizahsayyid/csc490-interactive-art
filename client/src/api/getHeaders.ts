export const getHeaders = (): Record<string, string> => {
  return {
    Authorization: localStorage.getItem("token") ?? "",
  };
};
