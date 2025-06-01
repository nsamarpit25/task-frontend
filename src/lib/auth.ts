export const saveToken = (token: string) => {
   localStorage.setItem("token", token);
};

export const getToken = (): string | null => {
   return typeof window !== "undefined" ? localStorage.getItem("token") : null;
};

export const clearToken = () => {
   localStorage.removeItem("token");
};
