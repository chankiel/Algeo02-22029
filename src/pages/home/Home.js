import { useEffect, useState } from "react"
import "./Home.css"
import "./homestyle.css"
import MAPPIC from './../../assets/PHONPIC.png';
import { Link } from 'react-router-dom'

const Home = () =>{

    return(
        <div>
            <div class="topnav" style={{marginLeft:"9cm"}}>
                <a class="texte disabled" style={{fontSize:"40px",fontFamily: "Avigea",color:"white"}}>Kamera Sabun</a>
                <a style={{fontFamily: "Poppins",fontSize:"24px",padding:"40px",color:"white",fontWeight:"bold"}}>Home</a>
                <Link style={{fontFamily: "Poppins",fontSize:"24px",padding:"40px"}} to={"./Upload"}>Upload</Link>
                <Link style={{fontFamily: "Poppins",fontSize:"24px",padding:"40px"}} to={"./About"}>About</Link>
            </div>
            <img src ={MAPPIC} class = "padding" alt = "Map Picture"/>
            <div style={{paddingLeft:"24px",color:"white"}}>
                <div class = "square" id = "home" style={{marginTop:"6.5cm"}}>
                    <h2 style={{fontSize:"60px",fontFamily:"Poppins-Thicc",marginTop:"5cm",marginLeft:"10px",paddingTop:"1.1cm"}}>Reverse Image Search</h2>
                    <p style={{fontFamily:"Poppins",fontSize:"20px",marginLeft:"10px",marginTop:"1cm"}}>Selamat datang di website Kamera Sabun. Disini kami menyediakan</p>
                    <p style={{fontFamily:"Poppins",fontSize:"20px",lineHeight:"0px",marginLeft:"10px"}}>fitur penyocokkan gambar yang anda punya dengan data-data yang</p>
                    <p style={{fontFamily:"Poppins",fontSize:"20px",marginLeft:"10px",paddingBottom:"20px"}}>ada di internet. Tunggu apa lagi? Ayo upload 1 foto untuk mencoba!</p>
                    <Link to = {"./Upload"} style={{fontSize:"20px",fontFamily:"Poppins",textDecoration: "none",paddingTop:"7px",paddingBottom:"7px",paddingLeft:"33px",paddingRight:"33px",marginLeft:"7.5cm",backgroundColor: "rgb(255, 255, 255)",color:"rgb(0, 0, 0)",borderRadius:"15px",outline: "5px solid black"}}> Try Now! </Link>
                </div>
            </div>
        </div>
    )
}

export default Home