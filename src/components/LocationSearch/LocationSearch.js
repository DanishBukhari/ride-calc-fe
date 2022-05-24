import React from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import "./LocationSearch.css";

const LocationSearch = (props) => {
  const [address, setAddress] = React.useState("");

  React.useEffect(() => {
    props.address && setAddress(props.address);
  }, [props.address]);

  React.useEffect(() => {
    if (props.clearLocation) {
      setAddress("");
      props.onLocationCleared();
    }
  }, [props, props.clearLocation]);

  const handleChange = (address) => {
    setAddress(address);
  };

  const handleSelect = async (address) => {
    setAddress(address);
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => props.onSelect(latLng.lat, latLng.lng, address));
  };

  return (
    <div className="location-search">
      <PlacesAutocomplete
        value={address}
        onChange={handleChange}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: "Search places...",
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div className="loading">Loading...</div>}
              {suggestions?.map((suggestion, index) => {
                const className = suggestion.active
                  ? "suggestion-item-active"
                  : "suggestion-item";
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: "#fafafa", cursor: "pointer" }
                  : { backgroundColor: "#ffffff", cursor: "pointer" };
                return (
                  <div
                    key={index}
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    </div>
  );
};

export default LocationSearch;
