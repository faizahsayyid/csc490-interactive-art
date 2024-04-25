import { Link } from "react-router-dom";
// import { logout } from "../api/auth";
// import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { API_URL } from "../api/config";


type HeaderProps = {
  isLoggedIn: boolean;
};

export const Header: React.FC<HeaderProps> = ({ }) => {
  // const logoutMutation = useMutation({ mutationFn: logout });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const onLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/accounts/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (data.status === 400) {
        console.log("error", data);
        return;
      }

    localStorage.removeItem("token");
    setIsLoggedIn(false);
    } catch (error) {
      console.error("error", error);
    }
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
        <div className="container-fluid px-5">
          <Link className="navbar-brand" to="/">
            Interactive Art
          </Link>
          <Link
            className="ms-auto nav-item navbar-link text-light me-3"
            to="/help"
          >
            Help
          </Link>
          {isLoggedIn && (
            <button className="btn btn-secondary" onClick={onLogout}>
              Log Out
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};
