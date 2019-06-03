"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const configPath = "./config.json";
const INITIAL_CONFIG = {
    environment: "development",
    cameras: [],
    storageOptions: ["./storage"]
};
exports.init = () => {
    if (!exports.exists())
        return exports.write(INITIAL_CONFIG);
    return exports.read();
};
exports.write = (config) => {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    return copyConfig(config);
};
exports.read = () => {
    if (!exports.exists())
        return INITIAL_CONFIG;
    const config = fs.readFileSync(configPath, { encoding: "utf-8" });
    return JSON.parse(config);
};
exports.exists = () => fs.existsSync(configPath);
const copyConfig = (config) => JSON.parse(JSON.stringify(config));
//# sourceMappingURL=config.js.map