import { connect } from 'react-redux';
import { openModal } from '../../actions/ui_actions';
import { selectOpenModal } from '../../reducers/selectors';

import Modal from './Modal';

const mapStateToProps = (state) => ({
	modalName: selectOpenModal(state.ui.modals)
});

const mapDispatchToProps = (dispatch) => ({
	openModal: (modalName) => dispatch(openModal(modalName)),
});

export default connect(
	mapDispatchToProps
)(Modal);