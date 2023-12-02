import React, { useState, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { MyContext } from '../../MyContext';

export default function Signup() {
  const { userDetails, setUserDetails, setShowSignupModal, setSuccessMessage, token } = useContext(MyContext);

  // initial state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [fullName, setFullName] = useState("");
  const [register, setRegister] = useState(false);
  const [validationError, setValidationError] = useState(null);

  const handleSubmit = (e) => {
    // prevent the form from refreshing the whole page
    e.preventDefault();

    // Basic form validation
    if (!email || !password || !location || !fullName) {
      setValidationError("All fields are required.");
      return;
    }

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError("Invalid email format.");
      return;
    }

    // set configurations
    const configuration = {
      method: "post",
      url: "http://localhost:3000/register",
      data: {
        email,
        password,
        location,
        fullName,
      },
    };

    // make the API call
    axios(configuration)
      .then((result) => {
        setRegister(true);
        setShowSignupModal(false);
        // Clear input fields after successful signup
        setEmail("");
        setPassword("");
        setLocation("");
        setFullName("");
        console.log("resultconsole", result);
          setSuccessMessage(`User ${result?.data?.result?.fullName} created successfully`);
  
          setTimeout(() => {
            setSuccessMessage(null);
          }, 5000);
      })
      .catch((error) => {
        setValidationError("Registration failed. Please try again.");
      });
  };

  return (
    <>
      <h2>Create User</h2>
      <Form onSubmit={(e) => handleSubmit(e)}>

        {/* fullName */}
        <Form.Group controlId="formBasicFullName">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            name="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter full name"
          />
        </Form.Group>

        {/* location */}
        <Form.Group controlId="formBasicLocation">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            name="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location"
          />
        </Form.Group>

        {/* email */}
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
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
          <Form.Label>Password</Form.Label>
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
          Create User
        </Button>

        {/* display success message or validation error */}
        {register ? (
          <p className="text-success">You Are Registered Successfully</p>
        ) : (
          validationError && <p className="text-danger">{validationError}</p>
        )}
      </Form>
    </>
  );
}
