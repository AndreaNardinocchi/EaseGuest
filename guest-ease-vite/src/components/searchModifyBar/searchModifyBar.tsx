import React, { useState, useEffect } from "react";
import type { SearchModifyBarProps } from "../../types/interfaces";

const SearchModifyBar: React.FC<SearchModifyBarProps> = ({
  initialCheckIn,
  initialCheckOut,
  initialGuests,
}) => {
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guests, setGuests] = useState(initialGuests);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const updateSearch = () => {
    if (!checkIn || !checkOut) return alert("Please select valid dates");
    if (new Date(checkOut) <= new Date(checkIn))
      return alert("Check‑out must be after check‑in.");

    window.location.href = `/search-results?checkIn=${encodeURIComponent(
      checkIn
    )}&checkOut=${encodeURIComponent(checkOut)}&guests=${guests}`;
  };

  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    flexWrap: isMobile ? "nowrap" : "wrap",
    alignItems: isMobile ? "stretch" : "flex-end",
    justifyContent: "center",
    gap: "1rem",
    width: "100%",
    maxWidth: isMobile ? "95%" : "900px",
    margin: "1rem auto",
    padding: isMobile ? "0.75rem" : "1rem",
    boxSizing: "border-box",
  };
  const fieldContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    flex: isMobile ? "1 1 100%" : "1 1 200px",
    minWidth: isMobile ? "100%" : "180px",
  };
  const labelStyle: React.CSSProperties = {
    marginBottom: "0.5rem",
    fontWeight: "bold",
  };
  const inputStyle: React.CSSProperties = {
    padding: "0.75rem",
    fontSize: "1rem",
    borderRadius: "10px",
    border: "1px solid #ccc",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    outline: "none",
    backgroundColor: "#fff",
    width: "100%",
    boxSizing: "border-box",
  };
  const buttonStyle: React.CSSProperties = {
    height: "3rem",
    padding: "0 1.5rem",
    fontSize: "1rem",
    fontWeight: 500,
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#472d30",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.2s ease",
    width: isMobile ? "100%" : "auto",
    marginTop: isMobile ? "0.5rem" : "0",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        updateSearch();
      }}
      style={formStyle}
    >
      <div style={fieldContainerStyle}>
        <label style={labelStyle}>Check‑in</label>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={fieldContainerStyle}>
        <label style={labelStyle}>Check‑out</label>
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={fieldContainerStyle}>
        <label style={labelStyle}>Guests</label>
        <input
          type="number"
          min={1}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          style={inputStyle}
        />
      </div>

      <button type="submit" style={buttonStyle}>
        Update Search
      </button>
    </form>
  );
};

export default SearchModifyBar;
