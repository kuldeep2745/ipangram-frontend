import React, {useContext} from 'react';
import { Button, Modal, Alert } from "react-bootstrap";
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";
import { MyContext } from '../../MyContext';

const cookies = new Cookies();
const token = cookies.get("TOKEN");

const Header = () => {
  const { isAdmin, listing, setListing } = useContext(MyContext);

  const logout = () => {
    cookies.remove("TOKEN", { path: "/" });
    window.location.href = "/";
  };

  const removeToken = () => {
    cookies.remove("TOKEN", { path: "/" });
  };

  const listRender = () => {
    setListing(!listing)
  };

  return (
    <div>
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <Button style={{marginRight:"10px"}} class="navbar-brand" type="submit" variant="danger" onClick={() => logout()}>
        Logout
      </Button>
      <div class="navbar-nav">
        {isAdmin ? (
          <div>
            <Button style={{marginRight:"10px"}} class="btn btn-primary" type="submit" variant="danger">
      <Link style={{color: "white", textDecoration: 'none'}} onClick={() => removeToken()} to="/">Login As User</Link>
      </Button>
      <button style={{marginRight:"10px"}} class="btn btn-warning" type="submit" variant="danger" onClick={listRender}>
        {listing ? ("Show Users List"): ("Show Departments List")}
      </button>
      <img style={{width:"50px", height:"50px", borderRadius:"50%"}} src="https://res.cloudinary.com/dwd3qhggm/image/upload/f_auto,q_auto/xrjslp7mams4hpt2mmcn" alt="profile"/>
          </div>
        ) : (
          <div>
            <button style={{marginRight:"10px"}} class="btn btn-primary" type="submit" variant="danger">
      <Link style={{color: "white", textDecoration: 'none'}} onClick={() => removeToken()} to="/manager">Login As Manager</Link>
      </button>
      <img style={{width:"50px", height:"50px", borderRadius:"50%"}} src="https://res.cloudinary.com/dwd3qhggm/image/upload/f_auto,q_auto/xrjslp7mams4hpt2mmcn" alt="profile"/>
          </div>
        )}
      </div>
    </div>
</nav>
    </div>
  )
}

export default Header
