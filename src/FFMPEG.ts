import path from "path";
import which from "which";
import mkdirp from "mkdirp";
import { spawn, ChildProcess } from "child_process";

const FFMPEG_PATH = which.sync("ffmpeg", { nothrow: true });
if (!FFMPEG_PATH) throw new Error("FFMPEG_NOT_FOUND");

type InputFormat = "copy" | "h264";
export type OutputFormat = "mp2" | "mp3" | "mpegts" | "mpeg" | "avi" | "flv" | "webm" | "h264" | "matroska";
type SegmentOutputFormat = "hls";

type Input = string | NodeJS.ReadableStream;

export type TransportType = "TCP" | "UDP";

interface Options {
  debug?: boolean;
}

export default class FFMPEG {
  private options: Options;
  private inputFormat: InputFormat;
  private input: Input;
  private transportTypeInput: TransportType;
  private videoFilters: string[] = [];
  private audioFilters: string[] = [];
  private audioDisabled: boolean = false;
  private process: ChildProcess;

  constructor(options: Options = {}) {
    this.options = options;
  }

  inputUrl(input: string) {
    this.input = input;
    return this;
  }

  transportType(transportType: TransportType) {
    this.transportTypeInput = transportType;
  }

  inputStream(inputFormat: InputFormat, stream: NodeJS.ReadableStream) {
    this.inputFormat = inputFormat;
    this.input = stream;
    return this;
  }

  videoFilter(videoFilter: string) {
    this.videoFilters.push(videoFilter);
    return this;
  }

  disableAudio() {
    this.audioDisabled = true;
    return this;
  }

  audioFilter(audioFilter: string) {
    this.audioFilters.push(audioFilter);
    return this;
  }

  run(outputArgs: string[]) {
    const { debug } = this.options;

    const inputArgs: string[] = [];
    if (this.transportTypeInput) inputArgs.push("-rtsp_transport", this.transportTypeInput.toLowerCase());

    if (typeof this.input === "string") {
      inputArgs.push(`-i`, this.input);
    } else {
      inputArgs.push(`-i`, `pipe:0`);
    }

    if (this.inputFormat) {
      inputArgs.push(`-c:v`, this.inputFormat);
    }

    const audioFiltersArgs: string[] = [];
    if (this.audioFilters.length > 0) {
      audioFiltersArgs.push("-af", this.audioFilters.map(x => x.replace(/,/ig, "\\,")).join(","));
    }

    const videoFiltersArgs: string[] = [];
    if (this.videoFilters.length > 0) {
      videoFiltersArgs.push("-vf", this.videoFilters.map(x => x.replace(/,/ig, "\\,")).join(","));
    }

    const args = [
      ...inputArgs,
      ...audioFiltersArgs,
      ...videoFiltersArgs,
      ...(this.audioDisabled ? ["-an"] : []),
      ...outputArgs
    ];
    if (debug) console.log(`${FFMPEG_PATH} ${args.join(" ")}`);

    const process = spawn(FFMPEG_PATH, args);
    process.on("error", err => {
      console.error(err);
    });
    process.stderr.on("data", err => {
      if (debug) console.log(err.toString());
    });

    if (typeof this.input !== "string") this.input.pipe(process.stdin);

    this.process = process;
    return process;
  }

  outputFolder(outputFormat: OutputFormat | SegmentOutputFormat, folderPath: string) {
    mkdirp.sync(folderPath);

    const options = [];
    if (outputFormat === "hls") {
      options.push(
        "-start_number", "0",
        "-hls_time", "10",
        "-hls_list_size", "6",
        "-hls_wrap", "3"
      );
      folderPath = path.resolve(`${folderPath}/index.m3u8`);
    }

    return this.run([
      ...options,
      folderPath
    ]);
  }

  outputStream(outputFormat: OutputFormat) {
    const process = this.run([`-f`, outputFormat, `pipe:1`]);

    return process.stdout;
  }

  pipe(outputFormat: OutputFormat, stream: NodeJS.WritableStream) {
    return this.outputStream(outputFormat).pipe(stream);
  }

  stop() {
    this.process.emit("SIGINT");
  }
}