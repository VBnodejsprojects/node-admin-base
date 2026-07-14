import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";

import { getAllVendor, addVendor, updateVendor } from "../../helpers/vendorApi";
import { getVendorAppVersions } from "../../helpers/filterApi";
import DataTableContainer from "../../components/Common/DataTabelContainer";
import FilterField from "../../components/Common/FilterField";
import RecordTabs from "../../components/Common/RecordTabs";
import EntityCell from "../../components/Common/EntityCell";
import { ShowToast } from "../../components/Toast";
import DeleteModal from "../../components/Common/DeleteModal";
import LocationMap from "../../components/Common/LocationMap";
import { formatDateTime } from "../../utils/formatDate";
import AddEditVendor from "./AddEditVendor";

const Vendors = () => {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [accountStatusFilter, setAccountStatusFilter] = useState("");
  const [versionFilter, setVersionFilter] = useState("");
  const [versionOptions, setVersionOptions] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [vendor, setVendor] = useState();
  const [selectedFiles, setSelectedFiles] = useState({});
  const [deleteModal, setDeleteModal] = useState(false);

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
      accountHolderName: vendor?.accountHolderName || "",
      bankName: vendor?.bankName || "",
      accountNumber: vendor?.accountNumber || "",
      ifscCode: vendor?.ifscCode || "",
      // GeoJSON location.coordinates is [lng, lat]; the map reads/writes lat/lng.
      lat: vendor?.location?.coordinates?.[1] ?? "",
      lng: vendor?.location?.coordinates?.[0] ?? "",
      status: vendor?.status || "",
      reasonForRejection: vendor?.reasonForRejection || "",
      isActive: vendor?.isActive ?? true,
      isVerified: vendor?.isVerified ?? false,
      isBlocked: vendor?.isBlocked ?? false,
      isDeleted: vendor?.isDeleted ?? false,
    },

    onSubmit: async (values) => {
      try {
        // Drop lat/lng when unset so the numeric backend validation doesn't 400
        // on an empty string; the map fills them when a location is chosen.
        const payload = { ...values };
        if (payload.lat === "" || payload.lat === null) delete payload.lat;
        if (payload.lng === "" || payload.lng === null) delete payload.lng;

        // Admin-created vendors skip the approval flow — created already approved,
        // active and verified (no status fields are shown on the Add form).
        if (!isEdit) {
          payload.status = "approved";
          payload.isActive = true;
          payload.isVerified = true;
        }

        const response = isEdit
          ? await updateVendor(payload, vendor._id)
          : await addVendor(payload);

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
        accountStatus: accountStatusFilter,
        deleted: activeTab === "deleted",
        appVersion: versionFilter,
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

  // Restore a soft-deleted vendor → clears isDeleted so it returns to the All tab.
  const handleRestore = async (data) => {
    const response = await updateVendor({ isDeleted: false }, data._id);
    if (response?.type === "success") {
      ShowToast.success("Vendor restored successfully");
      fetchData();
    } else {
      ShowToast.error(response?.message || "Failed to restore vendor");
    }
  };

  // Soft delete via the existing update endpoint (isDeleted → true).
  const handleDelete = async () => {
    const response = await updateVendor({ isDeleted: true }, vendor._id);
    if (response?.type === "success") {
      ShowToast.success("Vendor deleted successfully");
      fetchData();
      setDeleteModal(false);
      setVendor(null);
    } else {
      ShowToast.error(response?.message || "Failed to delete vendor");
    }
  };

  const fetchVersionOptions = async () => {
    const response = await getVendorAppVersions();
    setVersionOptions(response?.versions || []);
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
      header: "Vendor",
      accessorKey: "name",
      cell: ({ row }) => <EntityCell entity={row.original} />,
    },
    { header: "Email", accessorKey: "email", cell: ({ row }) => row.original.email || "N/A" },
    { header: "City", accessorKey: "city", cell: ({ row }) => row.original.city || "N/A" },
    { header: "State", accessorKey: "state", cell: ({ row }) => row.original.state || "N/A" },
    {
      header: "App Version",
      accessorKey: "appVersion",
      cell: ({ row }) => row.original.appVersion || "N/A",
    },
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
      header: "Created At",
      accessorKey: "createdAt",
      cell: ({ row }) => formatDateTime(row.original.createdAt),
    },
    {
      header: "Action",
      accessorKey: "action",
      cell: (cellProps) => (
        <div className="d-flex gap-3">
          {cellProps.row.original.isDeleted ? (
            <Link to="#" className="text-success" onClick={() => handleRestore(cellProps.row.original)}>
              <i className="mdi mdi-restore font-size-18" title="Restore" />
            </Link>
          ) : (
            <>
              <Link to="#" className="text-success" onClick={() => onClickEdit(cellProps.row.original)}>
                <i className="mdi mdi-pencil font-size-18" />
              </Link>
              <Link
                to="#"
                className="text-danger"
                onClick={() => {
                  setVendor(cellProps.row.original);
                  setDeleteModal(true);
                }}
              >
                <i className="mdi mdi-delete font-size-18" />
              </Link>
            </>
          )}
        </div>
      ),
    },
  ];

  // Grouped fields. Every field is admin-editable (on both add and edit); only
  // the wallet balance is excluded — it's adjusted through wallet transactions.
  const fieldGroups = [
    {
      title: "Basic Information",
      fields: [
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
      ],
    },
    {
      title: "Location",
      // Map lives in the same section as the address fields; searching or
      // dragging the pin fills Address / City / State / Pincode + lat/lng.
      content: (
        <>
          <p className="text-muted small mb-2">Search an address or drag the pin to set the location.</p>
          <LocationMap
            lat={validation.values.lat}
            lng={validation.values.lng}
            editable={true}
            validation={validation}
            addressField="address"
            cityField="city"
            stateField="state"
            pincodeField="pincode"
            countryField="country"
            height="280px"
          />
        </>
      ),
      fields: [
        { name: "address", label: "Address", type: "text", fullWidth: true },
        { name: "manualAddress", label: "Manual Address", type: "text", fullWidth: true },
        { name: "city", label: "City", type: "text" },
        { name: "state", label: "State", type: "text" },
        { name: "country", label: "Country", type: "text" },
        { name: "pincode", label: "Pincode", type: "text" },
      ],
    },
    {
      title: "Bank Details",
      fields: [
        { name: "accountHolderName", label: "Account Holder Name", type: "text" },
        { name: "bankName", label: "Bank Name", type: "text" },
        { name: "accountNumber", label: "Account Number", type: "text" },
        { name: "ifscCode", label: "IFSC Code", type: "text" },
      ],
    },
    // Status & approval is admin-managed on EDIT only. On ADD there's no approval
    // step — the vendor is created already approved (see onSubmit).
    ...(isEdit
      ? [
          {
            title: "Status & Approval",
            fields: [
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
              // Reason shows only when the status is "rejected".
              ...(validation.values.status === "rejected"
                ? [{ name: "reasonForRejection", label: "Reason For Rejection", type: "text", fullWidth: true }]
                : []),
              { name: "isActive", label: "Active", type: "select", isBoolean: true },
              { name: "isVerified", label: "Verified", type: "select", isBoolean: true },
              { name: "isBlocked", label: "Blocked", type: "select", isBoolean: true },
              { name: "isDeleted", label: "Deleted", type: "select", isBoolean: true },
            ],
          },
        ]
      : []),
  ];

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize, globalFilter, statusFilter, accountStatusFilter, activeTab, versionFilter]);

  useEffect(() => {
    fetchVersionOptions();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPageIndex(0);
  };

  return (
    <div className="page-content">
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDelete}
        onCloseClick={() => setDeleteModal(false)}
      />
      <h4><i className="bx bx-store-alt" /> Vendors</h4>

      <RecordTabs activeTab={activeTab} onChange={handleTabChange} />
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
        filters={
          <>
            <FilterField label="Approval">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPageIndex(0); }}
              >
                <option value="">All</option>
                <option value="Incomplete">Incomplete</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </FilterField>
            <FilterField label="Account">
              <select
                className="form-select"
                value={accountStatusFilter}
                onChange={(e) => { setAccountStatusFilter(e.target.value); setPageIndex(0); }}
              >
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="blocked">Blocked</option>
                <option value="verified">Verified</option>
              </select>
            </FilterField>
            <FilterField label="App Version">
              <select
                className="form-select"
                value={versionFilter}
                onChange={(e) => { setVersionFilter(e.target.value); setPageIndex(0); }}
              >
                <option value="">All</option>
                {versionOptions.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </FilterField>
          </>
        }
        isGlobalFilter={true}
        isAddButton={true}
        handleClick={toggle}
        buttonName="Add Vendor"
        buttonClass="btn btn-success btn-rounded waves-effect waves-light mb-2 me-2"
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
        fieldGroups={fieldGroups}
      />
    </div>
  );
};

export default Vendors;
