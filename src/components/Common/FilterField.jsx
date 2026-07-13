import React from "react";

// A single filter control with a consistent label + spacing so every filter
// across the app lines up in one row (used inside the DataTableContainer toolbar).
const FilterField = ({ label, children, width = 170, className = "" }) => (
    <div className={className} style={{ minWidth: width }}>
        {label ? (
            <label className="form-label mb-1 text-muted small fw-medium">{label}</label>
        ) : null}
        {children}
    </div>
);

export default FilterField;
