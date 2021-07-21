import { connect } from "react-redux";
import {
  handleMessageBox,
  handleMessage,
  handleOpenMenu,
  handleMenuMode,
  handleNoteKey,
  handleFetchNotes,
} from "../../../store/actions";
import { stateType } from "../../../store";
import { withTranslation } from "react-i18next";
import PopupNote from "./component";
const mapStateToProps = (state: stateType) => {
  return {
    currentEpub: state.book.currentEpub,
    currentBook: state.book.currentBook,
    notes: state.reader.notes,
    color: state.reader.color,
    flattenChapters: state.reader.flattenChapters,
    noteKey: state.reader.noteKey,
  };
};
const actionCreator = {
  handleMessageBox,
  handleMessage,
  handleOpenMenu,
  handleMenuMode,
  handleNoteKey,
  handleFetchNotes,
};
export default connect(
  mapStateToProps,
  actionCreator
)(withTranslation()(PopupNote as any));
