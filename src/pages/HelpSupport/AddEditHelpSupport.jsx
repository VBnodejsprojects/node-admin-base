import {
  Button,
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
} from "reactstrap";

import FileUploadWithPreview from "../../components/Common/FileUploadWithPreview";
import DynamicFormFields from "../../components/Common/DynamicFormFields";

const AddEditHelpSupport = ({
  open,
  toggle,
  isEdit,
  validation,
  formFields,
  setSelectedFile,
  selectedFile,
  helpSupport,
}) => {
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

          <FileUploadWithPreview
            label={"Help Image"}
            fileType="image"
            onFileChange={(file) => {
              setSelectedFile(file);
              validation.setFieldValue("helpImage", file);
            }}
            validation={validation}
            existingUrl={validation.values.helpImage}
            file={selectedFile}
            error={validation.errors.helpImage}
            touched={validation.touched.helpImage}
            readOnly={true}
          />

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