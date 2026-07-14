import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";

import { getAllUser, addUser, updateUser } from "../../helpers/userApi";
import { getUserAppVersions } from "../../helpers/filterApi";
import DataTableContainer from "../../components/Common/DataTabelContainer";
import FilterField from "../../components/Common/FilterField";
import RecordTabs from "../../components/Common/RecordTabs";
import EntityCell from "../../components/Common/EntityCell";
import { ShowToast } from "../../components/Toast";
import AddEditUser from "./AddEditUser";

const Users = () => {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [versionFilter, setVersionFilter] = useState("");
  const [versionOptions, setVersionOptions] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [user, setUser] = useState(null);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: user?.name || "",
      email: user?.email || "",
      mobileNo: user?.mobileNo || "",
      gender: user?.gender || "",
      dateOfBirth: user?.dateOfBirth || "",
      language: user?.language || "",
      isActive: user?.isActive ?? true,
      isVerified: user?.isVerified ?? false,
      isBlocked: user?.isBlocked ?? false,
      isDeleted: user?.isDeleted ?? false,
    },
    onSubmit: async (values) => {
      try {
        const payload = { ...values };
        const response = isEdit
          ? await updateUser(payload, user._id)
          : await addUser(payload);

        if (response?.type === "success") {
          ShowToast.success(response.message || "Operation successful");
          fetchData();
          toggle();
          validation.resetForm();
        } else {
          ShowToast.error(response?.message || "Failed to update user");
        }
      } catch (error) {
        console.error("Error in form submission:", error);
        ShowToast.error("An error occurred while processing your request.");
      } finally {
        toggle();
      }
    },
  });

  const toggle = () => {
    if (open) {
      setOpen(false);
      setIsEdit(false);
      setUser(null);
      validation.resetForm();
    } else {
      setOpen(true);
    }
  };

  const fetchData = async () => {
    const response = await getAllUser({
      search: globalFilter,
      page: pageIndex,
      limit: pageSize,
      status: statusFilter,
      deleted: activeTab === "deleted",
      appVersion: versionFilter,
    });
    setData(response?.users || []);
    setTotalCount(response?.total || 0);
  };

  const fetchVersionOptions = async () => {
    const response = await getUserAppVersions();
    setVersionOptions(response?.versions || []);
  };

  const onClickEdit = (rowUser) => {
    setUser(rowUser);
    setIsEdit(true);
    setOpen(true);
  };

  const columns = [
    {
      header: "User",
      accessorKey: "name",
      cell: ({ row }) => <EntityCell entity={row.original} />,
    },
    { header: "Email", accessorKey: "email" },
    { header: "Gender", accessorKey: "gender" },
    {
      header: "App Version",
      accessorKey: "appVersion",
      cell: ({ row }) => row.original.appVersion || "N/A",
    },
    {
      header: "Wallet Amount",
      accessorKey: "walletAmount",
      cell: ({ row }) => {
        const amount = Number(row.original.walletAmount);
        return Number.isFinite(amount) ? amount.toFixed(2) : "0.00";
      },
    },
    {
      header: "Verified",
      accessorKey: "isVerified",
      cell: ({ row }) => (
        <div
          className={`fs-5 fw-bold ${
            row.original.isVerified ? "text-success" : "text-danger"
          }`}
        >
          {row.original.isVerified ? "Yes" : "No"}
        </div>
      ),
    },
    {
      header: "Active",
      accessorKey: "isActive",
      cell: ({ row }) => (
        <div
          className={`fs-5 fw-bold ${
            row.original.isActive ? "text-success" : "text-danger"
          }`}
        >
          {row.original.isActive ? "Yes" : "No"}
        </div>
      ),
    },
    {
      header: "Blocked",
      accessorKey: "isBlocked",
      cell: ({ row }) => (
        <div
          className={`fs-5 fw-bold ${
            !row.original.isBlocked ? "text-danger" : "text-success"
          }`}
        >
          {row.original.isBlocked ? "Yes" : "No"}
        </div>
      ),
    },
    {
      header: "Action",
      accessorKey: "action",
      cell: (cellProps) => (
        <div className="d-flex gap-3">
          <Link
            to="#"
            className="text-success"
            onClick={() => onClickEdit(cellProps.row.original)}
          >
            <i className="mdi mdi-pencil font-size-18" />
          </Link>
        </div>
      ),
    },
  ];

  // Fields accepted by the backend:
  //  - add:    POST /user/add/byAdmin  → name, mobileNo, email, gender, dateOfBirth, language
  //  - update: PUT  /user/profile/:id  → the above + status flags (admin-only)
  //
  // On EDIT, identity/profile is read-only (the user owns it) and only the status
  // flags are editable. On ADD, the basic fields are editable so admins can create.
  const fieldGroups = [
    {
      title: "Basic Information",
      fields: [
        { name: "name", label: "Name", type: "text", required: true },
        { name: "email", label: "Email", type: "email" },
        { name: "mobileNo", label: "Mobile No", type: "text", required: true },
        isEdit
          ? { name: "gender", label: "Gender", type: "text", readOnly: true }
          : {
              name: "gender",
              label: "Gender",
              type: "select",
              options: [
                { key: "male", label: "Male" },
                { key: "female", label: "Female" },
                { key: "other", label: "Other" },
              ],
            },
        isEdit
          ? { name: "dateOfBirth", label: "Date of Birth", type: "text", readOnly: true }
          : { name: "dateOfBirth", label: "Date of Birth", type: "date" },
        { name: "language", label: "Language", type: "text", readOnly: isEdit },
      ],
    },
    // Status controls — edit only (admin can block / verify / activate / delete)
    ...(isEdit
      ? [
          {
            title: "Status",
            fields: [
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
  }, [pageIndex, pageSize, globalFilter, statusFilter, activeTab, versionFilter]);

  useEffect(() => {
    fetchVersionOptions();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPageIndex(0);
  };

  return (
    <div className="page-content">
      <h4>
        <i className="bx bx-user" /> Users
      </h4>
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
            <FilterField label="Status">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPageIndex(0); }}
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
        isPagination={true}
        handleClick={toggle}
        isCustomPageSize={true}
        SearchPlaceholder="Search here..."
        buttonClass="btn btn-success btn-rounded waves-effect waves-light mb-2 me-2"
        buttonName="Add User"
        tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
        theadClass="table-light"
        pagination="pagination"
        paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
      />
      <AddEditUser
        open={open}
        toggle={toggle}
        isEdit={isEdit}
        validation={validation}
        fieldGroups={fieldGroups}
      />
    </div>
  );
};

export default Users;
