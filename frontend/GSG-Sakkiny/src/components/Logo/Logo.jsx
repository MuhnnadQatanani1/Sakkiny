import infoImage from "../../assets/info-image.png";
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link
      to="/"
      className="hover:cursor-pointer flex items-center justify-center"
    >
      <img src={infoImage} alt="Sakkinny" className="h-10 rounded-full" />
      <h1 className="text-4xl font-bold ml-4">Sakkinny</h1>
    </Link>
  );
};
