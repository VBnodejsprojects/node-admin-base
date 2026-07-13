import React, { useCallback, useEffect, useState } from "react";
import DataTableContainer from "../../components/Common/DataTabelContainer";
import EntityCell from "../../components/Common/EntityCell";
import { getAllNotifications } from "../../helpers/notificationApi";

// Backend notification.modelType — 1:AllUser, 2:SingleUser, 3:AllVendor, 4:SingleVendor
const TARGET_LABEL = { "1": "All", "2": "Single", "3": "All", "4": "Single" };

const AllNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [globalFilter, setGlobalFilter] = useState("");
    const [modelNameFilter, setModelNameFilter] = useState("");

    const fetchData = useCallback(async () => {
        try {
            const response = await getAllNotifications({
                page: pageIndex,
                limit: pageSize,
                search: globalFilter || "",
                modelName: modelNameFilter,
            });

            const list = response?.notifications || [];
            setNotifications(Array.isArray(list) ? list : []);
            setTotalCount(response?.total ?? list.length ?? 0);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            setNotifications([]);
            setTotalCount(0);
        }
    }, [pageIndex, pageSize, globalFilter, modelNameFilter]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const columns = [
        {
            header: "Title",
            accessorKey: "title",
            cell: ({ row }) => row.original.title || "-",
        },
        {
            header: "Message",
            accessorKey: "message",
            cell: ({ row }) => row.original.message || "-",
        },
        {
            header: "Recipient Type",
            accessorKey: "modelName",
            cell: ({ row }) => row.original.modelName || "-",
        },
        {
            header: "Audience",
            accessorKey: "modelType",
            cell: ({ row }) => TARGET_LABEL[row.original.modelType] || "-",
        },
        {
            header: "Recipient",
            accessorKey: "model",
            cell: ({ row }) => (row.original.model ? <EntityCell entity={row.original.model} /> : "All"),
        },
        {
            header: "Sent At",
            accessorKey: "createdAt",
            cell: ({ row }) => {
                const value = row.original.createdAt;
                return value ? new Date(value).toLocaleString() : "-";
            },
        },
    ];

    return (
        <div className="page-content">
            <h4><i className="bx bx-bell" /> All Notifications</h4>

            <div className="d-flex align-items-center gap-2 mb-3">
                <label className="mb-0">Model Type:</label>
                <select
                    className="form-select"
                    style={{ width: 200 }}
                    value={modelNameFilter}
                    onChange={(e) => { setModelNameFilter(e.target.value); setPageIndex(0); }}
                >
                    <option value="">All</option>
                    <option value="User">User</option>
                    <option value="Vendor">Vendor</option>
                </select>
            </div>

            <DataTableContainer
                columns={columns}
                fetchData={fetchData}
                data={notifications}
                isSrNo={true}
                totalCount={totalCount}
                pageIndex={pageIndex}
                setPageIndex={setPageIndex}
                pageSize={pageSize}
                setPageSize={setPageSize}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                isGlobalFilter={true}
                isCustomPageSize={true}
                isPagination={true}
                SearchPlaceholder="Search notifications..."
                tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
                theadClass="table-light"
                pagination="pagination"
                paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
            />
        </div>
    );
};

export default AllNotifications;
