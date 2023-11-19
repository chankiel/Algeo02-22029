import React, { useCallback, useState } from 'react';
import JSZip from 'jszip';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import "./dataset.css"
import Swal from 'sweetalert';
import validator from 'validator';

const FileUploadForm = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [diffTime, setDiffTime] = useState(false);
  const [secondTime, setSecondTime] = useState(0);
  const [datasetSource, setDatasetSource] = useState(false);
  const [url, setUrl] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setSelectedFiles(acceptedFiles);
    setDiffTime(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, disabled: loading });

  const changeDatasetSource = () => {
    console.log('Source Dataset: ', datasetSource);
    var temp = datasetSource;
    setDatasetSource(!temp);
    console.log('Source After: ', datasetSource);
  }

  const onChangeFile = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      console.error('No files selected.');
      return;
    }
    setDiffTime(false);
    const startTime = performance.now();
  
    const zip = new JSZip();
    const files = selectedFiles;
  
    for (let file of files) {
      zip.file(file.name, file);
    }
  
    setLoading(true);
    setSelectedFiles([]);
  
    try {
      const content = await zip.generateAsync({ type: 'blob' });
      const formData = new FormData();
      formData.append('zipFile', content);
  
      const response = await axios.post('http://localhost:8080/upload-zip', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 40000,
      });
  
      console.log(response.data);
      Swal("Upload Data Set berhasil."); // Handle the response accordingly
    } catch (error) {
      console.error('Error uploading and zipping files', error);
      alert(error.message || 'Error uploading and zipping files');
    } finally {
      setLoading(false);
      const endTime = performance.now();
      setDiffTime(true);
      var temp = endTime - startTime;
      var temp2 = temp / 1000;
      if (temp2 < 0) {
        temp2 = 0;
      }
      setSecondTime(temp2);
    }
  };
  
  const handleUrlChange = (event) => {
    const enteredUrl = event.target.value;
    setUrl(enteredUrl);
    setIsValidUrl(validator.isURL(enteredUrl));
    setDiffTime(false);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    setDiffTime(false);
    const startTime = performance.now();
  
    setLoading(true);
    setIsValidUrl(false);
    
    try {
      // Make a POST request to your backend API with the entered URL
      const response = await fetch(`http://localhost:8080/scrape/${url}`, {method:'GET'});
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const responseData = await response.json();
      console.log(responseData);
      Swal('Image scraping successful');
    } catch (error) {
    console.error('Error scraping URL', error);
    alert(error.message || 'Error scraping URL');
    } finally {
    setLoading(false);
    const endTime = performance.now();
    setDiffTime(true);
    var temp = endTime - startTime;
    var temp2 = temp / 1000;
    if (temp2 < 0) {
        temp2 = 0;
    }
    setSecondTime(temp2);
    }
  };
  
  return (
    <div className='main-dataset'>
      <div className='type-search special-case'>
        <p>Local</p>
        <label className='switch'>
          <input type='checkbox' value='1' onChange={changeDatasetSource}></input>
          <span className='slider'></span>
        </label>
        <p>Scraping</p>
      </div>
      {datasetSource ? (
        <div className='box-dataset scraping-input'>
          {!loading && (
            <form onSubmit={handleFormSubmit} className='url-input-form'>
              <label htmlFor="urlInput"></label>
              <input
                type="text"
                id="urlInput"
                name="urlInput"
                value={url}
                onChange={handleUrlChange}
                placeholder="www.example.com"
                autoComplete='off'
              />
            {isValidUrl && (<button type="submit">Scrape</button>)}
            </form>
          )}
          {loading && (
          <div className='loading-style'>
            <div className='box-input loading'>
              <p id="loading-disable">Loading</p>
            </div>
            <div className='typing-animation'>
              <div className="dot dot1"></div>
              <div className="dot dot2"></div>
              <div className="dot dot3"></div>
            </div>
          </div>
          )}
          {diffTime && (
          <div className='success-bottom'>
            <p>Berhasil diupload dalam waktu {secondTime.toFixed(2)}s.</p>
          </div>
        )}
      </div>
      ):(
      <div className='box-dataset'>
        {!loading && (
          <div {...getRootProps()} className='box-input' disabled={loading}>
            <input {...getInputProps()} className='input-dataset' disabled={loading}/>
            <div>
              {
                selectedFiles.length !== 0 ?
                  (<div className='file-exist'>
                    <div className='chosen-file'>
                      {selectedFiles.length === 1 ? 
                      (<p>
                        {selectedFiles.length} File Chosen
                      </p>) : (
                        <p>
                          {selectedFiles.length} Files Chosen
                        </p>
                      )}
                    </div>
                  </div>) :
                  <div className='no-file'>
                    <p>Upload Dataset Here</p>
                  </div>
              }
            </div>
          </div>
        )}
        {loading && (
          <div className='loading-style'>
            <div className='box-input loading'>
              <p id="loading-disable">Loading</p>
            </div>
            <div className='typing-animation'>
              <div className="dot dot1"></div>
              <div className="dot dot2"></div>
              <div className="dot dot3"></div>
            </div>
          </div>
        )}
        {selectedFiles.length !== 0 && (
          <div className='label-upload'>
            <label htmlFor="upload-dataset" className='butn dataset-upload'>
              Upload
            </label>
            <button id="upload-dataset" type="button" onClick={onChangeFile} style={{display: 'none'}}>
            </button>
          </div>
        )}
        {diffTime && (
          <div>
            <p>Berhasil diupload dalam waktu {secondTime.toFixed(2)}s.</p>
          </div>
        )}
      </div>
      )}
    </div>
  );
};

export default FileUploadForm;
