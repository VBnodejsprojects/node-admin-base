import React, { useState, useEffect } from "react";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Row,
    Col,
    Table,
    Button,
    Input,
    Label,
    Badge,
} from "reactstrap";
import { ShowToast } from "../../components/Toast";

const ProductDetailModal = ({
    isOpen,
    toggle,
    product,
    bookingId,
    productIndex,
    onSave,
    isLoading = false,
}) => {
    const [editedData, setEditedData] = useState({
        quantity: 0,
        discountAmount: 0,
    });
    const [saving, setSaving] = useState(false);

    // Initialize edited data when product changes
    useEffect(() => {
        if (product) {
            setEditedData({
                quantity: product.quantity || 0,
                discountAmount: product.discountAmount ?? product.variant?.discountAmount ?? 0,
            });
        }
    }, [product, isOpen]);

    const handleInputChange = (field, value) => {
        setEditedData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = async () => {
        if (!product || productIndex === null) return;

        // Validation
        const quantity = parseInt(editedData.quantity);
        const discountAmount = parseFloat(editedData.discountAmount);

        if (quantity < 0) {
            ShowToast.error("Quantity cannot be negative");
            return;
        }

        if (discountAmount < 0) {
            ShowToast.error("Discount amount cannot be negative");
            return;
        }

        setSaving(true);
        try {
            await onSave({
                productIndex,
                quantity,
                discountAmount,
            });
        } catch (error) {
            console.error("Error saving product", error);
            ShowToast.error(error?.message || "Failed to update product");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (product) {
            setEditedData({
                quantity: product.quantity || 0,
                discountAmount: product.discountAmount ?? product.variant?.discountAmount ?? 0,
            });
        }
    };

    if (!product) return null;

    const variant = product.variant || {};

    console.log("Rendering ProductDetailModal with product:", product);
    const variantDetails = [
        { label: "Variant Name", value: variant.name || "N/A" },
        { label: "SKU", value: variant.sku || "N/A" },
        { label: "Original Amount", value: `₹${variant.originalAmount ?? product.originalAmount ?? 0}` },
        { label: "Discount Amount", value: `₹${variant.discountAmount ?? product.discountAmount ?? 0}` },
        // { label: "Stock", value: variant.stock ?? "N/A" },
    ];

    const productDetails = [
        { label: "Product Name", value: product.productName || "N/A" },
        // { label: "Product ID", value: product.productId || product.product?._id || "N/A" },
        // { label: "Category", value: product.productCategory?.name || product.categoryName || "N/A" },
        // { label: "Vendor", value: product.vendor?.name || product.vendorName || "N/A" },
        // { label: "Description", value: product.description || "N/A" },
    ];

    return (
        <Modal isOpen={isOpen} toggle={toggle} size="lg" scrollable>
            {/* ── Modal Header ── */}
            <ModalHeader toggle={toggle}>
                <div>
                    <span style={{ fontSize: 14, color: "#94a3b8", display: "block", marginBottom: 4 }}>
                        Product Details
                    </span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
                        {product.productName || "Product"}
                    </span>
                </div>
            </ModalHeader>

            {/* ── Modal Body ── */}
            <ModalBody style={{ background: "#f8fafc", padding: 20 }}>

                {/* Product Information */}
                <div style={{ marginBottom: 20 }}>
                    <h6 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#64748b", marginBottom: 12 }}>
                        Product Information
                    </h6>
                    <div
                        style={{
                            border: "1px solid #e2e8f0",
                            borderRadius: 8,
                            overflow: "hidden",
                        }}
                    >
                        <Table bordered responsive style={{ fontSize: 12, marginBottom: 0 }}>
                            <tbody>
                                {productDetails.map(({ label, value }) => (
                                    <tr key={label}>
                                        <td
                                            style={{
                                                width: "30%",
                                                background: "#f8fafc",
                                                fontWeight: 600,
                                                color: "#475569",
                                                padding: "10px 12px",
                                            }}
                                        >
                                            {label}
                                        </td>
                                        <td style={{ color: "#1e293b", padding: "10px 12px" }}>{value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>

                {/* Variant Information */}
                <div style={{ marginBottom: 20 }}>
                    <h6 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#64748b", marginBottom: 12 }}>
                        Variant Information
                    </h6>
                    <div
                        style={{
                            border: "1px solid #e2e8f0",
                            borderRadius: 8,
                            overflow: "hidden",
                        }}
                    >
                        <Table bordered responsive style={{ fontSize: 12, marginBottom: 0 }}>
                            <tbody>
                                {variantDetails.map(({ label, value }) => (
                                    <tr key={label}>
                                        <td
                                            style={{
                                                width: "30%",
                                                background: "#f8fafc",
                                                fontWeight: 600,
                                                color: "#475569",
                                                padding: "10px 12px",
                                            }}
                                        >
                                            {label}
                                        </td>
                                        <td style={{ color: "#1e293b", padding: "10px 12px" }}>{value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>

                {/* Editable Fields */}
                <div
                    style={{
                        border: "1px solid #dbeafe",
                        borderRadius: 8,
                        padding: 16,
                        background: "#f0f9ff",
                        marginBottom: 20,
                    }}
                >
                    <h6 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#0369a1", marginBottom: 14 }}>
                        Booking Details (Editable)
                    </h6>
                    <Row className="g-3">
                        <Col md={6}>
                            <div>
                                <Label style={{ fontSize: 11, fontWeight: 600, color: "#475569", marginBottom: 6 }}>
                                    Quantity <span style={{ color: "#dc2626" }}>*</span>
                                </Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    min="0"
                                    value={editedData.quantity || ""}
                                    onChange={(e) => handleInputChange("quantity", e.target.value)}
                                    placeholder="Enter quantity"
                                    style={{
                                        fontSize: 13,
                                        borderColor: "#bfdbfe",
                                        padding: "8px 12px",
                                    }}
                                />
                            </div>
                        </Col>
                        <Col md={6}>
                            <div>
                                <Label style={{ fontSize: 11, fontWeight: 600, color: "#475569", marginBottom: 6 }}>
                                    Discount Amount (₹) <span style={{ color: "#dc2626" }}>*</span>
                                </Label>
                                <Input
                                    id="discountAmount"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={editedData.discountAmount || ""}
                                    onChange={(e) => handleInputChange("discountAmount", e.target.value)}
                                    placeholder="Enter discount amount"
                                    style={{
                                        fontSize: 13,
                                        borderColor: "#bfdbfe",
                                        padding: "8px 12px",
                                    }}
                                />
                            </div>
                        </Col>
                    </Row>
                </div>

                {/* Summary */}
                <div
                    style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: 8,
                        padding: 12,
                        background: "#f9fafb",
                    }}
                >
                    <Row className="g-2">
                        <Col xs={6}>
                            <div>
                                <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 600 }}>
                                    Original Amount
                                </span>
                                <div style={{ fontSize: 14, fontWeight: 700, color: "#1f2937" }}>
                                    ₹{product.originalAmount ?? product.variant?.originalAmount ?? 0}
                                </div>
                            </div>
                        </Col>
                        <Col xs={6}>
                            <div>
                                <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 600 }}>
                                    Discount Amount
                                </span>
                                <div style={{ fontSize: 14, fontWeight: 700, color: "#059669" }}>
                                    ₹{editedData.discountAmount}
                                </div>
                            </div>
                        </Col>
                        <Col xs={6}>
                            <div>
                                <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 600 }}>
                                    Final Amount
                                </span>
                                <div style={{ fontSize: 14, fontWeight: 700, color: "#1f2937" }}>
                                    ₹{(editedData.discountAmount || 0)}
                                </div>
                            </div>
                        </Col>
                        <Col xs={6}>
                            <div>
                                <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 600 }}>
                                    Total (Qty × Final Amount)
                                </span>
                                <div style={{ fontSize: 14, fontWeight: 700, color: "#1f2937" }}>
                                    ₹{(editedData.quantity || 0) * (editedData.discountAmount || 0)}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </ModalBody>

            {/* ── Modal Footer ── */}
            <ModalFooter style={{ background: "#f8fafc", padding: 16 }}>
                <Button
                    color="secondary"
                    onClick={handleCancel}
                    disabled={saving}
                    style={{ padding: "8px 20px", fontSize: 13 }}
                >
                    Cancel
                </Button>
                <Button
                    color="success"
                    onClick={handleSave}
                    disabled={saving || isLoading}
                    style={{ padding: "8px 20px", fontSize: 13 }}
                >
                    {saving ? "Saving..." : "Save Changes"}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default ProductDetailModal;
