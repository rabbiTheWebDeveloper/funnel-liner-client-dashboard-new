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
  position: 'relative',
  borderRadius: 2,
  border: '1px solid #d4c1c1',
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

const deleteButton = {
  position: 'absolute',
  top: 4,
  right: 4,
  background: 'rgba(255, 255, 255, 0.7)',
  border: 'none',
  borderRadius: '50%',
  cursor: 'pointer',
  padding: 2,
};

const ProductImage = ({ productImage, setProductImage, other_images, place="Drag 'n' drop some Product Gallery Image here, or click to select Product Gallery Image" }) => {

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': []
    },
    onDrop: acceptedFiles => {
      setProductImage(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
    }
  });

  const removeImage = (file) => {
    setProductImage(productImage.filter(img => img !== file));
  };

  const thumbs = productImage.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          src={file.preview}
          style={img}
          // Revoke data uri after image is loaded
          onLoad={() => { URL.revokeObjectURL(file.preview) }}
        />
      </div>
      <button style={deleteButton} onClick={() => removeImage(file)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" viewBox="0 0 16 16">
          <path d="M5.5 5.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-6z"/>
          <path fillRule="evenodd" d="M14 3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1h12zM3.5 1a1 1 0 0 0-1 1H14a1 1 0 0 0-1-1h-9zM11 4.5v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7H3.5v7A3.5 3.5 0 0 0 7 15h2a3.5 3.5 0 0 0 3.5-3.5v-7H11z"/>
        </svg>
      </button>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => productImage.forEach(file => URL.revokeObjectURL(file.preview));
  }, [productImage]);

  return (
    <section className="container">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>{place}</p>
      </div>
      <aside style={thumbsContainer}>
        {productImage.length > 0 ? thumbs : other_images?.map(image => (
          <div style={thumb} key={image}>
            <div style={thumbInner}>
              <img src={image} style={img} />
            </div>
            <button style={deleteButton} onClick={() => removeImage(image)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" viewBox="0 0 16 16">
                <path d="M5.5 5.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-6z"/>
                <path fillRule="evenodd" d="M14 3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1h12zM3.5 1a1 1 0 0 0-1 1H14a1 1 0 0 0-1-1h-9zM11 4.5v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7H3.5v7A3.5 3.5 0 0 0 7 15h2a3.5 3.5 0 0 0 3.5-3.5v-7H11z"/>
              </svg>
            </button>
          </div>
        ))}
      </aside>
    </section>
  );
};

export default ProductImage;
