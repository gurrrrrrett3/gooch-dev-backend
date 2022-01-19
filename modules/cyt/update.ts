import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import defaultFiles from "./data/defaultFiles.json";
import filelist from "./data/filelist.json";
import fetchData from "./data/fetchData.json";
import { Town } from "../util/types";
import CYTParse from "./parse";
export default class CytUpdate {
  public static startUpdate() {
    this.checkForFiles();
    this.downloadFiles();
    this.parseTowns();
  }

  private static checkForFiles() {
    defaultFiles.data.forEach((file) => {
      if (!fs.existsSync(path.resolve(defaultFiles.filePath, file.location + file.name))) {
        fs.writeFileSync(
          path.resolve(defaultFiles.filePath, file.location + file.name),
          JSON.stringify(file.data)
        );
      }
    });
  }

  private static async downloadFiles() {
    globalThis.navigator = globalThis.navigator || {};
    //@ts-ignore
    navigator.cookieEnabled = true;

    filelist.data.forEach(async (file) => {
      try {
        const res = await fetch(filelist.baseURL + file.url, fetchData);
        const data = await res.json();
        fs.writeFileSync(
          path.resolve(filelist.filePath, file.fileLocation + file.filename),
          JSON.stringify(data, null, 2)
        );
      } catch (error) {
        try {
          const res = await fetch(filelist.baseURL + file.url, {
            method: "GET",
            headers: fetchData.headers,
          });
          const data = await res.text();

          fs.writeFileSync(
            path.resolve(filelist.filePath, "errors/" + file.filename.replace("json", "html")),
            data
          );

          console.log(`Error downloading file, check errors folder | ${file.filename}`);
        } catch (error) {
          console.log(error);
        }
      }
    });
  }

  private static parseTowns() {
    const markers = {
      world: JSON.parse(
        fs
          .readFileSync(
            path.resolve(
              filelist.filePath,
              filelist.files.worldMarkers.fileLocation,
              filelist.files.worldMarkers.filename
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
              filelist.files.earthMarkers.filename
            ),
            "utf8"
          )
          .toString()
      ),
    };

    const towns: Town[] = [];

    Object.keys(markers).forEach((world) => {
      //@ts-ignore
      markers[world][1].markers.forEach((marker: any) => {
        if (marker.type == "icon") {
          const town = CYTParse.parseIcon(marker, world);
            towns.push(town);
        }
      });
    });


    fs.writeFileSync(
      path.resolve(
        defaultFiles.filePath,
        defaultFiles.files.created.towns.location + defaultFiles.files.created.towns.name
      ),
      JSON.stringify(towns, null, 2)
    );
  }
}
