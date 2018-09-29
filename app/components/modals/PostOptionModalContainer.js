import { connect } from 'react-redux';
import { closeModal } from '../../actions/ui_actions';
import PostOptionsModal from './PostOptionsModal';

// functionalities:
// 1 - copy post URL
// 2 - send invite(s)
// 3 - unfollow
// 4 - report event

const mapStateToProps = (state) => ({
	currentUser: state.session.currentUser,
	postId: state.ui.modals.postOptionsModal
});

const mapDispatchToProps = (dispatch) => ({
	closeModal: (modalName) => dispatch(closeModal(modalName))
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PostOptionsModal);