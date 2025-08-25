import React from 'react';
import './Selection.css';

const Selection = ({ options, label, value, onChange }) => (
    <div className="selection">
        {label && <label>{label}</label>}
        <select value={value} onChange={onChange}>
            {options.map((option, idx) => (
                <option key={idx} value={option}>{option}</option>
            ))}
        </select>
    </div>
);

export default Selection;