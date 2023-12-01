import React, { useEffect, useContext } from 'react';
import { MyContext } from '../../MyContext';
import axios from "axios";

const UsersList = () => {
    const { userList, setUserList, token } = useContext(MyContext);

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
    
  return (
    <div>
      <table class="table">
  <thead>
    <tr>
      <th scope="col">S. No.</th>
      <th scope="col">User Name</th>
      <th scope="col">User Location</th>
      <th scope="col">User Email</th>
    </tr>
  </thead>
            <tbody>
            {userList?.map((item, index) => (
  <tr key={index}>
    <th scope="row">{index + 1}</th>
    <td>{item.fullName}</td>
    <td>{item.location}</td>
    <td>{item.email}</td>
  </tr>
))}

  </tbody>
</table>
    </div>
  )
}

export default UsersList
