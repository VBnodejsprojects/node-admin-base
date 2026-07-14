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
import FilterField from "../../components/Common/FilterField";
import EntityCell from "../../components/Common/EntityCell";
import { ShowToast } from "../../components/Toast";
import { formatDateTime } from "../../utils/formatDate";

const WithdrawalRequest = () => {
    const [data, setData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [globalFilter, setGlobalFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("pending");
    const [modelTypeFilter, setModelTypeFilter] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    // Particular user/vendor filter (mutually exclusive)
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedVendor, setSelectedVendor] = useState("");

    // Review modal
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [note, setNote] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [transactionImage, setTransactionImage] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // A specific user OR vendor id narrows to that entity's requests.
    const selectedEntityId = selectedUser || selectedVendor;

    const fetchData = async () => {
        const res = await getWithdrawalRequests({
            search: globalFilter,
            page: pageIndex,
            limit: pageSize,
            status: statusFilter,
            modelType: modelTypeFilter,
            modelId: selectedEntityId,
            from: fromDate,
            to: toDate,
        });
        setData(res?.data || []);
        setTotalCount(res?.pagination?.total || 0);
    };

    // Keep the two entity pickers mutually exclusive.
    const handleSelectUser = (id) => { setSelectedUser(id); setSelectedVendor(""); setPageIndex(0); };
    const handleSelectVendor = (id) => { setSelectedVendor(id); setSelectedUser(""); setPageIndex(0); };

    const openReview = (row) => {
        setSelected(row);
        setNote("");
        setTransactionId("");
        setTransactionImage(null);
        setOpen(true);
    };

    const closeReview = () => {
        setOpen(false);
        setSelected(null);
        setNote("");
        setTransactionId("");
        setTransactionImage(null);
    };

    const handleDecision = async (action) => {
        if (!selected) return;
        setSubmitting(true);
        const res = await processWithdrawalDecision(selected._id, {
            action,
            remark: note,
            transactionId,
            transactionImage,
        });
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
        {
            header: "Requested By",
            accessorKey: "modelId.name",
            cell: ({ row }) => (
                <div className="d-flex align-items-center gap-2">
                    <EntityCell entity={row.original.modelId} />
                    <Badge color="light" className="text-dark">{row.original.modelType}</Badge>
                </div>
            ),
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
            header: "Notes",
            accessorKey: "description",
            cell: ({ row }) => (
                <div
                    className="text-muted small text-truncate"
                    style={{ maxWidth: 160 }}
                    title={row.original.description || ""}
                >
                    {row.original.description || "-"}
                </div>
            ),
        },
        {
            header: "Requested At",
            accessorKey: "createdAt",
            cell: ({ row }) => formatDateTime(row.original.createdAt),
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
    }, [pageIndex, pageSize, globalFilter, statusFilter, modelTypeFilter, selectedUser, selectedVendor, fromDate, toDate]);

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
                filters={
                    <>
                        <FilterField label="Status" width={160}>
                            <select
                                className="form-select"
                                value={statusFilter}
                                onChange={(e) => { setStatusFilter(e.target.value); setPageIndex(0); }}
                            >
                                <option value="all">All</option>
                                <option value="pending">Pending</option>
                                <option value="completed">Approved</option>
                                <option value="failed">Rejected</option>
                            </select>
                        </FilterField>
                        <FilterField label="Model Type" width={150}>
                            <select
                                className="form-select"
                                value={modelTypeFilter}
                                onChange={(e) => { setModelTypeFilter(e.target.value); setPageIndex(0); }}
                            >
                                <option value="">All</option>
                                <option value="User">User</option>
                                <option value="Vendor">Vendor</option>
                            </select>
                        </FilterField>
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
                    </>
                }
                selectedUser={selectedUser}
                setSelectedUser={handleSelectUser}
                selectedVendor={selectedVendor}
                setSelectedVendor={handleSelectVendor}
                isUserFilter={true}
                isVendorFilter={true}
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

                            {selected.modelType === "Vendor" && (
                                <>
                                    <h6 className="text-uppercase text-muted mb-3 mt-2">Bank Details</h6>
                                    {owner.accountHolderName || owner.bankName || owner.accountNumber || owner.ifscCode ? (
                                        <Row>
                                            <Detail label="Account Holder Name" value={owner.accountHolderName} />
                                            <Detail label="Bank Name" value={owner.bankName} />
                                            <Detail label="Account Number" value={owner.accountNumber} />
                                            <Detail label="IFSC Code" value={owner.ifscCode} />
                                        </Row>
                                    ) : (
                                        <div className="text-muted mb-3">No bank details available for this vendor.</div>
                                    )}
                                </>
                            )}

                            <h6 className="text-uppercase text-muted mb-3 mt-2">Request</h6>
                            <Row>
                                <Detail label="Description" value={selected.description} />
                                <Detail
                                    label="Requested At"
                                    value={formatDateTime(selected.createdAt)}
                                />
                            </Row>

                            {insufficient && selected.status === "pending" && (
                                <div className="alert alert-warning py-2 mb-3">
                                    Requested amount exceeds the current wallet balance.
                                </div>
                            )}

                            {selected.status === "pending" ? (
                                <>
                                    <h6 className="text-uppercase text-muted mb-3 mt-2">Payout Proof (optional)</h6>
                                    <Row>
                                        <Col md={6} className="mb-3">
                                            <Label>Transaction ID</Label>
                                            <Input
                                                type="text"
                                                value={transactionId}
                                                onChange={(e) => setTransactionId(e.target.value)}
                                                placeholder="e.g. UTR / reference no."
                                            />
                                        </Col>
                                        <Col md={6} className="mb-3">
                                            <Label>Transaction Image</Label>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setTransactionImage(e.target.files?.[0] || null)}
                                            />
                                        </Col>
                                    </Row>
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
                                </>
                            ) : (
                                <>
                                    <h6 className="text-uppercase text-muted mb-3 mt-2">Payout Proof</h6>
                                    <Row>
                                        <Detail label="Transaction ID" value={selected.transactionId} />
                                        <Col md={6} className="mb-3">
                                            <Label className="text-muted mb-1 d-block">Transaction Image</Label>
                                            {selected.transactionImage ? (
                                                <a href={selected.transactionImage} target="_blank" rel="noreferrer">
                                                    <img
                                                        src={selected.transactionImage}
                                                        alt="transaction proof"
                                                        style={{ maxWidth: "100%", maxHeight: 160, borderRadius: 6, objectFit: "cover" }}
                                                    />
                                                </a>
                                            ) : (
                                                <div className="fw-medium">-</div>
                                            )}
                                        </Col>
                                    </Row>
                                    <div className="text-muted">This request has already been processed.</div>
                                </>
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
