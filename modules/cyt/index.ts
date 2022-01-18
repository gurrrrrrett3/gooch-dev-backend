import CytUpdate from "./update";
export default class CYT {
  private interval: any;
  //@ts-ignore
  public static instance: CYT;

  constructor(delay: number = 10000) {
    this.interval = setInterval(() => {
      this.update();
    }, delay);
  }

  public static Start() {
    this.instance = new CYT();
    this.instance.update();
  }

  public Stop() {
    clearInterval(this.interval);
  }

  public update() {
    CytUpdate.startUpdate();
  }
}
