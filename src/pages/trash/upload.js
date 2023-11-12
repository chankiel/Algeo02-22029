import image from './../../assets/img.png'
import './upload.css';
import './../home/homestyle.css'
import React, { useState } from 'react';
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom'
import ZipperFile from "./ZipperFile.js"

function Upload() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8080/search', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.message) {
        alert('File uploaded successfully');
      } else {
        alert('Error uploading file');
      }
    }catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    };
  }
  return (
    <main>
      <div>
        <div class="topnav" style={{marginLeft:"9cm"}}>
                <a class="texte disabled" style={{fontSize:"40px",fontFamily: "Avigea",color:"white"}}>Kamera Sabun</a>
                <Link style={{fontFamily: "Poppins",fontSize:"24px",padding:"40px"}} to={"./../Home"}>Home</Link>
                <a style={{fontFamily: "Poppins",fontSize:"24px",padding:"40px",color:"white",fontWeight:"bold"}}>Upload</a>
                <Link style={{fontFamily: "Poppins",fontSize:"24px",padding:"40px"}} to={"./../About"}>About</Link>
        </div>
        <div style={{paddingLeft:"24px",color:"white"}}>
                <div class = "squareupload" id = "home" style={{marginTop:"6.5cm",marginLeft:"4cm"}}>
                    <h2 style={{fontSize:"60px",fontFamily:"Poppins-Thicc",marginTop:"5cm",marginLeft:"165px",paddingTop:"0.3cm",color:"black"}}>Upload your photo here!</h2>
                    <p style={{fontFamily:"Poppins",fontSize:"20px",marginLeft:"93px",marginTop:"1cm",color:"black"}}>Tekan tombol 'Upload' yang ada di dibawah. Lalu pilihlah foto dengan format .png dan .jpg</p>
                    <p style={{fontFamily:"Poppins",fontSize:"20px",lineHeight:"0px",marginLeft:"17px",color:"black"}}>Setelah mendapatkan foto yang diinginkan. Klik 'Submit' agar Kamera Sabun bisa mencari gambar serupa!</p>
                    <p style={{fontFamily:"Poppins",fontSize:"20px",marginLeft:"300px",paddingBottom:"10px",color:"black"}}>Tombol 'Upload' dan 'Submit' ada di bawah anda!</p>
                    <form id="myForm">
                      <input type="file" onChange={handleFileChange} />
                      <button onClick={handleUpload}>Upload</button>
                      <div class = "squareprev">
                        <p style={{color:"black",fontFamily:"Poppins-Thicc",marginLeft:"85px",fontSize:"50px"}}>Preview</p>
                        <img src={URL.createObjectURL(file)} style={{width:"50%",height:"50%",marginTop:"130px",marginLeft:"-195px"}}/>
                      </div>
                      <div>
                        <a style={{opacity:"0"}}>a</a>
                      </div>
                    </form>
                    <div>
                    <ZipperFile />
                    </div>
                </div>
        </div>
      </div>
    </main>
  );
}

export default Upload;
