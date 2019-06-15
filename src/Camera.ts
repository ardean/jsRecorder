import path from "path";
import logger from "./services/logger";
import * as configService from "./services/config";
import FFMPEG, { OutputFormat, TransportType } from "./FFMPEG";

const openSansPath = path.resolve(
  path.dirname(require.resolve("npm-font-open-sans/package.json")),
  "fonts/Regular/OpenSans-Regular.ttf"
);

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
  retryIndex: number = 0;
  disableAudio?: boolean;
  transportType?: TransportType;
  mode: "stopped" | "failed" | "streaming" = "stopped";

  ffmpegMotion: FFMPEG;
  ffmpegHLS: FFMPEG;

  constructor(options: CameraOptions) {
    this.id = options.id;
    this.name = options.name;
    this.url = options.url;
    this.disableAudio = options.disableAudio;
    this.transportType = options.transportType;
  }

  streamMotion(outputFormat: OutputFormat = "mpegts", sensitivity?: number) {
    this.ffmpegMotion = new FFMPEG({
      debug: configService.read().environment === "development"
    })
      .inputUrl(this.url);

    if (this.transportType) this.ffmpegMotion.transportType(this.transportType);
    this.applyMotionFilter(this.ffmpegMotion, sensitivity);
    this.applyDisableAudio(this.ffmpegMotion);
    this.applyTopLeftText(this.ffmpegMotion, `${this.name ? this.name + " / " : ""}%{localtime}`);

    return this.ffmpegMotion.outputStream(outputFormat);
  }

  stopMotion() {
    this.ffmpegMotion.stop();
  }

  serveHLS(folderPath: string) {
    this.ffmpegHLS = new FFMPEG()
      .inputUrl(this.url);

    this.applyDisableAudio(this.ffmpegHLS);
    this.applyTopLeftText(this.ffmpegHLS, `${this.name ? this.name + " / " : ""}%{localtime}`);

    return this.ffmpegHLS.outputFolder("hls", folderPath);
  }

  stopHLS() {
    this.ffmpegHLS.stop();
  }

  applyTopLeftText(ffmpeg: FFMPEG, text: string) {
    ffmpeg.videoFilter(`drawtext=fontfile='${openSansPath}':text='${text}':fontcolor=white@0.8:x=3:y=3:box=1:boxcolor=black:borderw=3`);
  }

  applyDisableAudio(ffmpeg: FFMPEG) {
    if (this.disableAudio) ffmpeg.disableAudio();
  }

  applyMotionFilter(ffmpeg: FFMPEG, sensitivity: number = 0.01) {
    ffmpeg
      .videoFilter(`select=gt(scene,${sensitivity})`)
      .videoFilter("setpts=N/(5*TB)");
  }

  nextRetryTimeout() {
    return Math.min((1.5 * this.retryIndex++) * 30 * 1000, 24 * 60 * 60 * 1000);
  }

  resetRetryIndex() {
    if (this.retryIndex !== 0) this.retryIndex = 0;
  }

  setStreamingMode() {
    if (this.mode === "streaming") return;
    this.mode = "streaming";
    this.resetRetryIndex();
    logger.info("stream started");
  }
}