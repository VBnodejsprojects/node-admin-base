import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";

import {
  Row,
  Col,
  Label,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Badge,
  Table,
} from "reactstrap";

import {
  getAllHelpSupport,
  addHelpSupport,
  updateHelpSupport,
  deleteHelpSupport,
} from "../../helpers/help-supportApi";

import DataTableContainer from "../../components/Common/DataTabelContainer";
import { ShowToast } from "../../components/Toast";
import DeleteModal from "../../components/Common/DeleteModal";
import AddEditHelpSupport from "./AddEditHelpSupport";
import moment from "moment";

const HelpSupport = () => {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [globalFilter, setGlobalFilter] = useState("");

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [helpSupport, setHelpSupport] = useState();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [selectedFile, setSelectedFile] = useState();

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      subject: (helpSupport && helpSupport.subject) || "",
      comment: (helpSupport && helpSupport.comment) || "",
      helpImage: (helpSupport && helpSupport.helpImage) || "",
      response: (helpSupport && helpSupport.response) || "",
      status: (helpSupport && helpSupport.status) || "pending",
      responseByTime: helpSupport?.responseByTime
        ? moment(helpSupport.responseByTime).format("YYYY-MM-DDTHH:mm")
        : "",
      createdByModel: (helpSupport && helpSupport.createdByModel) || "",
      createdBy: (helpSupport && helpSupport.createdBy?.name) || "",
      createdByMobileNo: (helpSupport && helpSupport.createdBy?.mobileNo) || "",
      //userType: helpSupport?.userType || "1",
    },
    onSubmit: async (values) => {
      const payload = {
        //userType: values.userType,
        status: values.status,
        response: values.response,
      };
      try {
        if (isEdit) {
          const response = await updateHelpSupport(payload, helpSupport._id);
          if (response?.type === "success") {
            ShowToast.success(response.message);
            fetchData();
          } else {
            ShowToast.error(response.message);
          }
        } else {
          const response = await addHelpSupport(payload);
          if (response?.type === "success") {
            ShowToast.success(response.message);
            fetchData();
          } else {
            ShowToast.error(response.message);
          }
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
      setHelpSupport(null);
      setSelectedFile(null);
      validation.resetForm();
    } else {
      setOpen(true);
    }
  };

  const fetchData = async () => {
    const response = await getAllHelpSupport({
      search: globalFilter,
      page: pageIndex,
      limit: pageSize,
      from: startDate,
      to: endDate,
      status: statusFilter,
    });
    setData(response?.helpSupports || []);
    setTotalCount(response?.total || 0);
  };

  const onClickDelete = (data) => {
    setHelpSupport(data);
    setDeleteModal(true);
  };

  const onClickEdit = (data) => {
    setHelpSupport(data);
    setIsEdit(true);
    setOpen(true);
  };

  const handleDelete = async () => {
    let response = await deleteHelpSupport(helpSupport._id);
    if (response?.type === "success") {
      ShowToast.success(response.message);
      fetchData();
      setDeleteModal(false);
      setHelpSupport(null);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize, globalFilter, startDate, endDate, statusFilter]);

  const columns = [
    {
      header: "Help Image",
      accessorKey: "helpImage",
      cell: (cellProps) => {
        return (
          <img
            src={cellProps.row.original.helpImage || "vite.svg"}
            alt="help"
            className="img-fluid rounded-circle"
            style={{ width: "40px", height: "40px", objectFit: "cover" }}
          />
        );
      },
    },
    { header: "UserType", accessorKey: "createdByModel", cell: ({ row }) => row.original.createdByModel || "N/A" },
    {
      header: "User name",
      accessorKey: "createdBy",
      cell: ({ row }) => {
        const createdBy = row?.original?.createdBy;

        return (
          <div>
            <div>{createdBy?.name || "N/A"}</div>
            {/* <div className="text-mute small">{createdBy?.mobileNo || "N/A"}</div> */}
          </div>
        );
      },
    },

    {
      header: "Solution",
      accessorKey: "response",
      cell: ({ row }) => row.original.response || "N/A"
    },
    {
      header: "Mobile No",
      accessorKey: "createdBy",
      cell: ({ row }) => {
        const createdBy = row?.original?.createdBy;

        return (
          <div>
            {/* <div>{createdBy?.name || "N/A"}</div> */}
            <div className="text-mute">{createdBy?.mobileNo || "N/A"}</div>
          </div>
        );
      },
    },
    {
      header: "Subject",
      accessorKey: "subject",
      cell: ({ row }) => row.original.subject || "N/A",
    },
    {
      header: "Comment",
      accessorKey: "comment",
      cell: ({ row }) => row.original.comment || "N/A",
    },

    {
      header: "Created Date",
      accessorKey: "createdAt",
      cell: ({ row }) => {
        const date = row.original.createdAt;

        return date
          ? moment(date).format("DD MMM YYYY, hh:mm A")
          : "N/A";
      },
    },
    /*
    {
      header: "User Type",
      accessorKey: "userType",
      cell: ({ row }) => {
        const type = row.original.userType;
        const map = {
          "1": "user",
          "2": "vendor",
          "3": "admin",
          "4": "deliveryPartner",
        };
        return map[type] || type;
      },
    },
    */
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        const value = row.original.status;

        let badgeClass = "bg-secondary";

        if (value === "pending") {
          badgeClass = "bg-warning";
        } else if (value === "resolved") {
          badgeClass = "bg-success";
        } else if (value === "rejected") {
          badgeClass = "bg-danger";
        }

        return (
          <span className={`badge ${badgeClass} fs-6`}>
            {value}
          </span>
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
              onClick={() => onClickEdit(cellProps.row.original)}
            >
              <i className="mdi mdi-pencil font-size-18" />
            </Link>
            <Link
              to="#"
              className="text-danger"
              onClick={() => onClickDelete(cellProps.row.original)}
            >
              <i className="mdi mdi-delete font-size-18" />
            </Link>
          </div>
        );
      },
    },
  ];

  const formFields = [
    { name: "createdBy", label: "Created By", type: "text", readOnly: true },
    { name: "createdByMobileNo", label: "Created By Mobile No", type: "text", readOnly: true },
    // { name: "createdByModel", label: "Created By Model", type: "text", readOnly: true },
    { name: "subject", label: "Subject", type: "text", readOnly: true },
    { name: "comment", label: "Comment", type: "textarea", readOnly: true },
    ...(isEdit
      ? [
        /*
         {
      label: "User Type",
      name: "userType",
      type: "select",
      options: [
        { key: "1", label: "user" },
        { key: "2", label: "vendor" },
        { key: "3", label: "admin" },
        { key: "4", label: "deliveryPartner" },
      ],
    },
    */
        {
          name: "response",
          label: "Solution/Response",
          type: "text",
          required: false,
        },
        {
          name: "responseByTime",
          label: "Response By Time",
          type: "datetime-local",
          required: false,
          readOnly: true,
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          required: true,
          options: [
            { key: "pending", label: "Pending" },
            { key: "resolved", label: "Resolved" },
            { key: "rejected", label: "Rejected" },
          ],
          isEdit: true,
        },
      ]
      : []),
  ];

  return (
    <div className="page-content">
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDelete}
        onCloseClick={() => setDeleteModal(false)}
      />
      <h4><i className="bx bx-help-circle" /> Help & Support</h4>

      <div className="d-flex gap-3 mb-3 align-items-end">
        <div className="d-flex align-items-center gap-2">
          <label className="mb-0">Status:</label>
          <Input
            type="select"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPageIndex(0); }}
            style={{ width: 180 }}
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </Input>
        </div>
        <Col md={3}>
          <Label>Start Date :</Label>
          <Input
            name="startDate"
            type="date"
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); setPageIndex(0); }}
          />
        </Col>
        <Col md={3}>
          <Label>End Date :</Label>
          <Input
            name="endDate"
            type="date"
            value={endDate}
            onChange={(e) => { setEndDate(e.target.value); setPageIndex(0); }}
          />
        </Col>
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
        handleClick={toggle}
        isCustomPageSize={true}
        SearchPlaceholder="Search here..."
        buttonClass="btn btn-success btn-rounded waves-effect waves-light mb-2 me-2"
        buttonName="Add Help & Support"
        tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline"
        theadClass="table-light"
        pagination="pagination"
        paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
      />
      <AddEditHelpSupport
        open={open}
        toggle={toggle}
        isEdit={isEdit}
        validation={validation}
        formFields={formFields}
        setSelectedFile={setSelectedFile}
        selectedFile={selectedFile}
        helpSupport={helpSupport}
      />
    </div>
  );
};

export default HelpSupport;