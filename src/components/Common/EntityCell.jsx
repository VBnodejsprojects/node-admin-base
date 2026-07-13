import React from "react";

// Shows a user/vendor entity as a single cell: profile image + name + mobile no.
// `entity` is the populated user/vendor object ({ name, mobileNo, profileImage }).
// `fallbackName` / `fallbackMobile` are used when the entity object is absent.
const EntityCell = ({ entity, fallbackName, fallbackMobile, emptyLabel = "N/A", showImage = true }) => {
  const e = entity || {};
  const name = e.name || fallbackName || emptyLabel;
  const mobile = e.mobileNo || fallbackMobile || "";
  return (
    <div className="d-flex align-items-center gap-2">
      {showImage && (
        <img
          src={e.profileImage || "vite.svg"}
          alt=""
          style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
        />
      )}
      <div>
        <div className="fw-medium">{name}</div>
        {mobile ? <div className="text-muted small">{mobile}</div> : null}
      </div>
    </div>
  );
};

export default EntityCell;
