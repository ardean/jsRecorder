/// <reference types="node" />
declare type InputFormat = "copy" | "h264";
export declare type OutputFormat = "mp2" | "mp3" | "mpegts" | "mpeg" | "avi" | "flv" | "webm" | "h264" | "matroska";
declare type SegmentOutputFormat = "hls";
export declare type TransportType = "TCP" | "UDP";
interface Options {
    debug?: boolean;
}
export default class FFMPEG {
    private options;
    private inputFormat;
    private input;
    private transportTypeInput;
    private videoFilters;
    private audioFilters;
    private audioDisabled;
    private process;
    constructor(options?: Options);
    inputUrl(input: string): this;
    transportType(transportType: TransportType): void;
    inputStream(inputFormat: InputFormat, stream: NodeJS.ReadableStream): this;
    videoFilter(videoFilter: string): this;
    disableAudio(): this;
    audioFilter(audioFilter: string): this;
    run(outputArgs: string[]): import("child_process").ChildProcessWithoutNullStreams;
    outputFolder(outputFormat: OutputFormat | SegmentOutputFormat, folderPath: string): import("child_process").ChildProcessWithoutNullStreams;
    outputStream(outputFormat: OutputFormat): import("stream").Readable;
    pipe(outputFormat: OutputFormat, stream: NodeJS.WritableStream): NodeJS.WritableStream;
    stop(): void;
}
export {};
