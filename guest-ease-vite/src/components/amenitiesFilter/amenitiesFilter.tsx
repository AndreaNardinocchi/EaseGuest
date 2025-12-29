import React from "react";
import { Box, Chip, Typography } from "@mui/material";
import type { AmenitiesFilterProps } from "../../types/interfaces";

const AmenitiesFilter: React.FC<AmenitiesFilterProps> = ({
  allAmenities,
  selectedAmenities,
  setSelectedAmenities,
}) => {
  /**
   * Toggles an amenity in the selectedAmenities array.
   *
   * This uses the functional form of the React state setter because the new
   * state depends on the previous state. React may batch state updates, so
   * relying on the previous value directly (instead of using the current
   * selectedAmenities variable) ensures correctness.
   *
   * Sources:
   * - React useState API: https://react.dev/reference/react/useState
   * - Why updater functions are needed: https://react.dev/learn/state-as-a-snapshot
   */
  const toggleAmenities = (amenity: string) => {
    setSelectedAmenities(
      /**
       * prev = the previous array of selected amenities.
       * React guarantees prev is always the latest state value.
       */
      (prev: string[]) =>
        prev.includes(amenity)
          ? // If the amenity is already selected, remove it
            prev.filter((a) => a !== amenity)
          : // Otherwise, add it to the selected list
            [...prev, amenity]
    );
  };

  return (
    <Box sx={{ mb: 3 }}>
      {" "}
      <Typography variant="h6" sx={{ mb: 1 }}>
        {" "}
        Amenities{" "}
      </Typography>{" "}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {" "}
        {allAmenities.map((amenity) => (
          <Chip
            key={amenity}
            label={amenity}
            clickable
            onClick={() => toggleAmenities(amenity)}
            variant={
              selectedAmenities.includes(amenity) ? "filled" : "outlined"
            }
            sx={{
              borderRadius: "8px",
              fontWeight: 500,
              backgroundColor: selectedAmenities.includes(amenity)
                ? "#e26d5c" // selected background
                : "transparent",
              color: selectedAmenities.includes(amenity)
                ? "#fff" // text color when selected
                : "inherit",
              borderColor: selectedAmenities.includes(amenity)
                ? "#e26d5c" // border matches selected color
                : "rgba(0,0,0,0.23)",
              "&:hover": {
                backgroundColor: selectedAmenities.includes(amenity)
                  ? "#d45f50" // slightly darker hover shade
                  : "rgba(0,0,0,0.04)",
              },
            }}
          />
        ))}{" "}
      </Box>{" "}
    </Box>
  );
};
export default AmenitiesFilter;
