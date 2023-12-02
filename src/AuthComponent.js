import React, { useEffect, useState, useContext } from "react";
import { Button, Modal, Alert } from "react-bootstrap";
import axios from "axios";
import Cookies from "universal-cookie";
import Signup from "./components/auth/Signup";
import UserDetails from "./components/users/UserDetails";
import UserList from "./components/users/UsersList";
import { MyContext } from "./MyContext";
import DepartmentComponent from "./components/departments/DepartmentComponent"

const cookies = new Cookies();
const token = cookies.get("TOKEN");

export default function AuthComponent() {
  const [message, setMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [userList, setUserList] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [departmentList, setDepartmentList] = useState([]);

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
        setIsAdmin(result.data.isAdmin);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  }, []);

  const logout = () => {
    cookies.remove("TOKEN", { path: "/" });
    window.location.href = "/";
  };

  const handleCreateUser = () => {
    setShowSignupModal(true);
  };

  const handleCloseSignupModal = () => {
    setShowSignupModal(false);
  };

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
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          <Button variant="primary" onClick={handleCreateUser}>
            Create New User
          </Button>

          {/* Display the DepartmentComponent */}
          <MyContext.Provider value={{ departmentList, setDepartmentList, token }}>
          <DepartmentComponent />
          </MyContext.Provider>

          <MyContext.Provider value={{ userList, departmentList, setUserList, token }}>
            <UserList />
          </MyContext.Provider>
        </div>
      ) : (
        <div>
          <h3 className="text-success">User Dashboard Content</h3>
          <MyContext.Provider value={{ userDetails, departmentList, setUserDetails, token }}>
            <UserDetails />
          </MyContext.Provider>
        </div>
      )}

      <h3 className="text-danger">{message}</h3>

      {/* Signup Modal */}
      <Modal show={showSignupModal} onHide={handleCloseSignupModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MyContext.Provider value={{ userList, departmentList, setUserList, setShowSignupModal, setSuccessMessage, token }}>
            <Signup />
          </MyContext.Provider>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSignupModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
