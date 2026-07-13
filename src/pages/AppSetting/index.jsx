import React, { useState, useEffect } from "react";
import { useFormik } from "formik";

import { Form, Input, Label, Button, Row, Col } from "reactstrap";

import { getSettingContent, updateSettingContent } from "../../helpers/settingsApi";
import { ShowToast } from "../../components/Toast";

// This page maps 1:1 to models/setting.js (the single Setting document).
// FAQs live on the FAQ pages; terms/privacy/about live on User/Vendor Settings.
const AppSetting = () => {
  const [settings, setSettings] = useState({});

  const fetchSettings = async () => {
    const response = await getSettingContent();
    if (response?.type === "success") {
      setSettings(response.setting || {});
    }
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      // Support contact details
      chatSupportNumber: settings?.chatSupportNumber || "",
      contactSupportNumber: settings?.contactSupportNumber ?? "",
      whatsappSupportNumber: settings?.whatsappSupportNumber ?? "",
      email: settings?.email || "",
      address: settings?.address || "",
      pincode: settings?.pincode || "",

      // App active toggles
      isAppActiveUserApp: settings?.isAppActiveUserApp ?? true,
      isAppActiveVendorApp: settings?.isAppActiveVendorApp ?? true,
      isAppActiveDeliveryPartnerApp: settings?.isAppActiveDeliveryPartnerApp ?? true,

      // App versions & mandatory-update flags
      userAppVersion: settings?.userAppVersion || "0.0.0",
      vendorAppVersion: settings?.vendorAppVersion || "0.0.0",
      deliveryPartnerAppVersion: settings?.deliveryPartnerAppVersion || "0.0.0",
      userIOSAppVersion: settings?.userIOSAppVersion || "0.0.0",
      vendorIOSAppVersion: settings?.vendorIOSAppVersion || "0.0.0",
      deliveryPartnerIOSAppVersion: settings?.deliveryPartnerIOSAppVersion || "0.0.0",
      isUserAppUpdateMandatory: settings?.isUserAppUpdateMandatory ?? false,
      isVendorAppUpdateMandatory: settings?.isVendorAppUpdateMandatory ?? false,
      isDeliveryPartnerAppUpdateMandatory: settings?.isDeliveryPartnerAppUpdateMandatory ?? false,
      isUserIOSAppUpdateMandatory: settings?.isUserIOSAppUpdateMandatory ?? false,
      isVendorIOSAppUpdateMandatory: settings?.isVendorIOSAppUpdateMandatory ?? false,
      isDeliveryPartnerIOSAppUpdateMandatory: settings?.isDeliveryPartnerIOSAppUpdateMandatory ?? false,

      // Charges & fees
      platformFee: settings?.platformFee ?? 0,
      deliveryCharges: settings?.deliveryCharges ?? 0,
      gstCharges: settings?.gstCharges ?? 0,
      minimumOrderAmount: settings?.minimumOrderAmount ?? 0,

      // Social media links
      facebookUrl: settings?.facebookUrl || "",
      instaUrl: settings?.instaUrl || "",
      telegramUrl: settings?.telegramUrl || "",
      youtubeUrl: settings?.youtubeUrl || "",
      linkedinUrl: settings?.linkedinUrl || "",
      twitterUrl: settings?.twitterUrl || "",
    },

    onSubmit: async (values) => {
      try {
        // Coerce numeric fields; drop empties so Joi number validation doesn't 400.
        const numericFields = [
          "contactSupportNumber", "whatsappSupportNumber",
          "platformFee", "deliveryCharges", "gstCharges", "minimumOrderAmount",
        ];
        const payload = { ...values };
        numericFields.forEach((f) => {
          if (payload[f] === "" || payload[f] === null) delete payload[f];
          else payload[f] = Number(payload[f]);
        });

        const response = await updateSettingContent(payload);
        if (response?.type === "success") {
          ShowToast.success("App settings updated successfully");
          fetchSettings();
        } else {
          ShowToast.error(response?.message || "Something went wrong");
        }
      } catch (error) {
        console.error("Error in form submission:", error);
        ShowToast.error("An error occurred while processing your request.");
      }
    },
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const textField = (name, label, type = "text") => (
    <Col md={6}>
      <div className="mb-3">
        <Label>{label}</Label>
        <Input
          name={name}
          type={type}
          onChange={validation.handleChange}
          onBlur={validation.handleBlur}
          value={validation.values[name] ?? ""}
        />
      </div>
    </Col>
  );

  const toggleField = (name, label) => (
    <Col md={4}>
      <div className="d-flex gap-3 justify-content-between align-items-center mb-3">
        {label}:{" "}
        <div className="form-check form-switch form-switch-md">
          <input
            type="checkbox"
            className="form-check-input"
            onChange={() => validation.setFieldValue(name, !validation.values[name])}
            checked={!!validation.values[name]}
          />
        </div>
      </div>
    </Col>
  );

  return (
    <div className="page-content d-flex flex-column gap-2">
      <h4><i className="bx bx-cog" /> App Setting</h4>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          validation.handleSubmit();
          return false;
        }}
      >
        <h5 className="mb-3">Support Contact</h5>
        <Row>
          {textField("chatSupportNumber", "Chat Support Number")}
          {textField("contactSupportNumber", "Contact Support Number", "number")}
          {textField("whatsappSupportNumber", "WhatsApp Support Number", "number")}
          {textField("email", "Email")}
          {textField("address", "Address")}
          {textField("pincode", "Pincode")}
        </Row>

        <h5 className="mb-3 mt-2">App Versions</h5>
        <Row>
          {textField("userAppVersion", "User App Version")}
          {textField("userIOSAppVersion", "User iOS App Version")}
          {textField("vendorAppVersion", "Vendor App Version")}
          {textField("vendorIOSAppVersion", "Vendor iOS App Version")}
          {textField("deliveryPartnerAppVersion", "Delivery Partner App Version")}
          {textField("deliveryPartnerIOSAppVersion", "Delivery Partner iOS App Version")}
        </Row>

        <h5 className="mb-3 mt-2">Charges & Fees</h5>
        <Row>
          {textField("platformFee", "Platform Fee", "number")}
          {textField("deliveryCharges", "Delivery Charges", "number")}
          {textField("gstCharges", "GST Charges", "number")}
          {textField("minimumOrderAmount", "Minimum Order Amount", "number")}
        </Row>

        <h5 className="mb-3 mt-2">Social Links</h5>
        <Row>
          {textField("facebookUrl", "Facebook URL")}
          {textField("instaUrl", "Instagram URL")}
          {textField("telegramUrl", "Telegram URL")}
          {textField("youtubeUrl", "YouTube URL")}
          {textField("linkedinUrl", "LinkedIn URL")}
          {textField("twitterUrl", "Twitter (X) URL")}
        </Row>

        <h5 className="mb-3 mt-2">App Status</h5>
        <Row>
          {toggleField("isAppActiveUserApp", "User App Active")}
          {toggleField("isAppActiveVendorApp", "Vendor App Active")}
          {toggleField("isAppActiveDeliveryPartnerApp", "Delivery Partner App Active")}
        </Row>

        <h5 className="mb-3 mt-2">Mandatory Update</h5>
        <Row>
          {toggleField("isUserAppUpdateMandatory", "User App Update Mandatory")}
          {toggleField("isUserIOSAppUpdateMandatory", "User iOS Update Mandatory")}
          {toggleField("isVendorAppUpdateMandatory", "Vendor App Update Mandatory")}
          {toggleField("isVendorIOSAppUpdateMandatory", "Vendor iOS Update Mandatory")}
          {toggleField("isDeliveryPartnerAppUpdateMandatory", "Delivery Partner App Update Mandatory")}
          {toggleField("isDeliveryPartnerIOSAppUpdateMandatory", "Delivery Partner iOS Update Mandatory")}
        </Row>

        <Row>
          <Col className="d-flex gap-3 flex-row-reverse">
            <div className="text-end">
              <Button color="success" type="submit" className="save-user">
                Save
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default AppSetting;
