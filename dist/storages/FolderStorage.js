"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const moment_1 = __importDefault(require("moment"));
const mkdirp_1 = __importDefault(require("mkdirp"));
class FolderStorage {
    constructor(baseFolder = "./storage") {
        this.baseFolder = baseFolder;
    }
    store(camera, entry) {
        const { stream } = entry;
        const filename = this.getFilename(camera, entry);
        mkdirp_1.default.sync(path_1.default.dirname(filename));
        stream.pipe(fs_1.default.createWriteStream(filename));
    }
    getFolder(camera, entry) {
        return `${this.baseFolder}/${camera.id}/${moment_1.default(entry.date).format("YYYY-MM-DD")}`;
    }
    getFilename(camera, entry) {
        return `${this.getFolder(camera, entry)}/${moment_1.default(entry.date).format("HH-mm-ss")}.mp4`;
    }
    list(camera) {
        return [];
    }
    cleanup(camera, entry) {
        const filename = this.getFilename(camera, entry);
        fs_1.default.unlinkSync(filename);
    }
}
exports.default = FolderStorage;
//# sourceMappingURL=FolderStorage.js.map