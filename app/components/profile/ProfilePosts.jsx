import React from 'react';
import PropTypes from 'prop-types';
import ImageMasonry from './ImageMasonry';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { groupByGranularity } from '../../utils/dates';
import { TIMELINE_GRANULARITIES } from '../../constants';
/**
 * Publically viewable page, don't need to be signed in
 */

const MILLISECONDS_IN_DAY = 86400000;

class ProfilePosts extends React.Component {
  componentDidMount() {``
    this.props.getPosts();
  }

  formatSection = (groupKey, granularity) => {
    return moment(groupKey, TIMELINE_GRANULARITIES[granularity]).format(
      'MMMM YYYY'
      );
  }

  render() {
    const gran = 'DAY';
    const { posts } = this.props;
    const groupedPosts = groupByGranularity(posts, gran);
    const sections = Object.keys(groupedPosts).sort();
    return (
      <div className='timeline-container'>
        {
          sections.map(groupKey => {
            let posts = groupedPosts[groupKey];
            return (
              <div key={groupKey}>
                {this.formatSection(groupKey, gran)}
                <ImageMasonry
                  numCols={3}
                  animate={false}
                  scrollable={false}
                  className='masonry-container'
                >
                  {posts.map((post, idx) => (
                    <Link key={idx} to={`/event/${post.id}`}>
                      <img
                        src={post.thumb_url}
                        alt={post.thumb_url}
                      />
                    </Link>
                  ))}
                </ImageMasonry>
              </div>
            )
        }
      )}
      </div>
    );
  }
}

ProfilePosts.propTypes = {
  posts: PropTypes.object,
}

export default ProfilePosts;
