import React from "react";
import "./settingDialog.css";
import { SettingInfoProps, SettingInfoState } from "./interface";
import { Trans } from "react-i18next";
import i18n from "../../../i18n";
import { version } from "../../../../package.json";
import StorageUtil from "../../../utils/storageUtil";
import { changePath } from "../../../utils/syncUtils/common";
import { isElectron } from "react-device-detect";
import { dropdownList } from "../../../constants/dropdownList";
import { Tooltip } from "react-tippy";
import { restore } from "../../../utils/syncUtils/restoreUtil";
import {
  settingList,
  langList,
  searchList,
} from "../../../constants/settingList";
import { themeList } from "../../../constants/themeList";
import _ from "underscore";
import toast from "react-hot-toast";
class SettingDialog extends React.Component<
  SettingInfoProps,
  SettingInfoState
> {
  constructor(props: SettingInfoProps) {
    super(props);
    this.state = {
      isTouch: StorageUtil.getReaderConfig("isTouch") === "yes",
      isImportPath: StorageUtil.getReaderConfig("isImportPath") === "yes",
      isMergeWord: StorageUtil.getReaderConfig("isMergeWord") === "yes",
      isPreventTrigger:
        StorageUtil.getReaderConfig("isPreventTrigger") === "yes",
      isAutoFullscreen:
        StorageUtil.getReaderConfig("isAutoFullscreen") === "yes",
      isPreventAdd: StorageUtil.getReaderConfig("isPreventAdd") === "yes",
      isOpenBook: StorageUtil.getReaderConfig("isOpenBook") === "yes",
      isExpandContent: StorageUtil.getReaderConfig("isExpandContent") === "yes",
      isPreventSleep: StorageUtil.getReaderConfig("isPreventSleep") === "yes",
      isOpenInMain: StorageUtil.getReaderConfig("isOpenInMain") === "yes",
      isDisableUpdate: StorageUtil.getReaderConfig("isDisableUpdate") === "yes",
      isDisplayDark: StorageUtil.getReaderConfig("isDisplayDark") === "yes",
      isDisableAnalytics:
        StorageUtil.getReaderConfig("isDisableAnalytics") === "yes",
      currentThemeIndex: _.findLastIndex(themeList, {
        name: StorageUtil.getReaderConfig("themeColor"),
      }),
    };
  }
  componentDidMount() {
    StorageUtil.getReaderConfig("systemFont") &&
      document
        .getElementsByClassName("lang-setting-dropdown")[0]
        ?.children[
          dropdownList[0].option.indexOf(
            StorageUtil.getReaderConfig("systemFont")
          )
        ].setAttribute("selected", "selected");
    document
      .getElementsByClassName("lang-setting-dropdown")[1]
      ?.children[
        ["zh", "cht", "en", "ru"].indexOf(
          StorageUtil.getReaderConfig("lang") ||
            (navigator.language.indexOf("zh") > -1 ? "zh" : "en")
        )
      ].setAttribute("selected", "selected");
    document.getElementsByClassName("lang-setting-dropdown")[2]?.children[
      _.findLastIndex(searchList, {
        value:
          StorageUtil.getReaderConfig("searchEngine") ||
          (navigator.language === "zh-CN" ? "baidu" : "google"),
      })
    ].setAttribute("selected", "selected");
  }
  handleRest = (bool: boolean) => {
    toast.success(this.props.t("Change Successfully"));
  };
  changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    StorageUtil.setReaderConfig("lang", lng);
  };
  changeSearch = (searchEngine: string) => {
    StorageUtil.setReaderConfig("searchEngine", searchEngine);
  };
  changeFont = (font: string) => {
    let body = document.getElementsByTagName("body")[0];
    body.setAttribute("style", "font-family:" + font + "!important");
    StorageUtil.setReaderConfig("systemFont", font);
  };
  handleJump = (url: string) => {
    isElectron
      ? window.require("electron").shell.openExternal(url)
      : window.open(url);
  };
  handleSetting = (stateName: string) => {
    this.setState({ [stateName]: !this.state[stateName] } as any);
    StorageUtil.setReaderConfig(
      stateName,
      this.state[stateName] ? "no" : "yes"
    );
    this.handleRest(this.state[stateName]);
  };
  syncFromLocation = async () => {
    const fs = window.require("fs");
    const path = window.require("path");
    const { zip } = window.require("zip-a-folder");
    let storageLocation = localStorage.getItem("storageLocation")
      ? localStorage.getItem("storageLocation")
      : window
          .require("electron")
          .ipcRenderer.sendSync("storage-location", "ping");
    let sourcePath = path.join(storageLocation, "config");
    let outPath = path.join(storageLocation, "config.zip");
    await zip(sourcePath, outPath);

    var data = fs.readFileSync(outPath);

    let blobTemp = new Blob([data], { type: "application/epub+zip" });
    let fileTemp = new File([blobTemp], "config.zip", {
      lastModified: new Date().getTime(),
      type: blobTemp.type,
    });

    let result = await restore(fileTemp, true);
    if (result) {
      toast.success(this.props.t("Change Successfully"));
    } else {
      toast.error(this.props.t("Change Failed"));
    }
  };
  handleChangeLocation = async () => {
    const { ipcRenderer } = window.require("electron");
    const path = await ipcRenderer.invoke("change-path");
    if (!path.filePaths[0]) {
      return;
    }
    let result = await changePath(
      localStorage.getItem("storageLocation")
        ? localStorage.getItem("storageLocation")
        : ipcRenderer.sendSync("storage-location", "ping"),
      path.filePaths[0]
    );
    if (result === 1) {
      this.syncFromLocation();
    } else if (result === 2) {
      this.props.handleFetchBooks();
      toast.success(this.props.t("Change Successfully"));
    } else {
      toast.error(this.props.t("Change Failed"));
    }
    localStorage.setItem("storageLocation", path.filePaths[0]);
    document.getElementsByClassName(
      "setting-dialog-location-title"
    )[0].innerHTML =
      path.filePaths[0] ||
      localStorage.getItem("storageLocation") ||
      ipcRenderer.sendSync("storage-location", "ping");
  };
  handleDisplayDark = () => {
    this.setState({ isDisplayDark: !this.state.isDisplayDark });
    StorageUtil.setReaderConfig(
      "isDisplayDark",
      this.state.isDisplayDark ? "no" : "yes"
    );
    if (isElectron) {
      toast(this.props.t("Try refresh or restart"));
    } else {
      window.location.reload();
    }
  };

  handleTheme = (name: string, index: number) => {
    this.setState({ currentThemeIndex: index });
    StorageUtil.setReaderConfig("themeColor", name);
    if (isElectron) {
      toast(this.props.t("Try refresh or restart"));
    } else {
      window.location.reload();
    }
  };
  handleMergeWord = () => {
    if (this.state.isOpenInMain && !this.state.isMergeWord) {
      toast(this.props.t("Please turn off open books in the main window"));
      return;
    }
    this.handleSetting("isMergeWord");
  };
  handleOpenInMain = () => {
    if (this.state.isMergeWord && !this.state.isOpenInMain) {
      toast(this.props.t("Please turn off merge with word first"));
      return;
    }
    this.handleSetting("isOpenInMain");
  };
  render() {
    return (
      <div className="setting-dialog-container">
        <p className="setting-dialog-title">
          <Trans>Setting</Trans>
        </p>
        <p className="setting-subtitle">
          <Trans>Version</Trans>
          {version}
        </p>
        <div
          className="setting-close-container"
          onClick={() => {
            this.props.handleSetting(false);
          }}
        >
          <span className="icon-close setting-close"></span>
        </div>

        <div className="setting-dialog-info">
          {settingList.map((item, index) => {
            return (
              <div
                style={
                  item.isElectron ? (isElectron ? {} : { display: "none" }) : {}
                }
                key={item.propName}
              >
                <div className="setting-dialog-new-title" key={item.title}>
                  <span style={{ width: "250px" }}>
                    <Trans>{item.title}</Trans>
                  </span>

                  <span
                    className="single-control-switch"
                    onClick={() => {
                      switch (item.propName) {
                        case "isDisplayDark":
                          this.handleDisplayDark();
                          break;
                        case "isMergeWord":
                          this.handleMergeWord();
                          break;
                        case "isOpenInMain":
                          this.handleOpenInMain();
                          break;
                        default:
                          this.handleSetting(item.propName);
                          break;
                      }
                    }}
                    style={this.state[item.propName] ? {} : { opacity: 0.6 }}
                  >
                    <span
                      className="single-control-button"
                      style={
                        this.state[item.propName]
                          ? {
                              transform: "translateX(20px)",
                              transition: "transform 0.5s ease",
                            }
                          : {
                              transform: "translateX(0px)",
                              transition: "transform 0.5s ease",
                            }
                      }
                    ></span>
                  </span>
                </div>
                <p className="setting-option-subtitle">
                  <Trans>{item.desc}</Trans>
                </p>
              </div>
            );
          })}
          <div className="setting-dialog-new-title">
            <Trans>Theme Color</Trans>
            <ul className="theme-setting-container">
              {themeList.map((item, index) => (
                <Tooltip
                  key={item.id}
                  title={this.props.t(item.title)}
                  position="top"
                  trigger="mouseenter"
                >
                  <li
                    className={
                      index === this.state.currentThemeIndex
                        ? "active-color theme-setting-item"
                        : "theme-setting-item"
                    }
                    onClick={() => {
                      this.handleTheme(item.name, index);
                    }}
                    style={{ backgroundColor: item.color }}
                  ></li>
                </Tooltip>
              ))}
            </ul>
          </div>

          {isElectron && (
            <>
              <div className="setting-dialog-new-title">
                <Trans>Change storage location</Trans>

                <span
                  className="change-location-button"
                  onClick={() => {
                    this.handleChangeLocation();
                  }}
                >
                  <Trans>Change location</Trans>
                </span>
              </div>
              <div className="setting-dialog-location-title">
                {localStorage.getItem("storageLocation")
                  ? localStorage.getItem("storageLocation")
                  : window
                      .require("electron")
                      .ipcRenderer.sendSync("storage-location", "ping")}
              </div>
            </>
          )}
          <div className="setting-dialog-new-title">
            <Trans>System Font</Trans>
            <select
              name=""
              className="lang-setting-dropdown"
              onChange={(event) => {
                this.changeFont(event.target.value);
              }}
            >
              {dropdownList[0].option.map((item) => (
                <option value={item} key={item} className="lang-setting-option">
                  {this.props.t(item)}
                </option>
              ))}
            </select>
          </div>

          <div className="setting-dialog-new-title">
            <Trans>Language</Trans>
            <select
              name=""
              className="lang-setting-dropdown"
              onChange={(event) => {
                this.changeLanguage(event.target.value);
              }}
            >
              {langList.map((item) => (
                <option
                  value={item.value}
                  key={item.value}
                  className="lang-setting-option"
                >
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="setting-dialog-new-title">
            <Trans>Default search engine</Trans>
            <select
              name=""
              className="lang-setting-dropdown"
              onChange={(event) => {
                this.changeSearch(event.target.value);
              }}
            >
              {searchList.map((item) => (
                <option
                  value={item.value}
                  key={item.value}
                  className="lang-setting-option"
                >
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  }
}

export default SettingDialog;
