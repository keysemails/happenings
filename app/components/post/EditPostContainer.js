import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

const mapStateToProps = (state, ownProps) => ({
	loggedIn: !!state.session.currentUser,
	currUser: state.session.currentUser,
	post: state.entities.posts[ownProps.match.params.event_id],
});

export default connect(
	mapStateToProps,
	null
)(EditPostPage)