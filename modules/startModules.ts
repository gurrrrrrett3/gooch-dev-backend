import fs from "fs";
import { Module } from "./util/types";
import startList from "./util/data/startList.json";
export default class StartModules {
  public static modules: Module[] = [];

  public static startAll() {
    fs.readdirSync("./modules").forEach(async (folder) => {
      if (!folder.includes(".") && startList.includes(folder)) {
        await import(`./${folder}/index.js`).then((module: Module) => {
          console.log(`Starting module: ${folder}`);
          module.default.Start();
        });
      }
    });
  }

    public static stopAll() {
    fs.readdirSync("./modules").forEach(async (folder) => {
      if (!folder.includes(".") && startList.includes(folder)) {
        await import(`./${folder}/index.js`).then((module: Module) => {
          console.log(`Stopping module: ${folder}`);
          module.default.Stop();
        });
      }
    });
  }

    public static async start(module: string) {
    await import(`./${module}/index.js`).then((mod: Module) => {
      console.log(`Starting module: ${module}`);
      mod.default.Start();
    });
  }

    public static async stop(module: string) {
    await import(`./${module}/index.js`).then((mod: Module) => {
      console.log(`Stopping module: ${module}`);
      mod.default.Stop();
    });
  }
}
