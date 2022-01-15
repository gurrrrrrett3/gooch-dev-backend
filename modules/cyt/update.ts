import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import defaultFiles from "./data/defaultFiles.json";
import filelist from "./data/filelist.json";
import fetchData from "./data/fetchData.json";
export default class CytUpdate {
  public static startUpdate() {
    this.checkForFiles();

    this.downloadFiles();
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
            headers: fetchData.headers
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
}
