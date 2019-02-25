import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import App from './App';
import { fetchCurrentUser, proceedWithoutLogin } from '../actions/session_actions';
import { getUserNotifications } from '../actions/inbox_actions';

const mapStateToProps = state => ({
  loggedIn: !!state.session.currentUser,
  loaded: ( state.session.proceedWithoutLogin ||
    (
    state.ui.loading.userLoaded &&
    state.ui.loading.notificationsLoaded
    )
  )
});

const mapDispatchToProps = dispatch => ({
  fetchUser: (email, uid) => dispatch(fetchCurrentUser(email, uid)),
  getUserNotifications: (uid) => dispatch(getUserNotifications(uid)),
  proceedWithoutLogin: () => dispatch(proceedWithoutLogin())
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(App));
