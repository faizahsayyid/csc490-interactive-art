import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api/config";

export const SignUp = () => {
  const navigate = useNavigate();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = (event.target as HTMLFormElement).email.value;
    const password = (event.target as HTMLFormElement).password.value;
    const confirmPassword = (event.target as HTMLFormElement).confirmPassword
      .value;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/accounts/register/`, {
        username: email,
        email,
        password,
      });

      const data = response.data;

      console.log("Response:", data);

      if (response.status === 400) {
        console.log("error", data);
        if (data.username) {
          alert(`Email: ${data["username"]}`);
        }
        if (data.password) {
          alert(`Password: ${data["password"]}`);
        }
      } else {
        localStorage.setItem("token", data.token);
        navigate("/");
      }
    } catch (error) {
      console.error("Error in axios post:", error);
    }
  };

  return (
    <form
      className="mt-5 card p-4 mx-auto"
      style={{ width: "max(50%, 300px)" }}
      onSubmit={onSubmit}
    >
      <h1 className="text-center h4">Sign Up</h1>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email address
        </label>
        <input type="email" className="form-control" id="email" />
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input type="password" className="form-control" id="password" />
      </div>
      <div className="mb-3">
        <label htmlFor="confirmPassword" className="form-label">
          Confirm Password
        </label>
        <input type="password" className="form-control" id="confirmPassword" />
      </div>
      <button type="submit" className="mt-3 btn btn-primary">
        Submit
      </button>
      <p className="mt-4 text-center">
        Already have an account? <Link to="/login">Log In!</Link>
      </p>
    </form>
  );
};
