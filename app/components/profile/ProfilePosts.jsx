import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { groupByGranularity } from '../../utils/dates';
import {
  TIMELINE_GRANULARITIES,
  TIMELINE_GROUPBY_KEYS,
  TIMELINE_FEED_TYPES
} from '../../constants';

import ImageMasonry from '../util/ImageMasonry';
import TimelineSelector from './TimelineSelector';
import GranularitySelector from './GranularitySelector';

/**
 * Publically viewable page, don't need to be signed in
 */
class ProfilePosts extends React.Component {
  DEFAULT_STATE = {
    selection: TIMELINE_FEED_TYPES.ATTENDING,
    granularity: TIMELINE_GRANULARITIES.MONTH,
  }
  state = {...this.DEFAULT_STATE};

  componentDidMount() {
    this.props.getPosts();
  }
  // TODO: Finalize the date formatting here.
  formatSection = (groupKey, granularity) => {
    const formatKey = TIMELINE_GROUPBY_KEYS[granularity];
    return moment(groupKey, formatKey).format(
      formatKey
      );
  }
  render() {
    const { posts } = this.props;
    const groupedPosts = groupByGranularity(posts, this.state.granularity);
    const sections = Object.keys(groupedPosts).sort();

    const masonrySections = sections.map(groupKey => {
      let sectionPosts = groupedPosts[groupKey];
      let sectionTitle = this.formatSection(groupKey, this.state.granularity);
      let masonryBody = sectionPosts.map((post, idx) => (
        <Link key={idx} to={`/event/${post.id}`}>
          <img src={post.thumb_url} alt={post.thumb_url} />
        </Link>
        )
      );
      return (
        <div key={groupKey}>
          {sectionTitle}
          <ImageMasonry
            numCols={3}
            animate={false}
            scrollable={false}
            className='masonry-container'
          >
            {masonryBody}
          </ImageMasonry>
        </div>
      )
    });

    return (
      <div className='timeline-container'>
        <TimelineSelector
          selection={this.state.selection}
          onChange={(selection) => this.setState({selection})}
        />
        <GranularitySelector
          selection={this.state.granularity}
          onChange={(granularity) => this.setState({granularity})}
        />
        {masonrySections}
      </div>
    );
  }
}

ProfilePosts.propTypes = {
  posts: PropTypes.object,
  getPosts: PropTypes.func,
}

export default ProfilePosts;
