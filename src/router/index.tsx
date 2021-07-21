import React, { useEffect } from "react";
import { Route, Switch, HashRouter } from "react-router-dom";
import Manager from "../pages/manager";
import EpubReader from "../pages/epubPage";
import HtmlReader from "../pages/htmlReader";
import DjvuReader from "../pages/djvuReader";
import ComicReader from "../pages/comicReader";
import _Redirect from "../pages/redirect";
import i18n from "../i18n";
import OtherUtil from "../utils/otherUtil";

const Router = () => {
  useEffect(() => {
    const lng = OtherUtil.getReaderConfig("lang");
    if (lng) {
      i18n.changeLanguage(lng);
    } else {
      if (navigator.language === "zh-CN" || navigator.language === "zh-SG") {
        i18n.changeLanguage("zh");
      } else if (
        navigator.language === "zh-TW" ||
        navigator.language === "zh-HK"
      ) {
        i18n.changeLanguage("cht");
      } else if (navigator.language === "ru") {
        i18n.changeLanguage("ru");
      } else {
        i18n.changeLanguage("en");
      }
    }
  }, []);
  return (
    <HashRouter>
      <Switch>
        <Route component={Manager} path="/manager" />
        <Route component={EpubReader} path="/epub" />
        <Route component={DjvuReader} path="/djvu" />
        <Route component={HtmlReader} path="/mobi" />
        <Route component={HtmlReader} path="/azw3" />
        <Route component={HtmlReader} path="/txt" />
        <Route component={HtmlReader} path="/docx" />
        <Route component={HtmlReader} path="/md" />
        <Route component={HtmlReader} path="/rtf" />
        <Route component={HtmlReader} path="/fb2" />
        <Route component={ComicReader} path="/cbr" />
        <Route component={ComicReader} path="/cbz" />
        <Route component={ComicReader} path="/cbt" />{" "}
        <Route component={HtmlReader} path="/html" />
        <Route component={HtmlReader} path="/htm" />
        <Route component={HtmlReader} path="/xml" />
        <Route component={HtmlReader} path="/xhtml" />
        <Route component={HtmlReader} path="/href" />
        <Route component={_Redirect} path="/" />
      </Switch>
    </HashRouter>
  );
};

export default Router;
