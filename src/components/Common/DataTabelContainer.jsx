import React, { Fragment, useEffect, useState, useMemo } from "react";
import { Row, Table, Button, Col } from "reactstrap";
import { Link } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
} from "@tanstack/react-table";
import { getAllUsersListForFilter, getAllVendorsListForFilter } from "../../helpers/filterApi";
import { set } from "lodash"
import SearchableDropdown from "./SearchableDropdown";
// import JobListGlobalFilter from "./GlobalSearchFilter";

const DataTableContainer = ({
  columns,
  fetchData,
  data,
  isSrNo,
  totalCount,
  pageIndex,
  setPageIndex,
  pageSize,
  setPageSize,
  globalFilter,
  setGlobalFilter,
  selectedUser,
  setSelectedUser,
  selectedVendor,
  setSelectedVendor,
  selectedStoreType,
  tableClass,
  theadClass,
  divClassName,
  isBordered,
  isPagination,
  isGlobalFilter,
  isUserFilter,
  isVendorFilter,
  paginationWrapper,
  SearchPlaceholder,
  pagination,
  buttonClass,
  buttonName,
  isAddButton,
  handleClick,
  isCustomPageSize,
  isJobListGlobalFilter,
  storeType,
  fetchDataDeps = [],
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [userOptions, setUserOptions] = useState([]);
  const [vendorOptions, setVendorOptions] = useState([]);

  // The parent page owns data fetching (its own useEffect). This component only
  // populates the optional user/vendor filter dropdowns, so the table never
  // double-fetches on load or on filter changes.
  useEffect(() => {
    if (isUserFilter) fetchUserList();
    if (isVendorFilter) fetchVendorList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserFilter, isVendorFilter, storeType]);

  const fetchUserList = async () => {
    const response = await getAllUsersListForFilter();
    setUserOptions(response.users);
    return response;
  }

  const fetchVendorList = async () => {
    const response = await getAllVendorsListForFilter({ storeType });
    setVendorOptions(response.vendors);
    return response;
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setGlobalFilter(searchTerm);
    }
    // setSelectedUser("");
    // setSelectedVendor("");
  };

  const clearSearch = () => {
    setSearchTerm("");
    setGlobalFilter("");
  };

  // Move the "Action" column to the front so it renders as the first column.
  const orderedColumns = useMemo(() => {
    if (!Array.isArray(columns)) return columns;
    const idx = columns.findIndex((c) => c.accessorKey === "action");
    if (idx <= 0) return columns;
    const copy = [...columns];
    const [actionCol] = copy.splice(idx, 1);
    copy.unshift(actionCol);
    return copy;
  }, [columns]);

  const hasAction =
    Array.isArray(orderedColumns) &&
    orderedColumns[0]?.accessorKey === "action";

  const table = useReactTable({
    columns: orderedColumns,
    data,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(totalCount / pageSize),
  });

  useEffect(() => {
    if (searchTerm === "") {
      clearSearch();
    }
  }, [searchTerm])


  const colSpan = columns?.length + (isSrNo ? 1 : 0);

  return (
    <Fragment>
      <div className="surface-card">
      <div className="mb-2 d-flex justify-content-between gap-2 align-items-center mt-4" style={{ marginTop: 0 }}>
        {isCustomPageSize && (
          <Col sm={2}>
            <select
              className="form-select pageSize mb-2"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </Col>
        )}
        {isUserFilter && (
          <Col sm={3}>
            <SearchableDropdown
              options={userOptions}
              onChange={(value) => setSelectedUser(value)}
              displayField="name"
              subField="mobileNo"
              placeholder="Search User..."
              allLabel="All Users"
            />
          </Col>
        )}

        {isVendorFilter && (
          <Col sm={3}>
            <SearchableDropdown
              options={vendorOptions}
              onChange={(value) => setSelectedVendor(value)}
              displayField="name"
              placeholder="Search Vendor..."
              allLabel="All Vendors"
            />
          </Col>
        )}

        <Col sm={3} className="position-relative d-inline-block">
          {isGlobalFilter && (
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="form-control search-box me-2 mb-2 d-inline-block"
              placeholder={SearchPlaceholder}
            />
          )}
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="btn position-absolute top-50 end-0 translate-middle-y me-2 p-0"
              style={{ border: "none", background: "transparent" }}
            >
              <i className="bx bx-x fs-2"></i>
            </button>
          )}
        </Col>

        {isAddButton && (
          <div className="text-sm-end">
            <Button type="button" className={buttonClass} onClick={handleClick}>
              <i className="mdi mdi-plus me-1"></i> {buttonName}
            </Button>
          </div>
        )}
      </div>

      <div className={divClassName || "table-responsive"}>
        <Table className={tableClass} bordered={isBordered}>
          <thead className={theadClass}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {isSrNo && !hasAction && <th>Sr No.</th>}
                {headerGroup.headers.map((header, idx) => (
                  <Fragment key={header.id}>
                    <th>{header.column.columnDef.header}</th>
                    {isSrNo && hasAction && idx === 0 && <th>Sr No.</th>}
                  </Fragment>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {isSrNo && !hasAction && (
                    <td>{pageIndex * pageSize + row.index + 1}</td>
                  )}
                  {row.getVisibleCells().map((cell, idx) => (
                    <Fragment key={cell.id}>
                      <td>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                      {isSrNo && hasAction && idx === 0 && (
                        <td>{pageIndex * pageSize + row.index + 1}</td>
                      )}
                    </Fragment>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={colSpan} className="text-center">
                  No results.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {isPagination && (
        <Row>
          <Col sm={12} md={5}>
            <div className="dataTables_info">
              Showing {data.length} of {totalCount} Results
            </div>
          </Col>
          <Col sm={12} md={7}>
            <div className={paginationWrapper}>
              <ul className={pagination}>
                <li
                  className={`paginate_button page-item ${pageIndex === 0 ? "disabled" : ""
                    }`}
                >
                  <Link
                    to="#"
                    className="page-link"
                    onClick={(e) => {
                      e.preventDefault();
                      if (pageIndex > 0) setPageIndex(pageIndex - 1);
                    }}
                  >
                    <i className="mdi mdi-chevron-left"></i>
                  </Link>
                </li>
                {/* {Array.from(
                  { length: Math.ceil(totalCount / pageSize) },
                  (_, index) => (
                    <li
                      key={index}
                      className={`paginate_button page-item ${
                        pageIndex === index ? "active" : ""
                      }`}
                    >
                      <Link
                        to="#"
                        className="page-link"
                        onClick={() => setPageIndex(index)}
                      >
                        {index + 1}
                      </Link>
                    </li>
                  )
                )} */}
                {(() => {
                  const totalPages = Math.ceil(totalCount / pageSize);
                  let startPage = Math.max(0, pageIndex - 1);
                  let endPage = Math.min(totalPages - 1, startPage + 2);
                  let pages = [];

                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <li
                        key={i}
                        className={`paginate_button page-item ${pageIndex === i ? "active" : ""
                          }`}
                      >
                        <Link
                          to="#"
                          className="page-link"
                          onClick={(e) => {
                            e.preventDefault();
                            setPageIndex(i);
                          }}
                        >
                          {i + 1}
                        </Link>
                      </li>
                    );
                  }

                  return pages;
                })()}
                <li
                  className={`paginate_button page-item ${pageIndex >= Math.ceil(totalCount / pageSize) - 1
                    ? "disabled"
                    : ""
                    }`}
                >
                  <Link
                    to="#"
                    className="page-link"
                    onClick={(e) => {
                      e.preventDefault();
                      const maxPage = Math.ceil(totalCount / pageSize) - 1;
                      if (pageIndex < maxPage) setPageIndex(pageIndex + 1);
                    }}
                  >
                    <i className="mdi mdi-chevron-right"></i>
                  </Link>
                </li>
              </ul>
            </div>
          </Col>
        </Row>
      )}
      </div>
    </Fragment>
  );
};

export default DataTableContainer;
