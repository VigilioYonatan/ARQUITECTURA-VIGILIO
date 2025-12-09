import enviroments from "./environments.config";

export const BASE_URL = () => enviroments().VITE_URL;

export const IP_CEAR = "170.0.234.103";
