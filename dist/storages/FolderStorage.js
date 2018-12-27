"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const moment = require("moment");
const mkdirp = require("mkdirp");
class FolderStorage {
    constructor(baseFolder = "./storage") {
        this.baseFolder = baseFolder;
    }
    store(camera, entry) {
        const { date, stream } = entry;
        const momentDate = moment(date);
        const cameraFolder = `${this.baseFolder}/${camera.id}`;
        const folderPath = `${cameraFolder}/${momentDate.format("YYYY-MM-DD")}`;
        mkdirp.sync(folderPath);
        const filePath = `${folderPath}/${momentDate.format("HH-mm-ss")}.mp4`;
        stream.pipe(fs.createWriteStream(filePath));
    }
    list(camera) {
        return [];
    }
}
exports.default = FolderStorage;
//# sourceMappingURL=FolderStorage.js.map