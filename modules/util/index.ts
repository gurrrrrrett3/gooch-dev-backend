import { Coords } from "./types";

export default class Util {

    public static getDistance(point1: Coords, point2: Coords) {

        const x = point1.x - point2.x;
        const z = point1.z - point2.z;

        return Math.sqrt(x * x + z * z);


    }

    public static genDateFilename(): string {
        const date = new Date();
        return `${date.getFullYear()}-${this.pad(date.getMonth() + 1)}-${this.pad(date.getDate())}`;
    }

    public static parseDate(): string {

        const d = new Date();
        return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}, ${this.pad(d.getHours() > 12 ? d.getHours() - 12 : d.getHours())}:${this.pad(d.getMinutes())}:${this.pad(d.getSeconds())}.${d.getMilliseconds()} ${d.getHours() > 12 ? "PM" : "AM"}`;
    
      }
    
      private static pad(num: number): string {
        return num < 10 ? "0" + num : num.toString();
      }

}