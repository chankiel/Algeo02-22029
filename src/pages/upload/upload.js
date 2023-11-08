import image from './../../assets/img.png'
import './upload.css';
import './../home/homestyle.css'
import { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom'

function Upload() {
  function uploadForm () {
    document.getElementById("submite").disabled = false;
  }

  const [file, setFile] = useState();
    function handleChange(e) {
      uploadForm();
        console.log(e.target.files);
        setFile(URL.createObjectURL(e.target.files[0]));
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
                      <input style={{marginLeft:"420px"}} type="file" id="fileInput" name="file" onChange={handleChange}/>
                      <button disabled={true} id="submite" type="submit" value = "Submit">Submit</button>
                      <div class = "squareprev">
                        <p style={{color:"black",fontFamily:"Poppins-Thicc",marginLeft:"85px",fontSize:"50px"}}>Preview</p>
                        <img src={file} style={{width:"50%",height:"50%",marginTop:"130px",marginLeft:"-195px"}}/>
                      </div>
                      <div>
                        <a style={{opacity:"0"}}>a</a>
                      </div>
                    </form>
                </div>
        </div>
      </div>
    </main>
  );
}

export default Upload;
