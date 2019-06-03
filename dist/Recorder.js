"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
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
    storeCameraStream(camera, stream) {
        const date = moment_1.default().toDate();
        const entry = { date, stream };
        for (const storage of this.storages) {
            storage.store(camera, entry);
        }
    }
}
exports.default = Recorder;
//# sourceMappingURL=Recorder.js.map