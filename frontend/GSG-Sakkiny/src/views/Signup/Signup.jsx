import { useEffect, useState } from "react";
import { SocialIcon } from "react-social-icons";
import { FormInput } from "../../components";
import infoImage from "../../assets/info-image.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import background from "../../assets/register_background.jpg";
import Select from "react-select";
import { toast } from "react-hot-toast";

export const Signup = () => {
  const navigate = useNavigate();

  const userType = [
    { value: "Client", label: "Client" },
    { value: "Owner", label: "Owner" },
  ];

  const [userInput, setUserInput] = useState({
    fullName: "",
    email: "",
    role: "Client",
    password: "",
    coPassword: "",
  });

  const handleChange = (e) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (selectedOption) => {
    setUserInput({ ...userInput, role: selectedOption.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/Auth/register",
        JSON.stringify(userInput),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      navigate("/login");
    } catch (error) {
      toast.error(error.response.data.description);
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-[#f8f9fa] relative">
      <img src={background} className="absolute w-full h-full blur-sm" />
      <div className="z-30 flex bg-white rounded-lg overflow-hidden w-2/3">
        <div className="flex-1 flex justify-center items-center">
          <img className="w-full h-full" src={infoImage} alt="Signup" />
        </div>
        <div className="flex-1 flex flex-col p-[40px]">
          <h2>
            Create an account on
            <span className="font-bold text-red-600"> Sakkinny</span>{" "}
          </h2>
          <form onSubmit={handleSubmit}>
            <FormInput
              type="text"
              placeholder="Email"
              value={userInput.email}
              name="email"
              handleChange={handleChange}
            />

            <FormInput
              type="text"
              placeholder="Full Name"
              value={userInput.fullName}
              name="fullName"
              handleChange={handleChange}
            />

            <FormInput
              type="password"
              placeholder="Password"
              value={userInput.password}
              name="password"
              handleChange={handleChange}
            />

            <FormInput
              type="password"
              placeholder="Confirm Password"
              value={userInput.coPassword}
              name="coPassword"
              handleChange={handleChange}
            />

            <Select
              defaultValue={userType[0]}
              name="userType"
              options={userType}
              onChange={handleSelectChange}
              className="w-full mt-4"
              isSearchable={false}
            />

            <button
              type="submit"
              className=" p-4 text-sm w-full border-0 bg-red-600 mt-5 rounded-[20px]"
            >
              <span className="font-bold text-white text-base">Sign Up</span>
            </button>
          </form>

          <p className="self-center mt-4">
            Already have an account?{" "}
            <Link className="text-red-600 font-bold" to="/login">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
