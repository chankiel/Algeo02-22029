import React, { useCallback, useMemo, useState } from 'react';
import axios from 'axios';
import JSZip from 'jszip';
import { useDropzone } from 'react-dropzone';

const FileUploadForm = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    setSelectedFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const onChangeFile = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      console.error('No files selected.');
      return;
    }

    const zip = new JSZip();
    const files = selectedFiles;

    for (let file of files) {
      zip.file(file.name, file);
    }

    zip.generateAsync({ type: 'blob' }).then((content) => {
      const formData = new FormData();
      formData.append('zipFile', content);

      axios.post('http://localhost:8080/upload-zip', formData)
        .then(response => {
          console.log(response.data); // Handle the response accordingly
        })
        .catch(error => {
          console.error('Error uploading and zipping files', error);
        });
    });
  };

  const dropzoneStyles = useMemo(() => ({
    border: '5px dashed #fff8dc',
    borderRadius: '4px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
    height: '40px',
    width: '200px',
    margin: '20px 20px 0px 20px',
    backgroundColor: '#f0ffff'
  }), []);

  return (
    <div>
      <div {...getRootProps()} style={dropzoneStyles}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Click Upload to Procces Dataset Extraction</p> :
            <p>Upload Dataset Here</p>
        }
      </div>
      <button type="button" onClick={onChangeFile} style={buttonSyle}>
        Upload 
      </button>
    </div>
  );
};

const buttonSyle = {
  margin: '20px',
  color: 'white',
  backgroundColor: '#a9a9a9',
  width: '60px',
  height: '30px',
  border: '2px solid "fff',
  borderRadius: '9px',
  cursor: 'pointer'
}

export default FileUploadForm;
