/// <reference types="node" />
import FFMPEG, { OutputFormat } from "./FFMPEG";
export interface CameraOptions {
    id: string;
    url: string;
    name?: string;
    disableAudio?: boolean;
}
export default class Camera {
    id: string;
    name?: string;
    url: string;
    disableAudio: boolean;
    ffmpegMotion: FFMPEG;
    ffmpegHLS: FFMPEG;
    constructor(options: CameraOptions);
    streamMotion(outputFormat?: OutputFormat, sensitivity?: number): import("stream").Readable;
    stopMotion(): void;
    serveHLS(folderPath: string): import("child_process").ChildProcess;
    stopHLS(): void;
    applyTimestamp(ffmpeg: FFMPEG): void;
    applyDisableAudio(ffmpeg: FFMPEG): void;
}
