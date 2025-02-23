import React, { useState, useCallback, useRef } from "react";
import { Form, InputGroup, Dropdown } from "react-bootstrap";
import { FixedSizeGrid as Grid } from "react-window";
import "./ReusableDropdown.css"; // External CSS for styling
import useDebounce from "./useDebounce";

const COLUMN_COUNT = 3; // 3 values per row

const ReusableDropdown = ({ label, options = [] }) => {
  const [state, setState] = useState({
    search: "",
    selected: "",
    error: "",
    showDropdown: false,
  });

  const inputRef = useRef(null);
  const debouncedSearch = useDebounce(state.search, 300);

  const filteredOptions =
    typeof debouncedSearch === "string"
      ? options.filter((option) =>
          option.toString().toLowerCase().includes(debouncedSearch.toLowerCase())
        )
      : options;

  const handleSelect = useCallback((option) => {
    setState((prev) => ({
      ...prev,
      search: option,
      selected: option,
      error: "",
      showDropdown: false,
    }));
  }, []);

  const columnWidth = inputRef.current ? inputRef.current.offsetWidth / COLUMN_COUNT : 80;
  const rowCount = Math.ceil(filteredOptions.length / COLUMN_COUNT);

  return (
    <div className="dropdown-container">
      <label className="dropdown-label">{label}</label>
      <InputGroup>
        <Form.Control
          ref={inputRef}
          type="text"
          placeholder={`Search ${label}`}
          value={state.search}
          onChange={(e) =>
            setState((prev) => ({
              ...prev,
              search: e.target.value,
              showDropdown: true,
            }))
          }
          onFocus={() => setState((prev) => ({ ...prev, showDropdown: true }))}
          onBlur={() =>
            setTimeout(() => setState((prev) => ({ ...prev, showDropdown: false })), 200)
          }
          className="dropdown-input"
        />
      </InputGroup>

      {state.showDropdown && filteredOptions.length > 0 && (
        <Dropdown.Menu show className="dropdown-menu">
          <div className="dropdown-grid-container">
            <Grid
              columnCount={COLUMN_COUNT}
              columnWidth={columnWidth}
              height={150}
              rowCount={rowCount}
              rowHeight={35}
              width={inputRef.current ? inputRef.current.offsetWidth : 250}
              className="grid-list"
            >
              {({ rowIndex, columnIndex, style }) => {
                const itemIndex = rowIndex * COLUMN_COUNT + columnIndex;
                if (itemIndex >= filteredOptions.length) return null;

                return (
                  <Dropdown.Item
                    style={style}
                    onMouseDown={() => handleSelect(filteredOptions[itemIndex])}
                    className="dropdown-item"
                  >
                    {filteredOptions[itemIndex]}
                  </Dropdown.Item>
                );
              }}
            </Grid>
          </div>
        </Dropdown.Menu>
      )}
      <div className="dropdown-error">{state.error}</div>
    </div>
  );
};

export default ReusableDropdown;
