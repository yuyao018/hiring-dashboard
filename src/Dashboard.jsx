import { useState, useEffect } from 'react'
import Navbar from './components/Navbar/Navbar'
import Selection from './components/Selection/Selection'
import Card from './components/Card/Card'
import { Link } from 'react-router-dom'
import Button from '@mui/material/Button'
import { FaDownload } from "react-icons/fa";
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper, Typography } from "@mui/material";
import './Dashboard.css'

const Dashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [applicants, setApplicants] = useState([]);
    const [selectedApplicantIndex, setSelectedApplicantIndex] = useState(null);
    const [animatedPercent, setAnimatedPercent] = useState(0);
    const jobStatus = ["Active", "Closed", "Draft"];
    // const applicationStatus = ["Applied", "Shortlisted", "Interview", "Offer", "Hired", "Rejected"];
    const applicationStatus = ["Shortlisted", "Rejected"];
    const recruitment = ["My Recruitment", "All Recruitment"];
    const [selectedJob, setSelectedJob] = useState("");
    const RESUME_BASE_URL = process.env.RESUME_UPLOAD_PATH;

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await fetch("http://localhost:4000/jobs"); // ✅ call backend API
                const data = await res.json();

                if (data.success) {
                    setJobs(data.jobs); // ✅ jobs come from backend
                } else {
                    console.error("Failed to fetch jobs");
                }
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };

        const fetchApplicants = async () => {
            try {
                const res = await fetch("http://localhost:4000/applicants", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" }
                });
                const data = await res.json();

                if (data.success) {
                    setApplicants(data.applicants);
                } else {
                    console.error("Failed to fetch applicants");
                }
            } catch (error) {
                console.error("Error fetching applicants:", error);
            }
        };

        fetchJobs();
        fetchApplicants();
    }, []);

    // Reset selected applicant when job filter changes
    useEffect(() => {
        setSelectedApplicantIndex(null);
    }, [selectedJob]);

    // Animate circular progress when selected applicant (or their score) changes
    useEffect(() => {
        const filtered = !selectedJob ? applicants : applicants.filter(a => a.job_name === selectedJob);
        const selected = selectedApplicantIndex === null ? null : filtered[selectedApplicantIndex];
        const target = selected ? Math.max(0, Math.min(100, Math.round(Number(selected.score) || 0))) : 0;

        let animationFrameId;
        let startTimestamp = null;
        const durationMs = 700;
        const startValue = animatedPercent;

        const step = (timestamp) => {
            if (startTimestamp === null) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / durationMs, 1);
            const value = Math.round(startValue + (target - startValue) * progress);
            setAnimatedPercent(value);
            if (progress < 1) {
                animationFrameId = requestAnimationFrame(step);
            }
        };

        animationFrameId = requestAnimationFrame(step);
        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedApplicantIndex, selectedJob, applicants]);

    const formatDateTime = (value) => {
        if (!value) return '';
        const date = new Date(value);
        if (isNaN(date.getTime())) return String(value);
        const datePart = date.toLocaleDateString();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${datePart} ${hours}:${minutes}`;
    };

    return (
        <div>
            <Navbar/>
            <div className='headerContainer'>
                <div className='dashboardTitle'>
                    <h1>Dashboard</h1>
                </div>
                <div className='jobBtnGroup'>
                    <div className='manageJob'>
                        <Link to='/manageJob'>Manage job</Link>
                    </div>
                    <div className='createJob'>
                        <Link to='/Form'>Create job</Link>
                    </div>
                </div>
            </div>
            <div className='recruiterTools'>
                <div className='jobs'>
                    <Selection
                        options={["All Jobs", ...jobs.map(job => job.job)]}
                        label="Job"
                        value={selectedJob || "All Jobs"}
                        onChange={(e) => setSelectedJob(e.target.value === "All Jobs" ? "" : e.target.value)}
                    />
                </div>
                <div className='applicationStatus'>
                    <Selection options={applicationStatus} label="Application Status"/>
                </div>
                <div className='Recruitment'>
                    <Selection options={recruitment} label="Recruitment"/>
                </div>
            </div>
            <div className='resumeContainer'>
                {(() => { const filteredApplicants = !selectedJob ? applicants : applicants.filter(a => a.job_name === selectedJob); return (
                <div className='list'>
                    <h3>{filteredApplicants.length} Applicants</h3>
                    <div className='cardsWrapper'>
                        {filteredApplicants.length === 0 ? (
                            <p>No applicants found.</p>
                        ) : (
                            filteredApplicants
                                .map((applicant, index) => (
                                <div key={index} onClick={() => setSelectedApplicantIndex(index)} style={{cursor: 'pointer'}}>
                                    <Card
                                        jobName={applicant.job_name || applicant.role_applied}
                                        applicantName={applicant.applicant_name}
                                        appliedAt={applicant.created_at}
                                    />
                                </div>
                                ))
                        )}
                    </div>
                </div>
                )})()}
                <div className='detail'>
                    <div className='buttonGroup'>
                        <Button variant='outlined' color='success' className='shortlistBtn'>Shortlist</Button>
                        <Button variant='outlined' color='error' className='RejectBtn'>Reject</Button>
                    </div>

                    {(() => {
                        const filtered = !selectedJob ? applicants : applicants.filter(a => a.job_name === selectedJob);
                        if (selectedApplicantIndex === null || !filtered[selectedApplicantIndex]) return null;
                        const selected = filtered[selectedApplicantIndex];

                        return (
                            <div className='applicantInfo'>
                                <div className='applicantInfo-grid1'>
                                    <h3>{String(selected.applicant_name)}</h3>
                                    <p>{String(selected.job_name)}</p>
                                </div>
                                <div className='applicantInfo-grid2'><p><strong>Applied on</strong><br/>{String(formatDateTime(selected.created_at))}</p></div>
                            </div>
                        );
                    })()}

                    <div className='resultContainer'>
                        {(() => {
                            const filtered = !selectedJob ? applicants : applicants.filter(a => a.job_name === selectedJob);
                            if (selectedApplicantIndex === null || !filtered[selectedApplicantIndex]) {
                                return <div className='score'><p>Please select an applicant ...</p></div>;
                            }
                            const selected = filtered[selectedApplicantIndex];
                            console.log('Selected applicant:', selected);
                            const percent = Math.max(0, Math.min(100, Math.round(Number(selected.score) || 0)));
                            return (
                                <div className='score'>
                                    <h4 className='score-section'>Total Score</h4>
                                    <div className='circular' style={{"--value": `${animatedPercent}`}}>
                                        <span>{animatedPercent}%</span>
                                    </div>
                                </div>
                            );
                        })()}

                        {(() => {
                            const filtered = !selectedJob ? applicants : applicants.filter(a => a.job_name === selectedJob);
                            if (selectedApplicantIndex === null || !filtered[selectedApplicantIndex]) return null;
                            const selected = filtered[selectedApplicantIndex];

                            let applicant_personality = '';
                            // Prefer direct field from DB if available
                            if (selected.personality_type) {
                                applicant_personality = String(selected.personality_type);
                            } else {
                                // Fallback: parse prior personality JSON structure if present
                                try {
                                    const p = typeof selected.personality === 'string' ? JSON.parse(selected.personality) : selected.personality;
                                    applicant_personality = p && (p.mbti || p.MBTI || p.type) ? (p.mbti || p.MBTI || p.type) : '';
                                } catch (e) {
                                    applicant_personality = '';
                                }
                            }

                            let breakdown = null;
                            if (selected.compatibility_breakdown) {
                                try {
                                    breakdown = typeof selected.compatibility_breakdown === 'string'
                                        ? JSON.parse(selected.compatibility_breakdown)
                                        : selected.compatibility_breakdown;
                                } catch {
                                    breakdown = null;
                                }
                            }
                            return (
                                <div className='breakdown'>
                                    <h4 className='breakdown-section'>Score Summary</h4>
                                    <TableContainer component={Paper} sx={{ maxWidth: 600, margin: "auto", mt: 2, boxShadow: "none" }}>
                                        <Table size='small' sx={{ width: "100%" }}>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell><strong>Personality</strong></TableCell>
                                                    <TableCell>{applicant_personality}</TableCell>
                                                </TableRow>

                                                <TableRow>
                                                    <TableCell><strong>Education Qualification</strong></TableCell>
                                                    <TableCell>{breakdown.qualification}</TableCell>
                                                </TableRow>

                                                <TableRow>
                                                    <TableCell><strong>Required Skills</strong></TableCell>
                                                    <TableCell>{Math.round(breakdown.skills * 100)}% matches</TableCell>
                                                </TableRow>

                                                <TableRow>
                                                    <TableCell><strong>Grades</strong></TableCell>
                                                    <TableCell>{Math.round(breakdown.grades * 4)} CGPA</TableCell>
                                                </TableRow>

                                                <TableRow>
                                                    <TableCell><strong>Achievements</strong></TableCell>
                                                    <TableCell>
                                                    {breakdown.achievements === 0 ? "N/A" : breakdown.achievements}
                                                    </TableCell>
                                                </TableRow>

                                                <TableRow>
                                                    <TableCell><strong>Projects Done</strong></TableCell>
                                                    <TableCell>{breakdown.projects === 0 ? "N/A" : breakdown.projects}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>
                            );
                        })()}
                    </div>
                    {(() => {
                        const filtered = !selectedJob ? applicants : applicants.filter(a => a.job_name === selectedJob);
                        if (selectedApplicantIndex === null || !filtered[selectedApplicantIndex]) return null;
                        const selected = filtered[selectedApplicantIndex];

                        return (
                            <div className='contactInfo'>
                                <h4 className='contactInfo-section'>Applicant's Contact Information</h4>
                                <TableContainer component={Paper} sx={{ maxWidth: "100%", margin: "auto", mt: 1, boxShadow: "none" }}>
                                    <Table sx={{ width: "100%" }}>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell sx={{ width: "25%" }}><strong>Contact Number</strong></TableCell>
                                                <TableCell sx={{ width: "75%" }}>{String(selected.contact_number)}</TableCell>
                                            </TableRow>

                                            <TableRow>
                                                <TableCell sx={{ width: "25%" }}><strong>Email Address</strong></TableCell>
                                                <TableCell sx={{ width: "75%" }}>{String(selected.email)}</TableCell>
                                            </TableRow>

                                            <TableRow>
                                                <TableCell sx={{ width: "25%" }}><strong>House Address</strong></TableCell>
                                                <TableCell sx={{ width: "75%" }}>{String(selected.address)}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        );
                        })()}

                        {(() => {
                        const filtered = !selectedJob ? applicants : applicants.filter(a => a.job_name === selectedJob);
                        if (selectedApplicantIndex === null || !filtered[selectedApplicantIndex]) return null;
                        const selected = filtered[selectedApplicantIndex];
                        const resumeUrl = `${process.env.REACT_APP_RESUME_BASE_URL}/${selected.resume}`;
                        console.log(resumeUrl)

                        return (
                            <div className='resumeDownload'>
                                <div>
                                    <p>For more information, click to download Applicant's Resume</p>
                                </div>
                                <div>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        startIcon={<FaDownload />}
                                        href={`http://localhost:4000/resumes/${selected.resume}`}
                                        download
                                    >
                                        Download
                                    </Button>
                                </div>
                            </div>
                        );
                        })()}
                </div>
            </div>
        </div>
    )
}

export default Dashboard