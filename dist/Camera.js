"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const logger_1 = __importDefault(require("./services/logger"));
const configService = __importStar(require("./services/config"));
const FFMPEG_1 = __importDefault(require("./FFMPEG"));
const openSansPath = path_1.default.resolve(path_1.default.dirname(require.resolve("npm-font-open-sans/package.json")), "fonts/Regular/OpenSans-Regular.ttf");
class Camera {
    constructor(options) {
        this.retryIndex = 0;
        this.mode = "stopped";
        this.id = options.id;
        this.name = options.name;
        this.url = options.url;
        this.disableAudio = options.disableAudio;
        this.transportType = options.transportType;
    }
    streamMotion(outputFormat = "mpegts", sensitivity) {
        this.ffmpegMotion = new FFMPEG_1.default({
            debug: configService.read().environment === "development"
        })
            .inputUrl(this.url);
        if (this.transportType)
            this.ffmpegMotion.transportType(this.transportType);
        this.applyMotionFilter(this.ffmpegMotion, sensitivity);
        this.applyDisableAudio(this.ffmpegMotion);
        this.applyTopLeftText(this.ffmpegMotion, `${this.name ? this.name + " / " : ""}%{localtime}`);
        return this.ffmpegMotion.outputStream(outputFormat);
    }
    stopMotion() {
        this.ffmpegMotion.stop();
    }
    serveHLS(folderPath) {
        this.ffmpegHLS = new FFMPEG_1.default()
            .inputUrl(this.url);
        this.applyDisableAudio(this.ffmpegHLS);
        this.applyTopLeftText(this.ffmpegHLS, `${this.name ? this.name + " / " : ""}%{localtime}`);
        return this.ffmpegHLS.outputFolder("hls", folderPath);
    }
    stopHLS() {
        this.ffmpegHLS.stop();
    }
    applyTopLeftText(ffmpeg, text) {
        ffmpeg.videoFilter(`drawtext=fontfile='${openSansPath}':text='${text}':fontcolor=white@0.8:x=3:y=3:box=1:boxcolor=black:borderw=3`);
    }
    applyDisableAudio(ffmpeg) {
        if (this.disableAudio)
            ffmpeg.disableAudio();
    }
    applyMotionFilter(ffmpeg, sensitivity = 0.01) {
        ffmpeg
            .videoFilter(`select=gt(scene,${sensitivity})`)
            .videoFilter("setpts=N/(5*TB)");
    }
    nextRetryTimeout() {
        return Math.min((1.5 * this.retryIndex++) * 30 * 1000, 24 * 60 * 60 * 1000);
    }
    resetRetryIndex() {
        if (this.retryIndex !== 0)
            this.retryIndex = 0;
    }
    setStreamingMode() {
        if (this.mode === "streaming")
            return;
        this.mode = "streaming";
        this.resetRetryIndex();
        logger_1.default.info("stream started");
    }
}
exports.default = Camera;
//# sourceMappingURL=Camera.js.map