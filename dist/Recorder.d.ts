import Camera, { CameraOptions } from "./Camera";
import Storage, { StorageEntry } from "./storages/Storage";
export interface RecorderCameraOptions extends CameraOptions {
    livestreamFolder?: string;
}
export declare type StorageOption = string | Storage;
export default class Recorder {
    private cameraOptions;
    private cameras;
    private storages;
    constructor(cameraOptions: RecorderCameraOptions[], storageOptions?: StorageOption[]);
    start(): void;
    startCamera(camera: Camera): void;
    restart(): void;
    restartCamera(camera: Camera): void;
    stop(): void;
    stopCamera(camera: Camera): void;
    watchStream(camera: Camera, entry: StorageEntry): void;
    storeCameraStream(camera: Camera, entry: StorageEntry): void;
    cleanupStorage(camera: Camera, entry: StorageEntry): void;
}
