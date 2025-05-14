import React, { useState, useEffect } from 'react';
import { Apartments } from '../Apartments';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Dashboard = () => {
  const [userRole, setUserRole] = useState('');
  const [userId, setUserId] = useState('');
  const [ownedApartments, setOwnedApartments] = useState([]);
  const [rentedApartments, setRentedApartments] = useState([]);
  const [renters, setRenters] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from local storage or session
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const token = localStorage.getItem('token');
    
    if (userData && userData.roles && userData.userId) {
      setUserRole(userData.roles[0] || '');
      setUserId(userData.userId);
      
      // Set axios default headers
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      // Fetch data based on role
      if (userData.roles.includes('Owner')) {
        fetchOwnedApartments(userData.userId);
      } else if (userData.roles.includes('Customer')) {
        fetchRentedApartments(userData.userId);
      }
    }
    
    setLoading(false);
  }, []);

  const fetchOwnedApartments = async (ownerId) => {
    try {
      const response = await axios.get(`/api/Apartment/owner/${ownerId}`);
      setOwnedApartments(response.data);
      
      // For each apartment, get the renters
      response.data.forEach(apartment => {
        fetchRentersForApartment(apartment.id);
      });
    } catch (error) {
      console.error('Error fetching owned apartments:', error);
    }
  };

  const fetchRentersForApartment = async (apartmentId) => {
    try {
      const response = await axios.get(`/api/Apartment/owner/apartments/${apartmentId}/renters`);
      setRenters(prev => ({
        ...prev,
        [apartmentId]: response.data
      }));
    } catch (error) {
      console.error(`Error fetching renters for apartment ${apartmentId}:`, error);
    }
  };

  const fetchRentedApartments = async (customerId) => {
    try {
      const response = await axios.get(`/api/Apartment/customer/${customerId}/rented`);
      setRentedApartments(response.data);
    } catch (error) {
      console.error('Error fetching rented apartments:', error);
    }
  };

  const handleCancelRental = async (apartmentId) => {
    try {
      await axios.post(`/api/Apartment/apartments/${apartmentId}/cancel`);
      // Remove the apartment from rentedApartments
      setRentedApartments(prev => prev.filter(apt => apt.id !== apartmentId));
      alert('Rental cancelled successfully');
    } catch (error) {
      console.error('Error cancelling rental:', error);
      alert('Error while cancelling rental');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-xl font-medium text-gray-700">Loading...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Add New Apartment Button - Only for Owners */}
      {userRole === 'Owner' && (
        <div className="mb-8 flex justify-end">
          <button 
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg flex items-center transition-all duration-300 transform hover:scale-105"
            onClick={() => navigate('/addApartment')}
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Apartment
          </button>
        </div>
      )}
      
      {/* Default view with all apartments */}
      {(!userRole || (userRole !== 'Owner' && userRole !== 'Customer')) && (
        <Apartments />
      )}

      {/* Owner dashboard */}
      {userRole === 'Owner' && (
        <div className="space-y-8">
          <div className="flex items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Owner Dashboard</h2>
            <div className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Owner</div>
          </div>
          
          {ownedApartments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              <p className="text-lg text-gray-600">No owned apartments found</p>
              <p className="text-gray-500 mt-2">Add your first apartment to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ownedApartments.map(apartment => (
                <div key={apartment.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="bg-blue-600 h-3"></div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{apartment.name}</h3>
                    <div className="flex items-center text-gray-600 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{apartment.address}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500">Total Rooms</p>
                        <p className="text-xl font-bold text-blue-700">{apartment.totalRooms}</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500">Available</p>
                        <p className="text-xl font-bold text-green-700">{apartment.availableRooms}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        Tenants:
                      </h4>
                      
                      {renters[apartment.id] && renters[apartment.id].length > 0 ? (
                        <div className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                          {renters[apartment.id].map(renter => (
                            <div key={renter.userId} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                              <div>
                                <span className="font-medium">{renter.fullName || renter.email}</span>
                              </div>
                              <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                {renter.rentedRooms} Room{renter.rentedRooms !== 1 ? 's' : ''}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm italic">No tenants for this apartment</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-8">
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300"
              onClick={() => window.location.href = '/apartments'}
            >
              View All Apartments
            </button>
          </div>
        </div>
      )}

      {/* Customer dashboard */}
      {userRole === 'Customer' && (
        <div className="space-y-8">
          <div className="flex items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Tenant Dashboard</h2>
            <div className="ml-4 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Tenant</div>
          </div>
          
          {rentedApartments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
              </svg>
              <p className="text-lg text-gray-600">No rented apartments found</p>
              <p className="text-gray-500 mt-2">Explore available apartments to rent</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rentedApartments.map(apartment => (
                <div key={apartment.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="bg-green-600 h-3"></div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{apartment.name}</h3>
                    <div className="flex items-center text-gray-600 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{apartment.address}</span>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg mb-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500">Rented Rooms</p>
                          <p className="text-2xl font-bold text-green-700">{apartment.rentedRooms}</p>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    
                    <button 
                      className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors duration-300"
                      onClick={() => handleCancelRental(apartment.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Cancel Rental
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-8">
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300 flex items-center"
              onClick={() => window.location.href = '/apartments'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Explore More Apartments
            </button>
          </div>
        </div>
      )}
    </div>
  );
};