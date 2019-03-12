// src/components/NotFound/index.js
import React, { Component } from 'react';
import Dialog from './Dialog.js'
import { PLynxApi } from '../../API.js';
import LoadingScreen from '../LoadingScreen.js'
import { NODE_STATUS, FILE_TYPES, RESPONCE_STATUS, NODE_RUNNING_STATUS } from '../../constants.js'


const DEFAULT_TITLE = 'File';

export default class FileUploadDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: DEFAULT_TITLE,
      description: 'Uploaded custom file',
      file_type: 'file',
      file_path: null,
      file_name: null,
      uploadProgress: 10,
      loading: false
    };
  }

  handleChange(event) {
    var name = event.target.name;
    console.log(name, event.target.value);

    this.setState({
      [name]: event.target.value
    });

    if (name === 'file-dialog') {
      console.log(event.target.files[0]);
      this.file = event.target.files[0];
      this.setState({
        file_path: this.file,
        file_name: this.file ? this.file.name : null,
        title: this.file && this.state.title == DEFAULT_TITLE ? this.file.name : this.state.title
      })
    }
  }

  handleChooseFile() {
    this.uploadDialog.click()
  }

  upload(retryCount) {
    var self = this;
    let formData = new FormData();
    formData.append('data', this.file);

    const config = {
      headers: { 'content-type': 'multipart/form-data' },
      onUploadProgress: function(progressEvent) {
        var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
        self.setState({
          uploadProgress: percentCompleted
        })
      }
    }

    self.setState({loading: true});
    PLynxApi.endpoints.resource.upload(formData, config)
    .then(function (response) {
      var data = response.data;
      console.log(data);

      if (data.status === RESPONCE_STATUS.SUCCESS) {
        var resourceId = data.resource_id;
        self.props.onPostFile({
          title: self.state.title,
          description: self.state.description,
          base_node_name: 'file',
          node_running_status:NODE_RUNNING_STATUS.STATIC,
          node_status: NODE_STATUS.READY,
          inputs: [],
          parameters: [],
          logs: [],
          outputs:[
            {
              file_type: self.state.file_type,
              name: "out",
              resource_id: resourceId
            }
          ]
        });
        self.props.onClose();
        self.setState({loading: false});
      }

    }).catch(function (error) {
      console.error('error', error);

      if (error.response.status === 401) {
        PLynxApi.getAccessToken()
        .then(function (isSuccessfull) {
          if (!isSuccessfull) {
            console.error("Could not refresh token");
          } else {
            if (retryCount > 0) {
              self.upload(retryCount - 1);
              return;
            }
          }
        });
      } else {
        self.showAlert('Failed to upload file', 'failed');
      }
      self.setState({loading: false});
    })
  }

  render() {
    return (
      <Dialog className=''
              onClose={() => {this.props.onClose()}}
              width={600}
              height={230}
              title={'Upload file'}
              enableResizing={false}
      >
      {this.state.loading &&
        <div className='LoadHolder'>
          <LoadingScreen />
        </div>
      }
        <div className='FileUploadDialogBody selectable'>
          <div className='MainBlock'>

            <div className='TitleDescription'>
              <div className='Title'>
                {this.state.title || 'No title'}
              </div>
              <div className='Description'>
                &ldquo;{this.state.description}&rdquo;
              </div>
            </div>

            <div className={'Type'}>
              <div className='Widget'>
                <img src={"/icons/file_types/" + this.state.file_type + ".svg"} width="20" height="20" alt={this.state.file_type}/>
                {FILE_TYPES.filter((x) => x.type === this.state.file_type)[0].alias}
              </div>
            </div>
          </div>

          <div className='Summary'>
            <div className='Item'>
              <div className={'Name'}>Title:</div>
              <input type='text'
                     name='title'
                     onChange={(e) => this.handleChange(e)}
                     value={this.state.title}
                    />
            </div>

            <div className='Item'>
              <div className={'Name'}>Description:</div>
              <input type='text'
                     name='description'
                     onChange={(e) => this.handleChange(e)}
                     value={this.state.description}
                    />
            </div>

            <div className='Item'>
              <div className={'Name'}>Type:</div>
              <select className='Type'
                type='text'
                name='file_type'
                value={this.state.file_type}
                onChange={(e) => this.handleChange(e)}
              >
              {
                FILE_TYPES.map((description) =>
                  <option
                    value={description.type}
                    key={description.type}
                    >
                    {description.alias}
                    </option>
                )
              }
              </select>
            </div>

            <div className='Item'>
              <div className={'Name'}>File:</div>
              <a href={null}
                 onClick={(e) => {e.preventDefault(); this.handleChooseFile()}}
                 className={"control-button" + (this.state.file_name ? ' selected': '')}>
                 <img src="/icons/file-plus.svg" alt="new file"/> {this.state.file_name || 'Choose file'}
                 <div className='progress-bar'>
                 </div>
              </a>
            </div>
          </div>

          <input
            name="file-dialog"
            type="file"
            onChange={(e) => this.handleChange(e)}
            ref={(ref) => this.uploadDialog = ref} style={{ display: 'none' }}
          />

          <div className='Controls noselect'>
            <a href={null}
               onClick={(e) => {e.preventDefault(); if (this.state.file_name) {this.upload(1)} }}
               className="control-button">
               <img src="/icons/upload.svg" alt="uplaod"/> Upload
            </a>
          </div>
        </div>
      </Dialog>
    );
  }
}
