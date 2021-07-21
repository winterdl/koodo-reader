import BookModel from "../../../model/Book";
import NoteModel from "../../../model/Note";
import BookmarkModel from "../../../model/Bookmark";
export interface SettingInfoProps {
  handleSetting: (isSettingOpen: boolean) => void;
  handleTipDialog: (isTipDialog: boolean) => void;
  handleTip: (tip: string) => void;
  handleMessage: (message: string) => void;
  handleMessageBox: (isShow: boolean) => void;
  t: (title: string) => string;
  bookmarks: BookmarkModel[];
  notes: NoteModel[];
  books: BookModel[];
}
export interface SettingInfoState {
  isTouch: boolean;
  isOpenBook: boolean;
  isDisplayDark: boolean;
  isExpandContent: boolean;
  isDisableUpdate: boolean;
  isDisableAnalytics: boolean;
  isAutoFullscreen: boolean;
  currentThemeIndex: number;
}
