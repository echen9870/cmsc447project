import { useState } from "react";
import Axios from "axios"; // Import Axios - for backend interaction

interface Props {
  onLogin: (username:string) => void;

}

const LoginPage = ({ onLogin }: Props) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    confirmPassword: "",
  });

  const [isLogin, setIsLogin] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    const { username, password, email, confirmPassword } = formData;
    try {
      if (isLogin) {
        const response = await Axios.post(
          "http://localhost:3000/auth/login_user",
          {
            username,
            password,
          }
        );
        if (response.status === 200) {
          onLogin(username);
          console.log("Logged in:", response.data);
        }
      } else {
        // If it's a sign-up, send a POST request to your sign-up endpoint
        const response = await Axios.post(
          "http://localhost:3000/auth/create_user",
          {
            username,
            password,
            email,
            confirmPassword,
          }
        );
        console.log(response);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const toggleLoginSignup = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-prismDarkPurple">
      <div className="bg-prismLightPurple p-8 rounded-lg shadow-lg text-white">
        <h2 className="text-2xl mb-4">{isLogin ? "Login" : "Sign Up"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            {!isLogin && (
              <>
                <label className="block">Email</label>
                <input
                  type="text"
                  name="email"
                  onChange={handleInputChange}
                  className="w-full p-2 rounded text-gray-800"
                  required
                />
              </>
            )}
            <label className="block">Username</label>
            <input
              type="text"
              name="username"
              onChange={handleInputChange}
              className="w-full p-2 rounded text-gray-800"
              required
            />
            <label className="block ">Password</label>
            <input
              type="password"
              name="password"
              onChange={handleInputChange}
              className="w-full p-2 rounded text-gray-800"
              required
            />
            {!isLogin && (
              <>
                <label className="block">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  onChange={handleInputChange}
                  className="w-full p-2 rounded text-gray-800"
                  required
                />
              </>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button className="ml-2 text-blue-500" onClick={toggleLoginSignup}>
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
