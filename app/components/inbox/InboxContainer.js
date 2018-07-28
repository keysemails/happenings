import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getUserInvites } from '../../actions/inbox';
import Inbox from './Inbox.jsx';

const mapStateToProps = state => ({
	loggedIn: !!state.session.currentUser,
	currentUser: state.session.currentUser,
});

const mapDispatchToProps = dispatch => ({
	getInvites: (uid) => dispatch(getUserInvites(uid))
});

export default withRouter(connect(
	mapStateToProps,
	mapDispatchToProps,
)(Inbox));