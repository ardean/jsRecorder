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
const util_1 = require("util");
const moment_1 = __importDefault(require("moment"));
const Recorder_1 = __importDefault(require("./Recorder"));
const configService = __importStar(require("./services/config"));
const config = configService.init();
const { version } = require("../package.json");
util_1.log(`${config.environment} mode, v${version}`);
const recorder = new Recorder_1.default(config.cameras, config.storageOptions);
recorder.start();
const interval = setInterval(() => recorder.restart(), moment_1.default.duration(1, "hour").asMilliseconds());
process.on("SIGINT", () => {
    clearInterval(interval);
    recorder.stop();
    process.exit(0);
});
//# sourceMappingURL=index.js.map