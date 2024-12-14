import { Logger } from "@surfacedstudio/core/logger";

class CatsInTechLogger extends Logger<["Lambda"]> {
  constructor() {
    super(Logger.LogLevel.Info, {});
  }
}

export const logger = new CatsInTechLogger();
