import React from "react";

export default function SearchBar({ search, setSearch }) {
  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        className="border border-customGreen rounded-full h-10 w-[26.25rem] p-2.5"
      />
    </div>
  );
}