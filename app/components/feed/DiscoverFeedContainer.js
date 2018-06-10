import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import DiscoverFeed from './DiscoverFeed';

const mapStateToProps = (state) => ({
  currentUser: state.session.currentUser,
});

const mapDispatchToProps = (state) => ({

});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscoverFeed));
