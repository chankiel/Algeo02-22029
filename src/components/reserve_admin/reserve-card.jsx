import React from "react";
import { Container, Card, Row, Col } from "react-bootstrap";

const ReserveCard = (props) => {
    return (
        <div className="mt-4">
            <h3>Parkir {props.loc}</h3>
            <Container fluid className={`${props.loc}`}>
                <Row>
                    <Col className="ps-0">
                        <Card>
                            <Card.Body>
                                <h1 className="text-center">{props.mobil}</h1>
                                <h6 className="text-center">Mobil</h6>
                            </Card.Body>
                        </Card>
                        </Col>
                    <Col className="ps-0">
                        <Card>
                            <Card.Body>
                                <h1 className="text-center">{props.motor}</h1>
                                <h6 className="text-center">Motor</h6>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default ReserveCard;