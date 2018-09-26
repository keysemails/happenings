import { connect } from 'react-redux';
import { closeModal } from '../../actions/ui_actions';

// functionalities:
// 1 - copy post URL
// 2 - send invite(s)
// 3 - unfollow
// 4 - report event

const mapDispatchToProps = (dispatch) => {
	closeModal: (modalName) => dispatch(closeModal(modalName))
};