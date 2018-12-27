/// <reference types="node" />
import Camera from "../Camera";
export interface StorageEntry {
    date: Date;
    stream: NodeJS.ReadableStream;
}
export default interface Storage {
    store(camera: Camera, entry: StorageEntry): Promise<void> | void;
    list(camera: Camera): Promise<StorageEntry[]> | StorageEntry[];
}
