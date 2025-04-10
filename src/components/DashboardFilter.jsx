import React, { useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const filterOptions = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "This Week", value: "this_week" },
  { label: "Last Week", value: "last_week" },
  { label: "This Month", value: "this_month" },
  { label: "Last Month", value: "last_month" },
  { label: "Custom Range", value: "custom" },
];

const DashboardFilter = ({ onApply }) => {
  const [filter, setFilter] = useState("this_month");
  const [showPicker, setShowPicker] = useState(false);
  const [customRange, setCustomRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleApply = () => {
    const fromDate = customRange[0].startDate.toISOString();
    const toDate = customRange[0].endDate.toISOString();
    onApply(filter, fromDate, toDate);
    setShowPicker(false);
  };

  const handleCancel = () => {
    setFilter("this_month");
    setShowPicker(false);
  };

  const handleRangeChange = (ranges) => {
    setCustomRange([ranges.selection]);
  };

  return (
    <div className="d-flex justify-content-end mb-3 position-relative">
      <div className="d-flex align-items-center flex-wrap gap-2">
        <select
          className="form-select"
          value={filter}
          onChange={(e) => {
            const val = e.target.value;
            setFilter(val);
            if (val === "custom") {
              setShowPicker(true);
            } else {
              setShowPicker(false);
            }
          }}
          style={{ width: "160px" }}
        >
          {filterOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {filter === "custom" && showPicker && (
          <div
            className="position-absolute mt-2 shadow bg-white rounded p-3 z-3"
            style={{ top: "60px", right: "0" }}
          >
            <DateRange
              editableDateInputs={true}
              onChange={handleRangeChange}
              moveRangeOnFirstSelection={false}
              ranges={customRange}
              maxDate={new Date()}
            />
            <div className="d-flex justify-content-end gap-2 mt-2">
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button className="btn btn-primary btn-sm" onClick={handleApply}>
                Apply
              </button>
            </div>
          </div>
        )}

        {filter !== "custom" && (
          <button className="btn btn-primary" onClick={handleApply}>
            Apply
          </button>
        )}
      </div>
    </div>
  );
};

export default DashboardFilter;
