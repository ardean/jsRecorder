"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const through2_1 = __importDefault(require("through2"));
const logger_1 = __importDefault(require("./services/logger"));
const Camera_1 = __importDefault(require("./Camera"));
const FolderStorage_1 = __importDefault(require("./storages/FolderStorage"));
class Recorder {
    constructor(cameraOptions, storageOptions = [""]) {
        this.cameraOptions = cameraOptions;
        this.cameras = cameraOptions.map(x => new Camera_1.default(x));
        this.storages = storageOptions.map(x => typeof x === "string" ? new FolderStorage_1.default(x ? x : undefined) : x);
    }
    start() {
        for (const camera of this.cameras) {
            this.startCamera(camera);
        }
    }
    startCamera(camera) {
        const stream = camera.streamMotion();
        const date = moment_1.default().toDate();
        const entry = { date, stream };
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
    restartCamera(camera) {
        this.stopCamera(camera);
        this.startCamera(camera);
    }
    stop() {
        for (const camera of this.cameras) {
            this.stopCamera(camera);
        }
    }
    stopCamera(camera) {
        camera.stopMotion();
    }
    watchStream(camera, entry) {
        entry.stream.once("close", () => {
            if (camera.mode === "stopped")
                this.cleanupStorage(camera, entry);
            camera.mode = "failed";
            logger_1.default.error("camera stream closed!");
            setTimeout(() => {
                this.restartCamera(camera);
            }, camera.nextRetryTimeout());
        });
        entry.stream = entry.stream.pipe(through2_1.default((chunk, enc, next) => {
            camera.setStreamingMode();
            next(null, chunk);
        }));
    }
    storeCameraStream(camera, entry) {
        for (const storage of this.storages) {
            storage.store(camera, entry);
        }
    }
    cleanupStorage(camera, entry) {
        for (const storage of this.storages) {
            storage.cleanup(camera, entry);
        }
    }
}
exports.default = Recorder;
//# sourceMappingURL=Recorder.js.map