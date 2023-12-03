import React, { useEffect, useContext, useState } from 'react';
import { MyContext } from '../../MyContext';
import axios from 'axios';
import { Button, Alert, Modal, Form } from 'react-bootstrap';

const UsersList = () => {
  const { userList, departmentList, setUserList, token } = useContext(MyContext);

  const [successMessage, setSuccessMessage] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    email: '',
    location: '',
    department: '',
  });
  const [validationErrors, setValidationErrors] = useState({
    fullName: '',
    email: '',
    location: '',
    department: '',
  });

  useEffect(() => {
    const authConfig = {
      method: 'get',
      url: 'http://localhost:3000/users',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios(authConfig)
      .then((result) => {
        setUserList(result?.data);
      })
      .catch((error) => {
        console.error('Error fetching user:', error);
      });
  }, [setUserList, token, editedUser]); // Added `editedUser` as a dependency

  const handleDelete = (userId, userName) => {
    axios
      .delete(`http://localhost:3000/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUserList((prevUsers) => prevUsers.filter((user) => user._id !== userId));
        setSuccessMessage(`${userName} deleted successfully`);

        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
      });
  };

  const handleEdit = (user) => {
    setEditedUser(user);
    setEditFormData({
      fullName: user.fullName,
      email: user.email,
      location: user.location,
      department: user.department,
    });
    setShowEditModal(true);
  };

  const validateForm = () => {
    const errors = {};

    if (!editFormData.fullName?.trim()) {
      errors.fullName = 'Full Name is required';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!editFormData.email?.trim() || !emailPattern.test(editFormData.email)) {
      errors.email = 'Valid Email is required';
    }

    if (!editFormData.location?.trim()) {
      errors.location = 'Location is required';
    }

    if (!editFormData.department?.trim()) {
      errors.department = 'Department is required';
    }

    setValidationErrors(errors);

    return Object.values(errors).every((error) => error === '');
  };

  const handleEditSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const { _id } = editedUser;

    const updatedUserData = {
      fullName: editFormData.fullName,
      email: editFormData.email,
      location: editFormData.location,
      department: editFormData.department,
    };

    axios
      .put(
        `http://localhost:3000/users/${_id}`,
        updatedUserData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setUserList((prevUsers) =>
          prevUsers.map((user) => (user._id === _id ? { ...user, ...response.data } : user))
        );

        setSuccessMessage(`${editFormData.fullName} updated successfully`);

        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);

        setShowEditModal(false);
        setEditedUser({});
        setEditFormData({
          fullName: '',
          email: '',
          location: '',
          department: '',
        });
      })
      .catch((error) => {
        console.error('Error editing user:', error);
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
            <th scope="col">User Department</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {userList?.map((item, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{item.fullName}</td>
              <td>{item.location}</td>
              <td>{item.email}</td>
              <td>{item.department}</td>
              <td>
                <Button variant="danger" onClick={() => handleDelete(item?._id, item?.fullName)}>
                  Delete
                </Button>{' '}
                <Button variant="primary" onClick={() => handleEdit(item)}>
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFullName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter full name"
                value={editFormData.fullName}
                onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                isInvalid={!!validationErrors.fullName}
              />
              <Form.Control.Feedback type="invalid">{validationErrors.fullName}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={editFormData.email}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                isInvalid={!!validationErrors.email}
              />
              <Form.Control.Feedback type="invalid">{validationErrors.email}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formLocation">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter location"
                value={editFormData.location}
                onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                isInvalid={!!validationErrors.location}
              />
              <Form.Control.Feedback type="invalid">{validationErrors.location}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formDepartment">
              <Form.Label>Department</Form.Label>
              {/* department */}
              <select
                onChange={(e) =>
                  setEditFormData({ ...editFormData, department: e.target.value })
                }
                className="form-select"
                aria-label="Default select example"
                value={editFormData.department}
                isInvalid={!!validationErrors.department}
              >
                <option value="" defaultValue>
                  Open this select menu
                </option>
                {departmentList?.map((item, index) => (
                  <option key={index} value={item?.name}>
                    {item?.name}
                  </option>
                ))}
              </select>
              <Form.Control.Feedback type="invalid">
                {validationErrors.department}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UsersList;
