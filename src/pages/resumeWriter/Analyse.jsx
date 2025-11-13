import './Analyse.css';
import { useState, useEffect } from 'react';
import {
    FaExclamationTriangle, FaCheckCircle, FaTimesCircle,
    FaArrowRight, FaInfoCircle, FaSpinner, FaStar
} from 'react-icons/fa';
import { getATSAnalysis } from './services/atsService';
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const Analyse = ({ userId, jobId }) => {
    const [loading, setLoading] = useState(true);
    const [enhancing, setEnhancing] = useState(false);
    const [error, setError] = useState(null);
    const [atsData, setAtsData] = useState(null);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (userId && jobId) {
            fetchATSAnalysis();
        }
    }, [userId, jobId]);

    const fetchATSAnalysis = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getATSAnalysis(userId, jobId);
            const data = response?.data || response;
            const formatted = {
                atsScore: parseInt(data?.atsScore || 0),
                enhancementsRemaining: parseInt(data?.enhancementsRemaining || 0),
            };
            setAtsData(formatted);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to fetch ATS analysis');
        } finally {
            setLoading(false);
        }
    };

    const getScoreCategory = (score) => {
        if (score >= 90) return 'excellent';
        if (score >= 80) return 'good';
        if (score >= 70) return 'average';
        return 'poor';
    };

    const getScoreColor = (score) => {
        if (score >= 90) return '#16a34a';
        if (score >= 80) return '#22c55e';
        if (score >= 70) return '#f59e0b';
        return '#dc2626';
    };

    const getScoreLabel = (score) => {
        if (score >= 90) return 'Excellent Match';
        if (score >= 80) return 'Good Match';
        if (score >= 70) return 'Average Match';
        return 'Poor Match';
    };

    const getStatusText = (score) => {
        if (score >= 90)
            return { title: "Outstanding Resume!", desc: "Your resume is in excellent shape and ready to submit." };
        if (score >= 80)
            return { title: "Good to Apply!", desc: "Your resume is strong. A few tweaks can make it perfect." };
        if (score >= 70)
            return { title: "Needs Improvement", desc: "Your resume is average. Consider refining it to stand out." };
        return { title: "Enhancement Recommended", desc: "Low match detected. Major improvements are suggested." };
    };

    if (loading) {
        return (
            <div className="ats-score-container">
                <div className="loading-container">
                    <FaSpinner className="spinner" />
                    <p>Analyzing your resume...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="ats-score-container">
                <div className="error-container">
                    <FaTimesCircle className="error-icon" />
                    <p>{error}</p>
                    <button onClick={fetchATSAnalysis} className="retry-button">
                        Retry Analysis
                    </button>
                </div>
            </div>
        );
    }

    const handleEnhance = () => {
        if (!userId || !jobId) return;

        const encryptAndSanitize = (value) => {
            const encrypted = CryptoJS.AES.encrypt(
                value.toString(),
                process.env.REACT_APP_SECRET_KEY
            ).toString();
            return encrypted.replace(/\//g, "-").replace(/\+/g, "_");
        };

        const encUserId = encryptAndSanitize(userId);
        const encJobId = encryptAndSanitize(jobId);

        navigate(`/enhnace-resume-jd/${encUserId}/${encJobId}`);
    }


    const enhanceResumeConfirmation = () => {
        return (
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header style={{ borderBottom: "none" }}>
                    <Modal.Title style={{ color: "#0160A4", fontWeight: "700" }}>
                        Confirm Enhancement
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body style={{ textAlign: "center", padding: "30px" }}>
                    <p
                        style={{
                            color: "#334155",
                            fontSize: "16px",
                            marginBottom: "24px",
                        }}
                    >
                        {enhancementsRemaining > 0
                            ? "This will use one enhancement credit. Continue?"
                            : "You have no remaining enhancements. Get a plan to unlock more!"}
                    </p>

                    <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
                        <Button
                            variant="secondary"
                            style={{
                                backgroundColor: "#e5e7eb",
                                color: "#111827",
                                border: "none",
                                padding: "10px 22px",
                                borderRadius: "8px",
                                fontWeight: "600",
                                width: '50%'
                            }}
                            onClick={() => setShowModal(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="primary"
                            style={{
                                backgroundColor: "#0160A4",
                                border: "none",
                                padding: "10px 22px",
                                borderRadius: "8px",
                                fontWeight: "600",
                                width: '50%'
                            }}
                            onClick={() => {
                                setShowModal(false);

                                if (enhancementsRemaining > 0) {
                                    // Proceed with enhancement flow
                                    handleEnhance();
                                } else {
                                    // Redirect to upgrade / plan page
                                    navigate("/");
                                }
                            }}
                        >
                            {enhancementsRemaining > 0 ? "Yes, Enhance" : "Upgrade Plan"}
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        );
    };

    const handleEnhanceClick = () => {
        if (!userId || !jobId) return;

        if (enhancementsRemaining > 0) {
            setShowModal(true)
        } else {
            navigate("/")
        }
    };

    if (!atsData) return null;

    const { atsScore, enhancementsRemaining } = atsData;
    const color = getScoreColor(atsScore);
    const label = getScoreLabel(atsScore);
    const status = getStatusText(atsScore);

    const buttonText =
        enhancementsRemaining > 0
            ? "Enhance Resume"
            : "Enhance Resume (Get plan to unlock more)";

    const isOptimized = atsScore >= 80;

    return (
        <div className="ats-score-container">
            {/* Header */}
            <div className="ats-header">
                <div className="ats-header-icon">
                    <FaExclamationTriangle />
                </div>
                <div className="ats-header-content">
                    <h3 className="ats-title">Resume ATS Analysis</h3>
                    <p className="ats-subtitle">Your resume compatibility score with this job posting</p>
                </div>
            </div>

            {/* Score Display */}
            <div className="ats-score-section">
                <div className="score-gauge-wrapper">
                    <svg className="score-gauge" viewBox="0 0 200 120">
                        <path
                            d="M 20 100 A 80 80 0 0 1 180 100"
                            fill="none"
                            stroke="#e9ecef"
                            strokeWidth="20"
                            strokeLinecap="round"
                        />
                        <path
                            d="M 20 100 A 80 80 0 0 1 180 100"
                            fill="none"
                            stroke={color}
                            strokeWidth="20"
                            strokeLinecap="round"
                            strokeDasharray={`${(atsScore / 100) * 251.2} 251.2`}
                            className="score-arc"
                        />
                    </svg>
                    <div className="score-value">
                        <span className="score-number" style={{ color }}>
                            {atsScore}
                        </span>
                        <span className="score-label">{label}</span>
                    </div>
                </div>

                <div className="score-info">
                    <div className="score-status" style={{ borderColor: color }}>
                        <div className="status-icon" style={{ color }}>
                            {atsScore >= 70 ? <FaCheckCircle /> : <FaTimesCircle />}
                        </div>
                        <div className="status-text">
                            <strong>{status.title}</strong>
                            <p>{status.desc}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Remaining Enhancements */}
            <div className="enhancements-remaining">
                {enhancementsRemaining} Enhancements Left
            </div>

            {/* CTA */}
            {isOptimized ? (
                <div className="ats-disclaimer disclaimer-text">
                    ✅ Your resume is already well optimized (ATS Score ≥ 80).
                    No further enhancement needed.
                </div>
            ) : (
                <>
                    <div className="ats-cta-section">
                        <button className="enhance-button" onClick={handleEnhanceClick} disabled={enhancing}>
                            <span className="button-shine"></span>
                            {enhancing ? (
                                <>
                                    <FaSpinner className="button-icon spinner" />
                                    <span className="button-text">Enhancing...</span>
                                </>
                            ) : (
                                <>
                                    <FaStar className="button-icon" />
                                    <span className="button-text">{buttonText}</span>
                                    <FaArrowRight className="button-arrow" />
                                </>
                            )}
                        </button>
                        <p className="cta-description">
                            AI-powered optimization in under 2 minutes
                        </p>
                    </div>
                    {/* Disclaimer */}
                    <div className="ats-disclaimer">
                        <div className="disclaimer-icon">
                            <FaInfoCircle />
                        </div>
                        <p className="disclaimer-text">
                            <strong>Important Note:</strong> Improving your ATS score increases your chances of getting shortlisted,
                            but does not guarantee job placement.
                        </p>
                    </div>
                </>
            )}

            {enhanceResumeConfirmation()}
        </div>
    );
};

export default Analyse;
