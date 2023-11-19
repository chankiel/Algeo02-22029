import React from "react";
import './home.css'
import {Link} from 'react-router-dom'

function StepItem({Data}) {
  const path = Data.path;
  const text = Data.text;
  return (
    <div className="step-box">
      <img src={path} alt="Logo"/>
      <div className="inside">
        <h3>{text}</h3>
      </div>
    </div>
  )
}

export default function Home(){
    const Step1 = {path:"step1.png", text:"First upload your dataset at \"Upload Dataset Here\" button area"}
    const Step2 = {path:"step2.png", text:"Insert an image you want to search in dataset"}
    const Step3 = {path:"step3.png", text:"Click the \"Search\" button and wait for the process to finish"}
    const Step4 = {path:"step4.png", text:"The similar image from the dataset will be displayed"}
    return (
      <div className="main-container">
        <div className="left-title">
          <h1>Explore The Hidden Files</h1>
          <div className="try-it-box">
            <Link className="try-it"to={"/search"}>Try it Right Now</Link>
          </div>
        </div>
        <div className="step-container">
          <h1>How to Use</h1>
          <StepItem Data={Step1}/>
          <StepItem Data={Step2}/>
          <StepItem Data={Step3}/>
          <StepItem Data={Step4}/>
        </div>
      </div>
    );
}
