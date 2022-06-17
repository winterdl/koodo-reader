import GA from "electron-google-analytics";
import * as pkg from "../../../package.json";

const isDevelopment = process.env.NODE_ENV === "development";

interface EvOptions {
  evLabel?: any;
  evValue?: any;
}

const hostname = "https://reader.960960.xyz";

class Analytics {
  private readonly ga: any;

  private clientId: any;

  constructor() {
    this.ga = new GA("G-LW49EYTQWY", { debug: isDevelopment });

    this.ga.set("version", (pkg as any).version);
  }

  public getClientId(callback: any) {
    if (this.clientId) {
      callback(this.clientId);
    }
    var macaddress = window.require("macaddress");
    macaddress.one((err: any, mac: string) => {
      this.clientId = mac;
      callback(mac);
    });
  }

  public async pageView(url: string, title?: string) {
    this.getClientId(async (clientId: any) => {
      try {
        await this.ga.pageview(hostname, url, title, 1, clientId);
      } catch (e) {
        console.error(e);
      }
    });
  }

  public async event(evCategory: string, evAction: string, options: EvOptions) {
    this.getClientId(async (clientId: any) => {
      try {
        await this.ga.event(evCategory, evAction, {
          ...options,
          clientID: clientId,
        });
      } catch (e) {
        console.error(e);
      }
    });
  }

  public async exception(exDesc: string, exFatal: any) {
    this.getClientId(async (clientId: any) => {
      try {
        await this.ga.exception(exDesc, exFatal);
      } catch (e) {
        console.error(e);
      }
    });
  }
  public removeScript() {
    let elem = document.getElementById("analytic");
    if (!elem || !elem.parentNode) return;
    elem.parentNode.removeChild(elem);
  }
}

export default new Analytics();
