// src/pages/User/AddEditUser.jsx
import React from "react";
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

const AddEditUser = ({ open, toggle, isEdit, validation, formFields }) => {
  return (
    <Modal
      isOpen={open}
      toggle={toggle}
      size="lg"
      contentClassName="app-redesign-modal"
    >
      <ModalHeader toggle={toggle} tag="h4">
        {isEdit ? "Edit User" : "Add User"}
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

          <Row className="mt-3">
            <Col className="d-flex gap-3 flex-row-reverse">
              <Button color="success" type="submit" className="save-user">
                Save
              </Button>
              <Button color="danger" className="save-user" onClick={toggle}>
                Cancel
              </Button>
            </Col>
          </Row>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default AddEditUser;