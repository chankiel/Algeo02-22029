import React from "react";
import { Link } from "react-router-dom"
import './about.css'
import ABOUTPIC from './../../assets/ABOUTPIC.png';
import './../home/homestyle.css'

const About = () => {
    return (
        <div>
            <div class="topnav" style={{marginLeft:"9cm"}}>
                <a class="texte disabled" style={{fontSize:"40px",fontFamily: "Avigea",color:"white"}}>Kamera Sabun</a>
                <Link style={{fontFamily: "Poppins",fontSize:"24px",padding:"40px"}} to={"./../Home"}>Home</Link>
                <Link style={{fontFamily: "Poppins",fontSize:"24px",padding:"40px"}} to={"./../Upload"}>Upload</Link>
                <a style={{fontFamily: "Poppins",fontSize:"24px",padding:"40px",color:"white",fontWeight:"bold"}}>About</a>
            </div>
            <div class="squarebig" style={{color:"white",marginTop:"4cm",padding:"1cm"}}>
                <div style={{textAlign:"center",fontSize:"50px"}}>
                    Kudos to Contributors!
                </div>
                <img src={ABOUTPIC} style={{width:"100%",height:"90%",marginLeft:"0cm",marginTop:"-1cm"}}></img>
                <div class="squarebout" style={{lineHeight:"50%",paddingTop:"1px",marginLeft:"17px",marginTop:"-1.4cm"}}>
                    <p style={{marginLeft:"2.75cm"}}>13522029</p>
                    <p style={{marginLeft:"0.8cm"}}>Ignatius Jhon Hezkiel Chan</p>
                    <a style={{textDecoration:"none",backgroundColor:"#0080ff",padding:"3px",borderRadius:"4px",marginLeft:"1.16cm",paddingLeft:"1cm",paddingRight:"1cm"}}href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">More from Kiel</a>
                </div>
                <div class="squarebout" style={{lineHeight:"50%",paddingTop:"1px",marginLeft:"378px",marginTop:"-2.3cm"}}>
                    <p style={{marginLeft:"2.75cm"}}>13522098</p>
                    <p style={{marginLeft:"0.2cm"}}>Suthasoma Mahardhika Munthe</p>
                    <a style={{textDecoration:"none",backgroundColor:"#0080ff",padding:"3px",borderRadius:"4px",marginLeft:"1.16cm",paddingLeft:"1cm",paddingRight:"1cm"}}href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">More from Suta</a>
                </div>
                <div class="squarebout" style={{lineHeight:"50%",paddingTop:"1px",marginLeft:"737px",marginTop:"-2.33cm"}}>
                    <p style={{marginLeft:"2.75cm"}}>13522110</p>
                    <p style={{marginLeft:"0.8cm"}}>Marvin Scifo Y. Hutahaean</p>
                    <a style={{textDecoration:"none",backgroundColor:"#0080ff",padding:"3px",borderRadius:"4px",marginLeft:"1cm",paddingLeft:"1cm",paddingRight:"1cm"}}href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">More from Scifo</a>
                </div>
                <div style={{opacity:"0%",marginTop:"50px"}}>
                    aaa
                </div>
            </div>
        </div>
    )
}

export default About;