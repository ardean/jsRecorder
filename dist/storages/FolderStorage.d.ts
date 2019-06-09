import Camera from "../Camera";
import Storage, { StorageEntry } from "./Storage";
export default class FolderStorage implements Storage {
    private baseFolder;
    constructor(baseFolder?: string);
    store(camera: Camera, entry: StorageEntry): void;
    getFolder(camera: Camera, entry: StorageEntry): string;
    getFilename(camera: Camera, entry: StorageEntry): string;
    list(camera: Camera): any[];
    cleanup(camera: Camera, entry: StorageEntry): void;
}
