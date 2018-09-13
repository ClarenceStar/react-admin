import './index.styl';
import React from 'react';
import PropTypes from 'prop-types';
import { uploadImg, uploadBigImg, uploadAll } from 'services/UploadService';

class Uploader extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            accept: '*'
        };
    }

    render() {
        const {accept, multiple, uploadLabel} = this.props;
        return (
            <div className="file-upload">
                <label className="button button--normal button--primary">{uploadLabel}
                    <form ref="form" className="file-upload__form">
                        <input onChange={this._onChange.bind(this)} multiple={multiple} type="file" accept={accept} className="file-upload__input"/>
                    </form>
                </label>
            </div>
        )
    }

    _onChange(e) {
        const {beforeUpload, multiple} = this.props;
        const fileList = e.target.files;
        if (!fileList.length)
            return;

        const file = multiple
            ? fileList
            : fileList[0],
            upload = this.props.upload ? this.props.upload : this._upload.bind(this);

        if (beforeUpload) {
            let before = beforeUpload(file);
            if (before && !!before.then) {
                before.then(file => {
                    if(file) {
                        upload(file);
                    }
                }).catch(err => {
                    throw err;
                });
            } else if (!!before) {
                upload(file);
            }
        } else {
            upload(file);
        }
    }

    _upload(file) {
        const { uploadType, uploadData, onStart, isBigImg, onSuccess, onError } = this.props;
    
        if (uploadType === 'file') {
            onStart && onStart();
            uploadAll(uploadData, file).then(res => {
            res.forEach( response => {
                    onSuccess && onSuccess(response);
                })
            }).catch(err => {
                onError && onError(err[0]);
            });
        } else if (uploadType === 'img') {
            onStart && onStart();
            if ( !!isBigImg ) {
                uploadBigImg(uploadData, file).then(res => {
                    onSuccess && onSuccess(res);
                }).catch(err => {
                    onError && onError(err);
                });
            }else{
                uploadImg(uploadData, file).then(res => {
                    onSuccess && onSuccess(res);
                }).catch(err => {
                    onError && onError(err);
                });
            }
        } else {
            throw new Error('uploader: invalid upload type');
        }
    }
}

Uploader.defaultProps = {
    accept: '*',
    multiple: false,
    uploadData: {},
    uploadType: 'file',
    uploadLabel: '上传'
}

Uploader.propTypes = {
    /**
     * 允许上传的文件类型
     */
    accept: PropTypes.string,
    /**
     * 是否多文件上传
     */
    multiple: PropTypes.bool,
    /**
     * 是否为大图
     */
    isBigImg: PropTypes.bool,
    /**
     * 上传种类
     */
    uploadType: PropTypes.string,
    uploadData: PropTypes.object,
    beforeUpload: PropTypes.func,
    upload: PropTypes.func,
    onStart: PropTypes.func,
    onSuccess: PropTypes.func,
    onError: PropTypes.func,
    uploadLabel: PropTypes.string
}

export default Uploader;
