import React, { useState, useEffect } from "react";
import { Button, Input, Label, Row, Col, Form } from "reactstrap";
import {
  getSettingContent,
  updateSettingContent,
} from "../../helpers/settingsApi";
import { ShowToast } from "../../components/Toast";

const VendorFAQ = () => {
  const [faqs, setFaqs] = useState([]);

  const fetchSettings = async () => {
    const response = await getSettingContent();
    if (response.type === "success") {
      setFaqs(response.setting.vendorFaqs || []);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleFaqChange = (index, field, value) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index][field] = value;
    setFaqs(updatedFaqs);
  };

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const handleRemoveFaq = (index) => {
    const updatedFaqs = [...faqs];
    updatedFaqs.splice(index, 1);
    setFaqs(updatedFaqs);
  };

  const handleSave = async () => {
    try {
      const response = await updateSettingContent({ vendorFaqs: faqs });
      if (response.type === "success") {
        ShowToast.success("FAQs updated successfully");
        fetchSettings(); // refresh if needed
      } else {
        ShowToast.error(response.message);
      }
    } catch (error) {
      console.error("Failed to save FAQs", error);
      ShowToast.error("An error occurred while saving FAQs");
    }
  };

  return (
    <div className="page-content d-flex flex-column gap-4">
      <h4><i className="bx bx-help-circle" /> Vendor FAQs</h4>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        {faqs.map((faq, index) => (
          <div key={index} className="border p-3 mb-3 rounded">
            <Row className="mb-2 d-flex flex-column gap-3">
              <Col>
                <Label>Question {index + 1}</Label>
                <Input
                  type="text"
                  value={faq.question}
                  onChange={(e) =>
                    handleFaqChange(index, "question", e.target.value)
                  }
                  placeholder="Enter FAQ question"
                  required
                />
              </Col>
              <Col>
                <Label>Answer</Label>
                <Input
                  type="textarea"
                  value={faq.answer}
                  onChange={(e) =>
                    handleFaqChange(index, "answer", e.target.value)
                  }
                  placeholder="Enter FAQ answer"
                  required
                />
              </Col>
            </Row>
            <div className="text-end">
              <Button
                color="danger"
                size="sm"
                onClick={() => handleRemoveFaq(index)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}

        <div className="d-flex gap-3 mb-3">
          <Button color="primary" onClick={handleAddFaq}>
            + Add FAQ
          </Button>
          <Button color="success" type="submit">
            Save All
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default VendorFAQ;
