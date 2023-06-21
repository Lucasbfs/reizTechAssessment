import React, { useEffect, useState } from "react";
import axios from "axios";
import ListCountries from "./ListCountries";
import SearchInput from "./SearchInput";
import ErrorMessage from "./ErrorMessage";

function GetCountries() {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [sortBy, setSortBy] = useState("name_asc");
  const [currentPage, setCurrentPage] = useState(1);
  const countriesPerPage = 20;
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setLoading(false);
    } catch (error) {
      setError("Error fetching countries");
      setLoading(false);
      setCurrentPage(0);
    }
  };

  const handleSortByChange = (event) => {
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
      <SearchInput searchTerm={searchTerm} onChange={handleSearchChange} />

      <div className="flex flex-wrap justify-between mb-10 gap-4">
        <div>
          <label className="mr-2">Sort by:</label>
          <select
            value={sortBy}
            onChange={handleSortByChange}
            className="filters"
            aria-label="Sort by"
          >
            <option value="name_asc">Name (A-Z)</option>
            <option value="name_desc">Name (Z-A)</option>
            <option value="area_asc">Area (Smallest to Largest)</option>
            <option value="area_desc">Area (Largest to Smallest)</option>
          </select>
        </div>
        <div>
          <label className="mr-2">Filter:</label>
          <select
            onChange={handleFilterChange}
            className="filters"
            aria-label="Filter by"
          >
            <option value="all">All</option>
            <option value="smaller_than_lithuania">
              Smaller than Lithuania
            </option>
            <option value="oceania_region">Oceania Region</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-blue-500">Loading...</div>
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <ListCountries currentCountries={currentCountries} />
      )}

      <div className="flex justify-center mt-4 flex-wrap">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (pageNumber) => (
            <button
              key={pageNumber}
              className={`mx-1 p-2 border rounded ${
                currentPage === pageNumber ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => handlePageChange(pageNumber)}
              aria-label={`Page ${pageNumber}`}
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
