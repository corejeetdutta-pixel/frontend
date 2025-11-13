import React, { useRef, useState, useEffect } from 'react';
import './ResumeEnhanceMain.css';
import resumePreview from './../../assets/enhance-banner.png'; // 👉 replace with your actual image
import { FaCheckCircle, FaSpinner, FaDownload } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from "react-bootstrap";

const STEPS = [
    { label: 'Improving Content and Readability' },
    { label: 'Optimizing ATS Keywords' },
    { label: 'Enhancing Section Formatting' },
    { label: 'Refining Overall Presentation' },
    { label: "Finalizing & Saving Changes" }
];




const ResumeEnhanceMain = () => {
    const [file, setFile] = useState(null);
    const [enhancingResume, setEnhancingResume] = useState(false)
    const [currentStep, setCurrentStep] = useState(0);
    const [finished, setFinished] = useState(false);
    const [atsScore, setAtsScore] = useState(0);
    const [resumeId, setResumeId] = useState('')
    const [fetchingEnhancements, setFetchingEnhancements] = useState(true)
    //const userId = "70829b7a-17dc-46d5-b01e-815e44b35292"
    
    const [showModal, setShowModal] = useState(false);
    const [enhancementsRemaining, setEnhancementsRemaining] = useState(null);
    const navigate = useNavigate()
    const [userId, setUserId] = useState("");
    
        useEffect(()=> {
            
            if(localStorage.getItem('user')){
                const user = JSON.parse(localStorage.getItem('user'));
                setUserId(user.userId)
            }else{
                navigate("/login")
            }
        },[])

        function ScoreSkeleton() {
    return (
        <div className="score-skeleton">
            <div className="skeleton-gauge" />
            <div className="skeleton-bars">
                <div className="skeleton-bar" />
                <div className="skeleton-bar" />
                <div className="skeleton-bar" />
            </div>
        </div>
    );
}

function ScoreCard({ atsScore = 75, resumeId }) {
    const [animatedScore, setAnimatedScore] = useState(0);
    const animationRef = useRef();
    const navigate = useNavigate()

    // get label & color
    const getColor = (score) => {
        if (score >= 75) return '#28c76f';
        if (score >= 50) return '#ffa800';
        return '#fc424a';
    };
    const getLabel = (score) => {
        if (score >= 75) return 'Good Match';
        if (score >= 50) return 'Needs Improvement';
        return 'Poor Match';
    };

    useEffect(() => {
        let start = 0, end = atsScore, duration = 1200, startTime = null;
        function animateScore(ts) {
            if (!startTime) startTime = ts;
            let progress = Math.min((ts - startTime) / duration, 1);
            let value = Math.floor(progress * (end - start) + start);
            setAnimatedScore(value);
            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animateScore);
            } else {
                setAnimatedScore(end);
            }
        }
        animationRef.current = requestAnimationFrame(animateScore);
        return () => animationRef.current && cancelAnimationFrame(animationRef.current);
    }, [atsScore]);

    // Arc calculation (251.2 = full arc length)
    const arcLength = 251.2;
    const animatedArc = (animatedScore / 100) * arcLength;

    return (
        <div className="score-card-enhanced sticky-card-shadow">
            <div className="score-gauge-enhanced">
                <svg viewBox="0 0 200 120" className="score-gauge-svg">
                    {/* Track */}
                    <path
                        d="M 20 100 A 80 80 0 0 1 180 100"
                        fill="none"
                        stroke="#eef1f7"
                        strokeWidth="22"
                        strokeLinecap="round"
                    />
                    {/* Animated Arc */}
                    <path
                        d="M 20 100 A 80 80 0 0 1 180 100"
                        fill="none"
                        stroke={getColor(animatedScore)}
                        strokeWidth="22"
                        strokeLinecap="round"
                        strokeDasharray={`${animatedArc} 251.2`}
                        className="gauge-arc-animated"
                    />
                </svg>
                <div className="score-value-enhanced">
                    <span className="score-number-animated" style={{ color: getColor(animatedScore) }}>
                        {animatedScore}
                    </span>
                    <span className="score-label-animated" key={getLabel(animatedScore)}>
                        {getLabel(animatedScore)}
                    </span>
                </div>
            </div>
            <div className="score-detail-modern">
                <div className="detail-block">
                    <div className="detail-title">Content</div>
                    <div className="detail-bar" style={{ width: `${65 + animatedScore / 3}%`, background: getColor(animatedScore) }} />
                </div>
                <div className="detail-block">
                    <div className="detail-title">ATS Match</div>
                    <div className="detail-bar" style={{ width: `${animatedScore}%`, background: getColor(animatedScore) }} />
                </div>
                <div className="detail-block">
                    <div className="detail-title">Tailoring</div>
                    <div className="detail-bar" style={{ width: `${50 + animatedScore / 2}%`, background: getColor(animatedScore) }} />
                </div>
            </div>
            <button className="resumeenhance-btn-primary-download" onClick={() => navigate(`/download-resume?resumeId=${resumeId}`)}>
                Download Resume
            </button>
        </div>
    );
}

    useEffect(() => {
        const fetchEnhancements = async () => {
            if(!userId) return;
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL_NODE}/check-enhancements`, {
                    params: { userId },
                });

                if (!res.data.success || res.data.enhancementsRemaining <= 0) {
                    setShowModal(true);
                    setEnhancementsRemaining(0);
                } else {
                    setEnhancementsRemaining(res.data.enhancementsRemaining);
                }
                setFetchingEnhancements(false)
            } catch (err) {
                console.error("Error checking enhancements:", err);
            }
        };
        fetchEnhancements();
    }, [userId]);


    const handleFileUpload = (event) => {
        const uploadedFile = event.target.files[0];
        if (uploadedFile) setFile(uploadedFile);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];
        if (droppedFile) setFile(droppedFile);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleEnhanceClick = async () => {
        if (!file) return alert("Please upload a resume.");
        let interval;

        setFetchingEnhancements(true)

        try {
            const check = await axios.get(`${import.meta.env.VITE_BACKEND_URL_NODE}/check-enhancements`, {
                params: { userId },
            });

            if (!check.data.success || check.data.enhancementsRemaining <= 0) {
                setShowModal(true);
                return;
            }
        } catch (err) {
            console.error("Error verifying enhancements:", err);
            setShowModal(true);
            return;
        }
        setFetchingEnhancements(false)

        setEnhancingResume(true)
        setFinished(false);
        setCurrentStep(0);

        // ⏳ Step progress animation
        interval = setInterval(() => {
            setCurrentStep(prev => {
                if (prev < STEPS.length - 1) return prev + 1;
                clearInterval(interval);
                return prev;
            });
        }, 3000);
        try {
            const formData = new FormData();
            formData.append("resumeFile", file);
            formData.append("userId", userId);

            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL_NODE}/enhance-resume`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setAtsScore(res.data?.data?.atsScore || 0);
            setResumeId(res.data?.data?.resumeId || '');

            // ✅ Finalize progress animation
            clearInterval(interval);
            interval = setInterval(() => {
                setCurrentStep(prev => {
                    if (prev < STEPS.length - 1) return prev + 1;
                    clearInterval(interval);
                    setFinished(true);
                    return prev;
                });
            }, 1000);

        } catch (err) {
            console.error(err);
            alert("Error enhancing resume.");
        }
    }

    const noEnhancementsModal = () => {

        return (
            <Modal show={showModal} onHide={null} centered>
                <Modal.Header style={{ borderBottom: "none" }}>
                    <Modal.Title style={{ color: "#0160A4", fontWeight: "700" }}>
                        No Resume Enhancements Left
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ textAlign: "center", padding: "30px" }}>
                    <p style={{ color: "#334155", fontSize: "16px", marginBottom: "24px" }}>
                        You’ve reached your limit of resume enhancements for your current plan.
                        Upgrade your plan to unlock more resume slots and features.
                    </p>
                    <Button
                        variant="primary"
                        style={{
                            backgroundColor: "#0160A4",
                            border: "none",
                            padding: "10px 22px",
                            borderRadius: "8px",
                            fontWeight: "600",
                        }}
                        onClick={() => {
                            setShowModal(false);
                            // Redirect or open upgrade page
                            navigate("/");
                        }}
                    >
                        Upgrade Plan
                    </Button>
                </Modal.Body>
            </Modal>
        )
    }

    const onOpenEnhanceWithJobDesc = () => {
        navigate("/dummy")
    }


    return (
        <div>
            {fetchingEnhancements ? (
                <div>
                    Loading...
                </div>
            ) : (
                enhancingResume ? (
                    <div className="enhancer-fullscreen-layout">
                        <div className="score-sticky-container">
                            <div className="score-sticky-inner">
                                {!finished ? (
                                    <ScoreSkeleton />
                                ) : (
                                    <ScoreCard atsScore={atsScore} resumeId={resumeId} />
                                )}
                            </div>
                        </div>
                        <div className="enhancer-right-scrollable">
                            <div className="enhancer-section">
                                <h2 className="enhancer-title">Resume Enhancement in Progress</h2>
                                <p className="enhancer-subtitle">Your resume is being optimized...</p>
                                <div className="enhancer-steps">
                                    {STEPS.map((step, idx) => (
                                        <div
                                            key={step.label}
                                            className={`enhancer-step${idx < currentStep ? ' complete' : ''}${idx === currentStep && !finished ? ' current' : ''}`}>
                                            <div className="enhancer-step-icon">
                                                {idx < currentStep ? (
                                                    <FaCheckCircle className="icon-check" />
                                                ) : idx === currentStep && !finished ? (
                                                    <FaSpinner className="icon-spinner" />
                                                ) : (
                                                    <span className="step-dot"></span>
                                                )}
                                            </div>
                                            <span className="enhancer-step-label">{step.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Resume Templates */}

                            {/* ATS Explainer */}
                            <div className="enhancer-section">
                                <h3 className="section-head">What is ATS?</h3>
                                <p className="section-desc">
                                    ATS stands for Applicant Tracking System, a software used by employers to filter and rank job applications automatically.
                                </p>
                            </div>
                            <div className="enhancer-section">
                                <h3 className="section-head">Why Optimize for ATS?</h3>
                                <ul className="section-list">
                                    <li>Increases your chances of getting shortlisted</li>
                                    <li>Ensures your resume is readable by employers' systems</li>
                                    <li>Highlights matching skills and experience for your applied role</li>
                                    <li>Prevents common mistakes that could lead to automatic rejection by the system</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="resumeenhance-hero">
                        <div className="resumeenhance-left">
                            <h1 className="resumeenhance-title">
                                Boost Your Resume’s <span>ATS Score</span> Instantly
                            </h1>
                            <p className="resumeenhance-desc">
                                Our AI-powered engine enhances your resume to meet top ATS standards—including keyword relevance, formatting, and structure—to help you pass screening filters and stand out to recruiters.
                            </p>

                            <div className="resumeenhance-two-options">
                                {/* Option 1: Upload + Enhance as before */}
                                <div className="resumeenhance-option-card">
                                    <div className="resumeenhance-option-title">Enhance Resume Only</div>
                                    <div
                                        className="resumeenhance-upload"
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                    >
                                        <input
                                            type="file"
                                            id="resume-upload"
                                            className="resumeenhance-file-input"
                                            onChange={handleFileUpload}
                                            accept=".pdf,.doc,.docx"
                                        />
                                        <label htmlFor="resume-upload" className="resumeenhance-upload-label">
                                            {file ? (
                                                <span className="resumeenhance-file-name">📄 {file.name}</span>
                                            ) : (
                                                <>
                                                    <span className="resumeenhance-upload-icon">⬆️</span>
                                                    <p>Drag & Drop your resume here or <strong>browse</strong></p>
                                                    <small>Supported formats: PDF, DOC, DOCX</small>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                    {file && (
                                        <button
                                            className="resumeenhance-btn-primary"
                                            onClick={handleEnhanceClick}
                                            disabled={fetchingEnhancements}
                                        >
                                            {fetchingEnhancements ? "Loading..." : "Enhance My Resume"}
                                        </button>
                                    )}
                                </div>

                                {/* Option 2: Enhance with Job Description */}
                                <div className="resumeenhance-option-card">
                                    <div>
                                        <div className="resumeenhance-option-title">Enhance With Job Description</div>
                                        <div className="resumeenhance-job-desc-cta">
                                            <p className="resumeenhance-job-desc-note">
                                                Get a personalized resume tailored for a specific job. Paste or upload your job description for best matching.
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        className="resumeenhance-btn-primary"
                                        style={{ width: "100%" }}
                                        onClick={onOpenEnhanceWithJobDesc}
                                    >
                                        Enhance With Job Description
                                    </button>
                                </div>
                            </div>

                            <div className="resumeenhance-hero-lefttext">
                                {enhancementsRemaining} Enhancements Left
                            </div>
                        </div>
                        <div className="resumeenhance-right">
                            <img src={resumePreview} alt="Resume Enhancement Preview" className="resumeenhance-image" />
                        </div>
                    </div>
                )
            )}
            {noEnhancementsModal()}
        </div>
    );
};

export default ResumeEnhanceMain;
