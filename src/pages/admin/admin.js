import React from "react";
import { Container, Row, Col } from 'react-bootstrap';
import './admin.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import ReserveCard from "../../components/reserve_admin/reserve-card";
import Scanner from "../../components/reserve_admin/scanner";


const Admin = () => {
    return (
        <Container fluid>
            <Row>
                <Col md={{span:5, offset:1}} className="border">
                    <h1 className="text-center">Reserve</h1>
                    <Row>
                        <Col>
                            <ReserveCard loc="Seni Rupa" mobil="17" motor="56"/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <ReserveCard loc="Sipil" mobil="3" motor="89"/>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <ReserveCard loc="Saraga" mobil="0" motor="9"/>
                        </Col>
                    </Row>
                </Col>

                <Col md={{span:4, offset:2}} className="border">
                    <h1 className="text-center">QR Scanner</h1>
                    <Row className="p-5">
                        <Scanner />
                    </Row>

                </Col>
            </Row>
        </Container>
    )
}

export default Admin;