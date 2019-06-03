import { log } from "util";
import moment from "moment";
import Recorder from "./Recorder";
import * as configService from "./services/config";

const config = configService.init();
const { version } = require("../package.json");

log(`${config.environment} mode, v${version}`);

const recorder = new Recorder(config.cameras, config.storageOptions);
recorder.start();
const interval = setInterval(() => recorder.restart(), moment.duration(1, "hour").asMilliseconds());

process.on("SIGINT", () => {
  clearInterval(interval);
  recorder.stop();
  process.exit(0);
});