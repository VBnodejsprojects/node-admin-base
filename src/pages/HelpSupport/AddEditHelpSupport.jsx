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

import DynamicFormFields from "../../components/Common/DynamicFormFields";

const AddEditHelpSupport = ({
  open,
  toggle,
  isEdit,
  validation,
  formFields,
  helpSupport,
  onPreviewImage,
}) => {
  const helpImage = validation.values.helpImage || helpSupport?.helpImage;
  return (
    <Modal isOpen={open} toggle={toggle}>
      <ModalHeader toggle={toggle} tag="h4">
        {!!isEdit ? "Edit Help & Support" : "Add Help & Support"}
      </ModalHeader>
      <ModalBody>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            validation.handleSubmit();
            return false;
          }}
        >

          <DynamicFormFields formFields={formFields} validation={validation} />

          {/* Help image — read-only preview; click to open full size. */}
          <div className="mb-3">
            <Label className="d-block">Help Image</Label>
            {helpImage ? (
              <div
                role="button"
                title="Click to preview full image"
                style={{ cursor: "pointer" }}
                onClick={() => onPreviewImage?.(helpImage)}
              >
                <img
                  src={helpImage}
                  alt="help"
                  className="img-fluid rounded border"
                  style={{ maxWidth: "100%", maxHeight: 240, objectFit: "contain" }}
                />
                <div className="text-muted small mt-1">Click the image to preview full size.</div>
              </div>
            ) : (
              <div className="text-muted">No image attached.</div>
            )}
          </div>

          <Row>
            <Col className="d-flex gap-3 flex-row-reverse">
              <div className="text-end">
                <Button color="success" type="submit" className="save-user">
                  Save
                </Button>
              </div>
              <div className="text-end">
                <Button color="danger" className="save-user" onClick={toggle}>
                  Cancel
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default AddEditHelpSupport;