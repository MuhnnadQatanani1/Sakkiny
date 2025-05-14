import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { Navbar } from "../Navbar";
import { Footer } from "../Footer";
import "react-datepicker/dist/react-datepicker.css";

export const ApartmentRentalContract = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { owner: ownerDetails, apartment: apartmentDetails, id: apartmentId } =
    location.state || {};
  const { authenticated } = useAuth();

  const [renterDetails, setRenterDetails] = useState({});
  const [rentData, setRentData] = useState({
    renterId: authenticated.userId,
    apartmentId: apartmentId,
  });

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(
          `/Auth/getUserById/${authenticated.userId}`
        );
        setRenterDetails({
          renter: response.data.fullName,
          email: response.data.email,
        });
      } catch (error) {
        console.error(error);
      }
    };
    getUser();
  }, []);

  const handleRent = async () => {
    try {
      console.log(rentData);
      const response = await axios.post(`/Apartment/RentApartment/apartments/${rentData.apartmentId}/rent?userid=${rentData.renterId}`, rentData);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen w-4/5 mx-auto my-5 bg-white rounded-lg shadow-lg p-6">
        <header className="flex justify-between items-center bg-red-600 py-4 px-6 border-b-2 border-gray-200">
          <h1 className="text-2xl font-bold text-gray-100">
            Apartment Rental Contract
          </h1>
        </header>

        <div className="p-6">
          <section className="mt-4">
            <h2 className="text-xl font-semibold mb-4">Information</h2>

            {/* Owner Table */}
            <table className="w-full table-auto mb-6">
              <tbody>
                <tr>
                  <th className="p-2 text-left bg-red-600 w-[450px] text-gray-100">
                    Owner
                  </th>
                  <td className="p-2">
                    <input
                      disabled
                      type="text"
                      name="owner"
                      value={ownerDetails.fullName}
                      className="w-full border bg-gray-400 text-white border-gray-300 rounded px-3 py-2"
                    />
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <th className="p-2 text-left bg-gray-100 w-[450px] text-red-600">
                    Email
                  </th>
                  <td className="p-2">
                    <input
                      disabled
                      type="email"
                      name="email"
                      value={ownerDetails.email}
                      className="w-full border bg-gray-400 text-white border-gray-300 rounded px-3 py-2"
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Renter Table */}
            <table className="w-full table-auto mb-6">
              <tbody>
                <tr>
                  <th className="p-1 text-left bg-red-600 w-[450px] text-gray-100">
                    Renter
                  </th>
                  <td className="p-2">
                    <input
                      disabled
                      type="text"
                      name="renter"
                      value={renterDetails.renter}
                      className="w-full border bg-gray-400 text-white border-gray-300 rounded px-3 py-2"
                    />
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <th className="p-2 text-left bg-gray-100 w-[450px] text-red-600">
                    Email
                  </th>
                  <td className="p-2">
                    <input
                      disabled
                      type="email"
                      name="email"
                      value={renterDetails.email}
                      className="w-full border bg-gray-400 text-white border-gray-300 rounded px-3 py-2"
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Apartment Table */}
            <table className="w-full table-auto mb-6">
              <tbody>
                <tr>
                  <th className="p-2 text-left bg-red-600 text-gray-100 w-[450px]">
                    Apartment
                  </th>
                  <td className="p-2">
                    <input
                      disabled
                      type="text"
                      name="apartment"
                      value={apartmentDetails.title}
                      className="w-full border bg-gray-400 text-white border-gray-300 rounded px-3 py-2"
                    />
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <th className="p-2 text-left bg-gray-100 w-[450px] text-red-600">
                    Location
                  </th>
                  <td className="p-2">
                    <input
                      disabled
                      type="text"
                      name="model"
                      value={apartmentDetails.location}
                      className="w-full border bg-gray-400 text-white border-gray-300 rounded px-3 py-2"
                    />
                  </td>
                </tr>
                <tr>
                  <th className="p-2 text-left bg-red-600 w-[450px] text-gray-100">
                    Price
                  </th>
                  <td className="p-2">
                    <input
                      disabled
                      type="text"
                      name="price"
                      value={apartmentDetails.price}
                      className="bg-gray-400 text-white w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-center items-center gap-12 ">
              <button
                onClick={handleRent}
                className="bg-red-600 text-white rounded-lg px-4 py-2 hover:bg-gray-600 "
              >
                Save
              </button>
              <button
                onClick={() => navigate("/")}
                className="bg-red-600 text-white rounded-lg px-4 py-2 hover:bg-gray-600 "
              >
                Cancel
              </button>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};
