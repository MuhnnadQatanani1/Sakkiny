import { useState } from "react";
import { SocialIcon } from "react-social-icons";
import { useLocation, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { FormInput } from "../../components";
import infoImage from "../../assets/info-image.png";
import background from "../../assets/register_background.jpg";




export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const { setAuthenticated } = useAuth();
  const [userInput, setUserInput] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "/Auth/login",
        JSON.stringify(userInput),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setAuthenticated({
        userData: response.data,
      });

      localStorage.setItem("userData", JSON.stringify(response.data));
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-[#f8f9fa] relative">
      <img src={background} className="absolute w-full h-full blur-sm" />
      <div className="z-20 flex bg-white rounded-lg overflow-hidden w-2/3">
        <div className="flex-1 p-[40px] flex flex-col justify-around">
          <h2 className="text-4xl text-gray-600 self-center font-bold">
            Welcome To
            <span className="text-red-600"> Sakkinny</span>{" "}
          </h2>
          <p className="self-center text-lg text-gray-400 font-bold">
            <span className="text-black">Log in</span> to get in the moment
            updates on the things that interest you.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col h-1/2 justify-around"
          >
            <FormInput
              type="text"
              placeholder="Email"
              value={userInput.email}
              name="email"
              handleChange={handleChange}
            />

            <FormInput
              type="password"
              placeholder="Password"
              value={userInput.password}
              name="password"
              handleChange={handleChange}
            />

            <button
              type="submit"
              className=" p-4 text-sm mt-4 w-full border-0 bg-red-600  rounded-[20px]"
            >
              <span className="font-bold text-white text-base">Sign In</span>
            </button>
          </form>

          <p className="self-center mt-4">
            Don’t have an account?{" "}
            <Link className="text-red-600 font-bold" to="/signup">
              Sign Up
            </Link>
          </p>
        </div>

        <div className="flex-1 flex justify-center items-center">
          <img className="w-full h-full" src={infoImage} alt="Signup" />
        </div>
      </div>
    </div>
  );
};
