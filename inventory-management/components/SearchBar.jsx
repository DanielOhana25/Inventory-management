import React, { useState } from "react";

export default function SearchBar({ onSearch, placeholder }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term); // Appel à la fonction de rappel pour transmettre la recherche
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder={placeholder}
        className="border border-customGreen rounded-full h-10 w-[26.25rem] p-2.5"
      />
    </div>
  );
}
