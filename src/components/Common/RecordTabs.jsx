import React from "react";
import { Nav, NavItem, NavLink } from "reactstrap";

// Two-tab switch (All / Deleted) shown above a list table. Drives the soft-delete
// filter sent to the backend `deleted` query param:
//   activeTab === "all"     → non-deleted records (deleted=false)
//   activeTab === "deleted" → soft-deleted records only (deleted=true)
const RecordTabs = ({ activeTab, onChange, allLabel = "All", deletedLabel = "Deleted" }) => (
  <Nav tabs className="nav-tabs-custom mb-3">
    <NavItem>
      <NavLink
        style={{ cursor: "pointer" }}
        className={activeTab === "all" ? "active" : ""}
        onClick={() => onChange("all")}
      >
        <i className="mdi mdi-format-list-bulleted me-1" /> {allLabel}
      </NavLink>
    </NavItem>
    <NavItem>
      <NavLink
        style={{ cursor: "pointer" }}
        className={activeTab === "deleted" ? "active" : ""}
        onClick={() => onChange("deleted")}
      >
        <i className="mdi mdi-delete-outline me-1" /> {deletedLabel}
      </NavLink>
    </NavItem>
  </Nav>
);

export default RecordTabs;
