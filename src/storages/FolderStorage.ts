import fs from "fs";
import moment from "moment";
import mkdirp from "mkdirp";
import Camera from "../Camera";
import Storage, { StorageEntry } from "./Storage";

export default class FolderStorage implements Storage {
  constructor(
    private baseFolder: string = "./storage"
  ) { }

  store(camera: Camera, entry: StorageEntry) {
    const { date, stream } = entry;
    const momentDate = moment(date);

    const cameraFolder = `${this.baseFolder}/${camera.id}`;
    const folderPath = `${cameraFolder}/${momentDate.format("YYYY-MM-DD")}`;
    mkdirp.sync(folderPath);

    const filePath = `${folderPath}/${momentDate.format("HH-mm-ss")}.mp4`;
    stream.pipe(fs.createWriteStream(filePath));
  }

  list(camera: Camera) {
    return [];
  }
}