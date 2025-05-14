import { useNavigate, Link } from "react-router-dom";
import { Dropdown } from "flowbite-react";
import Avatar from "react-avatar";
import { Logo } from "../../components";
import { useContext } from "react";
import AuthContext from "../../context/AuthProvider";

export const Navbar = () => {
  const { authenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userData");
    console.log("logged out");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-100 min-h-24 flex items-center justify-between px-10">
      <Logo />

      {authenticated ? (
        <Dropdown
          label={
            <Avatar
              src="http://www.gravatar.com/avatar/a16a38cdfe8b2cbd38e8a56ab93238d3"
              size="50"
              round={true}
            />
          }
          arrowIcon={false}
          inline
          className="bg-gray-100 text-white rounded-md"
        >
          <Dropdown.Header>
            <span className="block text-sm">{authenticated.fullName}</span>
            <span className="block truncate text-sm font-medium">
              {authenticated.email}
            </span>
          </Dropdown.Header>
          <Dropdown.Item>
            <Link to="/dashboard">Dashboard</Link>
          </Dropdown.Item>
          <Dropdown.Item>
            <Link to="/settings">Account Settings</Link>
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>
            <button onClick={handleLogout}>Sign out</button>
          </Dropdown.Item>
        </Dropdown>
      ) : (
        <Link
          to="/login"
          className="text-lg font-medium text-gray-700 hover:underline"
        >
          Sign in
        </Link>
      )}
    </nav>
  );
};
