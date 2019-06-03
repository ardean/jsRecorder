/// <reference types="node" />
import Camera, { CameraOptions } from "./Camera";
import Storage from "./storages/Storage";
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
    restart(): void;
    stop(): void;
    storeCameraStream(camera: Camera, stream: NodeJS.ReadableStream): void;
}
