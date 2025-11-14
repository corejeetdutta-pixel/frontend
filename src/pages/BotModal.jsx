// src/pages/BotModal.jsx
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import JobBotService from "../api/JobBotService";
import { toast, ToastContainer } from "react-toastify";
import PaymentPage from "./PaymentPage";
import "react-toastify/dist/ReactToastify.css";
import Analyse from "./resumeWriter/Analyse";

const BotModal = ({ job, user, onClose, onFinish, isApplied: initialApplied }) => {
  const navigate = useNavigate();
  const [textValue, setTextValue] = useState("");
  const [answers, setAnswers] = useState({});
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(null);
  const [qualified, setQualified] = useState(null);
  const [dynamicQuestions, setDynamicQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState("questions");
  const [enhancedCv, setEnhancedCv] = useState("");
  const [enhancing, setEnhancing] = useState(false);
  const [resumeSent, setResumeSent] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [applied, setApplied] = useState(initialApplied);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  // Sync with parent component's applied state
  useEffect(() => {
    setApplied(initialApplied);
  }, [initialApplied]);

  const fixedQuestions = [
    { id: "location", text: "Which place are you from?" },
    { id: "relocate", text: "Are you willing to relocate? (yes/no)" },
    {
      id: "salary",
      text: `Are you okay with a salary between ${job.minSalary} and ${job.maxSalary}? (yes/no)`,
    },
    { id: "qualification", text: "What is your highest educational qualification?" },
    { id: "experience", text: "How many years of relevant work experience do you have?" },
  ];

  useEffect(() => {
    if (started) {
      setLoadingQuestions(true);
      JobBotService.generateQuestions(job.title)
        .then((res) =>
          setDynamicQuestions(Array.isArray(res.data.questions) ? res.data.questions : [])
        )
        .catch(() => setDynamicQuestions([]))
        .finally(() => setLoadingQuestions(false));
    }
  }, [started, job.title]);

  const allQuestions = [
    ...fixedQuestions.map((q) => ({ ...q, type: "text" })),
    ...dynamicQuestions.map((q, i) => ({
      id: `dynamic_${i}`,
      text: q.question,
      options: q.options,
      type: "mcq",
    })),
  ];

  const currentQuestion = allQuestions[currentIndex];

  const handleTextAnswer = (id, answer) => {
    setAnswers((prev) => ({ ...prev, [id]: answer }));
    if (currentIndex < allQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleNextMcq = () => {
    if (selectedOption !== null) {
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: selectedOption }));
      setSelectedOption(null);
      if (currentIndex < allQuestions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const allQs = [...fixedQuestions.map((q) => q.text), ...dynamicQuestions.map((q) => q.question)];
    const allAs = [
      ...fixedQuestions.map((q) => answers[q.id] || ""),
      ...dynamicQuestions.map((q, i) => {
        const selected = answers[`dynamic_${i}`];
        return typeof selected === "number" ? dynamicQuestions[i].options[selected] : "";
      }),
    ];

    try {
      const res = await JobBotService.evaluateAnswers(allQs, allAs);
      const data = res.data;
      setScore(data.score);
      setQualified(data.qualified);
      setStep(data.qualified ? "enhancePrompt" : "results");
    } catch (err) {
      console.error(err);
      toast.error("Failed to evaluate answers");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayAndEnhance = () => setShowPayment(true);

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setPaymentCompleted(true);
    enhanceResume();
  };

  const enhanceResume = async () => {
    setEnhancing(true);
    try {
      const res = await JobBotService.getUserResume(user.userId);
      const resumeText = res.data.resume;

      const enhanceRes = await JobBotService.enhanceResume({
        resume: resumeText,
        jobTitle: job.title,
        company: job.company,
        jobDescription: job.description || "",
      });

      setEnhancedCv(enhanceRes.data.enhancedCv);
      setStep("enhancedResume");
      toast.success("Resume enhanced successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to enhance resume");
    } finally {
      setEnhancing(false);
    }
  };

  const handleSendResume = async () => {
    try {
      await JobBotService.applyToJob({
        userId: user.userId,
        jobId: job.jobId,
        answers,
        score,
        qualified: true,
      });
      setResumeSent(true);
      setApplied(true);
      if (onFinish) onFinish(job.jobId);
      toast.success("Resume sent successfully!");
    } catch (err) {
      console.error("Failed to apply:", err);
      toast.error("Failed to send resume");
    }
  };

  const handleCloseAndApply = async () => {
    if (!resumeSent && enhancedCv) {
      await handleSendResume();
    }
    onClose();
  };

  const handleCloseOnly = () => onClose();

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto flex flex-col">
      <ToastContainer position="top-center" autoClose={3000} />

      <button
        onClick={handleCloseOnly}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <X size={28} />
      </button>

      <div className="flex-1 w-full px-6 sm:px-10 md:px-16 py-10 text-center">
        {applied && !started ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">✅ Applied Successfully!</h2>
            <p className="mb-4">You've already applied to this position.</p>
            <button onClick={handleCloseOnly} className="bg-gray-600 text-white px-4 py-2 rounded">
              Close
            </button>
          </div>
        ) : (
          <>
            {showPayment ? (
              <PaymentPage
                purpose="cv-enhancement"
                amount={299}
                onSuccess={handlePaymentSuccess}
                onCancel={() => setShowPayment(false)}
                embedded={true}
              />
            ) : (
              <>
                {paymentCompleted && enhancing && (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-blue-600">Enhancing your resume...</p>
                    <p className="text-gray-600 text-sm mt-2">This may take a few moments</p>
                  </div>
                )}

                {!enhancing && (
                  <>
                    {!started && !enhancedCv && !paymentCompleted && (
                      <div className="flex flex-col items-center justify-center h-full">
                        <h2 className="text-3xl font-bold mb-4">👋 Hello!</h2>
                        <Analyse userId={user.userId} jobId={job.jobId} />
                        <p className="mb-4 text-gray-700">
                          Let's check if you're a good fit for this position.
                        </p>
                        <button
                          onClick={() => setStarted(true)}
                          className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700"
                        >
                          Start Questions
                        </button>
                      </div>
                    )}

                    {started && loadingQuestions && (
                      <div className="flex flex-col items-center justify-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <p>Loading questions...</p>
                      </div>
                    )}

                      {started && !loadingQuestions && step === "questions" && currentQuestion && (
                        <div>
                          <h2 className="text-lg font-semibold mb-4">
                            Question {currentIndex + 1} of {allQuestions.length}
                          </h2>
                          <p className="mb-4 text-gray-700">{currentQuestion.text}</p>
                          {currentQuestion.type === "text" ? (
                            <div className="flex flex-col items-center">
                              <input
                                type="text"
                                className="border p-2 rounded w-full mb-4"
                                value={textValue}
                                onChange={(e) => setTextValue(e.target.value)}
                                placeholder="Your answer..."
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && e.target.value.trim()) {
                                    handleTextAnswer(currentQuestion.id, e.target.value.trim());
                                    e.target.value = "";
                                  }
                                }}
                              />
                              <button
                                onClick={() => {
                                if (textValue.trim()) {
                                handleTextAnswer(currentQuestion.id, textValue.trim());
                                setTextValue(""); // clear input after submit
                                }
                              }}
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                              >
                                {currentIndex === allQuestions.length - 1 ? "Submit" : "Next"}
                              </button>
                            </div>
                          ) : (
                            <>
                              <div className="space-y-2 mb-4">
                                {currentQuestion.options.map((opt, idx) => (
                                  <label key={idx} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                      type="radio"
                                      name="mcq-option"
                                      checked={selectedOption === idx}
                                      onChange={() => setSelectedOption(idx)}
                                      className="mr-3"
                                    />
                                    <span className="text-left">{opt}</span>
                                  </label>
                                ))}
                              </div>
                              <button
                                onClick={currentIndex === allQuestions.length - 1 ? handleSubmit : handleNextMcq}
                                disabled={selectedOption === null || submitting}
                                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                              >
                                {currentIndex === allQuestions.length - 1
                                  ? submitting
                                    ? "Submitting..."
                                    : "Submit"
                                  : "Next"}
                              </button>
                            </>
                          )}
                        </div>
                      )}

                    {step === "results" && !qualified && (
                      <div className="py-10">
                        <div className="text-red-500 mb-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 mx-auto"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <h2 className="text-red-600 text-xl font-bold mb-2">Not Qualified</h2>
                        <p className="mb-4">Your score: {score}/100</p>
                        <p className="text-gray-600 mb-6">
                          Unfortunately, your qualifications don't meet the requirements for this
                          position.
                        </p>
                        <button
                          onClick={handleCloseOnly}
                          className="bg-gray-600 text-white px-4 py-2 rounded"
                        >
                          Close
                        </button>
                      </div>
                    )}

                    {step === "enhancePrompt" && (
                      <div className="py-10">
                        <div className="text-green-500 mb-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 mx-auto"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <h2 className="text-green-700 text-xl font-bold mb-2">✅ Qualified!</h2>
                        <p className="mb-4">Your score: {score}/100</p>
                        <p className="text-gray-700 mb-6">
                          Would you like to enhance your resume for this specific position?
                        </p>
                        <div className="flex flex-col gap-3">
                          <button
                            onClick={async () => {
                              await handleSendResume();
                              setStep("success");
                            }}
                            className="bg-gray-600 text-white px-4 py-2 rounded"
                          >
                            Send My Current Resume
                          </button>
                        </div>
                      </div>
                    )}

                    {step === "enhancedResume" && enhancedCv && (
                      <div className="py-10">
                        <div className="text-green-500 mb-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 mx-auto"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <h2 className="text-green-700 text-xl font-bold mb-2">
                          🎉 Resume Enhanced!
                        </h2>
                        <p className="text-gray-700 mb-6">
                          Your resume has been tailored for this position.
                        </p>

                        <div className="flex flex-col gap-3 mb-6">
                          <a
                            href={`data:text/plain;charset=utf-8,${encodeURIComponent(enhancedCv)}`}
                            download="enhanced_resume.txt"
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                          >
                            Download Enhanced Resume
                          </a>

                          {!resumeSent ? (
                            <button
                              onClick={async () => {
                                await handleSendResume();
                                setStep("success");
                              }}
                              className="bg-green-600 text-white px-4 py-2 rounded"
                            >
                              Send Enhanced Resume to Employer
                            </button>
                          ) : (
                            <p className="text-green-600 font-medium">
                              ✅ Resume sent to employer
                            </p>
                          )}
                        </div>

                        <button
                          onClick={handleCloseAndApply}
                          className="bg-gray-600 text-white px-4 py-2 rounded"
                        >
                          {applied ? "Close" : "Close Without Applying"}
                        </button>
                      </div>
                    )}

                    {(step === "success" || (resumeSent && step !== "enhancedResume")) && (
                      <div className="py-10">
                        <div className="text-green-500 mb-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 mx-auto"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <h2 className="text-green-700 text-xl font-bold mb-2">
                          Application Submitted!
                        </h2>
                        <p className="text-gray-700 mb-6">
                          Your resume has been sent to the employer.
                        </p>
                        <button
                          onClick={handleCloseOnly}
                          className="bg-gray-600 text-white px-4 py-2 rounded"
                        >
                          Close
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BotModal;
