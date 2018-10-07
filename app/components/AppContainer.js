import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import App from './App';
import { fetchCurrentUser } from '../actions/session_actions';
import { getUserNotifications } from '../actions/inbox';

const mapStateToProps = state => ({
  loggedIn: !!state.session.currentUser
})

const mapDispatchToProps = dispatch => ({
  fetchUser: (email, uid) => dispatch(fetchCurrentUser(email, uid)),
  getUserNotifications: (uid) => dispatch(getUserNotifications(uid))
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(App));
