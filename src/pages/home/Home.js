import { useEffect, useState } from "react"
import "./Home.css"
import "./homestyle.css"
import MAPPIC from './../../assets/PHONPIC.png';

const Home = () =>{
    const [Park,setPark]=useState([])
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        fetch('https://parkir-api.vercel.app/data/park')
            .then(response => response.json())
            .then(data => {
                setPark(data)
                setIsLoading(false)
            })
            .catch(error => console.error(error));
    }, []);

    const Card = () =>{
        return (
            <div style = {{marginLeft:"14.5cm",marginTop:"5cm"}}>
                <form action="/action_page.php">
                    <input type="file" id="myFile" name="filename">
                    </input>
                    <input type="submit">
                    </input>
                </form>
            </div>
        )
    }

    function crowd(car,bike){
        if (car>50 || bike>50){
            return "#00D22E"
        }
        else if ((car<=50 && car>10) || (bike<=50 && bike>10)){
            return "#F5DC00"
        }
        else{
            return "#F50000"
        }
    }

    const Loading =()=>{
        return(
            <p>Loading...</p>
        )
    }

    return(
        <div>
            <div class="topnav" style={{marginLeft:"9cm"}}>
                <a class="texte disabled" style={{fontSize:"40px",fontFamily: "Avigea",color:"white"}}>Kamera Sabun</a>
                <a style={{fontFamily: "Poppins",fontSize:"24px",padding:"40px"}} href = "#home">Home</a>
                <a style={{fontFamily: "Poppins",fontSize:"24px",padding:"40px"}} href = "#parkspot">Upload</a>
                <a style={{fontFamily: "Poppins",fontSize:"24px",padding:"40px"}} href = "#about">About</a>
            </div>
            <img src ={MAPPIC} class = "padding" alt = "Map Picture"/>
            <div style={{paddingLeft:"24px",color:"white"}}>
                <div class = "square" id = "home" style={{marginTop:"6.5cm"}}>
                    <h2 style={{fontSize:"60px",fontFamily:"Poppins-Thicc",marginTop:"5cm",marginLeft:"10px",paddingTop:"1.1cm"}}>Reverse Image Search</h2>
                    <p style={{fontFamily:"Poppins",fontSize:"20px",marginLeft:"10px",marginTop:"1cm"}}>Selamat datang di website Kamera Sabun. Disini kami menyediakan</p>
                    <p style={{fontFamily:"Poppins",fontSize:"20px",lineHeight:"0px",marginLeft:"10px"}}>fitur penyocokkan gambar yang anda punya dengan data-data yang</p>
                    <p style={{fontFamily:"Poppins",fontSize:"20px",marginLeft:"10px",paddingBottom:"20px"}}>ada di internet. Tunggu apa lagi? Ayo upload 1 foto untuk mencoba!</p>
                    <a href = "#parkspot" style={{fontSize:"20px",fontFamily:"Arial",textDecoration: "none",padding:"15px",marginLeft:"7.5cm",backgroundColor: "rgb(255, 255, 255)",color:"rgb(0, 0, 0)",borderRadius:"15px",border: "5px solid red"}}> Try Now! </a>
                </div>
            </div>
            <div className="profilebox">
                <div className="profile-img"><img className="profile"/></div>
                <div><input className="search" type="text" placeholder="Search"></input></div>
            </div>
            <div class ="square3" id="parkspot">
                <div style ={{fontFamily : "Poppins-Thicc",fontSize:"55px",textAlign:"center",paddingTop:"1cm",color:"#ff0000"}}>
                    Upload your image!
                </div>      
                <div className="home-content">
                    <Card/>
                </div>
            </div>
            <div class = "square4" id="about">
                <div style ={{fontFamily : "Poppins-Thicc",fontSize:"55px",textAlign:"center",paddingTop:"0.4cm",color:"#ffffff"}}>
                    About
                </div>
                <div style ={{fontFamily : "Poppins",fontSize:"15px",textAlign:"center",paddingTop:"0.6cm",color:"#ffffff"}}>
                    Joe : 086942013522 (Telp) | 18422002@mahasiswa.itb.ac.id (Email)
                </div>
            </div>
            {isLoading && (<Loading/>)}
        </div>
    )
}

export default Home