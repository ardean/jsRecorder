import * as fs from "fs";
import { RecorderCameraOptions, StorageOption } from "../Recorder";

const configPath = "./config.json";

const INITIAL_CONFIG: Config = {
  environment: "development",
  cameras: [],
  storageOptions: ["./storage"]
};

export interface Config {
  environment: "production" | "development";
  cameras: RecorderCameraOptions[];
  storageOptions: StorageOption[];
}

export const init = (): Config => {
  if (!exists()) return write(INITIAL_CONFIG);
  return read();
};

export const write = (config: Config) => {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  return copyConfig(config);
};

export const read = () => {
  if (!exists()) return INITIAL_CONFIG;

  const config = fs.readFileSync(configPath, { encoding: "utf-8" });
  return JSON.parse(config) as Config;
};

export const exists = () => fs.existsSync(configPath);

const copyConfig = (config: Config) => JSON.parse(JSON.stringify(config)) as Config;