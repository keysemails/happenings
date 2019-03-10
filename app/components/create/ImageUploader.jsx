import React from 'react';
import PropTypes from 'prop-types';
// make life easier
import DropZone from 'react-dropzone';

class ImageUploader extends React.Component {
	constructor() {
		super();
		this.state = {
			files: [],
			fileLoaded: false
		}
	}
	clear = () => {
		if (this.state.fileLoaded) {
			this.clearLoadedFiles(this.state.files);
			this.setState({
				files: [],
				fileLoaded: false
			});
		}
	}
	clearLoadedFiles = (files) => {
		files.forEach(file => {
			window.URL.revokeObjectURL(file);
		});
    // clears the file reference in the store
    this.props.clearLocalImage();
	}
	componentWillUnmount() {
		if (this.state.fileLoaded) {
			this.clearLoadedFiles(this.state.files);
		}
	}
	onDrop = (files) => {
		this.props.onDrop(files[0]);
		this.setState({
			files: files,
			fileLoaded: true
		});
	}
	genPreview(files) {
		return (
			<div>
				<div onClick={this.clear}>[ x ]</div>
				<div className='preview-container'>
					{files.map((file) => {
						return (
							<img
								key={file.name}
								src={file.preview}
								width="300"
								height="300"
							/>
						)
					})}
				</div>
			</div>
		)
	}
	render() {
		const dropZone = (
			<DropZone
				onDrop={this.onDrop}
				multiple={false}
				disableClick={this.state.files.length > 0}
			>
				<div>drag n drop or click to select file upload</div>
			</DropZone>
		)
		return (
			<div className='dropzone'>
				{this.state.fileLoaded ? this.genPreview(this.state.files) : dropZone}
			</div>
		)
	}

}
ImageUploader.propTypes = {
	onDrop: PropTypes.func,
}

export default ImageUploader;
