import React, { useState, useRef, useEffect } from "react";

const SearchableDropdown = ({
    options = [],
    placeholder = "Select...",
    onChange,
    displayField = "name",
    subField,
    value,
    allLabel = "All"
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const filteredOptions = options.filter((opt) => {
        const text = `${opt[displayField]} ${subField ? opt[subField] : ""}`;
        return text.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const allOption = {
        _id: "",
        [displayField]: allLabel,
        ...(subField && { [subField]: "" }),
    };

    const finalOptions = [allOption, ...filteredOptions];

    const handleSelect = (selected) => {
        if (selected._id === "") {
            setSearchTerm(""); // or set to allLabel
        } else {
            setSearchTerm(`${selected[displayField]}${subField ? " (" + selected[subField] + ")" : ""}`);
        }
        setShowDropdown(false);
        onChange(selected._id);
    };

    return (
        <div className="position-relative" ref={dropdownRef}>
            <input
                type="text"
                className="form-control mb-2"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
            />
            <span
                className="position-absolute top-50 end-0 translate-middle-y me-2"
                style={{ pointerEvents: 'none', color: '#aaa' }}
            >
                <i className="bx bx-chevron-down text-black fs-3"></i>
            </span>
            {showDropdown && (
                <ul className="dropdown-menu show w-100" style={{ maxHeight: 200, overflowY: "auto" }}>
                    {finalOptions.length ? (
                        finalOptions.map((opt) => (
                            <li key={opt._id || "all"}>
                                <button
                                    className="dropdown-item"
                                    type="button"
                                    onClick={() => handleSelect(opt)}
                                >
                                    {opt[displayField]}
                                    {subField && opt[subField] && ` (${opt[subField]})`}
                                </button>
                            </li>
                        ))
                    ) : (
                        <li>
                            <span className="dropdown-item-text">No results found</span>
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default SearchableDropdown;
