import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UploadImage from './UploadImage';
//import FolderUpload from './components/FolderUpload';
import FileUploadForm from './ZippingFolder';
import { Link,useNavigate } from 'react-router-dom'

function Upload() {
 return (
    <main>
    <div>
      <div class="topnav" style={{marginLeft:"9cm"}}>
              <a class="texte disabled" style={{fontSize:"40px",fontFamily: "Avigea",color:"white"}}>Kamera Sabun</a>
              <Link style={{fontFamily: "Poppins",fontSize:"24px",padding:"40px"}} to={"./../Home"}>Home</Link>
              <a style={{fontFamily: "Poppins",fontSize:"24px",padding:"40px",color:"white",fontWeight:"bold"}}>Upload</a>
              <Link style={{fontFamily: "Poppins",fontSize:"24px",padding:"40px"}} to={"./../About"}>About</Link>
      </div>
      <br></br>
      <UploadImage />
      <FileUploadForm />
    </div>
  </main>
 )
}

export default Upload;
