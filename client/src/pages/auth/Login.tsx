// Login Page
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../api/config";
import { Form, Button, Alert } from "react-bootstrap";


const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  localStorage.removeItem("token");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/accounts/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok || response.status === 201) {
        const data = await response.json();
        // data is in JsonResponse(serializer.errors, status=400) this format
        // so we need to extract the error message from the dictionary
        const errorMessage = Object.values(data).join(" ");
        throw new Error(errorMessage);
      }

      const data = await response.json();
      localStorage.setItem("token", data.access);

      navigate("/");
    } catch (error) {
        if (error instanceof Error) {
            setError(error.message);
          }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="mb-4">Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            
            <div className="d-flex justify-content-between mt-3">
              <Button variant="primary" onClick={() => navigate("/register")}>
                Register
              </Button>

              <Button variant="primary" type="submit">
                Login
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
