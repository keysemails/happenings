import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Header from './Header';
import { logOut } from '../../actions/session_actions';
import { countUnreadNotifications } from '../../reducers/selectors';

const mapStateToProps = state => ({
  loggedIn: !!state.session.currentUser,
  currentUser: state.session.currentUser,
  unreadNotificationCount: countUnreadNotifications(state)
});

const mapDispatchToProps = dispatch => ({
  logOut: () => dispatch(logOut())
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Header));
