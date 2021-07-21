import React from "react";
import ReactDOM from "react-dom";
import "./assets/styles/reset.css";
import "./assets/styles/global.css";
import "./assets/styles/style.css";
import "react-tippy/dist/tippy.css";
import { Provider } from "react-redux";
import "./i18n";
import store from "./store";
import Router from "./router/index";
import StyleUtil from "./utils/readUtils/styleUtil";
import { isElectron } from "react-device-detect";
import { dropdownList } from "./constants/dropdownList";
import OtherUtil from "./utils/otherUtil";

let coverLoading: any = document.querySelector(".loading-cover");
coverLoading && coverLoading.parentNode.removeChild(coverLoading);

ReactDOM.render(
  <Provider store={store}>
    <Router />
  </Provider>,
  document.getElementById("root")
);

if (isElectron && OtherUtil.getReaderConfig("isDisableAnalytics") !== "yes") {
  const { ipcRenderer } = window.require("electron");
  const { ebtRenderer } = window.require("electron-baidu-tongji");
  const BAIDU_SITE_ID = "358570be1bfc40e01db43adefade5ad5";
  ebtRenderer(ipcRenderer, BAIDU_SITE_ID, Router);
}
if (
  isElectron &&
  navigator.appVersion.indexOf("NT 6.1") === -1 &&
  navigator.appVersion.indexOf("NT 5.1") === -1 &&
  navigator.appVersion.indexOf("NT 6.0") === -1
) {
  const { ipcRenderer } = window.require("electron");
  ipcRenderer.invoke("fonts-ready", "ping").then((result) => {
    dropdownList[0].option = result;
    dropdownList[0].option.push("Built-in font");
  });
}
StyleUtil.applyTheme();

ReactDOM.render(
  <Provider store={store}>
    <Router />
  </Provider>,
  document.getElementById("root")
);
