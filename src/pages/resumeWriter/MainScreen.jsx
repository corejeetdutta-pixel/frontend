import React, { useEffect, useState } from "react";
import "./MainScreen.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

const MainScreen = () => {
    const [planData, setPlanData] = useState(null);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [checkingCreations, setCheckingCreations] = useState(false)
    const [checkingDownloads, setCheckingDownloads] = useState(false);
    const [showNoDownloadsModal, setShowNoDownloadsModal] = useState(false)
    // const userId = "2";
    const [userId, setUserId] = useState("");

    useEffect(()=> {
        
        if(localStorage.getItem('user')){
            const user = JSON.parse(localStorage.getItem('user'));
            setUserId(user.userId)
        }else{
            navigate("/login")
        }
    },[])
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // const userId = "2";
                if (!userId) return;

                const [planRes, payRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_BACKEND_URL_NODE}/user-plan/${userId}`),
                    axios.get(`${import.meta.env.VITE_BACKEND_URL_NODE}/payments/${userId}`),
                ]);

                setPlanData(planRes.data.plan);
                setPayments(payRes.data.payments);
            } catch (err) {
                console.error("Error loading dashboard:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [userId]);

    const handleCreateResume = async () => {
        // const userId = 2;
        try {
            setCheckingCreations(true);

            // ✅ Check if user can still create resumes
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL_NODE}/check-creations`, {
                params: { userId },
            });

            if (!res.data.success || res.data.creationsRemaining <= 0) {
                // ❌ No remaining resume creations → show modal
                setShowModal(true);
                return;
            }

            // ✅ Continue to create page if remaining > 0
            navigate("/create-resume");
        } catch (err) {
            console.error("Check Creation Error:", err);
            setShowModal(true);
        } finally {
            setCheckingCreations(false);
        }
    };

    const noCreationsModal = () => {

        return (
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton style={{ borderBottom: "none" }}>
                    <Modal.Title style={{ color: "#0160A4", fontWeight: "700" }}>
                        No Resume Creations Left
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ textAlign: "center", padding: "30px" }}>
                    <p style={{ color: "#334155", fontSize: "16px", marginBottom: "24px" }}>
                        You’ve reached your limit of resume creations for your current plan.
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

    const [checkingEnhancements, setCheckingEnhancements] = useState(false)
    const [showNoEnhancementsModal, setShowNoEnhancementsModal] = useState(false)

    const handleEnhanceResume = async () => {
        // const userId = 2;
        try {
            setCheckingEnhancements(true);

            // ✅ Check if user can still create resumes
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL_NODE}/check-enhancements`, {
                params: { userId },
            });

            if (!res.data.success || res.data.enhancementsRemaining <= 0) {
                // ❌ No remaining resume creations → show modal
                setShowNoEnhancementsModal(true);
                return;
            }

            // ✅ Continue to create page if remaining > 0
            navigate("/enhance-resume");
        } catch (err) {
            console.error("Check Enhancement Error:", err);
            setShowNoEnhancementsModal(true);
        } finally {
            setCheckingEnhancements(false);
        }
    };


    const noEnhancementsModal = () => {

        return (
            <Modal show={showNoEnhancementsModal} onHide={() => setShowNoEnhancementsModal(false)} centered>
                <Modal.Header closeButton style={{ borderBottom: "none" }}>
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
                            setShowNoEnhancementsModal(false);
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

    const handleDownload = async (id) => {
        try {
           // const numericUserId = Number(userId); // ensure integer
            setCheckingDownloads(true);

            // ✅ Check if user can still create resumes
            const checkRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL_NODE}/check-downloads`, {
                params: { userId: userId},
            });

            if (!checkRes.data.success || checkRes.data.downloadsRemaining <= 0) {
                setShowNoDownloadsModal(true);
                return;
            }

            // ✅ Continue to create page if remaining > 0
            navigate(`/download-resume?resumeId=${id}`);
        } catch (err) {
            console.error("Check Download Error:", err);
            setShowNoDownloadsModal(true);
        } finally {
            setCheckingDownloads(false);
        }
    }


    const noDownloadsModal = () => {

        return (
            <Modal show={showNoDownloadsModal} onHide={() => setShowNoDownloadsModal(false)} centered>
                <Modal.Header closeButton style={{ borderBottom: "none" }}>
                    <Modal.Title style={{ color: "#0160A4", fontWeight: "700" }}>
                        No Downloads Remaining
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ textAlign: "center", padding: "30px" }}>
                    <p style={{ color: "#334155", fontSize: "16px", marginBottom: "24px" }}>
                        You’ve used all your available downloads.
                        Upgrade your plan to unlock more resume downloads and templates.
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
                            setShowNoDownloadsModal(false);
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


    if (loading) return <div className="main-loader">Loading dashboard...</div>;
    if (!planData) return <div className="main-error">No plan data found</div>;

    return (
        <div className="main-container">
            <div className="dashboard">
                {/* LEFT SIDE */}
                <div className="left-panel">
                    <div className="resume-history">
                        <h2>Resume History</h2>
                        <div>
                            {planData.resumes && planData.resumes.length > 0 ? (
                                <div className="resumehist-grid">
                                    {planData.resumes.map((resume, index) => {
                                        const formattedDate = new Date(resume.created_at).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        });

                                        return (
                                            <div className="resumehist-card" key={index}>
                                                <div>
                                                    <div>
                                                        {(() => {
                                                            const type = resume.type || "Create";

                                                            const getTypeStyles = (type) => {
                                                                switch (type) {
                                                                    case "Enhance-JD":
                                                                        return {
                                                                            label: "Enhanced (JD Matched)",
                                                                            bg: "#E0F2FE", // light blue
                                                                            color: "#0160A4", // main blue
                                                                        };
                                                                    case "Enhance":
                                                                        return {
                                                                            label: "Enhanced",
                                                                            bg: "#E0FFE4", // light green
                                                                            color: "#059669", // green
                                                                        };
                                                                    case "Create":
                                                                    default:
                                                                        return {
                                                                            label: "Created",
                                                                            bg: "#FFF7E6", // light orange
                                                                            color: "#D97706", // amber/orange
                                                                        };
                                                                }
                                                            };

                                                            const { label, bg, color } = getTypeStyles(type);

                                                            return (
                                                                <span
                                                                    style={{
                                                                        backgroundColor: bg,
                                                                        color,
                                                                        padding: "4px 10px",
                                                                        borderRadius: "8px",
                                                                        fontSize: "12px",
                                                                        fontWeight: 600,
                                                                        display: "inline-block",
                                                                    }}
                                                                    title={`This resume was ${label.toLowerCase()}`}
                                                                >
                                                                    {label}
                                                                </span>
                                                            );
                                                        })()}
                                                    </div>
                                                    <h3 className="resumehist-title">{resume.title || "Untitled Resume"}</h3>
                                                    <p className="resumehist-date">Created on: {formattedDate}</p>
                                                    <p className="resumehist-score">
                                                        ATS Score: <span>{resume.atsScore ?? "N/A"}</span>
                                                    </p>
                                                </div>
                                                <button
                                                    className="resumehist-btn resumehist-btn-primary"
                                                    onClick={() => handleDownload(resume.id)}
                                                    disabled={checkingDownloads || loading}
                                                >
                                                    {checkingCreations ? "Checking..." : "Download"}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>

                            ) : (
                                <div className="resume-empty">No resumes created yet.</div>
                            )}
                        </div>
                    </div>

                    <div className="payment-history">
                        <h2>Transaction History</h2>
                        {payments.length === 0 ? (
                            <p className="empty-state">No transactions yet.</p>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Plan</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.map((pay, i) => (
                                        <tr key={i}>
                                            <td>{new Date(pay.created_at).toLocaleDateString()}</td>
                                            <td>{pay.plan_type}</td>
                                            <td>₹{pay.amount}</td>
                                            <td className={`status ${pay.status}`}>{pay.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="right-panel">
                    <div className="user-plan">
                        <h2>Your Plan</h2>
                        <div className="plan-type">{planData.plan_type}</div>

                        <div className="plan-details">
                            <div>
                                <span>Resume Creations:</span>
                                <strong>{planData.creations_remaining}</strong>
                            </div>
                            <div>
                                <span>Resume Enhancements:</span>
                                <strong>{planData.enhancements_remaining}</strong>
                            </div>
                            <div>
                                <span>Resume Downloads:</span>
                                <strong>{planData.downloads_remaining}</strong>
                            </div>
                        </div>

                        <div className="resume-action-buttons">
                            <button
                                className="resume-btn resume-btn-primary"
                                onClick={handleCreateResume}
                                disabled={loading || checkingCreations}
                            >
                                {checkingCreations ? "Checking..." : "Create Resume"}
                            </button>
                            {/* <button className="resume-btn resume-btn-secondary" onClick={handleEnhanceResume} disabled={loading || checkingEnhancements}>
                                {checkingEnhancements ? "Checking..." : "Enhance Resume"}
                            </button>
                            {planData.plan_type === "organization" && (
                                <button className="resume-btn resume-btn-tertiary">
                                    Analyze Resumes
                                </button>
                            )} */}
                        </div>
                    </div>
                </div>
            </div>
            {noCreationsModal()}
            {noDownloadsModal()}
            {noEnhancementsModal()}
        </div>
    );
};

export default MainScreen;
