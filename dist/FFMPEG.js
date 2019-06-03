"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const which_1 = __importDefault(require("which"));
const mkdirp_1 = __importDefault(require("mkdirp"));
const child_process_1 = require("child_process");
const FFMPEG_PATH = which_1.default.sync("ffmpeg", { nothrow: true });
if (!FFMPEG_PATH)
    throw new Error("FFMPEG_NOT_FOUND");
class FFMPEG {
    constructor(options = {}) {
        this.videoFilters = [];
        this.audioFilters = [];
        this.audioDisabled = false;
        this.options = options;
    }
    inputUrl(input) {
        this.input = input;
        return this;
    }
    transportType(transportType) {
        this.transportTypeInput = transportType;
    }
    inputStream(inputFormat, stream) {
        this.inputFormat = inputFormat;
        this.input = stream;
        return this;
    }
    videoFilter(videoFilter) {
        this.videoFilters.push(videoFilter);
        return this;
    }
    disableAudio() {
        this.audioDisabled = true;
        return this;
    }
    audioFilter(audioFilter) {
        this.audioFilters.push(audioFilter);
        return this;
    }
    run(outputArgs) {
        const { debug } = this.options;
        const inputArgs = [];
        if (this.transportTypeInput)
            inputArgs.push("-rtsp_transport", this.transportTypeInput.toLowerCase());
        if (typeof this.input === "string") {
            inputArgs.push(`-i`, this.input);
        }
        else {
            inputArgs.push(`-i`, `pipe:0`);
        }
        if (this.inputFormat) {
            inputArgs.push(`-c:v`, this.inputFormat);
        }
        const audioFiltersArgs = [];
        if (this.audioFilters.length > 0) {
            audioFiltersArgs.push("-af", this.audioFilters.map(x => x.replace(/,/ig, "\\,")).join(","));
        }
        const videoFiltersArgs = [];
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
        if (debug)
            console.log(`${FFMPEG_PATH} ${args.join(" ")}`);
        const process = child_process_1.spawn(FFMPEG_PATH, args);
        process.on("error", err => {
            console.error(err);
        });
        process.stderr.on("data", err => {
            if (debug)
                console.log(err.toString());
        });
        if (typeof this.input !== "string")
            this.input.pipe(process.stdin);
        this.process = process;
        return process;
    }
    outputFolder(outputFormat, folderPath) {
        mkdirp_1.default.sync(folderPath);
        const options = [];
        if (outputFormat === "hls") {
            options.push("-start_number", "0", "-hls_time", "10", "-hls_list_size", "6", "-hls_wrap", "3");
            folderPath = path_1.default.resolve(`${folderPath}/index.m3u8`);
        }
        return this.run([
            ...options,
            folderPath
        ]);
    }
    outputStream(outputFormat) {
        const process = this.run([`-f`, outputFormat, `pipe:1`]);
        return process.stdout;
    }
    pipe(outputFormat, stream) {
        return this.outputStream(outputFormat).pipe(stream);
    }
    stop() {
        this.process.emit("SIGINT");
    }
}
exports.default = FFMPEG;
//# sourceMappingURL=FFMPEG.js.map