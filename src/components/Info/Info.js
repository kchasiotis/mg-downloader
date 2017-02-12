import React, {Component} from 'react';
import {Progress, Input, Icon, Image, List, Popup, Modal, Grid} from 'semantic-ui-react'

import {DownloadFolder} from '../settings/settings'

import videoTools from '../../tools/videoTools/videoTools'
const fs = require('fs');

function Rename(props) {
    return (
        <Input fluid label="filename" value={props.filename} onChange={props.handleFilename}/>
    );
}

class ItemSettings extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal size='small' trigger={<Icon link name='setting' size='large' color="black"/>}>
                <Modal.Header style={{textAlign: 'center'}}>Item settings</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Grid columns='equal'>
                            <Grid.Column>
                            </Grid.Column>
                            <Grid.Column computer={8} tablet={10} mobile={16}>
                                <Rename filename={this.props.filename} handleFilename={this.props.handleFilename}/>
                                <DownloadFolder onPathChange={this.props.onPathChange} genericPath={this.props.genericPath} path={this.props.path}/>
                            </Grid.Column>
                            <Grid.Column>
                            </Grid.Column>
                        </Grid>
                    </Modal.Description>
                </Modal.Content>
            </Modal>
        );
    }
}

function DownloadIcon(props) {
    return (
        <Popup
            trigger={
                <Icon name='download' size='large' color="blue"
                      link={props.downloadPath.exists}
                      disabled={!props.downloadPath.exists}
                      onClick={props.handleVideoDownload}/>
            }
            content='Download'
        />
    );
}

function RemoveIcon(props) {
    return (
        <Popup
            trigger={
                <Icon link name='remove' size='large' color="red"
                      onClick={props.handleVideoRemove}/>
            }
            content='Remove from list'
        />
    );
}

function ProgressBar(props) {
    return (
        <Progress progress color='green'
                  percent={props.percent}
                  indicating={(props.percent != 0) && (props.percent != 100)}/>
    );
}

class InfoItem extends Component {
    constructor(props) {
        super(props);
        this.state = {percent: '0', filename: this.props.video.title, path: null};

        this.handleVideoDownload = this.handleVideoDownload.bind(this);
        this.onMp3Completion = this.onMp3Completion.bind(this);
        this.onGetPercentage = this.onGetPercentage.bind(this);
        this.handleVideoRemove = this.handleVideoRemove.bind(this);
        this.handleFilename = this.handleFilename.bind(this);
        this.onPathChange = this.onPathChange.bind(this);
    }

    handleVideoDownload() {
        // Disable download if folder doesn't exists
        if (!this.props.downloadPath.exists) return;
        console.log('run download');
        // Get paths
        let path = this.state.path ? this.state.path : this.props.downloadPath.value;
        this.tempFilename = path + '/' + this.state.filename + '.temp';
        this.audioFilename = path + '/' + this.state.filename + '.mp3';

        let onDownloadComplete = videoTools.convertToMp3(this.tempFilename, this.audioFilename, this.onGetPercentage, this.onMp3Completion);

        videoTools.downloadFromServer(this.tempFilename, this.props.video.url, onDownloadComplete, this.onGetPercentage);
    }

    onMp3Completion() {
        this.setState({percent: 100});
        fs.unlink(this.tempFilename);
    }

    onGetPercentage(percentage) {
        this.setState({percent: percentage.toFixed(0)});
    }

    handleVideoRemove() {
        this.props.handleRemoveVideo(this.props.video.id);
    }

    handleFilename(e) {
        this.setState({filename: e.target.value});
    }

    onPathChange(path) {
        this.setState({path: path});
    }

    render() {
        if (this.props.video.loading)
            return (
                <p>loading...</p>
            );

        return (
            <List.Item style={{textAlign: 'left'}}>
                <List.Content floated='right'>
                    <DownloadIcon downloadPath={this.props.downloadPath}
                                  handleVideoDownload={this.handleVideoDownload}/>
                </List.Content>
                <List.Content floated='right'>
                    <ItemSettings filename={this.state.filename} handleFilename={this.handleFilename}
                                  onPathChange={this.onPathChange} genericPath={this.props.downloadPath.value} path={this.state.path}/>
                </List.Content>
                <List.Content floated='right'>
                    <RemoveIcon handleVideoRemove={this.handleVideoRemove}/>
                </List.Content>
                <Image avatar src={this.props.video.thumbnail}/>
                <List.Content>
                    {this.state.filename}
                </List.Content>
                <ProgressBar percent={this.state.percent}/>
            </List.Item>
        );
    }
}

function InfoList(props) {

    const listItems = props.videos.map((video) =>
        <InfoItem key={video.id || video.url}
                  video={video}
                  downloadPath={props.downloadPath}
                  handleRemoveVideo={props.handleRemoveVideo}/>);

    return (
        <List divided ordered size="large">
            {listItems}
        </List>
    );
}

function Info(props) {
    if (props.videos.size == 0)
        return <h2>Info</h2>;

    return (
        <div>
            <InfoList videos={props.videos}
                      downloadPath={props.downloadPath}
                      handleRemoveVideo={props.handleRemoveVideo}/>
        </div>
    );
}

export default Info;