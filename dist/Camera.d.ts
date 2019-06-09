/// <reference types="node" />
import FFMPEG, { OutputFormat, TransportType } from "./FFMPEG";
export interface CameraOptions {
    id: string;
    url: string;
    name?: string;
    disableAudio?: boolean;
    transportType?: TransportType;
}
export default class Camera {
    id: string;
    url: string;
    name?: string;
    retryIndex: number;
    disableAudio?: boolean;
    transportType?: TransportType;
    mode: "stopped" | "failed" | "streaming";
    ffmpegMotion: FFMPEG;
    ffmpegHLS: FFMPEG;
    constructor(options: CameraOptions);
    streamMotion(outputFormat?: OutputFormat, sensitivity?: number): import("stream").Readable;
    stopMotion(): void;
    serveHLS(folderPath: string): import("child_process").ChildProcessWithoutNullStreams;
    stopHLS(): void;
    applyTimestamp(ffmpeg: FFMPEG): void;
    applyDisableAudio(ffmpeg: FFMPEG): void;
    applyMotionFilter(ffmpeg: FFMPEG, sensitivity?: number): void;
    nextRetryTimeout(): number;
    resetRetryIndex(): void;
    setStreamingMode(): void;
}
