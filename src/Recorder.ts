import moment from "moment";
import through from "through2";
import logger from "./services/logger";
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
      this.startCamera(camera);
    }
  }

  startCamera(camera: Camera) {
    const stream = camera.streamMotion();

    const date = moment().toDate();
    const entry: StorageEntry = { date, stream };
    this.watchStream(camera, entry);
    this.storeCameraStream(camera, entry);

    const index = this.cameras.indexOf(camera);
    const cameraOptions = this.cameraOptions[index];
    if (cameraOptions && cameraOptions.livestreamFolder) {
      camera.serveHLS(cameraOptions.livestreamFolder);
    }
  }

  restart() {
    for (const camera of this.cameras) {
      this.restartCamera(camera);
    }
  }

  restartCamera(camera: Camera) {
    this.stopCamera(camera);
    this.startCamera(camera);
  }

  stop() {
    for (const camera of this.cameras) {
      this.stopCamera(camera);
    }
  }

  stopCamera(camera: Camera) {
    camera.stopMotion();
  }

  watchStream(camera: Camera, entry: StorageEntry) {
    entry.stream.once("close", () => {
      if (camera.mode === "stopped") this.cleanupStorage(camera, entry);
      camera.mode = "failed";
      logger.error("camera stream closed!");

      const timeout = camera.nextRetryTimeout();
      logger.info(`retry in ${(timeout / 1000 / 60).toFixed(1)} minutes`);
      setTimeout(() => {
        this.restartCamera(camera);
      }, timeout);
    });
    entry.stream = entry.stream.pipe(through((chunk, enc, next) => {
      camera.setStreamingMode();
      next(null, chunk);
    }));
  }

  storeCameraStream(camera: Camera, entry: StorageEntry) {
    for (const storage of this.storages) {
      storage.store(camera, entry);
    }
  }

  cleanupStorage(camera: Camera, entry: StorageEntry) {
    for (const storage of this.storages) {
      storage.cleanup(camera, entry);
    }
  }
}