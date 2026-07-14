import React from "react";
import { Col, FormFeedback, Input, Label, Row } from "reactstrap";
import moment from "moment";

// Resolves the human-readable display value for a read-only field.
const getDisplayValue = (field, validation) => {
    const raw = validation.values[field.name];
    if (field.isBoolean) return raw ? "Yes" : "No";
    if (field.options?.length) {
        const match = field.options.find((o) => String(o.key) === String(raw));
        if (match) return match.label;
    }
    if (field.type === "date" && raw) return moment(raw).format("DD MMM YYYY");
    return raw === undefined || raw === null || raw === "" ? "-" : String(raw);
};

// Renders an editable control (select / date / text-like).
const renderControl = (field, validation) => {
    if (field.type === "select") {
        return (
            <Input
                name={field.name}
                type="select"
                className="form-select"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values[field.name] ?? ""}
                required={field.required}
            >
                <option value="">Select</option>
                {field.isBoolean ? (
                    <>
                        <option value={true}>Yes</option>
                        <option value={false}>No</option>
                    </>
                ) : (
                    field.options?.map((opt, i) => (
                        <option key={i} value={opt.key}>
                            {opt.label}
                        </option>
                    ))
                )}
            </Input>
        );
    }

    return (
        <Input
            id={field.name}
            name={field.name}
            type={field.type}
            className="form-control"
            placeholder={field.placeholder || ""}
            required={field.required}
            onChange={(e) => {
                if (field.name === "mobileNo" && e.target.value.length > 10) {
                    e.target.value = e.target.value.slice(0, 10);
                }
                if (field.type === "date") {
                    validation.setFieldValue(field.name, e.target.value);
                } else {
                    validation.handleChange(e);
                }
            }}
            onBlur={validation.handleBlur}
            onWheel={field.type === "number" ? (e) => e.target.blur() : undefined}
            value={
                field.type === "date"
                    ? validation.values[field.name]
                        ? moment(validation.values[field.name]).format("YYYY-MM-DD")
                        : ""
                    : validation.values[field.name] ?? ""
            }
        />
    );
};

// Renders grouped form fields in a two-column grid with section headings.
// `groups` = [{ title, fields: [{ name, label, type, readOnly, required, fullWidth, options, isBoolean }] }]
const FormFieldsGrid = ({ groups = [], validation }) => (
    <>
        {groups.map((group, gi) => (
            <div className="border rounded-3 p-3 mb-3 bg-white" key={gi}>
                <h6 className="text-uppercase fw-bold text-primary mb-3 d-flex align-items-center gap-2">
                    <i className="bx bx-chevron-right" />
                    {group.title}
                </h6>
                {group.content ? <div className="mb-3">{group.content}</div> : null}
                <Row className="gx-3 gy-3">
                    {group.fields.map((field) =>
                        field.readOnly ? (
                            // Read-only → label + value, height-matched to inputs so
                            // rows line up when placed next to editable fields.
                            <Col md={field.fullWidth ? 12 : 6} key={field.name}>
                                <span className="d-block fw-semibold mb-1">{field.label}</span>
                                <div
                                    className="d-flex align-items-center text-dark border-bottom"
                                    style={{ minHeight: "38px" }}
                                >
                                    {getDisplayValue(field, validation)}
                                </div>
                            </Col>
                        ) : (
                            <Col md={field.fullWidth ? 12 : 6} key={field.name}>
                                <Label for={field.name} className="mb-1 fw-semibold">
                                    {field.label}
                                    {field.required ? <span className="text-danger"> *</span> : null}
                                </Label>
                                {renderControl(field, validation)}
                                {validation.touched[field.name] && validation.errors[field.name] ? (
                                    <FormFeedback className="d-block">
                                        {validation.errors[field.name]}
                                    </FormFeedback>
                                ) : null}
                            </Col>
                        )
                    )}
                </Row>
            </div>
        ))}
    </>
);

export default FormFieldsGrid;
