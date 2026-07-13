import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";

import { getAllVendor, updateVendor } from "../../helpers/vendorApi";
import DataTableContainer from "../../components/Common/DataTabelContainer";
import { ShowToast } from "../../components/Toast";
import AddEditVendor from "./AddEditVendor";

const Vendors = () => {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [vendor, setVendor] = useState();
  const [selectedFiles, setSelectedFiles] = useState({});

  // Only fields the backend PUT /vendor/profile/:id accepts (vendorValidation.updateProfile).
  // `status` / status-flags are server-controlled → display-only columns.
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: vendor?.name || "",
      email: vendor?.email || "",
      mobileNo: vendor?.mobileNo || "",
      gender: vendor?.gender || "",
      dateOfBirth: vendor?.dateOfBirth || "",
      language: vendor?.language || "",
      address: vendor?.address || "",
      manualAddress: vendor?.manualAddress || "",
      city: vendor?.city || "",
      state: vendor?.state || "",
      country: vendor?.country || "",
      pincode: vendor?.pincode || "",
      lat: vendor?.lat ?? "",
      lng: vendor?.lng ?? "",
      status: vendor?.status || "",
      reasonForRejection: vendor?.reasonForRejection || "",
      isActive: vendor?.isActive ?? true,
      isVerified: vendor?.isVerified ?? false,
      isBlocked: vendor?.isBlocked ?? false,
      isDeleted: vendor?.isDeleted ?? false,
    },

    onSubmit: async (values) => {
      try {
        const response = await updateVendor(values, vendor._id);

        if (response?.type === "success") {
          ShowToast.success(response.message || "Operation successful");
          fetchData();
          toggle();
          validation.resetForm();
        } else {
          ShowToast.error(response?.message || "Failed to update Vendor");
        }
      } catch (error) {
        console.error("Error in form submission:", error);
        ShowToast.error("An error occurred while processing your request.");
      }
    },
  });

  const toggle = () => {
    if (open) {
      setOpen(false);
      setIsEdit(false);
      setVendor(null);
      setSelectedFiles(null);
      validation.resetForm();
    } else {
      setOpen(true);
    }
  };

  const fetchData = async () => {
    try {
      const response = await getAllVendor({
        search: globalFilter,
        page: pageIndex,
        limit: pageSize,
        status: statusFilter,
      });

      if (response?.type === "success") {
        setData(response?.vendors || []);
        setTotalCount(response?.total || 0);
      } else {
        setData([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
      setData([]);
      setTotalCount(0);
    }
  };

  const onClickEdit = (data) => {
    setVendor(data);
    setIsEdit(true);
    setOpen(true);
  };

  const getStatusBadge = (status) => {
    let className = "px-1 py-1 rounded text-white";
    switch (status?.toLowerCase()) {
      case "pending":
        className += " bg-warning text-dark fs-6";
        break;
      case "approved":
        className += " bg-success fs-6";
        break;
      case "rejected":
        className += " bg-danger fs-6";
        break;
      default:
        className += " bg-secondary fs-6";
    }
    return <span className={className}>{status}</span>;
  };

  const columns = [
    {
      header: "Profile Image",
      accessorKey: "profileImage",
      cell: ({ row }) => (
        <img
          src={row.original.profileImage || "vite.svg"}
          alt="profile"
          style={{ width: "40px", height: "40px", borderRadius: "50%" }}
        />
      ),
    },
    { header: "Name", accessorKey: "name", cell: ({ row }) => row.original.name || "N/A" },
    { header: "Email", accessorKey: "email", cell: ({ row }) => row.original.email || "N/A" },
    { header: "Mobile No", accessorKey: "mobileNo", cell: ({ row }) => row.original.mobileNo || "N/A" },
    { header: "City", accessorKey: "city", cell: ({ row }) => row.original.city || "N/A" },
    { header: "State", accessorKey: "state", cell: ({ row }) => row.original.state || "N/A" },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => getStatusBadge(row.original.status || "N/A"),
    },
    {
      header: "Verified",
      accessorKey: "isVerified",
      cell: ({ row }) => (
        <div className={`fs-5 fw-bold ${row.original.isVerified ? "text-success" : "text-danger"}`}>
          {row.original.isVerified ? "Yes" : "No"}
        </div>
      ),
    },
    {
      header: "Active",
      accessorKey: "isActive",
      cell: ({ row }) => (
        <div className={`fs-5 fw-bold ${row.original.isActive ? "text-success" : "text-danger"}`}>
          {row.original.isActive ? "Yes" : "No"}
        </div>
      ),
    },
    {
      header: "Blocked",
      accessorKey: "isBlocked",
      cell: ({ row }) => (
        <div className={`fs-5 fw-bold ${!row.original.isBlocked ? "text-danger" : "text-success"}`}>
          {row.original.isBlocked ? "Yes" : "No"}
        </div>
      ),
    },
    {
      header: "Action",
      accessorKey: "action",
      cell: (cellProps) => (
        <div className="d-flex gap-3">
          <Link to="#" className="text-success" onClick={() => onClickEdit(cellProps.row.original)}>
            <i className="mdi mdi-pencil font-size-18" />
          </Link>
        </div>
      ),
    },
  ];

  const formFields = [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "email", label: "Email", type: "text" },
    { name: "mobileNo", label: "Mobile No", type: "text", required: true },
    {
      name: "gender",
      label: "Gender",
      type: "select",
      options: [
        { key: "male", label: "Male" },
        { key: "female", label: "Female" },
        { key: "other", label: "Other" },
      ],
    },
    { name: "dateOfBirth", label: "Date of Birth", type: "date" },
    { name: "language", label: "Language", type: "text" },
    { name: "address", label: "Address", type: "text" },
    { name: "manualAddress", label: "Manual Address", type: "text" },
    { name: "city", label: "City", type: "text" },
    { name: "state", label: "State", type: "text" },
    { name: "country", label: "Country", type: "text" },
    { name: "pincode", label: "Pincode", type: "text" },
    { name: "lat", label: "Latitude", type: "number" },
    { name: "lng", label: "Longitude", type: "number" },
    // Approval / status controls (admin-only)
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { key: "Incomplete", label: "Incomplete" },
        { key: "pending", label: "Pending" },
        { key: "approved", label: "Approved" },
        { key: "rejected", label: "Rejected" },
      ],
    },
    { name: "reasonForRejection", label: "Reason For Rejection", type: "text" },
    { name: "isActive", label: "Active", type: "select", isBoolean: true, options: [{ key: true, label: "Yes" }, { key: false, label: "No" }] },
    { name: "isVerified", label: "Verified", type: "select", isBoolean: true, options: [{ key: true, label: "Yes" }, { key: false, label: "No" }] },
    { name: "isBlocked", label: "Blocked", type: "select", isBoolean: true, options: [{ key: true, label: "Yes" }, { key: false, label: "No" }] },
    { name: "isDeleted", label: "Deleted", type: "select", isBoolean: true, options: [{ key: true, label: "Yes" }, { key: false, label: "No" }] },
  ];

  useEffect(() => {
    fetchData();
  }, [pageIndex, pageSize, globalFilter, statusFilter]);

  return (
    <div className="page-content">
      <h4><i className="bx bx-store-alt" /> Vendors</h4>

      <div className="d-flex align-items-center gap-2 mb-3">
        <label className="mb-0">Status:</label>
        <select
          className="form-select"
          style={{ width: 220 }}
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPageIndex(0); }}
        >
          <option value="">All</option>
          <option value="Incomplete">Incomplete</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <DataTableContainer
        columns={columns}
        fetchData={fetchData}
        data={data}
        isSrNo={true}
        totalCount={totalCount}
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        pageSize={pageSize}
        setPageSize={setPageSize}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        isGlobalFilter={true}
        isAddButton={false}
        isPagination={true}
        SearchPlaceholder="Search vendor..."
        tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
        theadClass="table-light"
        pagination="pagination"
        paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
      />
      <AddEditVendor
        open={open}
        toggle={toggle}
        isEdit={isEdit}
        validation={validation}
        formFields={formFields}
        setSelectedFiles={setSelectedFiles}
        selectedFiles={selectedFiles}
      />
    </div>
  );
};

export default Vendors;
