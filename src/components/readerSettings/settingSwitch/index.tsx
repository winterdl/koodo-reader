import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import SettingSwitch from "./component";
import { stateType } from "../../../store";
import { handleMessageBox, handleMessage } from "../../../store/actions";

const mapStateToProps = (state: stateType) => {
  return {
    currentEpub: state.book.currentEpub,
    locations: state.progressPanel.locations,
    isReading: state.book.isReading,
    renderFunc: state.book.renderFunc,
  };
};
const actionCreator = { handleMessageBox, handleMessage };
export default connect(
  mapStateToProps,
  actionCreator
)(withTranslation()(SettingSwitch as any));
