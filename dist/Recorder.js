"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const Camera_1 = require("./Camera");
const FolderStorage_1 = require("./storages/FolderStorage");
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
        const date = moment().toDate();
        const entry = { date, stream };
        for (const storage of this.storages) {
            storage.store(camera, entry);
        }
    }
}
exports.default = Recorder;
//# sourceMappingURL=Recorder.js.map