"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const moment_1 = __importDefault(require("moment"));
const mkdirp_1 = __importDefault(require("mkdirp"));
class FolderStorage {
    constructor(baseFolder = "./storage") {
        this.baseFolder = baseFolder;
    }
    store(camera, entry) {
        const { date, stream } = entry;
        const momentDate = moment_1.default(date);
        const cameraFolder = `${this.baseFolder}/${camera.id}`;
        const folderPath = `${cameraFolder}/${momentDate.format("YYYY-MM-DD")}`;
        mkdirp_1.default.sync(folderPath);
        const filePath = `${folderPath}/${momentDate.format("HH-mm-ss")}.mp4`;
        stream.pipe(fs_1.default.createWriteStream(filePath));
    }
    list(camera) {
        return [];
    }
}
exports.default = FolderStorage;
//# sourceMappingURL=FolderStorage.js.map