import React from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { getPostData as _getPostData } from '../../utils/post';
import PostContainer from './PostContainer';

/**
 * Publically viewable Event page, don't need to be signed in. Will redirect to
 * public landing if 'like' or 'attend' is clicked with no signed in user.
 */

class PostPage extends React.Component {
    componentWillReceiveProps(nextProps) {
        if (nextProps.location.pathname != this.props.location.pathname) {
            window.location.reload();
        }
    }
    componentDidMount() {
        const id = this.props.match.params.event_id;
        this.props.getPostData(id);
    }
    addPost = () => {
        const id = this.props.match.params.event_id;
        const postData = this.props.posts[id];

        // TODO: ACTUAL 404 HANDLING -- in some global reduxy way!
        // should not be handled at the component level
        // in Main.jsx we can have a check if some
        // this.props.404 = true, redirect to 404 page
        if (!postData) {
            return (<Redirect to='/' />); 
        }
        return (
            <PostContainer
                id={id} // :'(
                author={postData.author}
                full_storage_uri={postData.full_storage_uri}
                full_url={postData.full_url}
                caption={postData.text}
                thumb_storage_uri={postData.thumb_storage_uri}
                thumb_url={postData.thumb_url}
                event_timestamp={postData.event_timestamp}
                title={postData.title}
                location={postData.location}
                description={postData.description}
            />
        )
    }
    render() {
        return (
            <div>
                {this.props.loaded && this.addPost()}
            </div>
        )
    }
}

export default PostPage;