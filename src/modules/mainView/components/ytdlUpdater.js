import React, {Component} from 'react'
import {Label, Popup} from "semantic-ui-react";
import environment from '../../../../environment'
import {update} from '../../../tools/updater'
let os = require('os');

export default class YtdlUpdater extends Component {
    constructor(props) {
        super(props);
        this.state = {visible: false};
    }

    componentDidMount() {
        if (environment.debug === false && os.platform() === 'linux') return;

        const updateState = () => this.setState({visible: true});
        update(function error(err, done) {
            if (err) {
                return console.log(err.stack);
            }
            console.log(done);

            if (!done.includes('Already up to date'))
                updateState();
        });
    }

    render() {
        return (<Popup
            trigger={<Label circular color='orange' style={{display: this.state.visible ? 'block' : 'none'}}>1</Label>}
            content='A library has been updated, please restart the application'
            position='bottom center'
        />)
    }
}