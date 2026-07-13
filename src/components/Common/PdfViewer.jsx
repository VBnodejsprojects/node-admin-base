import React from 'react';
import { Card, CardBody, Button, Label } from 'reactstrap';

const PdfViewer = ({ 
    documentUrl, 
    title, 
    label, 
    height = "400px",
    showDownloadButton = true 
}) => {
    if (!documentUrl) {
        return (
            <div className="mb-3">
                <Label>{label}</Label>
                <Card className="mt-2">
                    <CardBody className="text-center">
                        <div className="d-flex flex-column align-items-center justify-content-center" 
                             style={{ 
                                 height: height, 
                                 backgroundColor: "#f8f9fa",
                                 border: "2px dashed #dee2e6",
                                 borderRadius: "8px"
                             }}>
                            <i className="bx bx-file-pdf text-muted fs-1 mb-2"></i>
                            <h6 className="text-muted mb-0">Document not provided</h6>
                        </div>
                    </CardBody>
                </Card>
            </div>
        );
    }

    return (
        <div className="mb-3">
            <Label>{label}</Label>
            <Card className="mt-2">
                <CardBody className="text-center">
                    <iframe
                        src={documentUrl}
                        title={title}
                        style={{ 
                            width: "100%", 
                            height: height, 
                            border: "1px solid #ddd",
                            borderRadius: "8px"
                        }}
                    />
                    {showDownloadButton && (
                        <div className="mt-2">
                            <Button 
                                color="primary" 
                                size="sm"
                                onClick={() => window.open(documentUrl, '_blank')}
                            >
                                <i className="bx bx-download me-1"></i>
                                Download PDF
                            </Button>
                        </div>
                    )}
                </CardBody>
            </Card>
        </div>
    );
};

export default PdfViewer; 