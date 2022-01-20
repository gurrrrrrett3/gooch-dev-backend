import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import defaultFiles from "./data/defaultFiles.json";
import filelist from "./data/filelist.json";
import fetchData from "./data/fetchData.json";
import { Town } from "../util/types";
import CYTParse from "./parse";
import Logger from "../util/logger";
import TownLog from "./townLog";
import CYTInterface from "./interface";
export default class CytUpdate {
  public static async startUpdate() {
    TownLog.init();
    TownLog.saveOldTowns()
    TownLog.saveOldPlayers()
    this.checkForFiles();
    await this.downloadFiles();
    TownLog.updateTowns(CYTInterface.getTownFile());
    TownLog.updatePlayers(CYTInterface.getPlayerFile());
  }

  private static checkForFiles() {

    defaultFiles.data.forEach((file) => {
      if (!fs.existsSync(path.resolve(defaultFiles.filePath, file.location + file.name))) {

        fs.existsSync(path.resolve(defaultFiles.filePath, file.location)) || fs.mkdirSync(path.resolve(defaultFiles.filePath, file.location));

        fs.writeFileSync(
          path.resolve(defaultFiles.filePath, file.location + file.name),
          "[]"
        );
      }
    });
  }

  private static async downloadFiles(): Promise<void> {
    let downloadCount = filelist.data.length;
    for (const file of filelist.data) {
      await this.queueDownload(file).then(() => {
        downloadCount--;
      });
    }

    const downloadInterval = setInterval(() => {
      if (downloadCount === 0) {
        clearInterval(downloadInterval);
        this.parseTowns();
      } else {
        Logger.log(`Downloading ${downloadCount} files`);
      }
    }, 100);
  }

  private static async queueDownload(

    file: {
      fileName: string;
      fileLocation: string;
      url: string;
    }
  ): Promise<void> {
    try {
      const res = await fetch(filelist.baseURL + file.url, fetchData);
      const data = await res.json();
      fs.writeFileSync(path.resolve(filelist.filePath, file.fileLocation, file.fileName ), JSON.stringify(data, null, 2));
    } catch (error) {
      Logger.log(`Failed to download ${file.fileName}`, error);
      try {
        const res = await fetch(filelist.baseURL + file.url, fetchData);
        const data = await res.text();

        fs.writeFileSync(path.resolve(filelist.filePath, "errors/" + file.fileName.replace("json", "html")), data);

        Logger.log(`Error downloading file, check errors folder`, file.fileName, error);
      } catch (error) {
        Logger.log(`Could not download file, or get error`, file.fileName, error);
      }
    }
  }

  private static parseTowns() {
    const markers = {
      world: JSON.parse(
        fs
          .readFileSync(
            path.resolve(
              filelist.filePath,
              filelist.files.worldMarkers.fileLocation,
              filelist.files.worldMarkers.fileName
            ),
            "utf8"
          )
          .toString()
      ),
      earth: JSON.parse(
        fs
          .readFileSync(
            path.resolve(
              filelist.filePath,
              filelist.files.earthMarkers.fileLocation,
              filelist.files.earthMarkers.fileName
            ),
            "utf8"
          )
          .toString()
      ),
    };

    const towns: Town[] = [];
    try {
      Object.keys(markers).forEach((world) => {
        //@ts-ignore
        markers[world][1].markers.forEach((marker: any) => {
          if (marker.type == "icon") {
            const town = CYTParse.parseIcon(marker, world);
            towns.push(town);
          }
        });
      });
    } catch (error) {
      Logger.log(`Failed to parse towns`, error);
    }

    fs.writeFileSync(
      path.resolve(
        defaultFiles.filePath,
        defaultFiles.files.created.towns.location + defaultFiles.files.created.towns.name
      ),
      JSON.stringify(towns, null, 2)
    );
  }
}