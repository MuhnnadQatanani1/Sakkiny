import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import toast from "react-hot-toast";

export const UserCard = ({ ownerDetails, apartmentDetails, apartmentId }) => {
  const navigate = useNavigate();
  const [roomsToRent, setRoomsToRent] = useState(1);
  const [showRentModal, setShowRentModal] = useState(false);
  const [rentalDates, setRentalDates] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
  });

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const isLoggedIn = !!userData?.userId;
  const isOwner = ownerDetails?.id === userData?.userId;
  const isByRoom = apartmentDetails?.rentalType === 0;

  const handleRoomsChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= apartmentDetails?.roomsAvailable) {
      setRoomsToRent(value);
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setRentalDates(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    navigate(`/editapartment/${apartmentId}`);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/Apartment/DeleteApartment/${apartmentId}`);
      toast.success("Apartment deleted successfully");
      navigate("/");
    } catch (error) {
      console.error("Error deleting apartment:", error);
      toast.error("Failed to delete apartment");
    }
  };

  const handleRentClick = () => {
    if (!isLoggedIn) {
      toast.error("Please login to rent an apartment");
      navigate("/login");
      return;
    }
    setShowRentModal(true);
  };

  const handleRentSubmit = async () => {
    try {
      let endpoint;
      let payload;

      if (isByRoom) {
        endpoint = `/Apartment/RentRooms/${apartmentId}`;
        payload = { roomsToRent };
      } else {
        endpoint = "/Apartment/RentApartment";
        payload = {
          apartmentId: parseInt(apartmentId),
          customerId: userData.userId,
          rentalStartDate: rentalDates.startDate,
          rentalEndDate: rentalDates.endDate,
        };
      }

      const response = await axios.post(endpoint, payload);

      if (response.data.isSuccess) {
        toast.success(response.data.message || "Rental successful!");
        setShowRentModal(false);
        window.location.reload();
      } else {
        toast.error(response.data.message || "Failed to rent apartment");
      }
    } catch (error) {
      console.error("Error renting apartment:", error);
      toast.error(error.response?.data?.message || "Failed to rent apartment");
    }
  };

  return (
    <div className="border rounded-lg shadow-lg p-6 w-[350px]">
      <div className="flex flex-col items-center">
        <div className="w-32 h-32 rounded-full bg-gray-300 mb-4 overflow-hidden">
          <img
            src={ownerDetails?.profilePicture || "https://via.placeholder.com/128"}
            alt="Owner"
            className="w-full h-full object-cover"
          />
        </div>

        <h2 className="text-xl font-bold">
          {ownerDetails?.firstName || "Owner"} {ownerDetails?.lastName || ""}
        </h2>

        <p className="text-gray-600 mb-4">{ownerDetails?.email || "No email available"}</p>

        {isOwner ? (
          <div className="flex flex-col w-full gap-2">
            <button
              onClick={handleEdit}
              className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors w-full"
            >
              Edit Apartment
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors w-full"
            >
              Delete Apartment
            </button>
          </div>
        ) : (
          <div className="w-full">
            {apartmentDetails?.isAvailable !== false ? (
              <button
                onClick={handleRentClick}
                className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors w-full mb-2"
                disabled={apartmentDetails?.roomsAvailable === 0}
              >
                {isByRoom
                  ? `Rent Rooms (${apartmentDetails?.roomsAvailable || 0} available)`
                  : "Rent Apartment"}
              </button>
            ) : (
              <button
                disabled
                className="bg-gray-400 text-white p-2 rounded-md w-full mb-2 cursor-not-allowed"
              >
                Not Available
              </button>
            )}
          </div>
        )}
      </div>

      {showRentModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
            <h3 className="text-lg font-semibold mb-4">Confirm Rental</h3>

            {isByRoom ? (
              <div className="mb-4">
                <label className="block mb-1">Number of Rooms:</label>
                <input
                  type="number"
                  min={1}
                  max={apartmentDetails?.roomsAvailable || 1}
                  value={roomsToRent}
                  onChange={handleRoomsChange}
                  className="w-full border border-gray-300 rounded px-2 py-1"
                />
              </div>
            ) : (
              <div className="flex flex-col gap-3 mb-4">
                <div>
                  <label className="block mb-1">Start Date:</label>
                  <input
                    type="date"
                    name="startDate"
                    value={rentalDates.startDate}
                    onChange={handleDateChange}
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block mb-1">End Date:</label>
                  <input
                    type="date"
                    name="endDate"
                    value={rentalDates.endDate}
                    onChange={handleDateChange}
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRentModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleRentSubmit}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Confirm Rent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
