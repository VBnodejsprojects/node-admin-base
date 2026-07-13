import React from "react";
import { Nav, NavItem, NavLink } from "reactstrap";
import classnames from "classnames";

const Tabs = ({ tabs, activeTab, toggleCustom }) => {
  return (
    <Nav tabs className="nav-tabs-custom">
      {tabs.map((tab) => {
        return (
          <NavItem key={tab.id}>
            <NavLink
              style={{ cursor: "pointer" }}
              className={classnames({ active: activeTab === tab.id })}
              onClick={() => {
                toggleCustom(tab.id);
              }}
            >
              {tab.label}
            </NavLink>
          </NavItem>
        );
      })}
    </Nav>
  );
};

export default Tabs;
