import { useState } from 'react';
import { Card, CardBody, Button, Label } from 'reactstrap';
import Dropzone from 'react-dropzone';

const FileUploadWithPreview = ({ label, fileType = 'image', existingUrl, file, onFileChange, readOnly, error, touched, multiple = false }) => {
    const [editMode, setEditMode] = useState(false);

    const selectedFiles = multiple
        ? Array.isArray(file)
            ? file
            : file
                ? [file]
                : []
        : file
            ? [file]
            : [];

    const existingFiles = multiple
        ? Array.isArray(existingUrl)
            ? existingUrl
            : existingUrl
                ? [existingUrl]
                : []
        : existingUrl
            ? [existingUrl]
            : [];

    const renderPreview = (src, idx) => {
        if (fileType === 'image') {
            return (
                <img
                    key={idx}
                    src={src}
                    alt="Preview"
                    className="img-fluid rounded"
                    style={{ maxWidth: '200px', margin: '0.25rem' }}
                />
            );
        } else if (fileType === 'pdf') {
            return (
                <iframe
                    key={idx}
                    src={src}
                    title="PDF Preview"
                    style={{ width: '100%', height: '350px', border: '1px solid #ddd', borderRadius: 8 }}
                />
            );
        }
        return null;
    };

    const showError = touched && error;

    const getPreviewSource = (item) => {
        if (typeof item === 'string') return item;
        if (item instanceof File) return URL.createObjectURL(item);
        return null;
    };

    const hasSelectedFiles = selectedFiles.length > 0;
    const hasExistingFiles = existingFiles.length > 0;

    return (
        <div className="mb-3">
            <Label>{label}</Label>
            <Card className={`mt-2 ${showError ? "border-danger" : ""}`}>
                <CardBody className="text-center">
                    {/* Read Only Mode: Only show preview, no actions */}
                    {readOnly ? (
                        hasSelectedFiles ? (
                            <div className="d-flex flex-wrap justify-content-center">
                                {selectedFiles.map((item, idx) => renderPreview(getPreviewSource(item), idx))}
                            </div>
                        ) : hasExistingFiles ? (
                            <div className="d-flex flex-wrap justify-content-center">
                                {existingFiles.map((item, idx) => renderPreview(getPreviewSource(item), idx))}
                            </div>
                        ) : null
                    ) : hasSelectedFiles ? (
                        <>
                            <div className="d-flex flex-wrap justify-content-center">
                                {selectedFiles.map((item, idx) => renderPreview(getPreviewSource(item), idx))}
                            </div>
                            <div className="mt-2">
                                <Button color="danger" size="sm" onClick={() => onFileChange(multiple ? [] : null)}>
                                    Remove
                                </Button>
                            </div>
                        </>
                    ) : hasExistingFiles && !editMode ? (
                        <>
                            <div className="d-flex flex-wrap justify-content-center">
                                {existingFiles.map((item, idx) => renderPreview(getPreviewSource(item), idx))}
                            </div>
                            <div className="mt-2">
                                <Button color="primary" size="sm" onClick={() => setEditMode(true)}>
                                    Edit
                                </Button>
                                {fileType === 'pdf' && existingFiles.length === 1 && (
                                    <Button color="link" size="sm" href={getPreviewSource(existingFiles[0])} target="_blank" rel="noopener noreferrer">
                                        View Full PDF
                                    </Button>
                                )}
                            </div>
                        </>
                    ) : (
                        <Dropzone
                            onDrop={acceptedFiles => {
                                if (acceptedFiles && acceptedFiles.length > 0) {
                                    onFileChange(multiple ? acceptedFiles : acceptedFiles[0]);
                                    setEditMode(false);
                                }
                            }}
                            accept={fileType === 'image' ? { 'image/jpeg': [], 'image/png': [] } : { 'application/pdf': [] }}
                            multiple={multiple}
                        >
                            {({ getRootProps, getInputProps, isDragActive }) => (
                                <div
                                    {...getRootProps()}
                                    className={`dropzone d-flex flex-column align-items-center justify-content-center p-3 border rounded ${isDragActive ? 'bg-light' : ''}`}
                                    style={{ cursor: 'pointer', minHeight: 100 }}
                                >
                                    <input {...getInputProps()} />
                                    <i className="bx bxs-cloud-upload text-muted fs-1 mb-2" />
                                    <div>{isDragActive ? 'Drop the file here...' : `Drag & drop ${multiple ? 'files' : 'a file'} here, or click to select`}</div>
                                </div>
                            )}
                        </Dropzone>
                    )}
                    {showError && (
                        <div className="text-danger mt-2" style={{ fontSize: "0.875rem" }}>
                            {error}
                        </div>
                    )}
                </CardBody>
            </Card>
        </div>
    );
};

export default FileUploadWithPreview; 