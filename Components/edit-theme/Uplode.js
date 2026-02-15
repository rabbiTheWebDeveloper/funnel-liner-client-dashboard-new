import React, { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid ##d4c1c1',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box'
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};


const Uplode = ({reviewImage, setReviewImage,editInfo}) => {

    const {getRootProps, getInputProps} = useDropzone({
        accept: {
          'image/*': []
        },
        onDrop: acceptedFiles => {
            setReviewImage(acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
          })));
        }
      });
      
      const thumbs = reviewImage.map(file => (
        <div style={thumb} key={file.name}>
          <div style={thumbInner}>
            <img
              src={file.preview}
              style={img}
              // Revoke data uri after image is loaded
              onLoad={() => { URL.revokeObjectURL(file.preview) }}
            />
          </div>
        </div>
      ));
      const thumbs1 = editInfo?.map(file => (
        <div style={thumb} key={file.id}>
          <div style={thumbInner}>
            <img
              src={file.name}
              style={img}
              // Revoke data uri after image is loaded
              onLoad={() => { URL.revokeObjectURL(file.name) }}
            />
          </div>
        </div>
      ));
    
      useEffect(() => {
        // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
        return () => reviewImage.forEach(file => URL.revokeObjectURL(file.preview));
      }, []);
    
    return (
      <div className="PhotoUploader">
        <div {...getRootProps({className: 'dropzone'})}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some image here, or click to select image</p>
        </div>
        <aside style={thumbsContainer}>
          { thumbs?.length>0 ? thumbs :thumbs1}
        </aside>
      </div>
    );
};

export default Uplode;