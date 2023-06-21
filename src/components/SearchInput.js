import React from "react";
import { FiSearch } from "react-icons/fi";

function SearchInput({ searchTerm, onChange }) {
  return (
    <div className="title-container mb-4">
      <div className="search-container rounded flex border-2 border-black">
        <input
          type="text"
          className="search-input rounded-l p-2 w-80"
          placeholder="Search by name"
          value={searchTerm}
          onChange={onChange}
          aria-label="Search by name"
        />
        <div className="search-icon-container rounded-r bg-white p-2">
          <FiSearch className="search-icon" />
        </div>
      </div>
    </div>
  );
}

export default SearchInput;
