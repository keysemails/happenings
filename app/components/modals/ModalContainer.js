import { connect } from 'react-redux';
import { closeModal } from '../../actions/ui_actions';
import { selectOpenModal } from '../../reducers/selectors';

import Modal from './Modal';

const mapStateToProps = (state) => ({
  modalName: selectOpenModal(state),
});

const mapDispatchToProps = (dispatch) => ({
  closeModal: (modalName) => dispatch(closeModal(modalName)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Modal);
