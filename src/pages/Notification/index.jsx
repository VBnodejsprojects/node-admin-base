import { useEffect, useState } from "react";
import { useFormik } from "formik";
import Select from "react-select";

import {
    Button,
    Col,
    Row,
    Form,
    Label,
} from "reactstrap";

import { sendNotification } from "../../helpers/notificationApi";
import { getAllVendorsListForFilter, getAllUsersListForFilter } from "../../helpers/filterApi";

import { ShowToast } from "../../components/Toast";
import DynamicFormFields from "../../components/Common/DynamicFormFields";
import { CustomStyles } from "../../components/Common/MultiSelect";

// Backend type — 1:AllUser, 2:SingleUser, 3:AllVendor, 4:SingleVendor
const SendNotification = () => {
    const [vendorList, setVendorList] = useState([]);
    const [userList, setUserList] = useState([]);

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            title: "",
            message: "",
            type: "",
            userId: "",
        },
        onSubmit: async (values) => {
            try {
                const payload = {
                    title: values.title,
                    message: values.message,
                    type: values.type,
                };
                // userId is required only for the "single" types (2, 4)
                if (values.type === "2" || values.type === "4") {
                    payload.userId = values.userId;
                }

                const response = await sendNotification(payload);

                if (response?.type === "success") {
                    ShowToast.success(response.message);
                    validation.resetForm();
                } else {
                    ShowToast.error(response?.message || "Failed to send notification");
                }
            } catch (error) {
                ShowToast.error("Something went wrong.");
            }
        },
    });

    const fetchVendorList = async () => {
        const response = await getAllVendorsListForFilter();
        setVendorList(response?.vendors || []);
    };
    const fetchUserList = async () => {
        const response = await getAllUsersListForFilter();
        setUserList(response?.users || []);
    };

    const typeField = [
        {
            name: "type",
            label: "Send To",
            type: "select",
            required: true,
            options: [
                { key: "1", label: "All Users" },
                { key: "2", label: "Single User" },
                { key: "3", label: "All Vendors" },
                { key: "4", label: "Single Vendor" },
            ],
        },
    ];

    const formFields = [
        { name: "title", label: "Title", type: "text", required: true },
        { name: "message", label: "Message", type: "textarea", required: true },
    ];

    useEffect(() => {
        if (validation.values.type === "2") fetchUserList();
        if (validation.values.type === "4") fetchVendorList();
    }, [validation.values.type]);

    return (
        <div className="page-content">
            <h4><i className="bx bx-bell" /> Send Notification</h4>
            <Form
                onSubmit={(e) => {
                    e.preventDefault();
                    validation.handleSubmit();
                }}
            >
                <DynamicFormFields formFields={typeField} validation={validation} />

                {validation.values.type === "2" && (
                    <div className="mb-3">
                        <Label>Select User</Label>
                        <Select
                            classNamePrefix="select"
                            isClearable
                            isSearchable
                            name="Select User"
                            onChange={(value) => validation.setFieldValue("userId", value ? value.value : "")}
                            options={userList.map((user) => ({
                                value: user._id,
                                label: `${user.mobileNo} (${user?.name || ""})`,
                            }))}
                            styles={CustomStyles}
                        />
                    </div>
                )}
                {validation.values.type === "4" && (
                    <div className="mb-3">
                        <Label>Select Vendor</Label>
                        <Select
                            classNamePrefix="select"
                            isClearable
                            isSearchable
                            name="Select Vendor"
                            onChange={(value) => validation.setFieldValue("userId", value ? value.value : "")}
                            options={vendorList.map((vendor) => ({
                                value: vendor._id,
                                label: `${vendor.mobileNo} (${vendor?.name || ""})`,
                            }))}
                            styles={CustomStyles}
                        />
                    </div>
                )}

                <DynamicFormFields formFields={formFields} validation={validation} />

                <Row className="mt-4">
                    <Col className="d-flex justify-content-end gap-2">
                        <Button color="success" type="submit">
                            Send
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default SendNotification;
