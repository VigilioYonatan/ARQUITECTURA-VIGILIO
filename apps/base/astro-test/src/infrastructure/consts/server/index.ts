import environments from "@infrastructure/config/server/environments.config";

export const BASE_URL = () => environments().PUBLIC_URL;

/** entities  */
export type UploadEntities = "user" | "file";
export const UPLOAD_ENTITES: UploadEntities[] = ["user", "file"];

/**** properties about entities *****/
export type UploadProperties = "photo" | "file";
export const UPLOADS_PROPERTIES: UploadProperties[] = ["photo", "file"];
