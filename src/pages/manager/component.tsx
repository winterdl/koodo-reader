import React from "react";
import Sidebar from "../../containers/sidebar";
import Header from "../../containers/header";
import DeleteDialog from "../../components/dialogs/deleteDialog";
import EditDialog from "../../components/dialogs/editDialog";
import AddDialog from "../../components/dialogs/addDialog";
import SortDialog from "../../components/dialogs/sortDialog";
import AboutDialog from "../../components/dialogs/aboutDialog";
import MessageBox from "../../containers/messageBox";
import BackupDialog from "../../components/dialogs/backupDialog";
import "./manager.css";
import { ManagerProps, ManagerState } from "./interface";
import { Trans } from "react-i18next";
import OtherUtil from "../../utils/otherUtil";
import AddFavorite from "../../utils/readUtils/addFavorite";
import SettingDialog from "../../components/dialogs/settingDialog";
import { isMobileOnly } from "react-device-detect";
import { Route, Switch, Redirect } from "react-router-dom";
import { routes } from "../../router/routes";
import Arrow from "../../components/arrow";
import LoadingDialog from "../../components/dialogs/loadingDialog";
import TipDialog from "../../components/dialogs/TipDialog";

//判断是否为触控设备
const is_touch_device = () => {
  return "ontouchstart" in window;
};

class Manager extends React.Component<ManagerProps, ManagerState> {
  timer!: NodeJS.Timeout;
  constructor(props: ManagerProps) {
    super(props);
    this.state = {
      totalBooks: parseInt(OtherUtil.getReaderConfig("totalBooks") || "0") || 0,
      favoriteBooks: Object.keys(AddFavorite.getAllFavorite()).length,
      isAuthed: false,
      isError: false,
      isCopied: false,
      isUpdated: false,
      isDrag: false,
      token: "",
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps: ManagerProps) {
    if (nextProps.books && this.state.totalBooks !== nextProps.books.length) {
      this.setState(
        {
          totalBooks: nextProps.books.length,
        },
        () => {
          OtherUtil.setReaderConfig(
            "totalBooks",
            this.state.totalBooks.toString()
          );
        }
      );
    }
    if (nextProps.books && nextProps.books.length === 1 && !this.props.books) {
      this.props.history.push("/manager/home");
    }
    if (this.props.mode !== nextProps.mode) {
      this.setState({
        favoriteBooks: Object.keys(AddFavorite.getAllFavorite()).length,
      });
    }
    if (nextProps.isMessage) {
      this.timer = global.setTimeout(() => {
        this.props.handleMessageBox(false);
      }, 2000);
    }
  }
  UNSAFE_componentWillMount() {
    this.props.handleFetchBooks();
    this.props.handleFetchNotes();
    this.props.handleFetchBookmarks();
    this.props.handleFetchBookSortCode();
    this.props.handleFetchList();
  }
  componentDidMount() {
    if (is_touch_device() && !OtherUtil.getReaderConfig("isTouch")) {
      OtherUtil.setReaderConfig("isTouch", "yes");
    }
  }

  handleDrag = (isDrag: boolean) => {
    this.setState({ isDrag });
  };
  render() {
    let { books } = this.props;
    if (isMobileOnly) {
      return (
        <>
          <p className="waring-title">
            <Trans>Warning</Trans>
          </p>
          <div className="mobile-warning">
            <span>
              <Trans>
                For better user experince, please visit this site on a computer
              </Trans>
            </span>
          </div>
          <div>
            <img
              src={
                OtherUtil.getReaderConfig("isDisplayDark") === "yes"
                  ? "./assets/empty_light.svg"
                  : "./assets/empty.svg"
              }
              alt=""
              className="waring-pic"
            />
          </div>
        </>
      );
    }
    return (
      <div
        className="manager"
        onDragEnter={() => {
          !this.props.dragItem && this.handleDrag(true);
          (document.getElementsByClassName(
            "import-from-local"
          )[0] as any).style.zIndex = "50";
        }}
      >
        {this.state.isDrag && !this.props.dragItem && (
          <div className="drag-background">
            <div className="drag-info">
              <Arrow />
              <p className="arrow-text">
                <Trans>Drop your books here</Trans>
              </p>
            </div>
          </div>
        )}
        <Sidebar />
        <Header {...{ handleDrag: this.handleDrag }} />
        {this.props.isOpenDeleteDialog && <DeleteDialog />}
        {this.props.isOpenEditDialog && <EditDialog />}
        {this.props.isOpenAddDialog && <AddDialog />}
        {this.props.isShowLoading && <LoadingDialog />}
        {
          <div
            className="drag-background"
            onClick={() => {
              this.props.handleEditDialog(false);
              this.props.handleDeleteDialog(false);
              this.props.handleAddDialog(false);
              this.props.handleTipDialog(false);
              this.props.handleLoadingDialog(false);
              this.props.handleNewDialog(false);
              this.props.handleBackupDialog(false);
              this.props.handleSetting(false);
              this.handleDrag(false);
            }}
            style={
              this.props.isSettingOpen ||
              this.props.isBackup ||
              this.props.isShowNew ||
              this.props.isOpenDeleteDialog ||
              this.props.isOpenEditDialog ||
              this.props.isOpenAddDialog ||
              this.props.isTipDialog ||
              this.props.isShowLoading
                ? {}
                : {
                    display: "none",
                  }
            }
          ></div>
        }

        {this.props.isMessage && <MessageBox />}
        {this.props.isSortDisplay && <SortDialog />}
        {this.props.isAboutOpen && <AboutDialog />}
        {this.props.isBackup && <BackupDialog />}
        {this.props.isSettingOpen && <SettingDialog />}
        {this.props.isTipDialog && <TipDialog />}
        {(!books || books.length === 0) && this.state.totalBooks ? (
          <Redirect to="/manager/loading" />
        ) : (
          <Switch>
            {routes.map((ele) => (
              <Route
                render={() => <ele.component />}
                key={ele.path}
                path={ele.path}
              />
            ))}
          </Switch>
        )}
      </div>
    );
  }
}
export default Manager;
