import { useState, useEffect } from "react";
import { Navbar } from "../Navbar";
import { Footer } from "../Footer";
import { UserCard } from "../../components";
import { Carousel } from "flowbite-react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";
import toast from "react-hot-toast";

export const ApartmentDetails = () => {
  const [apartmentDetails, setApartmentDetails] = useState({});
  const [ownerDetails, setOwnerDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { apartmentId } = useParams();

  // Fetch apartment details
  useEffect(() => {
    const fetchApartment = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/Apartment/GetApartmentDetailsById/${apartmentId}`
        );
        
        console.log("Apartment data:", response.data);
        setApartmentDetails(response.data);
        
        // Only fetch owner if ownerId exists
        if (response.data?.ownerId) {
          fetchOwner(response.data.ownerId);
        }
      } catch (error) {
        console.error("Error fetching apartment:", error);
        setError("Failed to load apartment details");
        toast.error("Failed to load apartment details");
      } finally {
        setLoading(false);
      }
    };

    fetchApartment();
  }, [apartmentId]); // Only depend on apartmentId

  // Separate function to fetch owner details
  const fetchOwner = async (ownerId) => {
    if (!ownerId) return;
    
    try {
      const response = await axios.get(`/Auth/getUserById/${ownerId}`);
      console.log("Owner data:", response.data);
      setOwnerDetails(response.data);
    } catch (error) {
      console.error("Error fetching owner:", error);
      // Don't set main error, just handle owner error separately
      toast.error("Could not load owner information");
    }
  };

  // Helper function to get rental type text
  const getRentalTypeText = (type) => {
    return type === 0 ? "By Room" : "Whole Apartment";
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <p className="text-xl">Loading apartment details...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <p className="text-xl text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main>
        <div className="p-24 h-full flex justify-between">
          <div className="flex flex-col flex-1">
            <div className="h-[600px]">
              <Carousel slideInterval={5000}>
                {apartmentDetails.base64Images &&
                  apartmentDetails.base64Images.map((image, index) => (
                    <img
                      key={index}
                      className="w-full h-full object-cover"
                      src={`data:image/png;base64,${image}`}
                      alt="Apartment image"
                    />
                  ))}
              </Carousel>
            </div>
            <div className="mt-6">
              <div className="border-2 rounded-t-md border-t-gray-300">
                <div className="flex justify-between py-4 px-10">
                  <h1 className="text-3xl font-bold">
                    {apartmentDetails.title || "Apartment Details"}
                  </h1>
                  <h1 className="text-3xl text-green-500 font-bold">
                    ${apartmentDetails.price || "N/A"}
                  </h1>
                </div>
              </div>
              <div className="border-2 border-t-0 rounded-b-md border-gray-300 px-10 py-4">
                <h2 className="font-bold text-2xl text-red-600">Details</h2>
                <p className="mt-4">{apartmentDetails.subTitle || "No description available"}</p>
                <ul className="mt-6 flex flex-col gap-8">
                  <li className="border-b-2 pb-4">
                    <ul className="flex justify-between px-6">
                      <li className="font-bold text-xl">Location</li>
                      <li>{apartmentDetails.location || "Not specified"}</li>
                    </ul>
                  </li>
                  {/* Added Rental Type display */}
                  <li className="border-b-2 pb-4">
                    <ul className="flex justify-between px-6">
                      <li className="font-bold text-xl">Rental Type</li>
                      <li>
                        {getRentalTypeText(apartmentDetails.rentalType)}
                        {apartmentDetails.rentalType === 0 && (
                          <span className="ml-2 text-sm text-gray-500">
                            (Individual rooms can be rented)
                          </span>
                        )}
                      </li>
                    </ul>
                  </li>
                  <li className="border-b-2 pb-4">
                    <ul className="flex justify-between px-6">
                      <li className="font-bold text-xl">Rooms Number</li>
                      <li>{apartmentDetails.roomsNumber || "Not specified"}</li>
                    </ul>
                  </li>
                  <li className="border-b-2 pb-4">
                    <ul className="flex justify-between px-6">
                      <li className="font-bold text-xl">Available Rooms</li>
                      <li>
                        {apartmentDetails.roomsAvailable || "Not specified"}
                        {apartmentDetails.isAvailable === false && (
                          <span className="ml-2 text-red-500">(Not Available)</span>
                        )}
                      </li>
                    </ul>
                  </li>
                  {/* Added rental dates if available */}
                  {apartmentDetails.rentalStartDate && (
                    <li className="border-b-2 pb-4">
                      <ul className="flex justify-between px-6">
                        <li className="font-bold text-xl">Rental Period</li>
                        <li>
                          {new Date(apartmentDetails.rentalStartDate).toLocaleDateString()} - 
                          {apartmentDetails.rentalEndDate ? 
                            new Date(apartmentDetails.rentalEndDate).toLocaleDateString() : 
                            "Open ended"}
                        </li>
                      </ul>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          <div className="ml-20">
            <UserCard
              ownerDetails={ownerDetails}
              apartmentDetails={apartmentDetails}
              apartmentId={apartmentId}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};