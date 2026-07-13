import React, { useState, useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import * as Yup from "yup";

import { useFormik } from "formik";

import {
  Button,
  Col,
  Row,
  UncontrolledTooltip,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Input,
  FormFeedback,
  Label,
  Card,
  CardBody,
  FormGroup,
  Badge,
} from "reactstrap";

import Flatpickr from "react-flatpickr";

import { getAllAddress } from "../../helpers/addressApi";

import DataTableContainer from "../../components/Common/DataTabelContainer";
import EntityCell from "../../components/Common/EntityCell";
import { ShowToast } from "../../components/Toast";
import DeleteModal from "../../components/Common/DeleteModal";

const Addresses = () => {
  const location = useLocation();

  const { userId, userName } = location.state || {};
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState(userId || "");
  const [selectedVendor, setSelectedVendor] = useState("");

  const [viewModal, setViewModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const onClickView = (data) => {
    setSelectedAddress(data);
    setViewModal(true);
  };

  const toggleViewModal = () => {
    setViewModal((prev) => !prev);
    if (viewModal) setSelectedAddress(null);
  };


  //   const [open, setOpen] = useState(false);
  //   const [isEdit, setIsEdit] = useState(false);
  //   const [deleteModal, setDeleteModal] = useState(false);
  //   const [category, setCategory] = useState();

  //   const validation = useFormik({
  //     // enableReinitialize : use this flag when initial values needs to be changed
  //     enableReinitialize: true,

  //     initialValues: {
  //       name: (category && category.name) || "",
  //       createdBy: (category && category.createdBy) || "",
  //       isActive: category && category.isActive,
  //       isDeleted: category && category.isDeleted,
  //     },
  //     validationSchema: Yup.object({
  //       name: Yup.string().required("Please Enter name"),
  //     }),
  //     onSubmit: async (values) => {
  //       try {
  //         if (isEdit) {
  //           const response = await updateCategory({
  //             name: values.name,
  //             isActive: values.isActive,
  //             isDeleted: values.isDeleted,
  //             categoryId: category._id,
  //           });

  //           if (response?.type === "success") {
  //             ShowToast.success(response.message);
  //             fetchData();
  //             validation.resetForm();
  //           } else {
  //             ShowToast.error(response.message);
  //           }
  //         } else {
  //           // save new order
  //           const response = await addCategory({
  //             name: values.name,
  //           });
  //           if (response?.type === "success") {
  //             ShowToast.success(response.message);
  //             fetchData();
  //             toggle();
  //             validation.resetForm();
  //           } else {
  //             ShowToast.error(response.message);
  //           }
  //           validation.resetForm();
  //         }
  //       } catch (error) {
  //         console.error("Error in form submission:", error);
  //         ShowToast.error("An error occurred while processing your request.");
  //       } finally {
  //         toggle();
  //       }
  //     },
  //   });

  //   const toggle = () => {
  //     if (open) {
  //       setOpen(false);
  //       setIsEdit(false);
  //       setCategory(null);
  //     } else {
  //       setOpen(true);
  //     }
  //   };

  const fetchData = async () => {
    const response = await getAllAddress({
      userId: selectedUser,
      // vendorId: selectedVendor,
      search: globalFilter,
      page: pageIndex,
      limit: pageSize,
      // userId: userId || "",
    });
    console.log(response);
    setData(response?.addresses || []);
    setTotalCount(response?.totalAddresses || 0);
  };

  //   const onClickDelete = (data) => {
  //     setCategory(data);
  //     setDeleteModal(true);
  //   };

  //   const onClickEdit = (data) => {
  //     setCategory(data);
  //     setIsEdit(true);
  //     setOpen(true);
  //   };

  //   const handleDelete = async () => {
  //     let response = await deleteCategory(category._id);
  //     if (response?.type === "success") {
  //       ShowToast.success(response.message);
  //       fetchData();
  //       setDeleteModal(false);
  //       setCategory(null);
  //     }
  //   };

  const columns = [
    // {
    //   header: () => {
    //     return (
    //       <FormGroup check className="font-size-16">
    //         <Label check>
    //           <Input type="checkbox" id="checkAll" />
    //         </Label>
    //       </FormGroup>
    //     );
    //   },
    //   accessorKey: "id",
    //   cell: () => (
    //     <FormGroup check className="font-size-16">
    //       <Label check>
    //         <Input type="checkbox" id="checkAll" />
    //       </Label>
    //     </FormGroup>
    //   ),
    //   enableColumnFilter: false,
    //   enableSorting: true,
    // },
    // {
    //   header: "No",
    //   accessorKey: "no",
    // },
    {
      header: "User",
      accessorKey: "username",
      cell: ({ row }) => (
        <EntityCell
          entity={row.original.user}
          fallbackName={row.original.username}
          fallbackMobile={row.original.mobileNo}
        />
      ),
    },
    {
      header: "Address Type",
      accessorKey: "type",
      cell: ({ row }) => row.original.type === "1" ? "Home" : row.original.type === "2" ? "Work" : "Other", // Assuming userName is a string
    },
    {
      header: "Address",
      accessorKey: "address",
      cell: ({ getValue }) => (
        <div style={{ width: "300px", textWrap: "wrap" }}>{getValue()}</div>
      ),
    },
    // {
    //   header: "Address",
    //   accessorKey: "address",
    //   cell: ({ getValue }) => (
    //     <div style={{ width: "300px", textWrap: "wrap" }}>{getValue()}</div>
    //   ),
    // },
    {
      header: "Area",
      accessorKey: "area",
    },
    {
      header: "State",
      accessorKey: "state",
    },
    {
      header: "City",
      accessorKey: "city",
    },
    {
      header: "Pin Code",
      accessorKey: "pincode",
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
              className="text-primary"
              onClick={() => onClickView(cellProps.row.original)}
            >
              <i className="mdi mdi-eye font-size-18" id="viewtooltip" />
              <UncontrolledTooltip placement="top" target="viewtooltip">
                View
              </UncontrolledTooltip>
            </Link>
          </div>
        );
      },
    },
    // {
    //   header: "Country",
    //   accessorKey: "country",
    // },
    // {
    //   header: "Landmark",
    //   accessorKey: "landmark",
    // },
    // {
    //   header: "Latitude",
    //   accessorKey: "lat",
    // },
    // {
    //   header: "Longitude",
    //   accessorKey: "lng",
    // },
    // {
    //   header: "Active",
    //   accessorKey: "isActive",
    //   enableColumnFilter: false,
    //   enableSorting: true,
    //   cell: ({ row }) => {
    //     return (
    //       <i
    //         className={`bx bx-check-shield fs-2 ${
    //           row.original.isActive ? "text-success" : "text-danger"
    //         }`}
    //       ></i>
    //     );
    //   },
    // },
    // {
    //   header: "Action",
    //   accessorKey: "action",
    //   enableColumnFilter: false,
    //   enableSorting: false,
    //   cell: (cellProps) => {
    //     return (
    //       <div className="d-flex gap-3">
    //         <Link
    //           to="#"
    //           className="text-success"
    //           onClick={() => {
    //             const data = cellProps.row.original;
    //             onClickEdit(data);
    //           }}
    //         >
    //           <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
    //           <UncontrolledTooltip placement="top" target="edittooltip">
    //             Edit
    //           </UncontrolledTooltip>
    //         </Link>
    //         <Link
    //           to="#"
    //           className="text-danger"
    //           onClick={() => {
    //             const data = cellProps.row.original;
    //             onClickDelete(data);
    //           }}
    //         >
    //           <i className="mdi mdi-delete font-size-18" id="deletetooltip" />
    //           <UncontrolledTooltip placement="top" target="deletetooltip">
    //             Delete
    //           </UncontrolledTooltip>
    //         </Link>
    //       </div>
    //     );s
    //   },
    // },
  ];
  useEffect(() => {
    fetchData();
  }, [pageIndex, pageSize, globalFilter, selectedUser, selectedVendor]);

  return (
    <div className="page-content">
      {/* <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDelete}
        onCloseClick={() => setDeleteModal(false)}
      /> */}
      <h4><i className="bx bx-map" /> Address Management</h4>
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
        selectedUser={selectedUser}
        // selectedVendor={selectedVendor}
        setSelectedUser={setSelectedUser}
        setSelectedVendor={setSelectedVendor}
        isGlobalFilter={true}
        isUserFilter={true}
        // isVendorFilter={false}
        isAddButton={false}
        isPagination={true}
        // handleClick={toggle}
        isCustomPageSize={true}
        SearchPlaceholder="Search here..."
        buttonClass="btn btn-success btn-rounded waves-effect waves-light mb-2 me-2"
        buttonName="Add Category"
        tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
        theadClass="table-light"
        pagination="pagination"
        paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
      />

      {/* View Address Modal */}
      <Modal isOpen={viewModal} toggle={toggleViewModal} size="lg" scrollable>
        <ModalHeader toggle={toggleViewModal} tag="h4">
          Address Details
        </ModalHeader>
        <ModalBody>
          {selectedAddress && (
            <Row>
              {[
                { label: "User Name", value: selectedAddress.username },
                { label: "Mobile No", value: selectedAddress.mobileNo },
                {
                  label: "Address Type",
                  value:
                    selectedAddress.type === "1"
                      ? "Home"
                      : selectedAddress.type === "2"
                        ? "Work"
                        : "Other",
                },
                { label: "House / No.", value: selectedAddress.no },
                { label: "Address", value: selectedAddress.address },
                { label: "Manual Address", value: selectedAddress.manualAddress },
                { label: "Area", value: selectedAddress.area },
                { label: "Landmark", value: selectedAddress.landmark },
                { label: "City", value: selectedAddress.city },
                { label: "State", value: selectedAddress.state },
                { label: "Country", value: selectedAddress.country },
                { label: "Pin Code", value: selectedAddress.pincode },
                {
                  label: "Location (lng, lat)",
                  value: selectedAddress.location?.coordinates?.join(", "),
                },
                {
                  label: "Default Address",
                  value: selectedAddress.isDefault ? "Yes" : "No",
                },
              ].map((field, idx) => (
                <Col md="6" className="mb-3" key={idx}>
                  <Label className="text-muted mb-1 d-block">{field.label}</Label>
                  <div className="fw-medium">
                    {field.value !== undefined &&
                    field.value !== null &&
                    field.value !== ""
                      ? String(field.value)
                      : "-"}
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </ModalBody>
      </Modal>

      {/* <Modal isOpen={open} toggle={toggle}>
        <ModalHeader toggle={toggle} tag="h4">
          {!!isEdit ? "Edit Category" : "Add Category"}
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
              return false;
            }}
          >
            <Row>
              <Col className="col-12">
                <div className="mb-3">
                  <Label>Name</Label>
                  <Input
                    name="name"
                    type="text"
                    placeholder="Insert category name"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    required
                    value={validation.values.name || ""}
                    // invalid={
                    //   validation.touched.name && validation.errors.name
                    //     ? true
                    //     : false
                    // }
                  />
                {validation.touched.name && validation.errors.name ? (
                    <FormFeedback type="invalid">
                      {validation.errors.name}
                    </FormFeedback>
                  ) : null} 
                </div>

                {isEdit && (
                  <div className="mb-3">
                    <Label>Created By</Label>
                    <Input
                      name="createdBy"
                      type="text"
                      // validate={{
                      //   required: { value: true },
                      // }}
                      // onChange={validation.handleChange}
                      // onBlur={validation.handleBlur}
                      contentEditable="false"
                      value={validation.values.createdBy || ""}
                      // invalid={
                      //   validation.touched.email && validation.errors.email
                      //     ? true
                      //     : false
                      // }
                    />
                    {validation.touched.email && validation.errors.email ? (
                    <FormFeedback type="invalid">
                      {validation.errors.email}
                    </FormFeedback>
                  ) : null}
                  </div>
                )}

                {isEdit && (
                  <div className="mb-3">
                    <Label>Is Active</Label>
                    <Input
                      name="isActive"
                      type="select"
                      className="form-select"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={String(validation.values.isActive)}
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </Input>
                    {validation.touched.isActive &&
                    validation.errors.isActive ? (
                      <FormFeedback type="invalid" className="d-block">
                        {validation.errors.isActive}
                      </FormFeedback>
                    ) : null}
                  </div>
                )}

                {isEdit && (
                  <div className="mb-3">
                    <Label>Is Deleted</Label>
                    <Input
                      name="isDeleted"
                      type="select"
                      className="form-select"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={String(validation.values.isDeleted)}
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </Input>
                    {validation.touched.isDeleted &&
                    validation.errors.isDeleted ? (
                      <FormFeedback type="invalid" className="d-block">
                        {validation.errors.isDeleted}
                      </FormFeedback>
                    ) : null}
                  </div>
                )}
              </Col>
            </Row>
            <Row>
              <Col className="d-flex gap-3 flex-row-reverse">
                <div className="text-end">
                  <Button color="success" type="submit" className="save-user">
                    Save
                  </Button>
                </div>
                <div className="text-end">
                  <Button color="danger" className="save-user" onClick={toggle}>
                    Cancel
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>  */}
    </div>
  );
};

export default Addresses;
