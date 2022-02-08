import React, { Component } from 'react';
import _ from 'lodash';
import "../../assets/css/components/fileInput.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { Close } from "@material-ui/icons";

class FileInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			files: [],
		}
	}

	handleChange = (ev) => {
		const files = [...ev.target.files];
		_.forEach(files, (file) => {
			file.preview = URL.createObjectURL(file);
		})
		this.setState({files})
		this.props.onChange(ev, files);
		ev.target.value = '';
	}

	close = () => {
		this.setState({files: []})
	}

	render() {
		const {files} = this.state;
		const {onClick, ...props} = this.props;
		return (
			<div className="fileInput_content">
        <span className="close_avd" onClick={ () => {
	        onClick()
	        this.close()
        } } title="Remove"><Close/></span>
				<label className="fileInput">
					{ !_.isEmpty(files) ? <ul>
							{ files.map((file, key) => (
								<li key={ key }>
									<img src={ file.preview }
									     className="avatar"
									     alt={ file.name }
									     onError={ ev => {
										     ev.target.src = "/images/icons/avatar.jpg"
									     } }
									/>
								</li>
							)) }
						</ul> :
						<div className="emptyFile__content">
							<FontAwesomeIcon icon={ faCamera } className="imageIcon"/>
						</div> }
					<input { ...props } type="file" onChange={ this.handleChange }/>
				</label>
			</div>
		);
	}
}

export default FileInput;
