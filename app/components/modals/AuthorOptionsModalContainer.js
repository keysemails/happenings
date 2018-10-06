import { connect } from 'react-redux';
import { closeModal } from '../../actions/ui_actions';
import { modalTypes as MODAL_TYPES } from '../../constants/modalTypes';
import AuthorOptionsModal from './AuthorOptionsModal';

const mapStateToProps = (state) => ({
	currentUser: state.session.currentUser,
	postId: state.ui.modals.authorOptionsModal
});

const mapDispatchToProps = (dispatch) => ({
	closeModal: () => dispatch(closeModal(MODAL_TYPES.AUTHOR_OPTIONS_MODAL))
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AuthorOptionsModal);