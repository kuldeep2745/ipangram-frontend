import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Button, Modal, Form } from "react-bootstrap";
import { MyContext } from '../../MyContext';

const DepartmentComponent = () => {
  const { departmentList, setDepartmentList, token } = useContext(MyContext);

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [departmentData, setDepartmentData] = useState({
    name: ""
  });
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Set the number of items per page

  useEffect(() => {
    // Fetch the list of departments
    axios
      .get("http://localhost:3000/departments")
      .then((response) => {
        setDepartmentList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching departments:", error);
      });
  }, [setDepartmentList]);

  const openCreateModal = () => {
    setDepartmentData({ name: "" });
    setIsEditMode(false);
    setSelectedDepartment(null);
    setShowModal(true);
  };

  const openEditModal = (department) => {
    setDepartmentData({ name: department.name });
    setIsEditMode(true);
    setSelectedDepartment(department);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditMode(false);
    setSelectedDepartment(null);
  };

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
        setDepartmentList([...departmentList, response.data]);
        // Close the modal
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error creating department:", error);
      });
  };

  const handleEditDepartment = () => {
    // Logic for editing a department
    if (selectedDepartment) {
      axios
        .put(
          `http://localhost:3000/departments/${selectedDepartment._id}`,
          departmentData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          // Update the list of departments after successful edit
          setDepartmentList(
            departmentList.map((department) =>
              department._id === selectedDepartment._id ? response.data : department
            )
          );
          // Close the modal
          handleCloseModal();
        })
        .catch((error) => {
          console.error("Error editing department:", error);
        });
    }
  };

  const handleDeleteDepartment = (departmentId) => {
    // Logic for deleting a department
    axios
      .delete(`http://localhost:3000/departments/${departmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        // Update the list of departments after successful deletion
        setDepartmentList(departmentList.filter((department) => department._id !== departmentId));
      })
      .catch((error) => {
        console.error("Error deleting department:", error);
      });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = departmentList?.slice(indexOfFirstItem, indexOfLastItem);

  const totalItems = departmentList?.length;
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <h2 style={{display:"flex", alignItems: "center", flexDirection: "column"}}>Departments List</h2>
      {/* Button to open the modal for creating a new department */}
      <Button variant="primary" onClick={openCreateModal}>
        Create New Department
      </Button>

      {/* Display the list of departments */}
      <table className="table">
        <thead>
          <tr>
            <th scope="col">S. No.</th>
            <th scope="col">Department Name</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems?.map((department, index) => (
            <tr key={department._id}>
              <th scope="row">{indexOfFirstItem + index + 1}</th>
              <td>{department?.name}</td>
              <td>
                <Button variant="danger" onClick={() => handleDeleteDepartment(department._id)}>
                  Delete
                </Button>{" "}
                <Button variant="primary" onClick={() => openEditModal(department)}>
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
            <button className="page-link" onClick={() => setCurrentPage(number)}>
              {number}
            </button>
          </li>
        ))}
      </ul>

      {/* Modal for creating/editing a department */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? "Edit" : "Create"} Department</Modal.Title>
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
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={isEditMode ? handleEditDepartment : handleCreateDepartment}>
            {isEditMode ? "Edit" : "Create"} Department
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DepartmentComponent;
