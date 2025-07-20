import {
  ConsoleSink,
  FileSink,
  Logger,
  LoggingLevel,
  Service,
} from "@knight/knight";

export default Service(
  class LoggingService {
    public logger: Logger;
    constructor() {
      const date = new Date();
      const rnd = Math.floor(Math.random() * 1000);
      const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${rnd}`;
      this.logger = new Logger()
        .attach(new ConsoleSink())
        // .attach(
        //   new FileSink(`./logs/log_${dateString}.txt`).fromRange(
        //     LoggingLevel.Success,
        //   ),
        // );
    }
  },
);
