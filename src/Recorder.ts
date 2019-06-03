import moment from "moment";
import Camera, { CameraOptions } from "./Camera";
import FolderStorage from "./storages/FolderStorage";
import Storage, { StorageEntry } from "./storages/Storage";

export interface RecorderCameraOptions extends CameraOptions {
  livestreamFolder?: string;
}

export type StorageOption = string | Storage;

export default class Recorder {
  private cameraOptions: RecorderCameraOptions[];
  private cameras: Camera[];
  private storages: Storage[];

  constructor(cameraOptions: RecorderCameraOptions[], storageOptions: StorageOption[] = [""]) {
    this.cameraOptions = cameraOptions;
    this.cameras = cameraOptions.map(x => new Camera(x));
    this.storages = storageOptions.map(x => typeof x === "string" ? new FolderStorage(x ? x : undefined) : x);
  }

  start() {
    for (const camera of this.cameras) {
      const stream = camera.streamMotion();
      this.storeCameraStream(camera, stream);

      const index = this.cameras.indexOf(camera);
      const cameraOptions = this.cameraOptions[index];
      if (cameraOptions && cameraOptions.livestreamFolder) {
        camera.serveHLS(cameraOptions.livestreamFolder);
      }
    }
  }

  restart() {
    for (const camera of this.cameras) {
      camera.stopMotion();
      const stream = camera.streamMotion();
      this.storeCameraStream(camera, stream);
    }
  }

  stop() {
    for (const camera of this.cameras) {
      camera.stopMotion();
    }
  }

  storeCameraStream(camera: Camera, stream: NodeJS.ReadableStream) {
    const date = moment().toDate();
    const entry: StorageEntry = { date, stream };
    for (const storage of this.storages) {
      storage.store(camera, entry);
    }
  }
}