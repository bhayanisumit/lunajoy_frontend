import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate("/addpatient");
  };

  const handleLogout = async () => {
    localStorage.removeItem("auth");
    navigate("/");
  };

  return (
    <>
      <nav className="navbar">
        <div className="container-fluid">
          <a href=";" className="navbar-brand">
            <h3>Daily Logs</h3>
          </a>
          <form className="d-flex">
            <button
              className=" add me-3"
              type="button"
              onClick={handleAddClick}
            >
              Add
            </button>
            <button className=" add" type="button" onClick={handleLogout}>
              Logout
            </button>
          </form>
        </div>
      </nav>
    </>
  );
}
