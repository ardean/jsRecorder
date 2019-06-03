import { RecorderCameraOptions, StorageOption } from "../Recorder";
export interface Config {
    environment: "production" | "development";
    cameras: RecorderCameraOptions[];
    storageOptions: StorageOption[];
}
export declare const init: () => Config;
export declare const write: (config: Config) => Config;
export declare const read: () => Config;
export declare const exists: () => boolean;
