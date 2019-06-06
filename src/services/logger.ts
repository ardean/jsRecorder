import { format, createLogger, transports } from "winston";

const logger = createLogger({
  level: "info",
  format: format.json(),
  transports: [
    new transports.Console({
      format: format.simple()
    })
  ]
});

export default logger;