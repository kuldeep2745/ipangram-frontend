import React from "react";
import { Col, Row } from "react-bootstrap";
import Login from "./components/auth/Login";
// import Signup from "./components/auth/Signup";

export default function Account() {
  return (
    <Row>
      {/* Register */}
      {/* <Col xs={12} sm={12} md={6} lg={6}>
        <Signup />
      </Col> */}

      {/* Login */}
      <Col xs={12} sm={12} md={6} lg={6}>
        <Login />
      </Col>
    </Row>
  );
}
