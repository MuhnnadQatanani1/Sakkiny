import { useEffect, useState } from "react";
import { InputGroup } from "../../components/InputGroup";
import { Footer } from "../Footer";
import { Navbar } from "../Navbar";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast"; // Make sure you have this import

export const AccountSettings = () => {
  const { authenticated } = useAuth();
  const [currentlyChanging, setCurrentlyChanging] = useState("");
  const [user, setUser] = useState({
    fullName: "",
    email: ""
  });
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleCancel = () => {
    setCurrentlyChanging("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      if (currentlyChanging === "password" && formData.password !== formData.confirmPassword) {
        toast.error("كلمات المرور غير متطابقة");
        return;
      }

      // Create the update object based on what's changing
      const updateData = {};
      if (currentlyChanging === "name") {
        updateData.fullName = formData.fullName;
      } else if (currentlyChanging === "email") {
        updateData.email = formData.email;
      } else if (currentlyChanging === "password") {
        updateData.password = formData.password;
      }

      // API call to update user data
      const response = await axios.put(
        `/Auth/updateUser/${authenticated.userId}`,
        JSON.stringify(updateData),
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      
      console.log("API response:", response.data);
      toast.success("تم تحديث البيانات بنجاح");
      setCurrentlyChanging("");
      
      // Refresh user data after update
      const userResponse = await axios.get(`/Auth/getUserById/${authenticated.userId}`);
      setUser(userResponse.data);
      
      // Update localStorage if needed
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (userData) {
        if (updateData.fullName) userData.fullName = updateData.fullName;
        if (updateData.email) userData.email = updateData.email;
        localStorage.setItem("userData", JSON.stringify(userData));
      }
    } catch (error) {
      console.error("Error updating account:", error);
      toast.error(error.message || "فشل تحديث البيانات");
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(`/Auth/getUserById/${authenticated.userId}`);
        setUser(response.data);
        setFormData({
          fullName: response.data.fullName || "",
          email: response.data.email || "",
          password: "",
          confirmPassword: ""
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to load account details");
      }
    };
    getUser();
  }, [authenticated.userId]);

  return (
    <>
      <Navbar />
      <main className="bg-white h-screen border-2 flex flex-col items-center">
        <div className="w-2/3 h-4/5 mt-20 flex flex-col">
          <h3 className="text-3xl font-semibold mb-4 self-start">
            Account Settings
          </h3>
          <div className="border-2 shadow-lg rounded-lg flex-1 flex justify-between">
            <div className="flex-1 mt-20 flex flex-col items-center gap-2">
              <InputGroup
                src="name"
                label="Display Name"
                value={currentlyChanging === "name" ? formData.fullName : user.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                type="text"
                hasHelper={currentlyChanging !== "name"}
                helperCB={() => setCurrentlyChanging("name")}
                disabled={currentlyChanging !== "name"}
              />
              <InputGroup
                src="email"
                label="Email Address"
                value={currentlyChanging === "email" ? formData.email : user.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                type="email"
                hasHelper={currentlyChanging !== "email"}
                helperCB={() => setCurrentlyChanging("email")}
                disabled={currentlyChanging !== "email"}
              />

              <InputGroup
                src="password"
                label="Password"
                placeholder="************"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                type="password"
                hasHelper={currentlyChanging !== "password"}
                helperCB={() => setCurrentlyChanging("password")}
                disabled={currentlyChanging !== "password"}
              />
              {currentlyChanging === "password" && (
                <>
                  <InputGroup
                    src="confirmPassword"
                    label="Confirm Password"
                    placeholder="************"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    type="password"
                  />
                </>
              )}
              <div className="mt-12 flex justify-center items-center gap-20">
                <button 
                  onClick={handleSave}
                  disabled={!currentlyChanging}
                  className={`hover:opacity-75 active:scale-90 bg-blue-500 border-2 text-white font-bold border-black px-12 py-2 rounded-md ${!currentlyChanging ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  حفظ
                </button>
                <button 
                  onClick={handleCancel} 
                  disabled={!currentlyChanging}
                  className={`hover:opacity-75 active:scale-90 bg-gray-200 border-2 border-black px-12 py-2 font-bold rounded-md ${!currentlyChanging ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  إلغاء
                </button>
              </div>
            </div>
            <div className="flex flex-col w-1/3 items-center mt-24 gap-8">
              <img
                className="w-40 rounded-full"
                src="https://picsum.photos/100"
                alt="profile picture"
              />
              <button className=" hover:opacity-75 active:scale-90 border-2 border-black rounded-md bg-blue-500 font-bold text-white p-3 ">
                Change Picture
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};