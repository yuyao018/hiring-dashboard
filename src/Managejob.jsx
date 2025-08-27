import React from 'react'
import Navbar from './components/Navbar/Navbar'
import './Managejob.css'

const Managejob = () => {
    return (
        <div>
            <Navbar/>
            <div className='manageJobContainer'>
                <div className='manageJobContent'>
                    <h1>Manage Jobs</h1>
                    <p>Job management interface will be implemented here.</p>
                </div>
            </div>
        </div>
    )
}

export default Managejob