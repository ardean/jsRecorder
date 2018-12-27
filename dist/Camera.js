"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const FFMPEG_1 = require("./FFMPEG");
const openSansPath = path.resolve(path.dirname(require.resolve("npm-font-open-sans/package.json")), "fonts/Regular/OpenSans-Regular.ttf");
class Camera {
    constructor(options) {
        this.id = options.id;
        this.name = options.name;
        this.url = options.url;
        this.disableAudio = options.disableAudio;
    }
    streamMotion(outputFormat = "mpegts", sensitivity = 0.01) {
        this.ffmpegMotion = new FFMPEG_1.default()
            .inputUrl(this.url)
            .videoFilter(`select=gt(scene,${sensitivity})`)
            .videoFilter("setpts=N/(5*TB)");
        this.applyDisableAudio(this.ffmpegMotion);
        this.applyTimestamp(this.ffmpegMotion);
        return this.ffmpegMotion.outputStream(outputFormat);
    }
    stopMotion() {
        this.ffmpegMotion.stop();
    }
    serveHLS(folderPath) {
        this.ffmpegHLS = new FFMPEG_1.default()
            .inputUrl(this.url);
        this.applyDisableAudio(this.ffmpegHLS);
        this.applyTimestamp(this.ffmpegHLS);
        return this.ffmpegHLS.outputFolder("hls", folderPath);
    }
    stopHLS() {
        this.ffmpegHLS.stop();
    }
    applyTimestamp(ffmpeg) {
        ffmpeg.videoFilter(`drawtext=fontfile='${openSansPath}':text=%{localtime}:fontcolor=white@0.8:x=3:y=3:box=1:boxcolor=black:borderw=3`);
    }
    applyDisableAudio(ffmpeg) {
        if (this.disableAudio)
            ffmpeg.disableAudio();
    }
}
exports.default = Camera;
//# sourceMappingURL=Camera.js.map