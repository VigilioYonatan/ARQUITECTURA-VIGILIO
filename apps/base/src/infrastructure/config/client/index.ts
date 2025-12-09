import enviroments from "./environments.config";

export const BASE_URL = (): string => enviroments.VITE_URL;
