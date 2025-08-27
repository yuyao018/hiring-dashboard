import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar/Navbar'
import Selection from './components/Selection/Selection'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import './Managejob.css'

const Managejob = () => {
    const jobStatus = ["Active", "Closed", "Draft"]
    const recruitment = ["My Recruitment", "All Recruitment"];
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobsData = async () => {
            try {
                const response = await fetch("http://localhost:4000/allJobs");
                const data = await response.json();

                if (data.success) {
                    setJobs(data.jobs);
                } else {
                    console.error("Failed to fetch jobs");
                }
            } catch (error) {
                console.log("Error fetching jobs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobsData();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
        <div>
            <Navbar/>
            <div className='manageJobContainer'>
                <div className='manageJobSelection'>
                    <div className='jobStatus'>
                        <Selection options={jobStatus} label="Status"/>
                    </div>
                    <div className='recruitment'>
                        <Selection options={recruitment} label="Recruitment"/>
                    </div>
                </div>
                <div className='manageJobTable'>
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="jobs table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Job ID</TableCell>
                                        <TableCell>Job Name</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Created Date</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center">Loading jobs...</TableCell>
                                        </TableRow>
                                    ) : jobs.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center">No jobs found</TableCell>
                                        </TableRow>
                                    ) : (
                                        jobs.map((job, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{job.job_id || 'N/A'}</TableCell>
                                                <TableCell>{job.job || 'N/A'}</TableCell>
                                                <TableCell className={`status-cell ${job.status?.toLowerCase() || ''}`}>
                                                    <span className='status'>{job.status || 'N/A'}</span>
                                                </TableCell>
                                                <TableCell>{formatDate(job.created_at)}</TableCell>
                                                <TableCell>
                                                    <button className='editBtn'>Edit</button>
                                                    <button className='closeBtn'>Close</button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </div>
            </div>
        </div>
    )
}

export default Managejob