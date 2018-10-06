import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

class CopyEventLink extends React.Component {
	state = {
		copied: false
	}
	render() {
		const eventURL = `${window.location.host}/event/${this.props.postId}`;
		const copyText = this.state.copied ? 'copied!' : '[copy to clipboard]';
		return (
			<div>
				<CopyToClipboard
					text={eventURL}
					onCopy={() => this.setState({copied: true})}>
					<span>{copyText}</span>
				</CopyToClipboard>
			</div>
		)
	}
}

export default CopyEventLink;