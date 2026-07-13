import React, { useState } from "react";
import { Card, CardBody, Col, Row, Button, Label } from "reactstrap";
import Dropzone from "react-dropzone";

const FileGalleryUploadWithPreview = ({
  label = "Gallery Images",
  files = [],
  existingUrls = [],
  onFilesChange,
  fileType = "image",
  readOnly = false,
  isEdit = false
}) => {
  const [editMode, setEditMode] = useState(!isEdit);

  // Handle files dropped or selected
  const handleDrop = (acceptedFiles) => {
    const newFiles = [...files, ...acceptedFiles];
    onFilesChange(newFiles);
  };

  // Remove a file from the preview
  const handleRemove = (index) => {
    const newFiles = files.slice();
    newFiles.splice(index, 1);
    onFilesChange(newFiles);
  };

  return (
    <div className="mb-3">
      <Label>{label}</Label>
      <Card className="mt-2">
        <CardBody>
          {readOnly ? (
            <Row className="mt-2">
              {existingUrls && !files.length &&
                existingUrls.map((url, idx) => (
                  <Col key={idx} xs={6} sm={4} md={3} className="mb-2">
                    <Card>
                      <CardBody className="text-center p-2">
                        <img
                          src={url}
                          alt={`Gallery ${idx + 1}`}
                          className="img-fluid rounded"
                          style={{ width: "100%", height: "100px", objectFit: "cover" }}
                        />
                      </CardBody>
                    </Card>
                  </Col>
                ))}
              {files &&
                files.map((file, idx) => {
                  return (
                    <Col key={idx} xs={6} sm={4} md={3} className="mb-2">
                      <Card>
                        <CardBody className="text-center p-2">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${idx + 1}`}
                            className="img-fluid rounded"
                            style={{ width: "100%", height: "100px", objectFit: "cover" }}
                          />
                        </CardBody>
                      </Card>
                    </Col>
                  )
                })}
            </Row>
          ) : !editMode ? (
            <>
              <Row className="mt-2">
                {existingUrls && !files.length &&
                  existingUrls.map((url, idx) => (
                    <Col key={idx} xs={6} sm={4} md={3} className="mb-2">
                      <Card>
                        <CardBody className="text-center p-2">
                          <img
                            src={url}
                            alt={`Gallery ${idx + 1}`}
                            className="img-fluid rounded"
                            style={{ width: "100%", height: "100px", objectFit: "cover" }}
                          />
                        </CardBody>
                      </Card>
                    </Col>
                  ))}
                {files &&
                  files.map((file, idx) => (
                    <Col key={idx} xs={6} sm={4} md={3} className="mb-2">
                      <Card>
                        <CardBody className="text-center p-2">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${idx + 1}`}
                            className="img-fluid rounded"
                            style={{ width: "100%", height: "100px", objectFit: "cover" }}
                          />
                          <Button
                            color="danger"
                            size="sm"
                            className="mt-1"
                            onClick={() => handleRemove(idx)}
                          >
                            Remove
                          </Button>
                        </CardBody>
                      </Card>
                    </Col>
                  ))}
              </Row>
              <div className="text-center mt-2">
                <Button color="primary" size="sm" onClick={() => setEditMode(true)}>
                  Edit
                </Button>
              </div>
            </>
          ) : (
            <>
              <Dropzone
                onDrop={handleDrop}
                accept={fileType === "image" ? { "image/*": [] } : undefined}
                multiple
              >
                {({ getRootProps, getInputProps, isDragActive }) => (
                  <div
                    {...getRootProps()}
                    className={`dropzone d-flex flex-column align-items-center justify-content-center p-3 border rounded ${isDragActive ? "bg-light" : ""}`}
                    style={{ cursor: "pointer", minHeight: 100, background: "#fafbfc" }}
                  >
                    <input {...getInputProps()} />
                    <i className="bx bxs-cloud-upload text-muted fs-1 mb-2" />
                    <div>
                      {isDragActive
                        ? "Drop the files here..."
                        : "Drag & drop images here, or click to select"}
                    </div>
                  </div>
                )}
              </Dropzone>
              <Row className="mt-2">
                {files &&
                  files.map((file, idx) => (
                    <Col key={idx} xs={6} sm={4} md={3} className="mb-2">
                      <Card>
                        <CardBody className="text-center p-2">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${idx + 1}`}
                            className="img-fluid rounded"
                            style={{ width: "100%", height: "100px", objectFit: "cover" }}
                          />
                          <Button
                            color="danger"
                            size="sm"
                            className="mt-1"
                            onClick={() => handleRemove(idx)}
                          >
                            Remove
                          </Button>
                        </CardBody>
                      </Card>
                    </Col>
                  ))}
              </Row>

            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default FileGalleryUploadWithPreview; 