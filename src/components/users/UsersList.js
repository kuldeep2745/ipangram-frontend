import React, { useEffect, useContext, useState } from 'react';
import { MyContext } from '../../MyContext';
import axios from "axios";
import { Button, Alert } from "react-bootstrap";

const UsersList = () => {
  const { userList, setUserList, token } = useContext(MyContext);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const authConfig = {
      method: "get",
      url: "http://localhost:3000/users",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios(authConfig)
      .then((result) => {
        setUserList(result?.data); // Wrap the result in an array
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  }, [setUserList, token]);

  const handleDelete = (userId, userName) => {
    // Delete user by ID
    axios
      .delete(`http://localhost:3000/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // Remove deleted user from the user list
        setUserList((prevUsers) => prevUsers.filter((user) => user._id !== userId));
        setSuccessMessage(`${userName} deleted successfully`);

        // Clear the success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  return (
    <div>
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <table className="table">
        <thead>
          <tr>
            <th scope="col">S. No.</th>
            <th scope="col">User Name</th>
            <th scope="col">User Location</th>
            <th scope="col">User Email</th>
            <th scope="col">Delete User</th>
          </tr>
        </thead>
        <tbody>
          {userList?.map((item, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{item.fullName}</td>
              <td>{item.location}</td>
              <td>{item.email}</td>
              <td>
                <Button variant="danger" onClick={() => handleDelete(item?._id, item?.fullName)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersList;
