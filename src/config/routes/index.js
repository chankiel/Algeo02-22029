import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./../../pages/home/Home";
import Upload from "./../../pages/upload/upload";
import About from "./../../pages/about/about";

const Routess = () => {
    return (
        <Router>
            <Routes>
                <Route path="/about" element={<About />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="*" element={<Home />} />
            </Routes>
        </Router>
    )
}

export default Routess;