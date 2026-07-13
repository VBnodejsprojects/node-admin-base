import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { Button } from "reactstrap";

import { getSettingContent, updateSettingContent } from "../../helpers/settingsApi";

import { ShowToast } from "../../components/Toast";

import Tabs from "../../components/Tabs";

const VendorSettings = () => {
  const tabFieldMap = {
    1: "vendorAbout",
    2: "vendorTerms", // Or use another field if you define one
    3: "vendorPrivacy",
    4: "vendorInvoiceTerms",
  };

  const tabs = [
    { label: "About Us", id: "1" },
    { label: "Terms Content", id: "2" },
    { label: "Privacy", id: "3" },
    { label: "Invoice Terms", id: "4" },
  ];

  const [value, setValue] = useState("");
  const [activeTab, setActiveTab] = useState("1");
  const [settings, setSettings] = useState({});

  const toggleCustom = (tabId) => {
    setActiveTab(tabId);
  };

  const fetchSettings = async () => {
    const response = await getSettingContent();
    console.log("Settings response:", response);
    if (response.type === "success") {
      setSettings(response.setting);
    }
  };

  const handleSave = async () => {
    const field = tabFieldMap[activeTab];
    const updatedSetting = {
      ...settings,
      [field]: value,
    };
    const response = await updateSettingContent(updatedSetting);
    if (response.type === "success") {
      ShowToast.success("Settings saved successfully!");
      fetchSettings();
    } else {
      ShowToast.error("Error saving settings");
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    let content = "";
    if (activeTab === "1") content = settings.vendorAbout || "";
    else if (activeTab === "2") content = settings.vendorTerms || "";
    // Or define your actual notifications content
    else if (activeTab === "3") content = settings.vendorPrivacy || "";
    else if (activeTab === "4") content = settings.vendorInvoiceTerms || "";

    setValue(content);
  }, [activeTab, settings]);

  return (
    <div className="page-content d-flex flex-column gap-4">
      <Tabs tabs={tabs} activeTab={activeTab} toggleCustom={toggleCustom} />
      <div style={{ height: "40vh" }}>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={setValue}
          style={{ height: "40vh" }}
        />
      </div>
      <div className="mt-5">
        <Button color="success" className="w-25" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default VendorSettings;
