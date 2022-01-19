import fs from "fs";
import Config from "./config";
export default class Logger {
  public static log(message: string, ...optionalParams: any[]): void {

    fs.existsSync("logs") || fs.mkdirSync("logs");

    const loggerMode = Config.getValue("LoggerMode");
    if (loggerMode == "BOTH" || "FILE") {
      const d = new Date();
      fs.appendFileSync(
        `./modules/util/logs/${d.getFullYear()}${d.getMonth()}${d.getDate()}.txt`,
        `[${this.parseDate()}] ${message}${optionalParams.length > 0?":":""} ${optionalParams} \n`
      );
    }

    if (loggerMode == "BOTH" || "CONSOLE") {
      console.log(`[${this.parseDate()}] ${message}${optionalParams.length > 0?":":""} ${optionalParams}`);
    }
  }

  private static parseDate(): string {

    const d = new Date();
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}, ${this.pad(d.getHours() > 12 ? d.getHours() - 12 : d.getHours())}:${this.pad(d.getMinutes())}:${this.pad(d.getSeconds())}.${d.getMilliseconds()} ${d.getHours() > 12 ? "PM" : "AM"}`;

  }

  private static pad(num: number): string {
    return num < 10 ? "0" + num : num.toString();
  }
}