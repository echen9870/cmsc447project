import React, { useState } from "react";
import Axios from "axios";

interface PwdRecoveryProps {
  onCancel: () => void;
}

const PwdRecovery: React.FC<PwdRecoveryProps> = ({ onCancel }) => {
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error_message, setError_message] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { usernameOrEmail, newPassword, confirmPassword } = formData;

    try {
      const response = await Axios.post(
        "http://localhost:3000/auth/password_recovery",
        {
          usernameOrEmail,
          newPassword,
          confirmPassword,
        }
      );

      if (response.status === 200) {
        // Password recovery successful
        alert("Password changed successfully");
        onCancel(); // Close the password recovery form
      }
    } catch (error: any) {
      if (error.response) {
        setError_message(error.response.data.error);
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">{"Password Recovery"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block">Username or Email</label>
          <input
            type="text"
            name="usernameOrEmail"
            value={formData.usernameOrEmail}
            onChange={handleInputChange}
            className="w-full p-2 rounded text-gray-800"
            required
          />
          <label className="block">New Password</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            className="w-full p-2 rounded text-gray-800"
            required
          />
          <label className="block">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="w-full p-2 rounded text-gray-800"
            required
          />
          <p className="mt-4 text-red-600">{error_message}</p>
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Change Password
        </button>
      </form>
      {/* Another option for the user to recover the password */}
      <p className="mt-4 text-gray-600">
        {"Go back: "}
        <button className="ml-2 text-blue-500" onClick={onCancel}>
          {"Cancel"}
        </button>
      </p>
    </div>
  );
};

export default PwdRecovery;
