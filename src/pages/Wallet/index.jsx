import React, { useEffect, useState } from "react";
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
    Input,
    Badge,
} from "reactstrap";

import {
    getAllWalletTransactions,
    addWalletTransaction,
} from "../../helpers/walletTransactionApi";
import { getAllVendorsListForFilter, getAllUsersListForFilter } from "../../helpers/filterApi";

import DataTableContainer from "../../components/Common/DataTabelContainer";
import FilterField from "../../components/Common/FilterField";
import EntityCell from "../../components/Common/EntityCell";
import { ShowToast } from "../../components/Toast";
import DynamicFormFields from "../../components/Common/DynamicFormFields";
import { CustomStyles } from "../../components/Common/MultiSelect";

const OWNER_TYPES = [
    { key: "Vendor", label: "Vendor" },
    { key: "User", label: "User" },
];

const WalletTransactions = () => {
    const [data, setData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [globalFilter, setGlobalFilter] = useState("");
    const [open, setOpen] = useState(false);
    const [vendorList, setVendorList] = useState([]);
    const [userList, setUserList] = useState([]);

    // Owner filter is OPTIONAL — the page loads ALL transactions by default.
    const [ownerRole, setOwnerRole] = useState(""); // "" (all) | "User" | "Vendor"
    const [ownerId, setOwnerId] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [txnTypeFilter, setTxnTypeFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            modelType: "User",
            modelId: null,
            amount: "",
            transactionType: "credit",
            description: "",
        },
        validationSchema: Yup.object({
            modelType: Yup.mixed().oneOf(["User", "Vendor"]).required("Model type is required"),
            modelId: Yup.string().nullable().required("Please select an entity"),
            amount: Yup.number().typeError("Amount must be a number").positive().required("Amount is required"),
            transactionType: Yup.mixed().oneOf(["credit", "debit"]).required("Transaction type is required"),
        }),
        onSubmit: async (values) => {
            try {
                const payload = {
                    modelId: values.modelId,
                    modelType: values.modelType,
                    amount: Number(values.amount),
                    transactionType: values.transactionType,
                    description: values.description || undefined,
                };

                const response = await addWalletTransaction(payload);

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
        if (open) validation.resetForm();
    };

    const fetchData = async () => {
        // Owner filter is optional; with no owner selected we list everything.
        const res = await getAllWalletTransactions({
            id: ownerId || undefined,
            role: ownerRole ? ownerRole.toLowerCase() : undefined, // "user" | "vendor"
            page: pageIndex,
            limit: pageSize,
            from: fromDate,
            to: toDate,
            transactionType: txnTypeFilter,
            status: statusFilter,
        });
        setData(res?.data || []);
        setTotalCount(res?.pagination?.total || 0);
    };

    const fetchVendorList = async () => {
        const response = await getAllVendorsListForFilter();
        setVendorList(response?.vendors || []);
    };
    const fetchUserList = async () => {
        const response = await getAllUsersListForFilter();
        setUserList(response?.users || []);
    };

    const columns = [
        {
            header: "Entity",
            accessorKey: "modelId.name",
            cell: ({ row }) => (
                <div className="d-flex align-items-center gap-2">
                    <EntityCell entity={row.original.modelId} />
                    <Badge color="light" className="text-dark">{row.original.modelType}</Badge>
                </div>
            ),
        },
        {
            header: "Transaction Type",
            accessorKey: "transactionType",
            cell: ({ row }) => {
                const t = row.original.transactionType || "N/A";
                return (
                    <Badge color={t === "credit" ? "success" : "danger"} className="fs-6">
                        {t?.toUpperCase()}
                    </Badge>
                );
            },
        },
        {
            header: "Description",
            accessorKey: "description",
            cell: ({ row }) => (
                <div
                    className="text-muted small text-truncate"
                    style={{ maxWidth: 160 }}
                    title={row.original.description || ""}
                >
                    {row.original.description || "N/A"}
                </div>
            ),
        },
        {
            header: "Status",
            accessorKey: "status",
            cell: ({ row }) => {
                const status = row.original.status || "N/A";
                let color = "secondary";
                if (status === "completed") color = "success";
                if (status === "pending") color = "warning";
                if (status === "failed") color = "danger";
                return <Badge color={color} className="fs-6">{status.toUpperCase()}</Badge>;
            },
        },
        { header: "Amount", accessorKey: "amount" },
        {
            header: "Created By",
            accessorKey: "createdBy.name",
            cell: ({ row }) => row.original.createdBy?.name || (row.original.createdType === "Admin" ? "Admin" : "N/A"),
        },
        {
            header: "Date",
            accessorKey: "createdAt",
            cell: ({ row }) => (row.original.createdAt ? new Date(row.original.createdAt).toLocaleString() : "-"),
        },
    ];

    const ownerTypeField = [
        { name: "modelType", label: "Model Type", type: "select", required: true, options: OWNER_TYPES },
    ];

    const formFields = [
        { name: "amount", label: "Amount", type: "number", required: true },
        {
            name: "transactionType",
            label: "Transaction Type",
            type: "select",
            required: true,
            options: [
                { key: "credit", label: "Credit" },
                { key: "debit", label: "Debit" },
            ],
        },
        { name: "description", label: "Description", type: "text" },
    ];

    // Owner list for the top filter (only when a specific type is chosen)
    useEffect(() => {
        setOwnerId("");
        if (ownerRole === "Vendor") fetchVendorList();
        else if (ownerRole === "User") fetchUserList();
    }, [ownerRole]);

    // Entity list for the add-transaction modal
    useEffect(() => {
        if (validation.values.modelType === "Vendor") fetchVendorList();
        else fetchUserList();
    }, [validation.values.modelType]);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageIndex, pageSize, ownerId, ownerRole, fromDate, toDate, txnTypeFilter, statusFilter]);

    const ownerOptions = (ownerRole === "Vendor" ? vendorList : userList).map((o) => ({
        value: o._id,
        label: `${o.name || ""} (${o.mobileNo || ""})`,
    }));

    // Add-transaction modal: entity list (with mobile) + the selected entity's balance
    const modalEntityList = validation.values.modelType === "Vendor" ? vendorList : userList;
    const selectedEntityOptions = modalEntityList.map((o) => ({
        value: o._id,
        label: `${o.name || ""} (${o.mobileNo || ""})`,
    }));
    const selectedEntity = modalEntityList.find((o) => o._id === validation.values.modelId) || null;

    return (
        <div className="page-content">
            <h4><i className="bx bxs-wallet" /> Wallet Transactions</h4>

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
                filters={
                    <>
                        <FilterField label="Owner Type" width={140}>
                            <select
                                className="form-select"
                                value={ownerRole}
                                onChange={(e) => { setOwnerRole(e.target.value); setPageIndex(0); }}
                            >
                                <option value="">All</option>
                                <option value="User">User</option>
                                <option value="Vendor">Vendor</option>
                            </select>
                        </FilterField>
                        {ownerRole && (
                            <FilterField label={`Select ${ownerRole}`} width={220}>
                                <Select
                                    classNamePrefix="select"
                                    isClearable
                                    isSearchable
                                    value={ownerOptions.find((o) => o.value === ownerId) || null}
                                    onChange={(value) => { setOwnerId(value ? value.value : ""); setPageIndex(0); }}
                                    options={ownerOptions}
                                    styles={CustomStyles}
                                />
                            </FilterField>
                        )}
                        <FilterField label="From Date" width={150}>
                            <Input
                                type="date"
                                value={fromDate}
                                onChange={(e) => { setFromDate(e.target.value); setPageIndex(0); }}
                            />
                        </FilterField>
                        <FilterField label="To Date" width={150}>
                            <Input
                                type="date"
                                value={toDate}
                                onChange={(e) => { setToDate(e.target.value); setPageIndex(0); }}
                            />
                        </FilterField>
                        <FilterField label="Transaction Type" width={150}>
                            <Input
                                type="select"
                                value={txnTypeFilter}
                                onChange={(e) => { setTxnTypeFilter(e.target.value); setPageIndex(0); }}
                            >
                                <option value="">All</option>
                                <option value="credit">Credit</option>
                                <option value="debit">Debit</option>
                            </Input>
                        </FilterField>
                        <FilterField label="Status" width={150}>
                            <Input
                                type="select"
                                value={statusFilter}
                                onChange={(e) => { setStatusFilter(e.target.value); setPageIndex(0); }}
                            >
                                <option value="">All</option>
                                <option value="completed">Completed</option>
                                <option value="pending">Pending</option>
                                <option value="failed">Failed</option>
                            </Input>
                        </FilterField>
                    </>
                }
                isGlobalFilter={false}
                isAddButton={true}
                buttonName="Add Transaction"
                buttonClass="btn btn-success"
                handleClick={() => setOpen(true)}
                isPagination={true}
                isCustomPageSize={true}
                tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
                theadClass="table-light"
                pagination="pagination"
                paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
            />

            <Modal isOpen={open} toggle={toggle}>
                <ModalHeader toggle={toggle}>Add Wallet Transaction</ModalHeader>
                <ModalBody>
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            validation.handleSubmit();
                        }}
                    >
                        <DynamicFormFields formFields={ownerTypeField} validation={validation} />

                        <div className="mb-3">
                            <Label>Select {validation.values.modelType}</Label>
                            <Select
                                classNamePrefix="select"
                                isClearable
                                isSearchable
                                value={selectedEntityOptions.find((opt) => opt.value === validation.values.modelId) || null}
                                onChange={(value) => validation.setFieldValue("modelId", value ? value.value : null)}
                                options={selectedEntityOptions}
                                styles={CustomStyles}
                            />
                            {validation.touched.modelId && validation.errors.modelId && (
                                <div className="text-danger small mt-1">{validation.errors.modelId}</div>
                            )}
                            {selectedEntity && (
                                <div className="mt-2 p-2 rounded bg-light d-flex justify-content-between">
                                    <span className="text-muted">Current Balance</span>
                                    <span className="fw-semibold">₹ {Number(selectedEntity.walletAmount || 0).toFixed(2)}</span>
                                </div>
                            )}
                        </div>

                        <DynamicFormFields formFields={formFields} validation={validation} />

                        <Row className="mt-4">
                            <Col className="d-flex justify-content-end gap-2">
                                <Button color="secondary" onClick={toggle}>Cancel</Button>
                                <Button color="success" type="submit">Save</Button>
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
            </Modal>
        </div>
    );
};

export default WalletTransactions;
