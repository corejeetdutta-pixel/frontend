import { useState } from 'react';
import './HomeScreen.css'
import { FaFileAlt, FaPencilAlt, FaCheckCircle, FaSpellCheck, FaEye, FaCrown, FaSearch, FaRobot, FaChartLine, FaUserCheck } from 'react-icons/fa'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);


const HomeScreen = () => {
    const features = [
        {
            icon: <FaFileAlt />,
            title: "Professional Templates",
            description: "Choose from dozens of modern, ATS-friendly resume templates designed by industry experts."
        },
        {
            icon: <FaPencilAlt />,
            title: "AI-Powered Writing",
            description: "Our AI enhances your content with powerful action verbs, quantified achievements, and impact-driven language."
        },
        {
            icon: <FaCheckCircle />,
            title: "ATS Optimization",
            description: "Ensure your resume passes Applicant Tracking Systems with optimized keywords and formatting."
        },
        {
            icon: <FaSpellCheck />,
            title: "Grammar & Style",
            description: "Advanced grammar checking and style improvements to make your resume polished and professional."
        },
        {
            icon: <FaEye />,
            title: "Real-Time Editing",
            description: "See changes instantly with live preview. Edit, customize, and perfect your resume on the fly."
        },
        {
            icon: <FaCrown />,
            title: "Flexible Plans",
            description: "Free basic features with premium templates and AI enhancements available through subscription."
        }
    ];

    const navigate = useNavigate();
    const [redirectingToCheckOut, setRedirectingToCheckOut] = useState('')

    const handleNavigate = (path) => {
        if(localStorage.getItem('user')){
            navigate(`/${path}`);
        }else{
            navigate(`/login`);
        }
        
    };

    const handlePay = async (type) => {
        setRedirectingToCheckOut(type);
        const user = JSON.parse(localStorage.getItem('user')); // 👈 parse the JSON string

        try {
            const payBody = {
                userId: user.userId,
                currency: "inr",
                planType: type
            };

            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL_NODE}/create-checkout-session`, payBody);

            if (data?.url) {
                // ✅ New way: redirect directly to the session URL
                window.location.href = data.url;
            } else {
                throw new Error("Payment session URL not received");
            }

        } catch (error) {
            console.error("Payment error:", error);
            setRedirectingToCheckOut('');
        }
    };

    return (
        <div className="homescreen">
            {/* Inner 1 - Hero Section */}
            <div className="homescreen-inner1">
                <div className="background-overlay"></div>
                <div className="homescreen-content">
                    <div className="homescreen-inner1-div1">
                        AI-Powered Resume Builder
                    </div>
                    <div className="homescreen-inner1-div2">
                        Transform Your Resume from
                        <span className="homescreen-inner1-div2-text1">
                            Good to Great
                        </span>
                    </div>
                    <div className="homescreen-inner1-div3">
                        Create professional, ATS-optimized resumes in minutes. Our AI analyzes job descriptions, enhances your experience, and designs beautiful templates that get you noticed by recruiters.
                    </div>
                    <div className="homescreen-inner1-div4">
                        <div className="homescreen-inner1-div4-button1" onClick={() => handleNavigate("create-resume")}>
                            Create New Resume
                        </div>
                        <div className="homescreen-inner1-div4-button2" onClick={() => handleNavigate("enhance-resume")}>
                            Enhance Your Resume
                        </div>
                    </div>
                    <div className="homescreen-inner1-div5">
                        <div className="homescreen-inner1-div5-sec1">
                            <div className="homescreen-inner1-div5-sec1-text1">
                                100+
                            </div>
                            <div className="homescreen-inner1-div5-sec1-text2">
                                Resumes Created
                            </div>
                        </div>
                        <div className="homescreen-inner1-div5-border"></div>
                        <div className="homescreen-inner1-div5-sec1">
                            <div className="homescreen-inner1-div5-sec1-text1">
                                95%
                            </div>
                            <div className="homescreen-inner1-div5-sec1-text2">
                                ATS Pass Rate
                            </div>
                        </div>
                        <div className="homescreen-inner1-div5-border"></div>
                        <div className="homescreen-inner1-div5-sec1">
                            <div className="homescreen-inner1-div5-sec1-text1">
                                4.9/5
                            </div>
                            <div className="homescreen-inner1-div5-sec1-text2">
                                User Rating
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Inner 2 - Features Section */}
            <div className="homescreen-inner2">
                <div className="homescreen-inner2-header">
                    <h2 className="homescreen-inner2-title">
                        Elevate Your Resume from <span className="highlight">Average to Outstanding</span>
                    </h2>
                    <p className="homescreen-inner2-subtitle">
                        Our AI-powered platform transforms ordinary resumes into standout applications that capture recruiters' attention and secure interviews.
                    </p>
                </div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card">
                            <div className="feature-icon">
                                {feature.icon}
                            </div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Inner 3 - ATS Explanation Section */}
            <div className="homescreen-inner3">
                <div className="ats-section-header">
                    <h2 className="ats-main-title">
                        Understanding <span className="highlight-ats">ATS</span> & Why It Matters
                    </h2>
                    <p className="ats-main-subtitle">
                        Over 98% of Fortune 500 companies use Applicant Tracking Systems to filter resumes. Here's everything you need to know to get past them.
                    </p>
                </div>

                {/* What is ATS */}
                <div className="ats-content-row">
                    <div className="ats-content-left">
                        <div className="ats-icon-box">
                            <FaSearch />
                        </div>
                        <h3 className="ats-content-title">What is an ATS?</h3>
                        <p className="ats-content-description">
                            An Applicant Tracking System (ATS) is software that automates the hiring process for employers. It scans, parses, and ranks resumes based on keywords, skills, and experience before a human ever sees them. Think of it as a gatekeeper that determines if your resume reaches the recruiter's desk.
                        </p>
                        <ul className="ats-bullet-list">
                            <li>Scans and parses resume content into categories</li>
                            <li>Searches for specific keywords and qualifications</li>
                            <li>Ranks candidates based on job requirements</li>
                            <li>Filters out resumes that don't meet criteria</li>
                        </ul>
                    </div>
                    <div className="ats-content-right">
                        <div className="ats-stat-card">
                            <div className="ats-stat-number">98%</div>
                            <div className="ats-stat-label">of Fortune 500 companies use ATS</div>
                        </div>
                        <div className="ats-stat-card">
                            <div className="ats-stat-number">75%</div>
                            <div className="ats-stat-label">of resumes never reach human recruiters</div>
                        </div>
                    </div>
                </div>

                {/* How ATS Works */}
                <div className="ats-content-row ats-content-row-reverse">
                    <div className="ats-content-right ats-visual-section">
                        <div className="ats-process-box">
                            <div className="ats-process-step">
                                <div className="step-number">1</div>
                                <div className="step-content">
                                    <h4>Resume Submission</h4>
                                    <p>Candidate uploads resume to job portal</p>
                                </div>
                            </div>
                            <div className="ats-process-step">
                                <div className="step-number">2</div>
                                <div className="step-content">
                                    <h4>Parsing & Scanning</h4>
                                    <p>ATS extracts and categorizes information</p>
                                </div>
                            </div>
                            <div className="ats-process-step">
                                <div className="step-number">3</div>
                                <div className="step-content">
                                    <h4>Keyword Matching</h4>
                                    <p>System matches resume to job description</p>
                                </div>
                            </div>
                            <div className="ats-process-step">
                                <div className="step-number">4</div>
                                <div className="step-content">
                                    <h4>Ranking & Filtering</h4>
                                    <p>Candidates ranked by relevance score</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="ats-content-left">
                        <div className="ats-icon-box">
                            <FaRobot />
                        </div>
                        <h3 className="ats-content-title">How Does ATS Work?</h3>
                        <p className="ats-content-description">
                            The ATS follows a systematic process to evaluate every resume. Understanding this workflow helps you optimize your resume to pass through successfully and land in front of hiring managers.
                        </p>
                        <div className="ats-highlight-box">
                            <strong>Pro Tip:</strong> ATS systems can't read complex formatting, images, or tables. Keep your resume simple and text-based for best results.
                        </div>
                    </div>
                </div>

                {/* Why ATS Optimization Matters */}
                <div className="ats-content-row">
                    <div className="ats-content-left">
                        <div className="ats-icon-box">
                            <FaChartLine />
                        </div>
                        <h3 className="ats-content-title">Why ATS Optimization Matters</h3>
                        <p className="ats-content-description">
                            An ATS-optimized resume dramatically increases your chances of getting noticed. Studies show that optimized resumes are 60% more likely to pass ATS screening and reach hiring managers. Here's why it's crucial for your job search success.
                        </p>
                        <div className="ats-benefits-grid">
                            <div className="ats-benefit-item">
                                <FaCheckCircle className="benefit-icon" />
                                <div>
                                    <h4>Higher Visibility</h4>
                                    <p>Get ranked higher in recruiter searches</p>
                                </div>
                            </div>
                            <div className="ats-benefit-item">
                                <FaCheckCircle className="benefit-icon" />
                                <div>
                                    <h4>More Interviews</h4>
                                    <p>Increase callback rates by 40-60%</p>
                                </div>
                            </div>
                            <div className="ats-benefit-item">
                                <FaCheckCircle className="benefit-icon" />
                                <div>
                                    <h4>Faster Hiring</h4>
                                    <p>Stand out in the initial screening phase</p>
                                </div>
                            </div>
                            <div className="ats-benefit-item">
                                <FaCheckCircle className="benefit-icon" />
                                <div>
                                    <h4>Better Matches</h4>
                                    <p>Connect with relevant job opportunities</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="ats-content-right">
                        <div className="ats-impact-card">
                            <h4 className="impact-title">The Impact of ATS Optimization</h4>
                            <div className="impact-stat">
                                <span className="impact-number">60%</span>
                                <span className="impact-text">Shorter hiring cycle</span>
                            </div>
                            <div className="impact-stat">
                                <span className="impact-number">86%</span>
                                <span className="impact-text">Reduced time-to-hire</span>
                            </div>
                            <div className="impact-stat">
                                <span className="impact-number">40-60%</span>
                                <span className="impact-text">Increase in callbacks</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* How We Help */}
                <div className="ats-help-section">
                    <div className="ats-help-content">
                        <div className="ats-icon-box ats-icon-box-large">
                            <FaUserCheck />
                        </div>
                        <h3 className="ats-help-title">How Our Platform Helps You Beat the ATS</h3>
                        <p className="ats-help-description">
                            Our AI-powered resume builder is specifically designed to create ATS-friendly resumes that pass automated screening while still looking professional and polished to human recruiters.
                        </p>
                        <div className="ats-help-features">
                            <div className="help-feature">
                                <div className="help-feature-icon">✓</div>
                                <div className="help-feature-text">
                                    <strong>Keyword Optimization:</strong> Automatically identifies and incorporates relevant keywords from job descriptions
                                </div>
                            </div>
                            <div className="help-feature">
                                <div className="help-feature-icon">✓</div>
                                <div className="help-feature-text">
                                    <strong>ATS-Friendly Formatting:</strong> Uses simple, clean layouts that ATS systems can easily parse and read
                                </div>
                            </div>
                            <div className="help-feature">
                                <div className="help-feature-icon">✓</div>
                                <div className="help-feature-text">
                                    <strong>Smart Content Enhancement:</strong> AI improves your content with action verbs and quantifiable achievements
                                </div>
                            </div>
                            <div className="help-feature">
                                <div className="help-feature-icon">✓</div>
                                <div className="help-feature-text">
                                    <strong>Real-Time ATS Scoring:</strong> Get instant feedback on how well your resume matches job requirements
                                </div>
                            </div>
                        </div>
                        <div className="ats-cta-button">
                            Optimize Your Resume Now
                        </div>
                    </div>
                </div>
            </div>

            {/* Pricing Section */}
            <div className="homescreen-pricing-section">
                <div className="pricing-header">
                    <h2 className="pricing-title">Find the Plan That's Right for You</h2>
                    <p className="pricing-subtitle">
                        Simple pricing for every career stage—individuals, job seekers, or organizations.
                    </p>
                </div>
                <div className="pricing-card-grid">
                    <div className="pricing-card">
                        <div>
                            <div className="plan-name">Basic</div>
                            <div className="plan-price"><span className="price-currency">₹</span>99<span className="plan-frequency">/once</span></div>
                            <ul className="plan-features">
                                <li>1 Resume Creation or Enhancement</li>
                                <li>1 Resume Download</li>
                                <li>15 Unlockable Templates</li>
                                <li>ATS Improvement & Check</li>
                                <li>Email Support</li>
                            </ul>
                        </div>
                        <div className="plan-select-btn" onClick={() => handlePay("basic")}>
                            {redirectingToCheckOut === "basic" ? "Loading..." : "Get Started"}
                        </div>
                    </div>
                    <div className="pricing-card popular">
                        <div>
                            <div className="popular-tag">Most Popular</div>
                            <div className="plan-name">Premium</div>
                            <div className="plan-price"><span className="price-currency">₹</span>999<span className="plan-frequency">/once</span></div>
                            <ul className="plan-features">
                                <li>5 Resume Creations & Enhancements</li>
                                <li>10 Resume Downloads</li>
                                <li>25 Unlockable Templates</li>
                                <li>ATS Improvement & Check</li>
                                <li>Email & Live Chat Support</li>
                                <li>Priority Processing</li>
                            </ul>
                        </div>
                        <div className="plan-select-btn plan-select-btn-popular" onClick={() => handlePay("premium")}>
                            {redirectingToCheckOut === "premium" ? "Loading..." : "Choose Premium"}
                        </div>
                    </div>
                    <div className="pricing-card">
                        <div>
                            <div className="plan-name">Organization</div>
                            <div className="plan-price"><span className="price-currency">₹</span>4999<span className="plan-frequency">/once</span></div>
                            <ul className="plan-features">
                                <li>25 Resume Creations & Enhancements</li>
                                <li>100 Resume Score & Issues Checker</li>
                                <li>100 Resume Downloads</li>
                                <li>50 Unlockable Templates</li>
                                <li>ATS Improvement & Check</li>
                                <li>Team & Priority Support</li>
                                <li>Custom Branding</li>
                            </ul>
                        </div>
                        <div className="plan-select-btn" onClick={() => handlePay("organization")}>
                            {redirectingToCheckOut === "organization" ? "Loading..." : "Get Started"}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Section */}
            <footer className="homescreen-footer">
                <div className="footer-main">
                    <h2 className="footer-title">AI Resume Builder</h2>
                    <div className="footer-tagline">
                        Transforming your job search—one professional resume at a time.
                    </div>
                    <div className="footer-links">
                        <a href="/features">Features</a>
                        <a href="/pricing">Pricing</a>
                        <a href="/privacy">Privacy</a>
                        <a href="/terms">Terms</a>
                    </div>
                    <div className="footer-desc">
                        AI Resume Builder leverages artificial intelligence and industry design to help you create stunning, ATS-friendly resumes that get you noticed. Whether you're job hunting or advancing your career, our tools make it easy.
                    </div>
                    <div className="footer-copy">
                        © {new Date().getFullYear()} AI Resume Builder. All rights reserved.
                    </div>
                </div>
            </footer>

        </div>
    )
};

export default HomeScreen;