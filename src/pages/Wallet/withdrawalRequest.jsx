import React, { useEffect, useState } from "react";
import {
    Badge,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Row,
    Col,
    Label,
    Input,
} from "reactstrap";

import {
    getWithdrawalRequests,
    processWithdrawalDecision,
} from "../../helpers/walletTransactionApi";

import DataTableContainer from "../../components/Common/DataTabelContainer";
import EntityCell from "../../components/Common/EntityCell";
import { ShowToast } from "../../components/Toast";

const WithdrawalRequest = () => {
    const [data, setData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [globalFilter, setGlobalFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("pending");
    const [modelTypeFilter, setModelTypeFilter] = useState("");

    // Review modal
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [note, setNote] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const fetchData = async () => {
        const res = await getWithdrawalRequests({
            search: globalFilter,
            page: pageIndex,
            limit: pageSize,
            status: statusFilter,
            modelType: modelTypeFilter,
        });
        setData(res?.data || []);
        setTotalCount(res?.pagination?.total || 0);
    };

    const openReview = (row) => {
        setSelected(row);
        setNote("");
        setOpen(true);
    };

    const closeReview = () => {
        setOpen(false);
        setSelected(null);
        setNote("");
    };

    const handleDecision = async (action) => {
        if (!selected) return;
        setSubmitting(true);
        const res = await processWithdrawalDecision(selected._id, { action, remark: note });
        setSubmitting(false);
        if (res?.type === "success") {
            ShowToast.success(res.message);
            closeReview();
            fetchData();
        } else {
            ShowToast.error(res?.message || "Failed to process request");
        }
    };

    const statusBadge = (status) => {
        let color = "warning";
        if (status === "completed") color = "success";
        if (status === "failed") color = "danger";
        const label = status === "completed" ? "APPROVED" : status === "failed" ? "REJECTED" : "PENDING";
        return <Badge color={color} className="fs-6">{label}</Badge>;
    };

    const money = (v) => {
        const n = Number(v);
        return Number.isFinite(n) ? n.toFixed(2) : "N/A";
    };

    const columns = [
        { header: "Model Type", accessorKey: "modelType" },
        {
            header: "Requested By",
            accessorKey: "modelId.name",
            cell: ({ row }) => <EntityCell entity={row.original.modelId} />,
        },
        {
            header: "Wallet Balance",
            accessorKey: "modelId.walletAmount",
            cell: ({ row }) => money(row.original.modelId?.walletAmount),
        },
        { header: "Amount", accessorKey: "amount" },
        {
            header: "Status",
            accessorKey: "status",
            cell: ({ row }) => statusBadge(row.original.status),
        },
        {
            header: "Requested At",
            accessorKey: "createdAt",
            cell: ({ row }) => (row.original.createdAt ? new Date(row.original.createdAt).toLocaleString() : "-"),
        },
        {
            header: "Action",
            accessorKey: "action",
            cell: ({ row }) => (
                <Button color="primary" size="sm" onClick={() => openReview(row.original)}>
                    {row.original.status === "pending" ? "Review" : "View"}
                </Button>
            ),
        },
    ];

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageIndex, pageSize, globalFilter, statusFilter, modelTypeFilter]);

    const owner = selected?.modelId || {};
    const balance = Number(owner.walletAmount);
    const insufficient = Number.isFinite(balance) && selected && balance < selected.amount;

    const Detail = ({ label, value }) => (
        <Col md={6} className="mb-3">
            <Label className="text-muted mb-1 d-block">{label}</Label>
            <div className="fw-medium">{value === undefined || value === null || value === "" ? "-" : value}</div>
        </Col>
    );

    return (
        <div className="page-content">
            <h4><i className="bx bxs-wallet" /> Withdrawal Requests</h4>

            <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
                <div className="d-flex align-items-center gap-2">
                    <label className="mb-0">Status:</label>
                    <select
                        className="form-select"
                        style={{ width: 180 }}
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPageIndex(0); }}
                    >
                        <option value="pending">Pending</option>
                        <option value="completed">Approved</option>
                        <option value="failed">Rejected</option>
                    </select>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <label className="mb-0">Model Type:</label>
                    <select
                        className="form-select"
                        style={{ width: 180 }}
                        value={modelTypeFilter}
                        onChange={(e) => { setModelTypeFilter(e.target.value); setPageIndex(0); }}
                    >
                        <option value="">All</option>
                        <option value="User">User</option>
                        <option value="Vendor">Vendor</option>
                    </select>
                </div>
            </div>

            <DataTableContainer
                columns={columns}
                data={data}
                fetchData={fetchData}
                totalCount={totalCount}
                pageIndex={pageIndex}
                setPageIndex={setPageIndex}
                pageSize={pageSize}
                setPageSize={setPageSize}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                isSrNo={true}
                isGlobalFilter={true}
                isAddButton={false}
                isPagination={true}
                isCustomPageSize={true}
                SearchPlaceholder="Search by name / mobile..."
                tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
                theadClass="table-light"
                pagination="pagination"
                paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
            />

            {/* Review / decision modal */}
            <Modal isOpen={open} toggle={closeReview} size="lg" scrollable>
                <ModalHeader toggle={closeReview} tag="h4">
                    Withdrawal Request Details
                </ModalHeader>
                <ModalBody>
                    {selected && (
                        <>
                            <h6 className="text-uppercase text-muted mb-3">Requester</h6>
                            <Row>
                                <Detail label="Name" value={owner.name} />
                                <Detail label="Mobile No" value={owner.mobileNo} />
                                <Detail label="Email" value={owner.email} />
                                <Detail label="Account Type" value={selected.modelType} />
                            </Row>

                            <h6 className="text-uppercase text-muted mb-3 mt-2">Balance & Amount</h6>
                            <Row>
                                <Detail label="Current Wallet Balance" value={`₹ ${money(owner.walletAmount)}`} />
                                <Detail label="Requested Amount" value={`₹ ${money(selected.amount)}`} />
                                <Detail
                                    label="Balance After Approval"
                                    value={Number.isFinite(balance) ? `₹ ${(balance - selected.amount).toFixed(2)}` : "-"}
                                />
                                <Detail label="Status" value={statusBadge(selected.status)} />
                            </Row>

                            <h6 className="text-uppercase text-muted mb-3 mt-2">Request</h6>
                            <Row>
                                <Detail label="Description" value={selected.description} />
                                <Detail
                                    label="Requested At"
                                    value={selected.createdAt ? new Date(selected.createdAt).toLocaleString() : "-"}
                                />
                            </Row>

                            {insufficient && selected.status === "pending" && (
                                <div className="alert alert-warning py-2 mb-3">
                                    Requested amount exceeds the current wallet balance.
                                </div>
                            )}

                            {selected.status === "pending" ? (
                                <div className="mb-1">
                                    <Label>Note (optional) — added to the request on approval / rejection</Label>
                                    <Input
                                        type="textarea"
                                        rows={3}
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Add a note for this decision..."
                                    />
                                </div>
                            ) : (
                                <div className="text-muted">This request has already been processed.</div>
                            )}
                        </>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={closeReview}>Close</Button>
                    {selected?.status === "pending" && (
                        <>
                            <Button color="danger" disabled={submitting} onClick={() => handleDecision("reject")}>
                                Reject
                            </Button>
                            <Button color="success" disabled={submitting || insufficient} onClick={() => handleDecision("approve")}>
                                Approve
                            </Button>
                        </>
                    )}
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default WithdrawalRequest;
