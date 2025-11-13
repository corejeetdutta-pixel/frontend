// // ✅ ResumeTemplates.js
// import './ResumeTemplates.css';
// import jsPDF from "jspdf";
// import { FaLock } from "react-icons/fa";
// import template1 from './../assets/template1.jpeg'
// import template2 from './../assets/template2.jpeg'
// import template3 from './../assets/template3.jpeg'
// import { Modal, Button } from "react-bootstrap";
// import axios from "axios";
// import { useState } from "react";
// import { useNavigate } from 'react-router-dom';
// import html2canvas from "html2canvas";

// // -----------------------------------
// // 🔹 1. Parse Resume Text Function
// // -----------------------------------
// function parseAIResumeText(aiText) {
//     const getSection = (title) => {
//         const regex = new RegExp(`${title}:([\\s\\S]*?)(?=\\n[A-Z ]+:|$)`, "i");
//         const match = aiText.match(regex);
//         return match ? match[1].trim() : "";
//     };

//     return {
//         personal: {
//             fullName: getSection("NAME"),
//             email: getSection("EMAIL"),
//             phone: getSection("PHONE"),
//             linkedin: getSection("LINKEDIN"),
//             location: getSection("ADDRESS"),
//         },
//         summary: getSection("SUMMARY"),
//         skills: getSection("TECHNICAL SKILLS")
//             .split(/,|\n|•/g)
//             .map((s) => s.trim())
//             .filter(Boolean),
//         achievements: getSection("ACHIEVEMENTS")
//             .split("\n")
//             .map((t) => t.replace(/^•/, "").trim())
//             .filter(Boolean),
//         experiences: [
//             {
//                 company: "Atract Technologies Pvt. Ltd.",
//                 title: "Full Stack Developer",
//                 date: "June 2025 – October 2025",
//                 description: getSection("EXPERIENCE"),
//             },
//         ],
//         projects: [
//             {
//                 title: "AI Resume Writer",
//                 description: "Developed an AI-powered web app that builds ATS resumes.",
//             },
//         ],
//         education: [
//             {
//                 school: "Visvesvaraya Technological University",
//                 degree: "B.Tech in Computer Science",
//                 date: "June 2018 – May 2022",
//             },
//         ],
//         certifications: [
//             {
//                 title: "Full Stack Web Development",
//                 issuer: "Udemy",
//             },
//         ],
//         languages: [
//             { language: "English", proficiency: "Fluent" },
//             { language: "Hindi", proficiency: "Fluent" },
//         ],
//         additional: getSection("ADDITIONAL INFORMATION"),
//     };
// }

// // -----------------------------------
// // 🔹 2. Template Generators
// // -----------------------------------

// // ✅ Template 1 — your current perfect layout
// const generateTemplate1HTML = (resumeData) => {
//     const {
//         personal = {},
//         summary = "",
//         experiences = [],
//         education = [],
//         skills = [],
//         projects = [],
//         certifications = [],
//         achievements = [],
//         languages = [],
//         additional = "",
//     } = resumeData;

//     const listHtml = (arr = [], style = "") =>
//         arr
//             .map(
//                 (item) =>
//                     `<li style="font-size:12px; margin-bottom:6px; line-height:1.4; ${style}">${item.text || item}</li>`
//             )
//             .join("");

//     const educationHtml = education
//         .map(
//             (edu) => `
//         <li style="margin-bottom:11px;">
//           <div style="font-size:12px; font-weight:500; margin-bottom:2px; color:#ddd;">${edu.date}</div>
//           <div style="font-weight:bold; font-size:12px; color:#fff;">${edu.school}</div>
//           <div style="font-size:12px; color:#eee;">${edu.degree}</div>
//         </li>`
//         )
//         .join("");

//     const skillsHtml = skills
//         .map((skill) => `<li style="font-size:12px; color:#eee; margin-bottom:6px;">• ${skill}</li>`)
//         .join("");

//     const achievementsHtml = listHtml(achievements, "color:#eee;");
//     const languagesHtml = languages
//         .map(
//             (lang) =>
//                 `<li style="font-size:12px; color:#eee; margin-bottom:6px;">${lang.language} (${lang.proficiency})</li>`
//         )
//         .join("");

//     const experienceHtml = experiences
//         .map(
//             (exp) => `
//         <div style="margin-bottom:12px;">
//           <div style="display:flex; justify-content:space-between;">
//             <div style="font-weight:700; font-size:13px; color:#000;">${exp.company}</div>
//             <div style="font-size:11px; color:#555;">${exp.date}</div>
//           </div>
//           <div style="font-size:12px; font-style:italic; color:#333; margin-bottom:4px;">
//             ${exp.title}
//           </div>
//           ${exp.description
//                     ? `<ul style="padding-left:15px; color:#333; list-style-type:disc;">
//                   ${exp.description
//                         .split("\n")
//                         .map(
//                             (d) =>
//                                 `<li style="font-size:12px; margin-bottom:2px;">${d.trim()}</li>`
//                         )
//                         .join("")}
//                 </ul>`
//                     : ""
//                 }
//         </div>`
//         )
//         .join("");

//     const projectsHtml = projects
//         .map(
//             (p) => `
//         <li style="font-size:12px; color:#333; margin-bottom:6px;">
//           <strong>${p.title}</strong> – ${p.description}
//         </li>`
//         )
//         .join("");

//     const certificationsHtml = certifications
//         .map(
//             (c) =>
//                 `<li style="font-size:12px; color:#333; margin-bottom:6px;">${c.title} - ${c.issuer}</li>`
//         )
//         .join("");

//     // ✅ Final Template HTML
//     return `
//   <div id="resume-html" style="width:210mm; background:#fff; font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
//     <div style="display:flex; min-height:297mm;">
//       <!-- LEFT -->
//       <div style="width:32%; background:#223046; color:white; padding:30px 20px;">
//         <div style="text-align:center; margin-bottom:20px;">
//           <div style="width:110px; height:110px; border-radius:55px; background:#ddd; margin:0 auto; border:3px solid #fff;"></div>
//         </div>
//         <div style="margin-bottom:20px;">
//           <h3 style="font-size:14px;">CONTACT</h3>
//           <p><b>Phone:</b> ${personal.phone}</p>
//           <p><b>Email:</b> ${personal.email}</p>
//           <p><b>Location:</b> ${personal.location}</p>
//           ${personal.linkedin ? `<p><b>LinkedIn:</b> ${personal.linkedin}</p>` : ""}
//         </div>
//         <h3 style="font-size:14px;">EDUCATION</h3>
//         <ul>${educationHtml}</ul>
//         <h3 style="font-size:14px;">SKILLS</h3>
//         <ul>${skillsHtml}</ul>
//         ${achievements.length ? `<h3 style="font-size:14px;">ACHIEVEMENTS</h3><ul>${achievementsHtml}</ul>` : ""}
//         ${languages.length ? `<h3 style="font-size:14px;">LANGUAGES</h3><ul>${languagesHtml}</ul>` : ""}
//       </div>

//       <!-- RIGHT -->
//       <div style="flex:1; padding:30px 35px;">
//         <h1 style="font-size:28px;">${personal.fullName || "Your Name"}</h1>
//         ${summary ? `<h3>PROFILE</h3><p>${summary}</p>` : ""}
//         ${experienceHtml ? `<h3>EXPERIENCE</h3>${experienceHtml}` : ""}
//         ${projectsHtml ? `<h3>PROJECTS</h3><ul>${projectsHtml}</ul>` : ""}
//         ${certificationsHtml ? `<h3>CERTIFICATIONS</h3><ul>${certificationsHtml}</ul>` : ""}
//         ${additional ? `<h3>ADDITIONAL INFORMATION</h3><p>${additional}</p>` : ""}
//       </div>
//     </div>
//   </div>`;
// };

// export const generateTemplate2HTML = (resumeData) => {
//     const {
//         personal = {},
//         summary = "",
//         skills = [],
//         education = [],
//         experiences = [],
//         achievements = [],
//         projects = [],
//         languages = ["English", "Hindi"],
//     } = resumeData;

//     // Helpers
//     const section = (title, html) =>
//         html && html.trim() !== ""
//             ? `
//       <div style="margin-bottom:15px;">
//         <div style="font-size:12px; font-weight:bold; color:#1f4968; margin-bottom:5px; border-bottom:1px solid #1f4968; padding-bottom:2px;">
//           ${title}
//         </div>
//         ${html}
//       </div>`
//             : "";

//     const summaryHtml = summary
//         ? `<div style="font-size:10px; color:#333; line-height:1.4;">${summary}</div>`
//         : "";

//     const skillsHtml =
//         skills && skills.length > 0
//             ? skills.map((s) => `<div style="font-size:10px; margin-bottom:4px; color:#223046;">${s}</div>`).join("")
//             : "";

//     const educationHtml =
//         education && education.length > 0
//             ? education
//                 .map(
//                     (edu) => `
//         <div style="margin-bottom:8px;">
//           <div style="font-size:11px; color:#07213b; font-weight:600;">${edu.degree || ""}</div>
//           <div style="font-size:10px; color:#223046;">${edu.school || edu.institution || ""}</div>
//           <div style="font-size:9px; color:#6b7a89;">${edu.date || edu.year || ""}</div>
//         </div>`
//                 )
//                 .join("")
//             : "";

//     const experienceHtml =
//         experiences && experiences.length > 0
//             ? experiences
//                 .map((exp) => {
//                     const desc = exp.description
//                         ? exp.description
//                             .split("\n")
//                             .map((d) => `<div style="font-size:10px; margin-bottom:4px; padding-left:10px; color:#223046;">• ${d}</div>`)
//                             .join("")
//                         : "";
//                     return `
//           <div style="margin-bottom:10px; page-break-inside: avoid;">
//             <div style="display:flex; justify-content:space-between; margin-bottom:2px;">
//               <span style="font-weight:600; font-size:11px; color:#07213b;">${exp.company || ""}</span>
//               <span style="font-size:9px; color:#6b7a89; font-weight:500;">${exp.date || ""}</span>
//             </div>
//             <div style="font-size:10px; font-style:italic; color:#223046; margin-bottom:4px;">
//               ${exp.title || exp.position || ""}
//             </div>
//             ${desc}
//           </div>`;
//                 })
//                 .join("")
//             : "";

//     const achievementsHtml =
//         achievements && achievements.length > 0
//             ? achievements.map((a) => `<div style="font-size:11px; margin-bottom:6px; color:#223046;">• ${a}</div>`).join("")
//             : "";

//     const projectsHtml =
//         projects && projects.length > 0
//             ? projects.map((p) => `<div style="font-size:11px; margin-bottom:4px; color:#223046;">• ${p.title || p}</div>`).join("")
//             : "";

//     const languagesHtml =
//         languages && languages.length > 0
//             ? `<div style="font-size:10px; color:#333;">${languages.join(", ")}</div>`
//             : "";

//     // Final HTML
//     return `
//   <div id="resume-html" style="width:210mm; min-height:297mm; background:#ffffff; font-family:Arial, sans-serif;
//       font-size:12px; line-height:1.3; color:#333; box-sizing:border-box;">

//     <!-- Header -->
//     <div style="width:100%; background:#1f4968; color:white; padding:15px 20px; box-sizing:border-box;">
//       <div style="font-size:24px; font-weight:bold; margin-bottom:5px;">${personal.fullName || ""}</div>
//       ${personal.title
//             ? `<div style="font-size:12px; margin-bottom:8px;">${personal.title}</div>`
//             : ""
//         }
//       <div style="font-size:10px;">
//         ${personal.phone ? `<span style="margin-right:15px;">${personal.phone}</span>` : ""}
//         ${personal.email ? `<span style="margin-right:15px;">${personal.email}</span>` : ""}
//         ${personal.linkedin ? `<span>${personal.linkedin}</span>` : ""}
//       </div>
//     </div>

//     <!-- Content -->
//     <div style="display:flex; width:100%; padding:15px; gap:15px; box-sizing:border-box;">

//       <!-- Left Column -->
//       <div style="width:35%; background:#f8f9fa; padding:15px; border-radius:4px; box-sizing:border-box;">
//         ${section("PROFILE", summaryHtml)}
//         ${section("SKILLS", skillsHtml)}
//         ${section("EDUCATION", educationHtml)}
//         ${section("LANGUAGES", languagesHtml)}
//       </div>

//       <!-- Right Column -->
//       <div style="width:65%; padding:0 15px; box-sizing:border-box;">
//         ${section("WORK EXPERIENCE", experienceHtml)}
//         ${section("ACHIEVEMENTS", achievementsHtml)}
//         ${section("PROJECTS", projectsHtml)}
//       </div>
//     </div>
//   </div>`;
// };



// export const generateTemplate3HTML = (resumeData) => {
//     const {
//         personalDetails = {},
//         name = "",
//         title = "",
//         summary = "",
//         education = [],
//         languages = [],
//         technicalSkills = [],
//         workExperience = [],
//         achievements = [],
//     } = resumeData;

//     // Helper: Section Wrapper
//     const section = (title, html) =>
//         html && html.trim() !== ""
//             ? `
//       <div style="margin-bottom:25px;">
//         <div style="font-size:14px; font-weight:bold; color:#008080; margin-bottom:10px; border-bottom:2px solid #40e0d0; padding-bottom:4px;">
//           ${title}
//         </div>
//         ${html}
//       </div>`
//             : "";

//     // Education Section
//     const educationHtml =
//         education && education.length > 0
//             ? education
//                 .map(
//                     (edu) => `
//           <div style="margin-bottom:12px;">
//             <div style="font-size:11px; font-weight:600; color:#1a3c34;">${edu.degree || ""}</div>
//             <div style="font-size:10px; color:#2c5530;">${edu.institution || edu.school || ""}</div>
//             <div style="font-size:9px; color:#5a7d65;">${edu.year || edu.date || ""}</div>
//           </div>`
//                 )
//                 .join("")
//             : "";

//     // Languages
//     const languagesHtml =
//         languages && languages.length > 0
//             ? languages.map((lang) => `<div style="font-size:10px; color:#2c5530; margin-bottom:3px;">• ${lang}</div>`).join("")
//             : "";

//     // Skills
//     const skillsHtml =
//         technicalSkills && technicalSkills.length > 0
//             ? technicalSkills.map((s) => `<div style="font-size:10px; color:#2c5530; margin-bottom:3px; padding-left:8px;">• ${s}</div>`).join("")
//             : "";

//     // Work Experience
//     const experienceHtml =
//         workExperience && workExperience.length > 0
//             ? workExperience
//                 .map(
//                     (exp) => `
//           <div style="margin-bottom:20px; page-break-inside: avoid;">
//             <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">
//               <span style="font-weight:bold; font-size:12px; color:#1a3c34;">${exp.company || ""}</span>
//               <span style="font-size:10px; color:#5a7d65; font-weight:500; background:#e0f7fa; padding:2px 6px; border-radius:3px;">${exp.period || ""}</span>
//             </div>
//             <div style="font-size:11px; font-style:italic; color:#008080; margin-bottom:8px; font-weight:600;">${exp.position || ""}</div>
//             ${exp.responsibilities && exp.responsibilities.length > 0
//                             ? exp.responsibilities
//                                 .map(
//                                     (resp) =>
//                                         `<div style="font-size:10px; color:#2c5530; margin-bottom:4px; padding-left:12px; position:relative;">
//                           <span style="position:absolute; left:0; color:#40e0d0;">•</span> ${resp}
//                         </div>`
//                                 )
//                                 .join("")
//                             : ""
//                         }
//           </div>`
//                 )
//                 .join("")
//             : "";

//     // Achievements
//     const achievementsHtml =
//         achievements && achievements.length > 0
//             ? achievements
//                 .map(
//                     (a) =>
//                         `<div style="font-size:10px; color:#2c5530; margin-bottom:6px; padding-left:12px; position:relative;">
//                 <span style="position:absolute; left:0; color:#40e0d0;">•</span> ${a}
//               </div>`
//                 )
//                 .join("")
//             : "";

//     // Contact Details
//     const contactHtml =
//         personalDetails &&
//             (personalDetails.phone || personalDetails.email || personalDetails.linkedin || personalDetails.address)
//             ? `
//       <div style="margin-bottom:25px;">
//         <div style="font-size:14px; font-weight:bold; color:#008080; margin-bottom:10px; border-bottom:2px solid #40e0d0; padding-bottom:4px;">CONTACT</div>
//         ${personalDetails.phone ? `<div style="font-size:10px; color:#2c5530; margin-bottom:4px;"><strong>Phone:</strong> ${personalDetails.phone}</div>` : ""}
//         ${personalDetails.email ? `<div style="font-size:10px; color:#2c5530; margin-bottom:4px;"><strong>Email:</strong> ${personalDetails.email}</div>` : ""}
//         ${personalDetails.linkedin ? `<div style="font-size:10px; color:#2c5530; margin-bottom:4px;"><strong>LinkedIn:</strong> ${personalDetails.linkedin}</div>` : ""}
//         ${personalDetails.address ? `<div style="font-size:10px; color:#2c5530;"><strong>Address:</strong> ${personalDetails.address}</div>` : ""}
//       </div>`
//             : "";

//     // Final Resume HTML
//     return `
//   <div id="resume-html" style="width:210mm; min-height:297mm; background:#ffffff; font-family:Arial, sans-serif;
//       font-size:12px; line-height:1.3; color:#333; box-sizing:border-box;">

//     <!-- HEADER -->
//     <div style="width:100%; background:#40e0d0; color:white; padding:25px 30px; text-align:center; box-sizing:border-box;">
//       <div style="font-size:28px; font-weight:bold; margin-bottom:8px; letter-spacing:1px;">${name || ""}</div>
//       ${title ? `<div style="font-size:16px; font-weight:600; margin-bottom:15px; letter-spacing:0.5px;">${title}</div>` : ""}
//       ${summary ? `<div style="font-size:11px; background:rgba(255,255,255,0.2); padding:8px; border-radius:4px; max-width:600px; margin:0 auto; line-height:1.5;">${summary}</div>` : ""}
//     </div>

//     <!-- MAIN CONTENT -->
//     <div style="display:flex; width:100%; padding:0; gap:0; box-sizing:border-box;">

//       <!-- LEFT COLUMN -->
//       <div style="width:35%; background:#f8fafc; padding:20px; box-sizing:border-box; border-right:2px solid #e0f7fa;">
//         ${contactHtml}
//         ${section("EDUCATION", educationHtml)}
//         ${section("LANGUAGES", languagesHtml)}
//         ${section("SKILLS", skillsHtml)}
//       </div>

//       <!-- RIGHT COLUMN -->
//       <div style="width:65%; padding:20px; box-sizing:border-box;">
//         ${section("WORK EXPERIENCE", experienceHtml)}
//         ${section("ACHIEVEMENTS", achievementsHtml)}
//       </div>

//     </div>
//   </div>`;
// };



// const handleDownloadPDF = async (dataOrText, template = "template1") => {
//     let resumeHtml;

//     switch (template) {
//         case "template1":
//             resumeHtml = generateTemplate1HTML(dataOrText);
//             break;
//         case "template2":
//             resumeHtml = generateTemplate2HTML(dataOrText);
//             break;
//         case "template3":
//             resumeHtml = generateTemplate3HTML(dataOrText);
//             break;
//         default:
//             resumeHtml = generateTemplate1HTML(dataOrText);
//             break;
//     }

//     // ✅ Create hidden container with slightly smaller width
//     const container = document.createElement("div");
//     container.innerHTML = resumeHtml;
//     Object.assign(container.style, {
//         position: "fixed",
//         left: "0",
//         top: "0",
//         width: "720px", // instead of 794px → makes it fit better to A4
//         background: "#fff",
//         zIndex: "-9999",
//         transform: "scale(0.481)", // shrink visually a bit
//         transformOrigin: "top left",
//     });
//     document.body.appendChild(container);

//     await new Promise((r) => setTimeout(r, 200));

//     const pdf = new jsPDF({
//         orientation: "portrait",
//         unit: "mm",
//         format: "a4",
//     });

//     // ✅ Slightly smaller scale gives perfect fit (no clipping or zoom)
//     await pdf.html(container, {
//         callback: (pdfInstance) => {
//             pdfInstance.save(
//                 template === "template1"
//                     ? `${dataOrText.personal?.fullName || "resume"}.pdf`
//                     : "resume-template2.pdf"
//             );
//             document.body.removeChild(container);
//         },
//         html2canvas: {
//             scale: 0.55, // ⬅️ main fix: reduced scale = no zoomed output
//             useCORS: true,
//             logging: false,
//         },
//         margin: [0, 0, 0, 0],
//         x: 0,
//         y: 0,
//         width: 210,
//         windowWidth: 720, // match container width
//     });
// };

// // -----------------------------------
// // 🔹 4. React Component
// // -----------------------------------
// const ResumeTemplates = ({ enhancedText, planType, downloadsRemaining, onDownloadsUpdate, userId }) => {

//     const [showModal, setShowModal] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();


//     const prepareResumeData = (dataOrText, templateType) => {
//         // If it's plain text from AI, parse it
//         if (typeof dataOrText === "string") {
//             return parseAIResumeText(dataOrText);
//         }

//         // If it's already structured (JSON-like), use it as-is
//         if (typeof dataOrText === "object") {
//             return dataOrText;
//         }

//         console.warn("⚠️ Unrecognized resume data format.");
//         return {};
//     };


//     const handleDownloadTemplate = async (templateType) => {
//         try {
//             const numericUserId = Number(userId);

//             // ✅ Step 1: Check remaining downloads
//             const checkRes = await axios.get(`${process.env.REACT_APP_API_URL}/check-downloads`, {
//                 params: { userId: numericUserId },
//             });

//             if (!checkRes.data.success || checkRes.data.downloadsRemaining <= 0) {
//                 setShowModal(true);
//                 return;
//             }

//             setLoading(true);

//             // ✅ Step 2: Prepare and generate resume
//             const preparedData = prepareResumeData(enhancedText, templateType);
//             await handleDownloadPDF(preparedData, templateType);

//             // ✅ Step 3: Update remaining count
//             const updateRes = await axios.post(`${process.env.REACT_APP_API_URL}/update-downloads`, null, {
//                 params: { userId: numericUserId },
//             });

//             if (updateRes.data.success) {
//                 onDownloadsUpdate(updateRes.data.downloadsRemaining);
//             }
//         } catch (err) {
//             console.error("Download process error:", err);
//         } finally {
//             setLoading(false);
//         }
//     };


//     const templates = [
//         { type: "template1", category: "Modern Templates", label: "Modern Blue", plan: "baisc", img: template1 },
//         { type: "template2", category: "Modern Templates", label: "Classic White", plan: "premium", img: template2 },
//         { type: "template3", category: "Modern Templates", label: "Template 2", plan: "premium", img: template2 },
//         { type: "template4", category: "Classic Templates", label: "Modern Grey", plan: "organization", img: template3 },
//     ];

//     const planRank = { basic: 1, premium: 2, organization: 3 };

//     const groupedTemplates = templates.reduce((acc, tpl) => {
//         if (!acc[tpl.category]) acc[tpl.category] = [];
//         acc[tpl.category].push(tpl);
//         return acc;
//     }, {});

//     const userRank = planRank[planType] || 1;


//     const noDownloadsModal = () => {

//         return (
//             <Modal show={showModal} onHide={() => setShowModal(false)} centered>
//                 <Modal.Header closeButton style={{ borderBottom: "none" }}>
//                     <Modal.Title style={{ color: "#0160A4", fontWeight: "700" }}>
//                         No Downloads Remaining
//                     </Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body style={{ textAlign: "center", padding: "30px" }}>
//                     <p style={{ color: "#334155", fontSize: "16px", marginBottom: "24px" }}>
//                         You’ve used all your available downloads.
//                         Upgrade your plan to unlock more resume downloads and templates.
//                     </p>
//                     <Button
//                         variant="primary"
//                         style={{
//                             backgroundColor: "#0160A4",
//                             border: "none",
//                             padding: "10px 22px",
//                             borderRadius: "8px",
//                             fontWeight: "600",
//                         }}
//                         onClick={() => {
//                             setShowModal(false);
//                             // Redirect or open upgrade page
//                             navigate("/");
//                         }}
//                     >
//                         Upgrade Plan
//                     </Button>
//                 </Modal.Body>
//             </Modal>
//         )
//     }

//     return (
//         <div className="templates-section">
//             <h2 className="section-title">Choose a Template to Download</h2>

//             {Object.keys(groupedTemplates).map((category) => (
//                 <div key={category} className="template-category">
//                     <h3 className="category-title">{category}</h3>
//                     <div className="templates-grid">
//                         {groupedTemplates[category].map((tpl) => {
//                             const templateRank = planRank[tpl.plan];
//                             const isLocked = templateRank > userRank;

//                             return (
//                                 <div className="template-card" key={tpl.type}>
//                                     <div className="template-img-wrapper">
//                                         <img src={tpl.img} alt={tpl.label} className="template-img" />
//                                         <div className="template-overlay">
//                                             {isLocked ? (
//                                                 <div className="locked-overlay">
//                                                     <FaLock className="lock-icon" />
//                                                     <div className="locked-text">Locked</div>
//                                                     <div className="locked-caption">
//                                                         Upgrade to <strong>{tpl.plan}</strong> plan to use this template
//                                                     </div>
//                                                 </div>
//                                             ) : (
//                                                 <button
//                                                     className="template-download-button"
//                                                     onClick={() => handleDownloadTemplate(tpl.type)}
//                                                     disabled={loading}
//                                                 >
//                                                     {loading ? "Downloading..." : "Download"}
//                                                 </button>
//                                             )}
//                                         </div>
//                                     </div>
//                                     <div className="template-name">{tpl.label}</div>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 </div>
//             ))}
//             {noDownloadsModal()}
//         </div>
//     );
// };

// export default ResumeTemplates;









// ✅ ResumeTemplates.js
import './ResumeTemplates.css';
import jsPDF from "jspdf";
import { FaLock } from "react-icons/fa";
import template1 from './../../assets/template1.jpeg'
import template2 from './../../assets/template2.jpeg'
import template3 from './../../assets/template3.jpeg'
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
// import html2canvas from "html2canvas";


function parseAIResumeTextDynamic(aiText) {
    const sections = {};
    const lines = aiText.split("\n");

    let currentSection = null;

    lines.forEach((line) => {
        const sectionMatch = line.match(/^([A-Z &]+):$/); // Match 'SECTION NAME:'
        if (sectionMatch) {
            currentSection = sectionMatch[1].trim();
            sections[currentSection] = [];
        } else if (currentSection && line.startsWith("- ")) {
            const fieldMatch = line.match(/^- ([^:]+):\s*(.*)$/); // Match '- Label: Value'
            if (fieldMatch) {
                const [, fieldName, fieldValue] = fieldMatch;
                sections[currentSection].push({
                    [fieldName.trim()]: fieldValue.trim(),
                });
            }
        }
    });

    return sections;
}


const generateTemplate1HTML = (parsedText) => {
    // Sidebar sections that should appear on the left
    const sidebarSections = ["Personal Information", "Education", "Skills & Tools", "Achievements", "Languages"];

    // Main content sections
    const mainSections = Object.keys(parsedText).filter((sec) => !sidebarSections.includes(sec));

    // Helper for list
    const listHtml = (items = [], color = "#333") =>
        items
            .map((item) => `<li style="font-size:12px; margin-bottom:6px; color:${color};">• ${item}</li>`)
            .join("");

    // Sidebar: CONTACT (mapped from Personal Information)
    const personal = parsedText["Personal Information"]?.[0] || {};
    const contactHtml = `
    <h3 style="font-size:14px;">CONTACT</h3>
    <p><b>Phone:</b> ${personal.phone || "-"}</p>
    <p><b>Email:</b> ${personal.email || "-"}</p>
    <p><b>Location:</b> ${personal.location || "-"}</p>
    ${personal.linkedin ? `<p><b>LinkedIn:</b> ${personal.linkedin}</p>` : ""}
  `;

    // Sidebar: Dynamic education, skills, achievements, languages
    const sidebarHtml = sidebarSections
        .map((sec) => {
            const sectionData = parsedText[sec];
            if (!sectionData) return "";
            let html = `<h3 style="font-size:14px; margin-top:20px;">${sec}</h3><ul style="padding-left: 15px;">`;

            sectionData.forEach((entry) => {
                if (typeof entry === "string") {
                    html += `<li style="font-size:12px; margin-bottom:6px; color:#eee;">• ${entry}</li>`;
                } else {
                    Object.values(entry).forEach((val) => {
                        html += `<li style="font-size:12px; margin-bottom:6px; color:#eee;">${val}</li>`;
                    });
                }
            });

            return html + `</ul>`;
        })
        .join("");

    // Main: Name + dynamic sections like Experience, Projects, etc
    const nameHtml = `<h1 style="font-size:28px;">${personal.fullName || "Your Name"}</h1>`;
    const mainHtml = mainSections
        .map((sec) => {
            const sectionData = parsedText[sec];
            if (!sectionData) return "";
            let html = `<h3 style="font-size:14px; font-weight:600; margin-top:24px;">${sec}</h3>`;

            if (Array.isArray(sectionData)) {
                sectionData.forEach((entry) => {
                    html += `<div style="margin-bottom:12px;">`;
                    Object.entries(entry).forEach(([k, v]) => {
                        html += `<div style="font-size:12px; margin-bottom:4px;"><strong>${k}:</strong> ${v || "-"}</div>`;
                    });
                    html += `</div>`;
                });
            } else {
                html += `<p style="font-size:13px; color:#333;">${sectionData}</p>`;
            }
            return html;
        })
        .join("");

    // Final HTML
    return `
    <div id="resume-html" style="width:210mm; background:#fff; font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
      <div style="display:flex; min-height:297mm;">
        <!-- LEFT SIDEBAR -->
        <div style="width:32%; background:#223046; color:white; padding:30px 20px;">
          <div style="text-align:center; margin-bottom:20px;">
            <div style="width:110px; height:110px; border-radius:55px; background:#ddd; margin:0 auto; border:3px solid #fff;"></div>
          </div>
          ${contactHtml}
          ${sidebarHtml}
        </div>

        <!-- RIGHT MAIN CONTENT -->
        <div style="flex:1; padding:30px 35px; color:#000;">
          ${nameHtml}
          ${mainHtml}
        </div>
      </div>
    </div>`;
};



const handleDownloadPDF = async (parsedText, template = "template1") => {
    let resumeHtml;

    switch (template) {
        case "template1":
            resumeHtml = generateTemplate1HTML(parsedText);
            break;
        case "template2":
            resumeHtml = generateTemplate1HTML(parsedText);
            break;
        case "template3":
            resumeHtml = generateTemplate1HTML(parsedText);
            break;
        default:
            resumeHtml = generateTemplate1HTML(parsedText);
            break;
    }

    // ✅ Create hidden container with slightly smaller width
    const container = document.createElement("div");
    container.innerHTML = resumeHtml;
    Object.assign(container.style, {
        position: "fixed",
        left: "0",
        top: "0",
        width: "720px", // instead of 794px → makes it fit better to A4
        background: "#fff",
        zIndex: "-9999",
        transform: "scale(0.481)", // shrink visually a bit
        transformOrigin: "top left",
    });
    document.body.appendChild(container);

    await new Promise((r) => setTimeout(r, 200));

    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    const personalInfo = parsedText["PERSONAL INFORMATION"];
    const fullName = personalInfo?.find((item) => item["Full Name"])?.["Full Name"] || "resume";

    const fileName =
        template === "template1"
            ? `${fullName}.pdf`
            : "resume-template2.pdf";

    // ✅ Slightly smaller scale gives perfect fit (no clipping or zoom)
    await pdf.html(container, {
        callback: (pdfInstance) => {
            pdfInstance.save(
                `${fullName}.pdf`
            );
            document.body.removeChild(container);
        },
        html2canvas: {
            scale: 0.55, // ⬅️ main fix: reduced scale = no zoomed output
            useCORS: true,
            logging: false,
        },
        margin: [0, 0, 0, 0],
        x: 0,
        y: 0,
        width: 210,
        windowWidth: 720, // match container width
    });
};

const ResumeTemplates = ({ enhancedText, planType, downloadsRemaining, onDownloadsUpdate, userId }) => {

    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const handleDownloadTemplate = async (templateType) => {
        try {
            // const numericUserId = Number(userId);

            // ✅ Step 1: Check remaining downloads
            const checkRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL_NODE}/check-downloads`, {
                params: { userId: userId },
            });

            if (!checkRes.data.success || checkRes.data.downloadsRemaining <= 0) {
                setShowModal(true);
                return;
            }

            setLoading(true);

            // ✅ Step 2: Prepare and generate resume
            const preparedData = parseAIResumeTextDynamic(enhancedText);

            // console.log(preparedData)
            // return
            await handleDownloadPDF(preparedData, templateType);

            // ✅ Step 3: Update remaining count
            const updateRes = await axios.post(`${import.meta.env.VITE_BACKEND_URL_NODE}/update-downloads`, null, {
                params: { userId: userId },
            });

            if (updateRes.data.success) {
                onDownloadsUpdate(updateRes.data.downloadsRemaining);
            }
        } catch (err) {
            console.error("Download process error:", err);
        } finally {
            setLoading(false);
        }
    };


    const templates = [
        { type: "template1", category: "Modern Templates", label: "Modern Blue", plan: "baisc", img: template1 },
        { type: "template2", category: "Modern Templates", label: "Classic White", plan: "premium", img: template2 },
        { type: "template3", category: "Modern Templates", label: "Template 2", plan: "premium", img: template2 },
        { type: "template4", category: "Classic Templates", label: "Modern Grey", plan: "organization", img: template3 },
    ];

    const planRank = { basic: 1, premium: 2, organization: 3 };

    const groupedTemplates = templates.reduce((acc, tpl) => {
        if (!acc[tpl.category]) acc[tpl.category] = [];
        acc[tpl.category].push(tpl);
        return acc;
    }, {});

    const userRank = planRank[planType] || 1;


    const noDownloadsModal = () => {

        return (
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
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

    return (
        <div className="templates-section">
            <h2 className="section-title">Choose a Template to Download</h2>

            {Object.keys(groupedTemplates).map((category) => (
                <div key={category} className="template-category">
                    <h3 className="category-title">{category}</h3>
                    <div className="templates-grid">
                        {groupedTemplates[category].map((tpl) => {
                            const templateRank = planRank[tpl.plan];
                            const isLocked = templateRank > userRank;

                            return (
                                <div className="template-card" key={tpl.type}>
                                    <div className="template-img-wrapper">
                                        <img src={tpl.img} alt={tpl.label} className="template-img" />
                                        <div className="template-overlay">
                                            {isLocked ? (
                                                <div className="locked-overlay">
                                                    <FaLock className="lock-icon" />
                                                    <div className="locked-text">Locked</div>
                                                    <div className="locked-caption">
                                                        Upgrade to <strong>{tpl.plan}</strong> plan to use this template
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    className="template-download-button"
                                                    onClick={() => handleDownloadTemplate(tpl.type)}
                                                    disabled={loading}
                                                >
                                                    {loading ? "Downloading..." : "Download"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="template-name">{tpl.label}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
            {noDownloadsModal()}
        </div>
    );
};

export default ResumeTemplates;
