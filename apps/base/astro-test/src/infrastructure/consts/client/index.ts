import enviroments from "@infrastructure/config/client/environments.config";

export const BASE_URL = (): string => enviroments.PUBLIC_URL;
