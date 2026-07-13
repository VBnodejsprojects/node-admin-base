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
import FileGalleryUploadWithPreview from "../../components/Common/FileGalleryUploadWithPreview";
import DynamicFormFields from "../../components/Common/DynamicFormFields";

const AddEditBanner = ({ open, toggle, isEdit, validation, formFields, setSelectedFile, selectedFile }) => {
    return (
        <Modal isOpen={open} toggle={toggle}>
            <ModalHeader toggle={toggle} tag="h4">
                {!!isEdit ? "Edit Banner" : "Add Banner"}
            </ModalHeader>
            <ModalBody>
                <Form
                    onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                    }}
                >
                    <DynamicFormFields
                        formFields={formFields}
                        validation={validation}
                    />
                    <FileUploadWithPreview
                        label={"Banner Image"}
                        fileType="image"
                        onFileChange={(file) => {
                            setSelectedFile(file);
                            validation.setFieldValue("bannerImage", file);
                        }}
                        validation={validation}
                        existingUrl={validation.values.bannerImage}
                        file={selectedFile}
                        error={validation.errors.bannerImage}
                        touched={validation.touched.bannerImage}
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
    )
}

export default AddEditBanner