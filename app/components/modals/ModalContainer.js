import { connect } from 'react-redux';
import { toggleModal } from '../../actions/ui_actions';
import { selectOpenModal } from '../../reducers/selectors';

import Modal from './Modal';

const mapStateToProps = (state) => ({
	modalName: selectOpenModal(state.ui.modals)
});

const mapDispatchToProps = (dispatch) => ({
	toggleModal: (modalName) => dispatch(toggleModal(modalName)),
});

export default connect(
	mapDispatchToProps
)(Modal);