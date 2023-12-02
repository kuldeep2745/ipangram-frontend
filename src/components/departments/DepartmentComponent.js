// DepartmentComponent.js

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Button, Modal, Form } from "react-bootstrap";
import { MyContext } from '../../MyContext';

const DepartmentComponent = () => {

  const { departmentList, setDepartmentList, token } = useContext(MyContext);

  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [departmentData, setDepartmentData] = useState({
    name: ""
  });

  useEffect(() => {
    // Fetch the list of departments
    axios
      .get("http://localhost:3000/departments")
      .then((response) => {
        setDepartments(response.data);
        setDepartmentList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching departments:", error);
      });
  }, []);

  const handleCreateDepartment = () => {
    // Logic for creating a new department
    axios
      .post(
        "http://localhost:3000/departments",
        departmentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        // Update the list of departments after successful creation
        setDepartments([...departments, response.data]);
        // Close the modal
        setShowModal(false);
      })
      .catch((error) => {
        console.error("Error creating department:", error);
      });
  };

  // Other CRUD operations (update, delete) can be implemented similarly

  return (
    <div>
      <h3>Department Management</h3>

      {/* Button to open the modal */}
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Create New Department
      </Button>

      {/* Display the list of departments */}
      {/* <ul>
        {departments.map((department) => (
          <li key={department._id}>{department.name}</li>
        ))}
      </ul> */}

      {/* Modal for creating a new department */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Department</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formDepartmentName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter department name"
                value={departmentData.name}
                onChange={(e) => setDepartmentData({ ...departmentData, name: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateDepartment}>
            Create Department
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DepartmentComponent;
