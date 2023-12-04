import React, { useEffect, useContext } from 'react';
import { MyContext } from '../../MyContext';
import axios from "axios";

const UserDetails = () => {
    const { userDetails, setUserDetails, token } = useContext(MyContext);

    console.log("userDetails", userDetails)

    useEffect(() => {
      const authConfig = {
        method: "get",
        url: "http://localhost:3000/user",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    
      axios(authConfig)
        .then((result) => {
          setUserDetails([result.data]);
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
        });
    }, [setUserDetails, token]);
    
  return (
    <div>
      <table class="table">
  <thead>
    <tr>
      <th scope="col">S. No.</th>
      <th scope="col">User Name</th>
      <th scope="col">User Location</th>
      <th scope="col">User Email</th>
      <th scope="col">User Department</th>
    </tr>
  </thead>
            <tbody>
        {userDetails?.map((item, index) => (
    <tr key={index}>
      <th scope="row">{index + 1}</th>
      <td>{item?.fullName}</td>
      <td>{item?.location}</td>
      <td>{item?.email}</td>
      <td>{item?.department}</td>
    </tr>
))}
  </tbody>
</table>
    </div>
  )
}

export default UserDetails
