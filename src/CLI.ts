import { log } from "util";
import * as cors from "cors";
import * as path from "path";
import { dev } from "./config";
import * as moment from "moment";
import Recorder from "./Recorder";
import * as express from "express";
import * as program from "commander";
import { RecorderCameraOptions } from "./Recorder";

const { version } = require("../package.json");

log(`${dev ? "development" : "production"} mode, v${version}`);

const cameraOptionsComplete = x => x.id && x.url;

let partialCameraOption;
const cameraOptions: RecorderCameraOptions[] = [];

const addCamera = (id: string) => {
  if (partialCameraOption) {
    if (!cameraOptionsComplete(partialCameraOption)) console.warn(`previous camera definition (${partialCameraOption.id}) will be discarded!`);
    else cameraOptions.push(partialCameraOption);
  }

  partialCameraOption = { id };
};

const setCameraUrl = (url: string) => {
  if (!partialCameraOption) throw new Error("add a camera before setting the url");
  partialCameraOption.url = url;
};

const enableCameraLivestream = () => {
  if (!partialCameraOption) throw new Error("add a camera before enabling livestream");
  partialCameraOption.livestream = true;
};

const disableCameraAudio = () => {
  if (!partialCameraOption) throw new Error("add a camera before disabling audio");
  partialCameraOption.disableAudio = true;
};

program
  .version(version)
  .option("-p, --port <port>", "override default webserver port", parseInt)
  .option("-s, --storage <folder>", "override default storage folder path")
  .option("-c, --camera <id>", "add a camera and set an identifier", addCamera)
  .option("--cu, --camera-url <url>", "set the camera url", setCameraUrl)
  .option("--camera-enable-livestream", "enable camera livestream", enableCameraLivestream)
  .option("--camera-disable-audio", "disable camera audio", disableCameraAudio)
  .parse(process.argv);

if (partialCameraOption && cameraOptionsComplete(partialCameraOption)) {
  cameraOptions.push(partialCameraOption);
  partialCameraOption = null;
}

const publicFolder = path.resolve(__dirname, "../public");

for (const cameraOption of cameraOptions) {
  if ((cameraOption as any).livestream) cameraOption.livestreamFolder = `${publicFolder}/cameras/${cameraOption.id}`;
}

const recorder = new Recorder(cameraOptions, [program.storage || "./storage"]);
recorder.start();
setInterval(() => recorder.restart(), moment.duration(1, "hour").asMilliseconds());

// const port = program.port || 80;
// const app = express();
// app.disable("x-powered-by");
// app.use(cors());
// app.use(express.static(publicFolder));
// app.listen(port, () => {
//   console.log(`server running on http://localhost:${port}/`);
// });

process.on("SIGINT", () => {
  recorder.stop();
  process.exit(0);
});
