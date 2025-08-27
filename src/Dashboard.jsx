import { useState, useEffect } from 'react'
import Navbar from './components/Navbar/Navbar'
import Selection from './components/Selection/Selection'
import Card from './components/Card/Card'
import { Link } from 'react-router-dom'
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

    return (
        <div>
            <Navbar/>
            <div className='headerContainer'>
                <div className='dashboardTitle'>
                    <h1>Dashboard</h1>
                </div>
                <div className='createJob'>
                    <Link to='/Form'>Create job</Link>
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
                <div className='jobStatus'>
                    <Selection options={jobStatus} label="Job Status"/>
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
                    <div className='result'>
                        {(() => {
                            const filtered = !selectedJob ? applicants : applicants.filter(a => a.job_name === selectedJob);
                            if (selectedApplicantIndex === null || !filtered[selectedApplicantIndex]) {
                                return <div className='score'><p>Please select an application ...</p></div>;
                            }
                            const selected = filtered[selectedApplicantIndex];
                            console.log('Selected applicant:', selected);
                            const percent = Math.max(0, Math.min(100, Math.round(Number(selected.score) || 0)));
                            return (
                                <div className='score'>
                                    <div className='circular' style={{"--value": `${animatedPercent}`}}>
                                        <span>{animatedPercent}%</span>
                                    </div>
                                </div>
                            );
                        })()}
                        <div className='personality'>
                            {(() => {
                                const filtered = !selectedJob ? applicants : applicants.filter(a => a.job_name === selectedJob);
                                if (selectedApplicantIndex === null || !filtered[selectedApplicantIndex]) return null;
                                const selected = filtered[selectedApplicantIndex];
                                let mbti = '';
                                // Prefer direct field from DB if available
                                if (selected.personality_type) {
                                    mbti = String(selected.personality_type);
                                } else {
                                    // Fallback: parse prior personality JSON structure if present
                                    try {
                                        const p = typeof selected.personality === 'string' ? JSON.parse(selected.personality) : selected.personality;
                                        mbti = p && (p.mbti || p.MBTI || p.type) ? (p.mbti || p.MBTI || p.type) : '';
                                    } catch (e) {
                                        mbti = '';
                                    }
                                }
                                return mbti ? <p>MBTI: {mbti}</p> : <p>MBTI: N/A</p>;
                            })()}
                        </div>
                    </div>
                    <div className='col2'>
                        <div className='buttonGroup'>
                            <button className='shortlistBtn'>Shortlist</button>
                            <button className='RejectBtn'>Rejected</button>
                        </div>
                        <div className='resume'></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard