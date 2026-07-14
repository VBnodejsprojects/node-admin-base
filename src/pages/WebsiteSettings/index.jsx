import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { Button } from "reactstrap";

import { getSettingContent, updateSettingContent } from "../../helpers/settingsApi";

import { ShowToast } from "../../components/Toast";

import Tabs from "../../components/Tabs";

const WebsiteSettings = () => {
  const tabFieldMap = {
    1: "websiteTerms",
    2: "websitePrivacy",
    3: "websiteAbout",
    4: "websiteRefundPolicy",
  };

  const tabs = [
    { label: "Terms & Conditions", id: "1" },
    { label: "Privacy Policy", id: "2" },
    { label: "About Us", id: "3" },
    { label: "Refund & Cancellation Policy", id: "4" },
  ];

  const [value, setValue] = useState("");
  const [activeTab, setActiveTab] = useState("1");
  const [settings, setSettings] = useState({});

  const toggleCustom = (tabId) => {
    setActiveTab(tabId);
  };

  const fetchSettings = async () => {
    const response = await getSettingContent();
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
    setValue(settings[tabFieldMap[activeTab]] || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

export default WebsiteSettings;
