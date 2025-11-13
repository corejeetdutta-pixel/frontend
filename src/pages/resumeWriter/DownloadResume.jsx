import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./DownloadResume.css";
import ResumeTemplates from "./ResumeTemplates";

const DownloadResume = () => {
    const [searchParams] = useSearchParams();
    const resumeId = searchParams.get("resumeId");
    

    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [downloadsRemaining, setDownloadsRemaining] = useState(0)
    const [planType, setPlanType] = useState('basic')
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
        if(!userId) return;
        const fetchResume = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL_NODE}/get-resume?resumeId=${resumeId}&userId=${userId}`);
                const data = await res.json();

                if (data.success && data.data) {
                    setResume(data.data);
                    setDownloadsRemaining(data.downloads_remaining)
                    setPlanType(data.plan_type)
                } else {
                    setError("Resume not found");
                }
            } catch (err) {
                console.error(err);
                setError("Failed to fetch resume");
            } finally {
                setLoading(false);
            }
        };

        if (resumeId && userId) fetchResume();
        else {
            setError("Invalid request");
            setLoading(false);
        }
    }, [resumeId, userId]);

    if (loading) {
        return <div className="resume-loader">Loading resume...</div>;
    }

    if (error) {
        return <div className="resume-error">{error}</div>;
    }

    const getScoreLabel = (score) => {
        if (score >= 75) return "Excellent";
        if (score >= 50) return "Good";
        if (score >= 30) return "Average";
        return "Needs Improvement";
    };


    return (
        <div className="result-container">
            <div className="result-left">
                {/* Plan Info (top-right corner) */}
                <div className="plan-info">
                    <div className="plan-type">{planType?.toUpperCase() || "FREE"}</div>
                    <div className="downloads-remaining">
                        {downloadsRemaining ?? 0} downloads left
                    </div>
                </div>

                <div className="ats-score-section">
                    <h3 className="ats-score-label">ATS Score</h3>
                    <div className="ats-score-card">
                        <div className="ats-score-value">{resume.atsScore}</div>
                        <div className="ats-score-label-text">
                            {getScoreLabel(resume.atsScore)}
                        </div>
                    </div>
                </div>

                <div className="resume-generated-text">
                    <h2>Resume Generated</h2>
                    <p>Your enhanced resume is ready. Explore templates on the right to download.</p>
                </div>
            </div>

            <div className="result-right">
                <ResumeTemplates
                    enhancedText={resume.text}
                    planType={planType}
                    downloadsRemaining={downloadsRemaining}
                    onDownloadsUpdate={(newValue) => setDownloadsRemaining(newValue)}
                    userId={userId}
                />
            </div>
        </div>
    );
};

export default DownloadResume;
