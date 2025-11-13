import React, { useState, useEffect, useRef } from "react";
import "./CreateResume.css";
// import ResumeTemplates from "./ResumeTemplates";
import { FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import { functionalities, sectionsAndFields } from "./sectionsAndFields";




const CreateResume = () => {
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [enhancedText, setEnhancedText] = useState("");
    const [showTemplates, setShowTemplates] = useState(false);
    const navigate = useNavigate();
    const [creationsRemaining, setCreationsRemaining] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [fetchingCreations, setFetchingCreations] = useState(true)
    const [showCreateForm, setShowCreateForm] = useState(false)
    // const userId = 2
    const [currentStep, setCurrentStep] = useState(0);
    const [finished, setFinished] = useState(false);
    const [selectedSubRole, setSelectedSubRole] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMainRole, setSelectedMainRole] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [currentSections, setCurrentSections] = useState([]);
    const [formData, setFormData] = useState({});
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
        const fetchCreations = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL_NODE}/check-creations`, {
                    params: { userId },
                });

                if (!res.data.success || res.data.creationsRemaining <= 0) {
                    setShowModal(true);
                    setCreationsRemaining(0);
                } else {
                    setCreationsRemaining(res.data.creationsRemaining);
                }
                setFetchingCreations(false)
            } catch (err) {
                console.error("Error checking creations:", err);
            }
        };
        fetchCreations();
    }, [userId]);


    const handleSubmit = async () => {
        try {
            const check = await axios.get(`${import.meta.env.VITE_BACKEND_URL_NODE}/check-creations`, {
                params: { userId },
            });

            if (!check.data.success || check.data.creationsRemaining <= 0) {
                setShowModal(true);
                return;
            }
        } catch (err) {
            console.error("Error verifying creations:", err);
            setShowModal(true);
            return;
        }

        try {
            setLoading(true);
            setCompleted(false);
            setShowTemplates(false);
            setEnhancedText("");
            setCurrentStep(0);
            setFinished(false);

            // Step animation up to step 3 only
            const stepInterval = 3000;
            let stepTimer = setInterval(() => {
                setCurrentStep((prev) => {
                    if (prev < 2) return prev + 1; // Go till step index 2 (3rd step)
                    return prev; // Hold at step 3 until API finishes
                });
            }, stepInterval);

            // Call API to generate resume
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL_NODE}/generate-resume`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: userId, mainRole: selectedMainRole, subRole: selectedSubRole, formData }),
            });

            const data = await res.json();

            // Stop the step timer
            clearInterval(stepTimer);

            if (!data.success) {
                throw new Error("Failed to generate resume");
            }

            // Wait 1 second, then continue to complete remaining steps quickly
            setTimeout(() => {
                let idx = 2;
                const fastTimer = setInterval(() => {
                    idx++;
                    setCurrentStep(idx);
                    if (idx >= STEPS.length - 1) {
                        clearInterval(fastTimer);
                        setFinished(true);
                        setCompleted(true);

                        // After final step → navigate
                        setTimeout(() => {
                            navigate(`/download-resume?resumeId=${data.data.resumeId}`);
                        }, 1000);
                    }
                }, 1000);
            }, 1000);

        } catch (err) {
            console.error("Error:", err);
            setLoading(false);
            alert("Failed to generate resume.");
        }
    };


    const noCreationsModal = () => {

        return (
            <Modal show={showModal} onHide={null} centered>
                <Modal.Header style={{ borderBottom: "none" }}>
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


    const STEPS = [
        { label: 'Gathering Information' },
        { label: 'Drafting Content' },
        { label: 'Formatting Sections' },
        { label: 'Review & Edit' },
        { label: 'Finalizing & Generating' },
    ];


    const filteredFunctionalities = functionalities
        .map((cat) => ({
            ...cat,
            subCategories: cat.subCategories.filter(
                (sub) =>
                    sub.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    cat.category.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }))
        .filter(
            (cat) =>
                cat.subCategories.length > 0 ||
                cat.category.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const handleNextClick = () => {
        setShowCreateForm(true)
    }

    const handleRoleClick = (mainRole, subRole) => {
        setSelectedMainRole(mainRole)
        setSelectedSubRole(subRole)
    }

    const handleRoleChangeClick = () => {
        setShowCreateForm(false)
    }


    useEffect(() => {
        if (selectedMainRole) {
            // find the matching role’s section data
            const matched = sectionsAndFields.find(
                (item) => item.category === selectedMainRole
            );
            setCurrentSections(matched ? matched.sections : []);
            setSelectedSection(null); // reset when main role changes
        }
    }, [selectedMainRole]);


    const handleFieldChange = (sectionName, fieldName, value, index = 0) => {
        setFormData((prev) => {
            const updated = { ...prev };

            // Handle multiple entries (arrays)
            const sectionData = updated[sectionName] || (isMultiple(sectionName) ? [] : {});
            if (isMultiple(sectionName)) {
                const copy = [...sectionData];
                copy[index] = { ...(copy[index] || {}), [fieldName]: value };
                updated[sectionName] = copy;
            } else {
                updated[sectionName] = { ...sectionData, [fieldName]: value };
            }

            return updated;
        });
    };

    // Helper
    const isMultiple = (sectionName) =>
        currentSections.find((s) => s.name === sectionName)?.multiple;


    const handleDeleteEntry = (sectionName, index) => {
        setFormData((prev) => {
            const updated = { ...prev };
            if (Array.isArray(updated[sectionName])) {
                updated[sectionName] = updated[sectionName].filter((_, i) => i !== index);
            }
            return updated;
        });
    };

    const allSections = [...currentSections, { name: "Total Summary", fields: [] }];

    return (
        <div className="resume-builder-container">
            {loading ? (
                <div className="resume-builder-container-div1">
                    <div className="creation-fullscreen-layout">
                        <div className="creation-center-container">
                            <h2 className="creation-title">Resume Creation in Progress</h2>
                            <p className="creation-subtitle">Your resume is being created step-by-step...</p>

                            <div className="creation-steps">
                                {STEPS.map((step, idx) => {
                                    const isComplete = idx < currentStep || (finished && idx === STEPS.length - 1);
                                    const isCurrent = idx === currentStep && !finished && !isComplete;

                                    return (
                                        <div
                                            key={step.label}
                                            className={`creation-step${isComplete ? ' complete' : ''}${isCurrent ? ' current' : ''}`}
                                        >
                                            <div className="creation-step-icon">
                                                {isComplete ? (
                                                    <FaCheckCircle className="icon-check" />
                                                ) : isCurrent ? (
                                                    <FaSpinner className="icon-spinner" />
                                                ) : (
                                                    <span className="step-dot"></span>
                                                )}
                                            </div>
                                            <span className="creation-step-label">{step.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                showCreateForm ? (
                    <div className="createresumeform">
                        {/* LEFT SIDEBAR */}
                        <div className="createresumeform-inner1">
                            <div className="createresumeform-inner1-div1">
                                <div className="createresumeform-inner1-div1-text1">Create Your Resume</div>
                                <div className="createresumeform-inner1-div1-text2">
                                    Fill in your details below - AI will craft a professional, ATS-friendly resume.
                                </div>
                            </div>

                            <div className="resume-builder-container-div3-text">
                                {creationsRemaining} Creations Left
                            </div>

                            <div className="createresumeform-inner1-border"></div>

                            <div className="createresumeform-inner1-div2">
                                <div className="createresumeform-inner1-div2-text1">{selectedSubRole}</div>
                                <div className="createresumeform-inner1-div2-text2">{selectedMainRole}</div>
                                <div className="createresumeform-inner1-div2-text3" onClick={handleRoleChangeClick}>
                                    Change
                                </div>
                            </div>

                            <div className="createresumeform-inner1-border"></div>

                            {/* SECTION LIST */}
                            <div className="createresumeform-inner1-div3">
                                {allSections?.map((section, index) => (
                                    <div
                                        key={index}
                                        className={`createresumeform-section-item ${selectedSection === section.name ? "active" : ""
                                            }`}
                                        onClick={() => setSelectedSection(section.name)}
                                    >
                                        {section.name}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT CONTENT */}
                        <div className="createresumeform-inner2">
                            {selectedSection !== "Total Summary" && (
                                selectedSection ? (
                                    <div className="createresumeform-section-fields">
                                        <div className="createresumeform-section-fields-title">
                                            <h2>{selectedSection}</h2>
                                            {isMultiple(selectedSection) && (
                                                <button
                                                    className="createresumeform-add-btn"
                                                    onClick={() =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            [selectedSection]: [
                                                                ...(prev[selectedSection] || []),
                                                                {},
                                                            ],
                                                        }))
                                                    }
                                                >
                                                    + Add Another
                                                </button>
                                            )}
                                        </div>
                                        <div className="createresumeform-fields-grid">
                                            {(() => {
                                                const section = currentSections.find((sec) => sec.name === selectedSection);
                                                const entries = isMultiple(selectedSection)
                                                    ? formData[selectedSection] || [{}]
                                                    : [formData[selectedSection] || {}];

                                                return entries.map((entry, entryIndex) => (
                                                    <div key={entryIndex} className="createresumeform-entry">
                                                        {/* Entry Header with Delete */}
                                                        {isMultiple(selectedSection) && (
                                                            <div className="createresumeform-entry-header">
                                                                <div className="createresumeform-entry-title">
                                                                    {selectedSection} #{entryIndex + 1}
                                                                </div>
                                                                {entries.length > 1 && (
                                                                    <button
                                                                        className="createresumeform-delete-btn"
                                                                        onClick={() => handleDeleteEntry(selectedSection, entryIndex)}
                                                                    >
                                                                        ✕
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                        {section?.fields?.map((field, i) => (
                                                            <div key={i} className="createresumeform-field">
                                                                <label>{field.label}</label>
                                                                {field.type === "textarea" ? (
                                                                    <textarea
                                                                        name={field.name}
                                                                        value={entry[field.name] || ""}
                                                                        onChange={(e) =>
                                                                            handleFieldChange(
                                                                                selectedSection,
                                                                                field.name,
                                                                                e.target.value,
                                                                                entryIndex
                                                                            )
                                                                        }
                                                                        placeholder={field.label}
                                                                    />
                                                                ) : (
                                                                    <input
                                                                        type={field.type}
                                                                        name={field.name}
                                                                        value={entry[field.name] || ""}
                                                                        onChange={(e) =>
                                                                            handleFieldChange(
                                                                                selectedSection,
                                                                                field.name,
                                                                                e.target.value,
                                                                                entryIndex
                                                                            )
                                                                        }
                                                                        placeholder={field.label}
                                                                    />
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ));
                                            })()}
                                        </div>

                                        <button
                                            className="createresumeform-next-btn"
                                            onClick={() => {
                                                const currentIndex = allSections.findIndex(
                                                    (s) => s.name === selectedSection
                                                );
                                                if (currentIndex < allSections.length - 1) {
                                                    setSelectedSection(allSections[currentIndex + 1].name);
                                                } else {
                                                    // we’re already on the summary page
                                                    console.log("FormData ready to send:", formData);
                                                }
                                            }}
                                        >
                                            Next →
                                        </button>
                                    </div>
                                ) : (
                                    <div className="createresumeform-placeholder">Select a section to start filling details.</div>
                                )
                            )}
                            {selectedSection === "Total Summary" && (
                                <div className="createresumeform-summary">
                                    <h2>Review Your Details</h2>

                                    {/* Handle empty form case */}
                                    {Object.keys(formData).length === 0 ||
                                        Object.values(formData).every(
                                            (section) =>
                                            (Array.isArray(section)
                                                ? section.every((entry) => Object.values(entry).every((v) => !v))
                                                : Object.values(section || {}).every((v) => !v))
                                        ) ? (
                                        <div className="createresumeform-empty-summary">
                                            ⚠️ No data entered yet. Please fill in some details to review.
                                        </div>
                                    ) : (
                                        <div className="createresumeform-summary-content">
                                            {Object.entries(formData).map(([sectionName, sectionValue]) => {
                                                // Filter out empty entries
                                                if (Array.isArray(sectionValue)) {
                                                    const filledEntries = sectionValue
                                                        .map((entry) =>
                                                            Object.fromEntries(
                                                                Object.entries(entry).filter(([_, val]) => val?.trim())
                                                            )
                                                        )
                                                        .filter((entry) => Object.keys(entry).length > 0);

                                                    if (filledEntries.length === 0) return null; // skip empty section

                                                    return (
                                                        <div key={sectionName} className="createresumeform-summary-section">
                                                            <div className="createresumeform-summary-header">
                                                                <h3>{sectionName}</h3>
                                                                <button
                                                                    className="createresumeform-edit-btn"
                                                                    onClick={() => setSelectedSection(sectionName)}
                                                                >
                                                                    ✏️ Edit
                                                                </button>
                                                            </div>
                                                            {filledEntries.map((entry, idx) => (
                                                                <div key={idx} className="createresumeform-summary-entry">
                                                                    {Object.entries(entry).map(([key, val]) => (
                                                                        <div key={key} className="createresumeform-summary-field">
                                                                            <strong>{key.replace(/([A-Z])/g, " $1")}:</strong> {val}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    );
                                                } else {
                                                    const filteredFields = Object.fromEntries(
                                                        Object.entries(sectionValue || {}).filter(([_, val]) => val?.trim())
                                                    );
                                                    if (Object.keys(filteredFields).length === 0) return null; // skip empty section

                                                    return (
                                                        <div key={sectionName} className="createresumeform-summary-section">
                                                            <div className="createresumeform-summary-header">
                                                                <h3>{sectionName}</h3>
                                                                <button
                                                                    className="createresumeform-edit-btn"
                                                                    onClick={() => setSelectedSection(sectionName)}
                                                                >
                                                                    ✏️ Edit
                                                                </button>
                                                            </div>
                                                            <div className="createresumeform-summary-entry">
                                                                {Object.entries(filteredFields).map(([key, val]) => (
                                                                    <div key={key} className="createresumeform-summary-field">
                                                                        <strong>{key.replace(/([A-Z])/g, " $1")}:</strong> {val}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            })}
                                        </div>
                                    )}

                                    <button
                                        className="createresumeform-generate-btn"
                                        onClick={handleSubmit}
                                        disabled={fetchingCreations}
                                    >
                                        🚀 Start Generating Resume
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="create-resume-role-container">
                        <h1 className="create-resume-role-title">Select Your Functional Category</h1>

                        <div className="create-resume-role-search-box">
                            <input
                                type="text"
                                placeholder="Search category or role..."
                                className="create-resume-role-search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="create-resume-role-list">
                            {filteredFunctionalities.map((item, i) => (
                                <div key={i} className="create-resume-role-category">
                                    <h2 className="create-resume-role-category-title">{item.category}</h2>

                                    <div className="create-resume-role-subgrid">
                                        {item.subCategories.map((sub, j) => (
                                            <div
                                                key={j}
                                                onClick={() => handleRoleClick(item.category, sub)}
                                                className={`create-resume-role-card ${selectedSubRole === sub ? "active" : ""
                                                    }`}
                                            >
                                                {sub}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            className="create-resume-role-next-btn"
                            disabled={!selectedSubRole}
                            onClick={handleNextClick}
                        >
                            Next →
                        </button>
                    </div>
                )
            )}
            {noCreationsModal()}
        </div>
    );
};

export default CreateResume;
