import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { useFormik } from "formik";

import * as Yup from "yup";
import {
  Row,
  Col,
  Label,
} from "reactstrap";

import {
  getAllBanner,
  addBanner,
  updateBanner,
  deleteBanner,
} from "../../helpers/bannerApi";

import DataTableContainer from "../../components/Common/DataTabelContainer";
import { ShowToast } from "../../components/Toast";
import DeleteModal from "../../components/Common/DeleteModal";
import DropDown from "../../components/DropDown";
import AddEditBanner from "./AddEditBanner";
import { isBoolean, set } from "lodash";

const Banners = () => {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [globalFilter, setGlobalFilter] = useState("");

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [banner, setBanner] = useState();

  const [selectedFile, setSelectedFile] = useState();
  const [selectedRole, setSelectedRole] = useState("");

  // Banner model uses `role` (which app the banner is shown in): user | vendor
  const ROLE_OPTIONS = [
    { id: "", label: "All" },
    { id: "user", label: "User" },
    { id: "vendor", label: "Vendor" },
  ];

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      name: (banner && banner.name) || "",
      bannerImage: (banner && banner.image) || "",
      role: (banner && banner.role) || "user",
      isActive: banner?.isActive ?? true,
    },
    validationSchema: Yup.object({
      bannerImage: Yup.mixed().test("file-or-url", "Please select image", function (value) {
        if (typeof value === "string") {
          return value.trim().length > 0;
        }
        if (value && typeof value === "object" && value instanceof File) {
          return true;
        }
        return false;
      }),
      name: Yup.string().required("Please enter name"),
      isActive: Yup.boolean().required("Please select status"),
      role: Yup.string().required("Please select role"),
    }),
    onSubmit: async (values) => {
      const payload = { ...values };
      try {
        if (isEdit) {
          const response = await updateBanner(payload, banner._id);

          if (response?.type === "success") {
            ShowToast.success(response.message);
            fetchData();
          } else {
            ShowToast.error(response.message);
          }
        } else {
          // save new order
          const response = await addBanner(payload);
          if (response?.type === "success") {
            ShowToast.success(response.message);
            fetchData();
            toggle();
            validation.resetForm();
          } else {
            ShowToast.error(response.message);
          }
          validation.resetForm();
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
      setBanner(null);
      setSelectedFile(null);
      validation.resetForm();
    } else {
      setOpen(true);
    }
  };

  const fetchData = async () => {
    const response = await getAllBanner({
      search: globalFilter,
      page: pageIndex,
      limit: pageSize,
      role: selectedRole,
    });

    console.log(response);
    setData(response?.banners || []);
    setTotalCount(response?.total || 0);
  };

  const onClickDelete = (data) => {
    setBanner(data);
    setDeleteModal(true);
  };

  const onClickEdit = (data) => {
    setBanner(data);
    setIsEdit(true);
    setOpen(true);
  };

  const handleDelete = async () => {
    let response = await deleteBanner(banner._id);
    if (response?.type === "success") {
      ShowToast.success(response.message);
      fetchData();
      setDeleteModal(false);
      setBanner(null);
    }
  };

  const columns = [
    {
      header: "Banner Image",
      accessorKey: "image",
      cell: (cellProps) => {
        return (
          <img
            src={cellProps.row.original.image || "vite.svg"}
            alt=""
            className="img-fluid rounded-circle"
            style={{ width: "40px", height: "40px", objectFit: "cover" }}
          />
        );
      },
    },
    {
      header: "Name",
      accessorKey: "name",
      cell: ({ row }) => row.original.name || "N/A"
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: ({ row }) => {
        const map = { user: "User", vendor: "Vendor" };
        return map[row.original.role] || row.original.role || "N/A";
      },
    },
    {
      header: "Active",
      accessorKey: "isActive",
      enableColumnFilter: false,
      enableSorting: true,
      cell: ({ row }) => {
        return (
          <i
            className={`bx bx-check-shield fs-2 ${row.original.isActive ? "text-success" : "text-danger"
              }`}
          ></i>
        );
      },
    },
    {
      header: "Action",
      accessorKey: "action",
      enableColumnFilter: false,
      enableSorting: false,
      cell: (cellProps) => {
        return (
          <div className="d-flex gap-3">
            <Link
              to="#"
              className="text-success"
              onClick={() => {
                const data = cellProps.row.original;
                onClickEdit(data);
              }}
            >
              <i className="mdi mdi-pencil font-size-18" />
            </Link>
            <Link
              to="#"
              className="text-danger"
              onClick={() => {
                const data = cellProps.row.original;
                onClickDelete(data);
              }}
            >
              <i className="mdi mdi-delete font-size-18" />
            </Link>
          </div>
        );
      },
    },
  ];

  const formFields = [
    {
      name: "name",
      label: "Name",
      type: "text",
    },
    {
      name: "role",
      label: "Role",
      type: "select",
      required: true,
      options: [
        { key: "user", label: "User" },
        { key: "vendor", label: "Vendor" },
      ],
    },

    ...(isEdit
      ? [{
        name: "isActive",
        label: "Active",
        type: "select",
        required: true,
        isBoolean: true,
        options: [
          { key: true, label: "Yes" },
          { key: false, label: "No" },
        ]
      }] : [])
  ];


  useEffect(() => {
    fetchData();
  }, [pageIndex, pageSize, globalFilter, selectedRole]);

  return (
    <div className="page-content">
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDelete}
        onCloseClick={() => setDeleteModal(false)}
      />
      <h4><i className="bx bx-images" /> Banners</h4>
      <Row className="mb-3 g-2">
        <Col md={3}>
          <Label>Role :</Label>
          <DropDown
            options={ROLE_OPTIONS}
            value={selectedRole}
            setFunction={(val) => {
              setSelectedRole(val);
              setPageIndex(0);
            }}
          />
        </Col>
      </Row>
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
        isGlobalFilter={false}
        isAddButton={true}
        isPagination={true}
        handleClick={toggle}
        isCustomPageSize={true}
        SearchPlaceholder="Search here..."
        buttonClass="btn btn-success btn-rounded waves-effect waves-light mb-2 me-2"
        buttonName="Add Banner"
        tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
        theadClass="table-light"
        pagination="pagination"
        paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
      />
      <AddEditBanner
        open={open}
        toggle={toggle}
        isEdit={isEdit}
        validation={validation}
        formFields={formFields}
        setSelectedFile={setSelectedFile}
        selectedFile={selectedFile}
        banner={banner}
      />
    </div>
  );
};

export default Banners;
