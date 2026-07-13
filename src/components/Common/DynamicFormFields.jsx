import { Col, FormFeedback, Input, Label, Row } from "reactstrap";
import moment from "moment";

const DynamicFormFields = ({ formFields = [], validation }) => {
    return (
        <Row>
            <Col className="col-12">
                {formFields.map((field) => (
                    <div className="mb-3" key={field.name}>
                        <Label for={field.name}>{field.label}</Label>

                        {/* Select Dropdown */}
                        {field.type === "select" ? (
                            <Input
                                name={field.name}
                                type="select"
                                className="form-select"
                                onChange={validation.handleChange}
                                readOnly={field.readOnly}
                                disabled={field.readOnly}
                                onBlur={validation.handleBlur}
                                value={validation.values[field.name] ?? "--select--"}
                                required={field.required}
                            >
                                {!field.isEdit && <option value="">Select</option>}
                                {/* Handle boolean-specific fields */}
                                {field.isBoolean ? (
                                    <>
                                        <option value={true}>Yes</option>
                                        <option value={false}>No</option>
                                    </>
                                ) : (
                                    field.options?.map((opt, index) => (
                                        <option key={index} value={opt.key}>
                                            {opt.label}
                                        </option>
                                    ))
                                )}
                            </Input>
                        ) : (
                            // Other Input Types
                            <Input
                                id={field.name}
                                name={field.name}
                                type={field.type}
                                className="form-control"
                                placeholder={field.placeholder || ""}
                                required={field.required}
                                readOnly={field.readOnly}
                                disabled={field.readOnly}
                                hidden={field.isEdit}
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
                                    field.value !== undefined
                                        ? field.value
                                        : field.type === "date"
                                            ? validation.values[field.name]
                                                ? moment(validation.values[field.name]).format("YYYY-MM-DD")
                                                : "-"
                                            : validation.values[field.name] ?? "-"
                                }

                            />
                        )}

                        {/* Error */}
                        {validation.touched[field.name] && validation.errors[field.name] && (
                            <FormFeedback type="invalid" className="d-block">
                                {validation.errors[field.name]}
                            </FormFeedback>
                        )}
                    </div>
                ))}
            </Col>
        </Row>
    );
};

export default DynamicFormFields;