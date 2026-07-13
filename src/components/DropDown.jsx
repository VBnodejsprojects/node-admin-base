import React from "react";
import { Col } from "reactstrap";

const DropDown = ({ options, value, setFunction, colSize = 12 }) => {
    return (
        <Col sm={colSize}>
            <select
                className="form-select pageSize mb-2"
                value={value}
                onChange={(e) => setFunction(e.target.value)}
            >
                {options.map((item) => (
                    <option key={item.id} value={item.id}>
                        {item.label}
                    </option>
                ))}
            </select>
        </Col>
    );
}

export default DropDown;
