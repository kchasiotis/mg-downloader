import React from 'react';

import {connect} from 'react-redux'
import {removeVideo} from '../../actions'
import infoItem from '../../components/Info/infoItem'

const mapStateToProps = (state) => {
    const {videoList} = state;
    return {downloadPath: videoList.downloadPath};
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleRemoveVideo: (id) => {
            dispatch(removeVideo(id))
        }
    }
};

const InfoItem = connect(
    mapStateToProps,
    mapDispatchToProps
)(infoItem);

export default InfoItem;