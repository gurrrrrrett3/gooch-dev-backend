import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import fileList from "./data/filelist.json";
import { ActiveLogFile, ActiveLogFrameData, MCServerStausData } from "../util/types";
import otherData from "./data/otherConfig.json";

export default class CYTActiveLogManager {
  private static getFile(fileName: string): ActiveLogFile {
    const filePath = path.resolve(fileList.filePath ,`logs/activeLogs/${fileName}.json`);
    if (!fs.existsSync(filePath)) {
      return this.newFile();
    } else {
      return JSON.parse(fs.readFileSync(filePath).toString());
    }
  }

  private static saveFile(fileName: string, data: ActiveLogFile) {
    fs.writeFileSync(path.resolve(fileList.filePath ,`logs/activeLogs/${fileName}.json`), JSON.stringify(data, null, 2));
  }

  private static newFile(): ActiveLogFile {
    const fileName = this.generateFileName(Date.now());
    const data: ActiveLogFile = {
      global: {
        firstDate: Date.now(),
        lastDate: Date.now(),
        logCount: 0,
      },
      data: [],
    };

    this.saveFile(fileName, data);
    return data;
  }

  private static addData(data: ActiveLogFrameData) {
   const fileName = this.generateFileName(data.date);
    const file = this.getFile(fileName);

    file.data.push(data);
    file.global.lastDate = data.date;
    file.global.logCount++;

    this.saveFile(fileName, file);
  }

  private static getLastFile(): ActiveLogFile {
    const lastFileName = this.generateFileName(Date.now());
    const file = this.getFile(lastFileName);
    return file;
}

  public static async Update() {
    const data: MCServerStausData = await fetch(otherData.mcServerStatusURL).then((res) => res.json());
    const lastFile = this.getLastFile();
    const lastDate = lastFile.global.lastDate;
    const activeLogFrameData: ActiveLogFrameData = {
      date: Date.now(),
      playersMax: data.players.max,
      playersOnline: data.players.online,
      serverOnline: data.online,
    };

    if (lastDate - data.debug.cachetime < 0) {
    this.addData(activeLogFrameData);
    }
  }

  public static getDataBetween(timeData: { start?: number; end?: number }): ActiveLogFile {
    const time = {
      start: timeData.start || 0,
      end: timeData.end || Date.now(),
    };

    const filelist = fs.readdirSync(path.resolve(fileList.filePath ,"logs/activeLogs"));
    let outData: ActiveLogFile = {
      global: {
        firstDate: time.start,
        lastDate: time.end,
        logCount: 0,
      },
      data: [],
    };

    filelist.forEach((fileName: string) => {
      const file = this.getFile(fileName);
      if (file.global.lastDate < time.start || file.global.firstDate > time.end) {
        return;
      }
      outData.data.push(...file.data);
    });

    outData.data.filter((data: ActiveLogFrameData) => data.date >= time.start && data.date <= time.end);
    outData.data.sort((a: ActiveLogFrameData, b: ActiveLogFrameData) => a.date - b.date);
    outData.global.logCount = outData.data.length;
    outData.global.firstDate = outData.data[0].date;
    outData.global.lastDate = outData.data[outData.data.length - 1].date;

    return outData;
  }

  private static generateFileName(date: number): string {
    const d = new Date(date)
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  }
}
