import fs from "fs";
import path from "path";
import moment from "moment";
import mkdirp from "mkdirp";
import Camera from "../Camera";
import Storage, { StorageEntry } from "./Storage";

export default class FolderStorage implements Storage {
  constructor(
    private baseFolder: string = "./storage"
  ) { }

  store(camera: Camera, entry: StorageEntry) {
    const { stream } = entry;

    const filename = this.getFilename(camera, entry);
    mkdirp.sync(path.dirname(filename));
    stream.pipe(fs.createWriteStream(filename));
  }

  getFolder(camera: Camera, entry: StorageEntry) {
    return `${this.baseFolder}/${camera.id}/${moment(entry.date).format("YYYY-MM-DD")}`;
  }

  getFilename(camera: Camera, entry: StorageEntry) {
    return `${this.getFolder(camera, entry)}/${moment(entry.date).format("HH-mm-ss")}.mp4`;
  }

  list(camera: Camera) {
    return [];
  }

  cleanup(camera: Camera, entry: StorageEntry) {
    const filename = this.getFilename(camera, entry);
    fs.unlinkSync(filename);
  }
}