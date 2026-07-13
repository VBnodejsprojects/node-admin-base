import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";

import {
    Button,
    Col,
    Row,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    Label,
} from "reactstrap";

import {
    getAllCoupons,
    addCoupon,
    updateCoupon,
    deleteCoupon,
} from "../../helpers/couponApi";
import { getAllVendorsListForFilter, getAllUsersListForFilter } from "../../helpers/filterApi";

import DataTableContainer from "../../components/Common/DataTabelContainer";
import EntityCell from "../../components/Common/EntityCell";
import { ShowToast } from "../../components/Toast";
import DeleteModal from "../../components/Common/DeleteModal";
import DynamicFormFields from "../../components/Common/DynamicFormFields";
import { CustomStyles } from "../../components/Common/MultiSelect";

// Backend coupon.modelType — 0:All Vendor, 1:Single Vendor, 2:All User, 3:Single User
const MODEL_TYPE = {
    "0": { label: "All Vendor", modelName: "Vendor", single: false },
    "1": { label: "Single Vendor", modelName: "Vendor", single: true },
    "2": { label: "All User", modelName: "User", single: false },
    "3": { label: "Single User", modelName: "User", single: true },
};

const Coupons = () => {
    const [data, setData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [globalFilter, setGlobalFilter] = useState("");
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [coupon, setCoupon] = useState();
    const [deleteModal, setDeleteModal] = useState(false);
    const [vendorList, setVendorList] = useState([]);
    const [userList, setUserList] = useState([]);

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            modelType: coupon?.modelType || "2",
            model: coupon?.model
                ? { value: coupon.model._id || coupon.model, label: coupon.model.name || "" }
                : null,
            couponName: coupon?.couponName || "",
            couponPromoCode: coupon?.couponPromoCode || "",
            couponMinimumAmount: coupon?.couponMinimumAmount || "",
            couponMaximumAmount: coupon?.couponMaximumAmount || "",
            couponType: coupon?.couponType || "0",
            couponPrice: coupon?.couponPrice || "",
            couponPerUser: coupon?.couponPerUser ?? 0,
            startDate: coupon?.startDate || "",
            endDate: coupon?.endDate || "",
            isActive: coupon?.isActive ?? true,
            isDeleted: coupon?.isDeleted ?? false,
        },

        validationSchema: Yup.object({
            couponName: Yup.string().required("Name is required"),
            couponPromoCode: Yup.string().required("Promo code is required"),
            couponPrice: Yup.number().required("Price is required"),
            couponType: Yup.string().required("Coupon type is required"),
            modelType: Yup.string().required("Model type is required"),
        }),

        onSubmit: async (values) => {
            try {
                const cfg = MODEL_TYPE[values.modelType];
                const payload = {
                    modelType: values.modelType,
                    modelName: cfg?.modelName,
                    model: cfg?.single ? values.model?.value || null : null,
                    couponName: values.couponName,
                    couponPromoCode: values.couponPromoCode,
                    couponMinimumAmount: values.couponMinimumAmount || undefined,
                    couponMaximumAmount: values.couponMaximumAmount || undefined,
                    couponType: values.couponType,
                    couponPrice: Number(values.couponPrice),
                    couponPerUser: Number(values.couponPerUser) || 0,
                    startDate: values.startDate || undefined,
                    endDate: values.endDate || undefined,
                    isActive: values.isActive,
                };

                let response;
                if (isEdit) {
                    payload.couponId = coupon._id;
                    payload.isDeleted = values.isDeleted;
                    response = await updateCoupon(payload);
                } else {
                    response = await addCoupon(payload);
                }

                if (response?.type === "success") {
                    ShowToast.success(response.message);
                    fetchData();
                    toggle();
                } else {
                    ShowToast.error(response?.message || "Something went wrong.");
                }
            } catch (error) {
                ShowToast.error("Something went wrong.");
            }
        },
    });

    const toggle = () => {
        setOpen(!open);
        if (open) {
            setIsEdit(false);
            setCoupon(null);
            validation.resetForm();
        }
    };

    const fetchData = async () => {
        const res = await getAllCoupons({
            search: globalFilter,
            page: pageIndex,
            limit: pageSize,
        });
        setData(res?.coupons || []);
        setTotalCount(res?.total || 0);
    };

    const fetchVendorList = async () => {
        const response = await getAllVendorsListForFilter();
        setVendorList(response?.vendors || []);
    };
    const fetchUserList = async () => {
        const response = await getAllUsersListForFilter();
        setUserList(response?.users || []);
    };

    const handleEdit = (data) => {
        setCoupon(data);
        setIsEdit(true);
        setOpen(true);
    };

    const handleDelete = async () => {
        const res = await deleteCoupon(coupon._id);
        if (res?.type === "success") {
            ShowToast.success(res.message);
            fetchData();
            setDeleteModal(false);
        }
    };

    const columns = [
        {
            header: "Action",
            accessorKey: "action",
            cell: ({ row }) => (
                <div className="d-flex gap-3">
                    <Link to="#" className="text-success" onClick={() => handleEdit(row.original)}>
                        <i className="mdi mdi-pencil font-size-18" />
                    </Link>
                    <Link
                        to="#"
                        className="text-danger"
                        onClick={() => {
                            setCoupon(row.original);
                            setDeleteModal(true);
                        }}
                    >
                        <i className="mdi mdi-delete font-size-18" />
                    </Link>
                </div>
            ),
        },
        { header: "Name", accessorKey: "couponName" },
        { header: "Promo Code", accessorKey: "couponPromoCode" },
        { header: "Amount", accessorKey: "couponPrice" },
        {
            header: "Coupon Type",
            accessorKey: "couponType",
            cell: ({ row }) => (row.original.couponType === "0" ? "Percentage" : "Flat"),
        },
        {
            header: "Applies To",
            accessorKey: "modelType",
            cell: ({ row }) => MODEL_TYPE[row.original.modelType]?.label || "N/A",
        },
        {
            header: "Target",
            accessorKey: "model",
            cell: ({ row }) => (row.original.model ? <EntityCell entity={row.original.model} /> : "All"),
        },
        { header: "Per User", accessorKey: "couponPerUser" },
        {
            header: "Active",
            accessorKey: "isActive",
            cell: ({ row }) => (
                <i className={`bx bx-check-shield fs-2 ${row.original.isActive ? "text-success" : "text-danger"}`}></i>
            ),
        },
    ];

    const modelTypeField = [
        {
            name: "modelType",
            label: "Applies To",
            type: "select",
            required: true,
            options: Object.keys(MODEL_TYPE).map((key) => ({ key, label: MODEL_TYPE[key].label })),
        },
    ];

    const formFields = [
        { name: "couponName", label: "Coupon Name", type: "text", required: true },
        { name: "couponPromoCode", label: "Promo Code", type: "text", required: true },
        { name: "couponMinimumAmount", label: "Minimum Amount", type: "number" },
        { name: "couponMaximumAmount", label: "Maximum Amount", type: "number" },
        {
            name: "couponType",
            label: "Coupon Type",
            type: "select",
            required: true,
            options: [
                { key: "0", label: "Percentage" },
                { key: "1", label: "Flat Discount" },
            ],
        },
        { name: "couponPrice", label: "Coupon Price", type: "number", required: true },
        { name: "couponPerUser", label: "Coupon Per User", type: "number" },
        { name: "startDate", label: "Start Date", type: "date" },
        { name: "endDate", label: "End Date", type: "date" },
    ];

    const editFields = [
        {
            name: "isActive",
            label: "Is Active",
            type: "select",
            options: [
                { key: "true", label: "Yes" },
                { key: "false", label: "No" },
            ],
        },
        {
            name: "isDeleted",
            label: "Is Deleted",
            type: "select",
            options: [
                { key: "false", label: "No" },
                { key: "true", label: "Yes" },
            ],
        },
    ];

    useEffect(() => {
        fetchData();
    }, [pageIndex, pageSize, globalFilter]);

    // Load the relevant list when a "single" target type is chosen.
    useEffect(() => {
        const cfg = MODEL_TYPE[validation.values.modelType];
        if (cfg?.single && cfg.modelName === "Vendor") fetchVendorList();
        if (cfg?.single && cfg.modelName === "User") fetchUserList();
    }, [validation.values.modelType, open]);

    const currentCfg = MODEL_TYPE[validation.values.modelType];

    return (
        <div className="page-content">
            <DeleteModal
                show={deleteModal}
                onDeleteClick={handleDelete}
                onCloseClick={() => setDeleteModal(false)}
            />

            <h4><i className="bx bxs-discount" /> Coupons</h4>
            <DataTableContainer
                columns={columns}
                data={data}
                fetchData={fetchData}
                totalCount={totalCount}
                pageIndex={pageIndex}
                setPageIndex={setPageIndex}
                pageSize={pageSize}
                isSrNo={true}
                setPageSize={setPageSize}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                SearchPlaceholder={"Search here..."}
                isGlobalFilter={true}
                isAddButton={true}
                handleClick={toggle}
                buttonName="Add Coupon"
                buttonClass="btn btn-success btn-rounded waves-effect waves-light mb-2 me-2"
                isPagination={true}
                isCustomPageSize={true}
                tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
                theadClass="table-light"
                pagination="pagination"
                paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
            />

            <Modal isOpen={open} toggle={toggle}>
                <ModalHeader toggle={toggle}>
                    {isEdit ? "Edit Coupon" : "Add Coupon"}
                </ModalHeader>
                <ModalBody>
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            validation.handleSubmit();
                        }}
                    >
                        <DynamicFormFields formFields={modelTypeField} validation={validation} />

                        {currentCfg?.single && currentCfg.modelName === "Vendor" && (
                            <div className="mb-3">
                                <Label>Select Vendor</Label>
                                <Select
                                    classNamePrefix="select"
                                    isClearable
                                    isSearchable
                                    value={validation.values.model}
                                    onChange={(value) => validation.setFieldValue("model", value)}
                                    options={vendorList.map((v) => ({ value: v._id, label: v.name }))}
                                    styles={CustomStyles}
                                />
                            </div>
                        )}

                        {currentCfg?.single && currentCfg.modelName === "User" && (
                            <div className="mb-3">
                                <Label>Select User</Label>
                                <Select
                                    classNamePrefix="select"
                                    isClearable
                                    isSearchable
                                    value={validation.values.model}
                                    onChange={(value) => validation.setFieldValue("model", value)}
                                    options={userList.map((u) => ({ value: u._id, label: u.name }))}
                                    styles={CustomStyles}
                                />
                            </div>
                        )}

                        <DynamicFormFields formFields={formFields} validation={validation} />

                        {isEdit && <DynamicFormFields formFields={editFields} validation={validation} />}

                        <Row className="mt-4">
                            <Col className="d-flex justify-content-end gap-2">
                                <Button color="secondary" onClick={toggle}>
                                    Cancel
                                </Button>
                                <Button color="success" type="submit">
                                    {isEdit ? "Update" : "Save"}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
            </Modal>
        </div>
    );
};

export default Coupons;
