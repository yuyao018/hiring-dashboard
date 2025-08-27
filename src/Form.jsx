import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import Selection from './components/Selection/Selection'
import { FaPlus, FaTrash } from "react-icons/fa"
import Button from "@mui/material/Button"
import './Form.css'

const Form = () => {
    const jobType = ["Full-time", "Part-time", "Contract", "Internship"];
    const experience = ["No experience", "Fresh Graduates", "1+ year", "2–3 years", "3–5 years", "5+ years"]
    const [requirements, setRequirements] = useState([""]);

    const addRequirement = () => setRequirements(prev => [...prev, ""]);
    const removeRequirement = (index) => setRequirements(prev => prev.filter((_, i) => i !== index));
    const updateRequirement = (index, value) => setRequirements(prev => prev.map((v, i) => i === index ? value : v));

    return (
        <div>
            <Navbar/>
            <div className='formContainer'>
                <h2 className='formTitle'>Create Job for</h2>
                <div className='row'>
                    <div className='jobTitleInput'>
                        <label htmlFor="jobTitle" className='jobTitleLabel'>Job Title</label><br />
                        <input type="text" id="jobTitle" className='jobTitleBox' />
                    </div>
                    <div className='jobTypeInput'>
                        <Selection options={jobType} label="Job Type" />
                    </div>
                </div>
                <div className='row'>
                    <div className='educationInput'>
                        <label htmlFor="educationTitle" className='educationTitleLabel'>Education Qualification</label><br />
                        <input type="text" id="educationTitle" className='educationTitleBox' />
                    </div>
                    <div className='experienceInput'>
                        <Selection options={experience} label="Experience Required" />
                    </div>
                </div>
                <div className='overviewInput'>
                    <label htmlFor="overviewTitle" className='overviewTitleLabel'>Role Overview</label><br />
                    <textarea id="overviewTitle" className='overviewTitleBox' rows="5" cols="180" />
                </div>
                <div className='requirementInput'>
                    <div className='requirementHeader'>
                        <label htmlFor="requirementTitle" className='requirementTitleLabel'>Requirements</label>
                        <button type='button' className='addRequirementBtn' onClick={addRequirement} aria-label='Add requirement'><FaPlus/></button>
                    </div>
                    {requirements.map((value, idx) => (
                        <div className='requirementRow' key={idx}>
                            <input
                                type="text"
                                id={`requirementTitle-${idx}`}
                                className='requirementTitleBox'
                                value={value}
                                onChange={(e) => updateRequirement(idx, e.target.value)}
                                placeholder="Enter a requirement"
                            />
                            <button type='button' className='removeRequirementBtn' onClick={() => removeRequirement(idx)} aria-label='Remove requirement'>
                                <FaTrash/>
                            </button>
                        </div>
                    ))}
                </div>
                <div className='publishBtn'>
                    <Button variant='contained'>Publish</Button>
                </div>
            </div>
        </div>
    )
}

export default Form