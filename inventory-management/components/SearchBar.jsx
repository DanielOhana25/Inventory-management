import React, { useState } from "react";

export default function SearchBar({ onSearch, placeholder }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term); // Appel à la fonction de rappel pour transmettre la recherche
  };

  return (
    <div className="w-full flex sm:justify-center lg:justify-start ">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder={placeholder}
        className="border border-customGreen rounded-full h-10 w-full max-w-lg p-2.5 sm:w-80 md:w-96 lg:w-[26.25rem]"
      />
    </div>
  );
}
