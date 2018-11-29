import React from 'react';
import { Redirect } from 'react-router-dom';
import ImageUploader from './ImageUploader.jsx';
import EventInfoForm from './EventInfoForm.jsx';

import { uploadEvent } from '../../utils/upload';

class CreateEvent extends React.Component {
	// need some sort of 'cancel' button htat removes the current preview
	// and restores the imageuploader component
	// switching between preview and imageupload dropbox should be handled by
	// the ImageUploader component

	// TODO: after successful creation by DB, display a link to the new event
	// that the user can send their friends, etc
	constructor() {
		super();
		this.state = {
			imageLoaded: false,
			eventImage: null,
			successFullyCreatedEvent: false
		}
	}
	imageUploadCallback = (file) => {
		this.setState({
			imageLoaded: true,
			eventImage: file
		});
	}
	componentWillUnmount() {
		if (this.state.eventImage) {
			window.URL.revokeObjectURL(this.state.eventImage);
		}
	}
	handleFormInput = (event) => {
		const pic = this.state.eventImage;
		uploadEvent(event, pic, pic.name, response => {
			window.URL.revokeObjectURL(pic);
			if (response.status == 'SUCCESS') {
				this.setState({
					successFullyCreatedEvent: true,
					newEventId: response.message
				});
			} else {
				console.log('something went wrong, please reload page and try again.');
			}
			console.log(response);
			// TODO: redirect to individual event page
		});
	}
	render() {
		if (this.state.successFullyCreatedEvent) {
			return (<Redirect to={`/event/${this.state.newEventId}`} />)
		}
		return (
			<div className='img-upload-container'>
				create event here
				<ImageUploader
					onDrop={(f) => this.setState({eventImage: f, imageLoaded: true})}
				/>
				<EventInfoForm
					imgLoaded={this.state.imageLoaded}
					handleFormInput={this.handleFormInput}
				/>
			</div>
		)
	}
}

export default CreateEvent;