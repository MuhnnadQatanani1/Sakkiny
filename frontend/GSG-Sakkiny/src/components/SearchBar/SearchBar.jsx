import Select from "react-select";
import { LOCATIONS, ROOMS_COUNT } from "../../data/DropdownInputs";
import axios from "../../api/axios";
import { useEffect, useState } from "react";

export const SearchBar = ({ setSearchResults, setIsSearching }) => {
  const [apartmentNames, setApartmentNames] = useState([]);

  const [filters, setFilters] = useState({
    apartmentName: "",
    locations: [],
    rooms: [],
  });

  const searchBody = {
    pageIndex: 1,
    pageSize: 100,
    searchTerm: filters.apartmentName,
    columnFilters: [
      {
        key: "location",
        value: [...filters.locations],
      },
      {
        key: "roomsNumber",
        value: [...filters.rooms],
      },
    ],
  };

  useEffect(() => {
    const fetchNames = async () => {
      try {
        const response = await axios.get(
          "/Apartment/GetAllApartmentNames/names"
        );
        const names = [...new Set(response.data)];
        setApartmentNames(names.map((name) => ({ value: name, label: name })));
      } catch (error) {
        console.error(error);
      }
    };
    fetchNames();
  }, []);

  const handleChange = (selected, { name }) => {
    if (name === "apartmentName") {
      return setFilters((prevState) => ({
        ...prevState,
        [name]: selected ? selected.value : "",  // Handle clear by checking if selected is not null
      }));
    }
  
    setFilters((prevState) => ({
      ...prevState,
      [name]: selected ? selected.map((item) => item.value) : [],  // Handle clear by checking if selected is not null
    }));
  };

  const handleSearch = () => {
    // Check if all the filters are empty
    const isFilterEmpty = 
      !filters.apartmentName && 
      filters.locations.length === 0 && 
      filters.rooms.length === 0;

    if (isFilterEmpty) {
      // If no search filter is applied, revert to normal infinite scroll
      setIsSearching(false);
    } else {
      // Otherwise, apply search
      const fetchApartments = async () => {
        try {
          const response = await axios.post(
            "/Apartment/GetAllApartments",
            searchBody
          );
          console.log(response.data);
          // Assuming the response data includes an array of apartments
          const searchResultPages = [{ apartments: response.data.apartments }];

          // Set searchResults to match the format of useInfiniteQuery
          setSearchResults({ pages: searchResultPages });
          setIsSearching(true);
        } catch (error) {
          console.error(error);
        }
      };
      fetchApartments();
    }
  };

  return (
    <div className="mt-6 rounded-2xl border-2 w-2/3 p-8 bg-red-600 flex items-center justify-center gap-3">
      <Select
        name="apartmentName"
        options={apartmentNames}
        isSearchable
        isClearable
        onChange={handleChange}
        className="w-1/3 "
      />
      <Select
        isMulti
        name="locations"
        options={LOCATIONS}
        onChange={handleChange}
        className="w-1/5"
      />

      <Select
        isMulti
        name="rooms"
        options={ROOMS_COUNT}
        isSearchable={false}
        onChange={handleChange}
        className="w-1/5"
      />

      <button
        onClick={handleSearch}
        className="bg-black text-white font-semibold rounded-md py-2 px-10"
      >
        Search
      </button>
    </div>
  );
};
