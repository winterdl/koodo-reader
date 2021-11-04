import {
  handleFetchNotes,
  handleFetchBookmarks,
  handleFetchChapters,
  handleFetchBooks,
  handleReadingBook,
} from "../../store/actions";
import { connect } from "react-redux";
import { stateType } from "../../store";
import Reader from "./component";
import { withTranslation } from "react-i18next";

const mapStateToProps = (state: stateType) => {
  return {
    currentEpub: state.book.currentEpub,
    currentBook: state.book.currentBook,
    percentage: state.progressPanel.percentage,
    htmlBook: state.reader.htmlBook,
  };
};
const actionCreator = {
  handleFetchNotes,
  handleFetchBookmarks,
  handleFetchChapters,
  handleFetchBooks,
  handleReadingBook,
};
export default connect(
  mapStateToProps,
  actionCreator
)(withTranslation()(Reader));
