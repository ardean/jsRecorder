import Camera from "../Camera";
import Storage, { StorageEntry } from "./Storage";
export default class FolderStorage implements Storage {
    private baseFolder;
    constructor(baseFolder?: string);
    store(camera: Camera, entry: StorageEntry): void;
    list(camera: Camera): any[];
}
