import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";
import LoginHeader from "../header/LoginHeader";
const cookies = new Cookies();

export default function ManagerLogin() {
  // initial state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const configuration = {
      method: "post",
      url: "http://localhost:3000/admin-login-dummy",
      data: {
        email,
        password,
      },
    };

    axios(configuration)
      .then((result) => {
        // set the cookie
        cookies.set("TOKEN", result.data.token, {
          path: "/",
        });

        setLogin(true);

        // Redirect to the admin dashboard
        window.location.href = "/auth";
      })
      .catch((error) => {
        setErrorMessage(error);
        console.log("myerror", error);
        error = new Error();
      });
  };

  return (
    <>
      <LoginHeader />
      <div
        style={{
          marginTop: "50px",
          marginLeft: "350px",
          width: "406px",
          height: "301px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: "10px 10px 10px 10px grey",
          }}
        >
          <h2>Manager Login</h2>
          <Form onSubmit={(e) => handleSubmit(e)}>
            {/* email */}
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address :-use-admin@example.com</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />
            </Form.Group>

            {/* password */}
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password :-use-adminpassword</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </Form.Group>

            {/* submit button */}
            <Button
              variant="primary"
              type="submit"
              onClick={(e) => handleSubmit(e)}
            >
              Login
            </Button>

            {/* display success message */}
            {login ? (
              <p className="text-success">You Are Logged in Successfully</p>
            ) : (
              <p className="text-danger">
                {errorMessage?.response?.statusText}
              </p>
            )}
          </Form>
          <button type="button" class="btn btn-warning">
            <Link style={{ color: "white", textDecoration: "none" }} to="/">
              Login As User
            </Link>
          </button>
        </div>
      </div>
    </>
  );
}
