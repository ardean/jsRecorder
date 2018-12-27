/// <reference types="node" />
import { ChildProcess } from "child_process";
declare type InputFormat = "copy" | "h264";
export declare type OutputFormat = "mp2" | "mp3" | "mpegts" | "mpeg" | "avi" | "flv" | "webm" | "h264" | "matroska";
declare type SegmentOutputFormat = "hls";
interface Options {
    debug?: boolean;
}
export default class FFMPEG {
    private options;
    private inputFormat;
    private input;
    private videoFilters;
    private audioFilters;
    private audioDisabled;
    private process;
    constructor(options?: Options);
    inputUrl(input: string): this;
    inputStream(inputFormat: InputFormat, stream: NodeJS.ReadableStream): this;
    videoFilter(videoFilter: string): this;
    disableAudio(): this;
    audioFilter(audioFilter: string): this;
    run(outputArgs: string[]): ChildProcess;
    outputFolder(outputFormat: OutputFormat | SegmentOutputFormat, folderPath: string): ChildProcess;
    outputStream(outputFormat: OutputFormat): import("stream").Readable;
    pipe(outputFormat: OutputFormat, stream: NodeJS.WritableStream): NodeJS.WritableStream;
    stop(): void;
}
export {};
