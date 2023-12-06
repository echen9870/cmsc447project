// LandingPage.tsx
import React, { useState } from "react";
import LoginPage from "./LoginPage";
import Modal from "react-modal";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  onLogin: (username: string) => void;
}

const LandingPage = ({ onLogin }: Props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <header className="bg-prismDark text-white text-center py-4">
        <h1 className="text-2xl font-bold">TaskMeister</h1>
      </header>

      <section className="container mx-auto text-center my-8">
        <h2 className="text-3xl font-semibold mb-4 ">Welcome to TaskMeister</h2>
        <p className="text-gray-700 mb-4">
          A collaborative task management system designed for multiple users
        </p>
      </section>
      <button
        className="bg-prismDark text-white py-2 px-4 rounded hover:bg-prismLightPurple mx-auto max-w-md"
        onClick={openModal}
      >
        Sign Up/ Login
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Login Modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            border: "none",
            background: "none",
            padding: 0,
            position: "relative",
            top: "300px",
          },
        }}
      >
        <div className="absolute top-4 right-0 m-4 cursor-pointer">
          <FontAwesomeIcon
            icon={faTimes}
            onClick={closeModal}
            className="text-white text-2xl hover:text-gray-300"
          />
        </div>
        <LoginPage onLogin={onLogin} onCloseModal={closeModal} />
      </Modal>

      <footer className="bg-prismDark text-white text-center py-4">
        <p> </p>
      </footer>
    </div>
  );
};

export default LandingPage;
