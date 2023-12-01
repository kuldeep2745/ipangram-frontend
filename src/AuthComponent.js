import React, { useEffect, useState } from "react";
import Signup from "./components/auth/Signup";
import { Button } from "react-bootstrap";
import axios from "axios";
import Cookies from "universal-cookie";
import UserDetails from "./components/users/UserDetails"
import UserList from "./components/users/UsersList"
import {MyContext} from "./MyContext"
// import { Redirect } from "react-router-dom"; // Import Redirect
const cookies = new Cookies();

// get token generated on login
const token = cookies.get("TOKEN");

export default function AuthComponent() {
  const [message, setMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [userList, setUserList] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  // const [redirectToAdmin, setRedirectToAdmin] = useState(false); // New state for redirection

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
        console.log("result.data.isAdmin", result.data.isAdmin)
        setMessage(result.data.message);
        setIsAdmin(result.data.isAdmin);
        // Redirect logic
        // if (result.data.isAdmin) {
        //   setRedirectToAdmin(true);
        // }
      })
      .catch((error) => {
        error = new Error();
      });
  }, []);

  const logout = () => {
    cookies.remove("TOKEN", { path: "/" });
    window.location.href = "/";
  }

  // Redirect if isAdmin is true
  // if (redirectToAdmin) {
  //   return <Redirect to="/admin-dashboard" />;
  // }

  return (
    <div className="text-center">
      <h1>Auth Component</h1>
      <Button type="submit" variant="danger" onClick={() => logout()}>
        Logout
      </Button>

      {/* Displaying different content based on user role */}
      {isAdmin ? (
        <div>
        <h3 className="text-success">Admin Dashboard Content</h3>
        <Signup />
        <MyContext.Provider value={{ userList, setUserList, token }}>
        <UserList />
      </MyContext.Provider>
        </div>
        ) : (
          <div>
        <h3 className="text-success">User Dashboard Content</h3>
        <MyContext.Provider value={{ userDetails, setUserDetails, token }}>
        <UserDetails />
      </MyContext.Provider>
          </div>
      )}

      <h3 className="text-danger">{message}</h3>
    </div>
  );
}
