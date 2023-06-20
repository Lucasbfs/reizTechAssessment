import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";

function GetCountries() {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [sortBy, setSortBy] = useState("name_asc");
  const [currentPage, setCurrentPage] = useState(1);
  const countriesPerPage = 20;
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await axios.get(
        "https://restcountries.com/v2/all?fields=name,region,area,languages,flags,population"
      );
      const data = response.data;
      setCountries(data);
      setFilteredCountries(data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    sortCountries(event.target.value);
  };

  const sortCountries = (sortOption) => {
    const [field, order] = sortOption.split("_");
    const sortedCountries = [...filteredCountries].sort((a, b) => {
      if (a[field] < b[field]) return order === "asc" ? -1 : 1;
      if (a[field] > b[field]) return order === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredCountries(sortedCountries);
  };

  const handleFilterChange = (event) => {
    const filterOption = event.target.value;
    if (filterOption === "smaller_than_lithuania") {
      const filtered = countries.filter(
        (country) =>
          country.area < countries.find((c) => c.name === "Lithuania").area
      );
      setFilteredCountries(filtered);
    } else if (filterOption === "oceania_region") {
      const filtered = countries.filter(
        (country) => country.region === "Oceania"
      );
      setFilteredCountries(filtered);
    } else {
      setFilteredCountries(countries);
    }
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    filterCountries(event.target.value);
  };

  const filterCountries = (searchTerm) => {
    const filtered = countries.filter((country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCountries(filtered);
    setCurrentPage(1);
  };

  // Pagination
  const indexOfLastCountry = currentPage * countriesPerPage;
  const indexOfFirstCountry = indexOfLastCountry - countriesPerPage;
  const currentCountries = filteredCountries.slice(
    indexOfFirstCountry,
    indexOfLastCountry
  );

  const totalPages = Math.ceil(filteredCountries.length / countriesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Countries</h1>
      <div className="title-container mb-4">
        <div className="search-container rounded flex">
          <input
            type="text"
            className="search-input rounded-l p-2"
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div className="search-icon-container rounded-r bg-white p-2">
            <FiSearch className="search-icon" />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-between mb-10 gap-4">
        <div>
          <label className="mr-2">Sort by:</label>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="filters"
          >
            <option value="name_asc">Name (A-Z)</option>
            <option value="name_desc">Name (Z-A)</option>
            <option value="area_asc">Area (Smallest to Largest)</option>
            <option value="area_desc">Area (Largest to Smallest)</option>
          </select>
        </div>
        <div>
          <label className="mr-2">Filter:</label>
          <select onChange={handleFilterChange} className="filters">
            <option value="all">All</option>
            <option value="smaller_than_lithuania">
              Smaller than Lithuania
            </option>
            <option value="oceania_region">Oceania Region</option>
          </select>
        </div>
      </div>
      {/* Displaying list */}
      <ul className="flex flex-wrap justify-evenly gap-20">
        {currentCountries.map((country) => (
          <div
            key={country.name}
            className="group h-72 w-72 [perspective:1000px]"
          >
            <div className="relative h-full w-full rounded-xl shadow-xl transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
              <div className="absolute inset-0">
                {country.flags && (
                  <img
                    src={country.flags.png}
                    alt={country.name}
                    className="max-h-full rounded-t-lg object-cover shadow-xl shadow-black/40 [transform:rotateY(180deg)]"
                  />
                )}
                <div className="absolute bottom-4 right-4 ">
                  <p className="[transform:rotateY(180deg)]">
                    Population: {country.population}
                  </p>
                </div>
              </div>

              <div className="absolute inset-0 h-full w-full rounded-xl bg-black/80 px-12 text-center text-slate-200 [transform-rotateY(180deg)] [backface-visibility:hidden]">
                <div className="flex min-h-full flex-col items-center justify-center">
                  <h1 className="text-3xl font-bold">{country.name}</h1>
                  <p className="text-lg">Region: {country.region}</p>
                  <p className="text-base">Area: {country.area}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </ul>
      <div className="flex justify-center mt-4 flex-wrap">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (pageNumber) => (
            <button
              key={pageNumber}
              className={`mx-1 p-2 border rounded ${
                currentPage === pageNumber ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default GetCountries;
