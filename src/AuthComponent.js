import React, { useEffect, useState } from "react";
import Signup from "./components/auth/Signup";
import { Button } from "react-bootstrap";
import axios from "axios";
import Cookies from "universal-cookie";
const cookies = new Cookies();

// get token generated on login
const token = cookies.get("TOKEN");

export default function AuthComponent() {
  const [message, setMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);  // Add this line to store user role

  useEffect(() => {
    const configuration = {
      method: "get",
      url: "http://localhost:3000/auth-endpoint",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios(configuration)
      .then((result) => {
        setMessage(result.data.message);
        setIsAdmin(result.data.isAdmin);  // Set user role
      })
      .catch((error) => {
        error = new Error();
      });
  }, []);

  const logout = () => {
    cookies.remove("TOKEN", { path: "/" });
    window.location.href = "/";
  }

  return (
    <div className="text-center">
      <h1>Auth Component</h1>
      <Button type="submit" variant="danger" onClick={() => logout()}>
        Logout
      </Button>

      {/* Displaying different content based on user role */}
      {isAdmin ? (
        <h3 className="text-success">Admin Dashboard Content</h3>
      ) : (
        <h3 className="text-success">User Dashboard Content</h3>
      )}

      <h3 className="text-danger">{message}</h3>
    </div>
  );
}
