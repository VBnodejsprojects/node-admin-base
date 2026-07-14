import React from "react";

// Two-tab switch (All / Deleted) shown above a list table. Drives the soft-delete
// filter sent to the backend `deleted` query param:
//   activeTab === "all"     → non-deleted records (deleted=false)
//   activeTab === "deleted" → soft-deleted records only (deleted=true)
// Rendered as coloured buttons: All = green, Deleted = red; the active tab is
// filled, the inactive one is outlined.
const RecordTabs = ({ activeTab, onChange, allLabel = "All", deletedLabel = "Deleted List" }) => (
  <div className="d-flex gap-2 mb-3">
    <button
      type="button"
      className={`btn ${activeTab === "all" ? "btn-success" : "btn-outline-success"}`}
      onClick={() => onChange("all")}
    >
      <i className="mdi mdi-format-list-bulleted me-1" /> {allLabel}
    </button>
    <button
      type="button"
      className={`btn ${activeTab === "deleted" ? "btn-danger" : "btn-outline-danger"}`}
      onClick={() => onChange("deleted")}
    >
      <i className="mdi mdi-delete-outline me-1" /> {deletedLabel}
    </button>
  </div>
);

export default RecordTabs;
