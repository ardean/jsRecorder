import * as path from "path";
import FFMPEG, { OutputFormat } from "./FFMPEG";

const openSansPath = path.resolve(
  path.dirname(require.resolve("npm-font-open-sans/package.json")),
  "fonts/Regular/OpenSans-Regular.ttf"
);

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

  constructor(options: CameraOptions) {
    this.id = options.id;
    this.name = options.name;
    this.url = options.url;
    this.disableAudio = options.disableAudio;
  }

  streamMotion(outputFormat: OutputFormat = "mpegts", sensitivity: number = 0.01) {
    this.ffmpegMotion = new FFMPEG()
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

  serveHLS(folderPath: string) {
    this.ffmpegHLS = new FFMPEG()
      .inputUrl(this.url);

    this.applyDisableAudio(this.ffmpegHLS);
    this.applyTimestamp(this.ffmpegHLS);

    return this.ffmpegHLS.outputFolder("hls", folderPath);
  }

  stopHLS() {
    this.ffmpegHLS.stop();
  }

  applyTimestamp(ffmpeg: FFMPEG) {
    ffmpeg.videoFilter(`drawtext=fontfile='${openSansPath}':text=%{localtime}:fontcolor=white@0.8:x=3:y=3:box=1:boxcolor=black:borderw=3`);
  }

  applyDisableAudio(ffmpeg: FFMPEG) {
    if (this.disableAudio) ffmpeg.disableAudio();
  }
}