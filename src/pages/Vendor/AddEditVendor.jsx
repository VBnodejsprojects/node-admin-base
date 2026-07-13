import React from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
} from "reactstrap";

import FormFieldsGrid from "../../components/Common/FormFieldsGrid";

const AddEditVendor = ({
  open,
  toggle,
  isEdit,
  validation,
  fieldGroups,
}) => {
  const formId = "vendor-edit-form";
  return (
    <Modal isOpen={open} toggle={toggle} size="lg" scrollable centered>
      <ModalHeader toggle={toggle} tag="h4">
        <i className="bx bx-store-alt me-2" />
        {!!isEdit ? "Edit Vendor" : "Add Vendor"}
      </ModalHeader>
      <ModalBody className="bg-light">
        <Form
          id={formId}
          onSubmit={(e) => {
            e.preventDefault();
            validation.handleSubmit();
            return false;
          }}
        >
          <FormFieldsGrid groups={fieldGroups} validation={validation} />
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="light" onClick={toggle}>
          Cancel
        </Button>
        <Button color="success" type="submit" form={formId}>
          <i className="bx bx-save me-1" />
          Save Changes
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddEditVendor;