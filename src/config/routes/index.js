import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./../../pages/home/Home";
import Reservation from "./../../pages/reservation/Reservation";
import Admin from "./../../pages/admin/admin";

const Routess = () => {
    return (
        <Router>
            <Routes>
                <Route path="/reservation" element={<Reservation />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<Home />} />
            </Routes>
        </Router>
    )
}

export default Routess;