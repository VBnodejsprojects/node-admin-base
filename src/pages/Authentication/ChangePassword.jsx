import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardBody,
    Col,
    Container,
    Row,
    Form,
    Label,
    Input,
    Button,
    FormFeedback,
    InputGroup,
    InputGroupText,
} from "reactstrap";

import { changeAdminPassword } from "../../helpers/adminApi";
import { ShowToast } from "../../components/Toast";

const ChangePassword = () => {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [show, setShow] = useState({ current: false, next: false, confirm: false });

    const toggleShow = (key) => setShow((prev) => ({ ...prev, [key]: !prev[key] }));

    const validation = useFormik({
        initialValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        validationSchema: Yup.object({
            currentPassword: Yup.string().required("Please enter your current password"),
            newPassword: Yup.string()
                .notOneOf(
                    [Yup.ref("currentPassword")],
                    "New password must be different from the current password"
                )
                .required("Please enter a new password"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("newPassword")], "Passwords do not match")
                .required("Please confirm your new password"),
        }),
        onSubmit: async (values, { resetForm }) => {
            setSubmitting(true);
            try {
                const response = await changeAdminPassword(values);
                if (response?.type === "success") {
                    ShowToast.success(response.message || "Password changed successfully");
                    resetForm();
                    navigate("/dashboard");
                } else {
                    ShowToast.error(response?.message || "Failed to change password");
                }
            } catch (error) {
                ShowToast.error("Something went wrong.");
            } finally {
                setSubmitting(false);
            }
        },
    });

    const fieldError = (name) => validation.touched[name] && validation.errors[name];

    return (
        <div className="page-content">
            <Container fluid>
                <Row className="justify-content-center">
                    <Col xl={6} lg={8}>
                        <Card>
                            <CardBody>
                                <h4 className="card-title mb-1">
                                    <i className="bx bxs-lock-alt me-2" />
                                    Change Password
                                </h4>
                                <p className="text-muted mb-4">
                                    Enter your current password, then set a new password.
                                </p>

                                <Form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        validation.handleSubmit();
                                    }}
                                >
                                    <div className="mb-3">
                                        <Label htmlFor="currentPassword">Current Password</Label>
                                        <InputGroup>
                                            <Input
                                                id="currentPassword"
                                                name="currentPassword"
                                                type={show.current ? "text" : "password"}
                                                placeholder="Enter current password"
                                                value={validation.values.currentPassword}
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                invalid={!!fieldError("currentPassword")}
                                            />
                                            <InputGroupText
                                                className="cursor-pointer"
                                                onClick={() => toggleShow("current")}
                                            >
                                                <i className={`mdi ${show.current ? "mdi-eye-off" : "mdi-eye"}`} />
                                            </InputGroupText>
                                            {fieldError("currentPassword") && (
                                                <FormFeedback className="d-block">
                                                    {validation.errors.currentPassword}
                                                </FormFeedback>
                                            )}
                                        </InputGroup>
                                    </div>

                                    <div className="mb-3">
                                        <Label htmlFor="newPassword">New Password</Label>
                                        <InputGroup>
                                            <Input
                                                id="newPassword"
                                                name="newPassword"
                                                type={show.next ? "text" : "password"}
                                                placeholder="Enter new password"
                                                value={validation.values.newPassword}
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                invalid={!!fieldError("newPassword")}
                                            />
                                            <InputGroupText
                                                className="cursor-pointer"
                                                onClick={() => toggleShow("next")}
                                            >
                                                <i className={`mdi ${show.next ? "mdi-eye-off" : "mdi-eye"}`} />
                                            </InputGroupText>
                                            {fieldError("newPassword") && (
                                                <FormFeedback className="d-block">
                                                    {validation.errors.newPassword}
                                                </FormFeedback>
                                            )}
                                        </InputGroup>
                                    </div>

                                    <div className="mb-4">
                                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                        <InputGroup>
                                            <Input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type={show.confirm ? "text" : "password"}
                                                placeholder="Re-enter new password"
                                                value={validation.values.confirmPassword}
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                invalid={!!fieldError("confirmPassword")}
                                            />
                                            <InputGroupText
                                                className="cursor-pointer"
                                                onClick={() => toggleShow("confirm")}
                                            >
                                                <i className={`mdi ${show.confirm ? "mdi-eye-off" : "mdi-eye"}`} />
                                            </InputGroupText>
                                            {fieldError("confirmPassword") && (
                                                <FormFeedback className="d-block">
                                                    {validation.errors.confirmPassword}
                                                </FormFeedback>
                                            )}
                                        </InputGroup>
                                    </div>

                                    <div className="d-flex justify-content-end gap-2">
                                        <Button
                                            type="button"
                                            color="secondary"
                                            outline
                                            onClick={() => navigate(-1)}
                                            disabled={submitting}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" color="primary" disabled={submitting}>
                                            {submitting ? "Updating..." : "Update Password"}
                                        </Button>
                                    </div>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ChangePassword;
