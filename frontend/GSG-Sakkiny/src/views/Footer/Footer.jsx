import { Link } from "react-router-dom";
import { SocialIcon } from "react-social-icons";
import { Logo } from "../../components";

export const Footer = () => {
  return (
    <footer className="bg-gray-100 min-h-56 flex flex-col">
      <div className=" flex-1 border-b-2 border-b-gray-200">
        <div className="flex justify-between py-4 px-16 items-center h-full">
          <Logo />
          <div className="flex justify-around items-center gap-10 pr-4">
            <Link to="/home" className="text-lg font-bold">
              Home
            </Link>
            <span> • </span>
            <Link to="/about" className="text-lg font-bold ml-4">
              About
            </Link>
          </div>
        </div>
      </div>

      <div className="h-1/4 flex justify-between px-16 py-10 items-center ">
        <div className="flex justify-center items-center ">
          <h2 className="text-sm font-bold">Sakkinny-</h2>
          <p className="text-sm">© 2025 All right reserved</p>
        </div>
        <div className="flex gap-10 justify-between items-center">
          <SocialIcon url="https://facebook.com/" />
          <SocialIcon url="http://google.com" />
          <SocialIcon url="https://github.com/SamiMoqbel/Sakkinny-GSG" />
        </div>
      </div>
    </footer>
  );
};
