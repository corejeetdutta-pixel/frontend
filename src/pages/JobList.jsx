import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import JobCard from "../components/JobCard";
import BotModal from "./BotModal";
import JobServices from "../api/JobServices";
import BookmarkService from "../api/BookmarkServices";
import ApplicationService from "../api/ApplicationServices";
import { toast } from 'react-toastify';

const JobList = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = user?.userId;

  // Get jobId from navigation state if exists
  const selectedJobIdFromState = location.state?.selectedJobId;
  
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filters, setFilters] = useState({ location: "", company: "", jobId: "" });
  const [sortBy, setSortBy] = useState("latest");
  const [bookmarked, setBookmarked] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showFullDetails, setShowFullDetails] = useState(false);
  const [showBotModal, setShowBotModal] = useState(false);

  const loader = useRef(null);

  // Function to check if a job is expired
  const isJobExpired = (lastDate) => {
    const today = new Date();
    const lastDateObj = new Date(lastDate);
    return lastDateObj < today;
  };

  // Function to calculate remaining days
  const calculateRemainingDays = (lastDate) => {
    const today = new Date();
    const lastDateObj = new Date(lastDate);
    const diffTime = lastDateObj - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  useEffect(() => {
    fetchJobs(0);
    if (userId) {
      // fetchBookmarkedJobs();
      fetchAppliedJobs();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (loader.current) observer.observe(loader.current);
    return () => loader.current && observer.unobserve(loader.current);
  }, [hasMore, userId]);

  useEffect(() => {
    if (page > 0) fetchJobs(page);
  }, [page]);

  useEffect(() => {
    if (location.state?.paymentCompleted && location.state?.appliedJobId) {
      setAppliedJobs((prev) =>
        prev.includes(location.state.appliedJobId) ? prev : [...prev, location.state.appliedJobId]
      );
    }
  }, [location.state]);

  // Effect to handle job selection from state
  useEffect(() => {
    if (selectedJobIdFromState && jobs.length > 0 && appliedJobs.length > 0) {
      const jobFromState = jobs.find(job => job.jobId === selectedJobIdFromState);
      if (jobFromState) {
        setSelectedJob(jobFromState);
        
        // Check if user has already applied
        if (appliedJobs.includes(selectedJobIdFromState)) {
          toast.info("You've already applied for this job");
        } else if (isJobExpired(jobFromState.lastDate)) {
          toast.error("This job is no longer active");
        } else {
          setShowBotModal(true);
        }
        
        // Clear state after using it
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [jobs, appliedJobs, selectedJobIdFromState]);

  const fetchJobs = async (pageNumber) => {
    try {
      setLoading(true);
      const res = await JobServices.getAllJobsPaginated(pageNumber);
      const jobData = res.data || [];
      const newJobs = jobData.map(item => item.job);
      const allJobs = [...jobs, ...newJobs];
      const uniqueJobs = Array.from(new Map(allJobs.map((j) => [j.jobId, j])).values());
      setJobs(uniqueJobs);
      setHasMore(newJobs.length > 0);
    } catch (err) {
      console.error("❌ Failed to fetch jobs", err);
    } finally {
      setLoading(false);
    }
  };

  // const fetchBookmarkedJobs = async () => {
  //   try {
  //     const res = await BookmarkService.getUserBookmarks(userId);
  //     setBookmarked(res.data.map((b) => b.jobId));
  //   } catch (err) {
  //     console.error("❌ Failed to fetch bookmarks", err);
  //   }
  // };

  const fetchAppliedJobs = async () => {
  try {
    const res = await ApplicationService.getUserApplications(userId);
    const jobIds = res.data.map((app) => app.jobId);
    setAppliedJobs(jobIds);
  } catch (err) {
    console.error("❌ Failed to fetch applied jobs", err);
    if (err.response?.status === 403) {
      toast.error("Authentication error. Please log in again.");
    } else {
      toast.error("Failed to load your applications. Please try again later.");
    }
  }
};

  const handleBookmark = async (jobId) => {
    try {
      if (bookmarked.includes(jobId)) {
        await BookmarkService.removeBookmark(userId, jobId);
      } else {
        await BookmarkService.addBookmark(userId, jobId);
      }
      fetchBookmarkedJobs();
    } catch (err) {
      console.error("❌ Failed to update bookmark", err);
    }
  };

  const handleApplyClick = (job) => {
    // Check if job is expired
    if (isJobExpired(job.lastDate)) {
      toast.error('This job is no longer active');
      return;
    }
    
    // Check if already applied
    if (appliedJobs.includes(job.jobId)) {
      toast.info("You've already applied for this job");
      return;
    }
    
    setSelectedJob(job);
    setShowBotModal(true);
  };

  const sortJobs = (list) => {
    if (sortBy === "latest") {
      return list.slice().sort((a, b) => new Date(b.lastDate) - new Date(a.lastDate));
    }
    if (sortBy === "salary") {
      return list.slice().sort((a, b) => parseFloat(b.maxSalary) - parseFloat(a.maxSalary));
    }
    return list;
  };

  const filteredJobs = sortJobs(
    jobs.filter(
      (job) =>
        job?.location?.toLowerCase().includes(filters.location.toLowerCase()) &&
        job?.company?.toLowerCase().includes(filters.company.toLowerCase()) &&
        job?.jobId?.toLowerCase().includes(filters.jobId.toLowerCase())
    )
  );

  useEffect(() => {
    if (filteredJobs.length === 0) {
      setSelectedJob(null);
    } else if (!selectedJob || !filteredJobs.some((job) => job.jobId === selectedJob.jobId)) {
      setSelectedJob(filteredJobs[0]);
    }
  }, [filteredJobs, selectedJob]);

  return (
    <div className="w-full space-y-4">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row md:items-center gap-4 sticky top-0 z-10">
        <input
          type="text"
          placeholder="Filter by Location"
          className="border rounded px-4 py-2 w-full md:w-1/4"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filter by Company"
          className="border rounded px-4 py-2 w-full md:w-1/4"
          value={filters.company}
          onChange={(e) => setFilters({ ...filters, company: e.target.value })}
        />
        <input
          type="text"
          placeholder="Search by Job ID"
          className="border rounded px-4 py-2 w-full md:w-1/4"
          value={filters.jobId}
          onChange={(e) => setFilters({ ...filters, jobId: e.target.value })}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded px-4 py-2 w-full md:w-1/4"
        >
          <option value="latest">📅 Latest First</option>
          <option value="salary">💰 Highest Salary</option>
        </select>
      </div>

      {/* Layout */}
      <div className="flex gap-6">
        {/* Left Panel */}
        <div className="w-1/2 h-[70vh] overflow-y-auto pr-4">
          {filteredJobs.map((job) => (
            <div
              key={job.jobId}
              onClick={() => {
                setSelectedJob(job);
                setShowFullDetails(false);
              }}
              className={`cursor-pointer ${
                selectedJob?.jobId === job.jobId ? "ring-2 ring-blue-500 rounded-md" : ""
              }`}
            >
              <JobCard
                job={job}
                isSelected={selectedJob?.jobId === job.jobId}
                isBookmarked={bookmarked.includes(job.jobId)}
                isApplied={appliedJobs.includes(job.jobId)}
                onApply={() => handleApplyClick(job)}
                onBookmark={() => handleBookmark(job.jobId)}
              />
            </div>
          ))}
          {loading && (
            <div className="text-center py-4 text-gray-400 animate-pulse">Loading more jobs...</div>
          )}
          {hasMore && (
            <div ref={loader} className="text-center py-4 text-sm text-gray-500">
              Scroll to load more...
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="w-1/2 sticky top-[130px] self-start h-[70vh] overflow-y-auto bg-white p-6 shadow-lg rounded-xl">
          {selectedJob ? (
            <>
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold">{selectedJob.title}</h2>
                <div className="flex items-center gap-2">
                  {!isJobExpired(selectedJob.lastDate) && (
                    <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-1 rounded">
                      {calculateRemainingDays(selectedJob.lastDate) === 0 
                        ? 'Last day to apply' 
                        : `${calculateRemainingDays(selectedJob.lastDate)} days left`}
                    </span>
                  )}
                  <button
                    onClick={() => setShowFullDetails((prev) => !prev)}
                    className="text-sm text-blue-600 underline"
                  >
                    {showFullDetails ? "Show Less" : "View More"}
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mt-2">🏢 {selectedJob.company}</p>
              <p className="text-gray-600">📍 {selectedJob.location}</p>
              <p className="text-green-700 mt-2 font-semibold">
                💰 {selectedJob.minSalary} - {selectedJob.maxSalary}
              </p>
              
              {/* Show expiration status */}
              {isJobExpired(selectedJob.lastDate) && (
                <div className="mt-2 p-2 bg-red-100 text-red-700 rounded-md">
                  ⏰ This job posting has expired
                </div>
              )}
              
              {!showFullDetails ? (
                <p className="mt-4 text-sm text-gray-700 line-clamp-3">{selectedJob.description}</p>
              ) : (
                <div className="mt-4 space-y-3 text-sm text-gray-700">
                  <p><strong>Description:</strong> {selectedJob.description}</p>
                  <p><strong>Requirements:</strong> {selectedJob.requirements}</p>
                  <p><strong>Perks:</strong> {selectedJob.perks}</p>
                  <p><strong>Experience:</strong> {selectedJob.experience}</p>
                  <p><strong>Job Type:</strong> {selectedJob.jobType}</p>
                  <p><strong>Employment Type:</strong> {selectedJob.employmentType}</p>
                  <p><strong>Department:</strong> {selectedJob.department}</p>
                  <p><strong>Mode:</strong> {selectedJob.mode}</p>
                  <p><strong>Openings:</strong> {selectedJob.openings}</p>
                  <p><strong>Opening Date:</strong> {selectedJob.openingDate}</p>
                  <p><strong>Last Date to Apply:</strong> {selectedJob.lastDate}</p>
                  <p><strong>Contact Email:</strong> {selectedJob.contactEmail}</p>
                  <p><strong>Job ID:</strong> {selectedJob.jobId}</p>
                </div>
              )}
              <button
                onClick={() => handleApplyClick(selectedJob)}
                disabled={appliedJobs.includes(selectedJob.jobId) || isJobExpired(selectedJob.lastDate)}
                className={`mt-6 px-6 py-2 rounded-full transition ${
                  appliedJobs.includes(selectedJob.jobId) || isJobExpired(selectedJob.lastDate)
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                title={isJobExpired(selectedJob.lastDate) ? "This job is no longer active" : appliedJobs.includes(selectedJob.jobId) ? "Already applied" : "Apply for this job"}
              >
                {isJobExpired(selectedJob.lastDate) 
                  ? "❌ Expired" 
                  : appliedJobs.includes(selectedJob.jobId) 
                    ? "✔️ Applied" 
                    : "✅ Apply"}
              </button>
            </>
          ) : (
            <p className="text-gray-400 italic">No job selected</p>
          )}
        </div>
      </div>

      {/* Bot Modal - Only show if job is not expired */}
      {showBotModal && selectedJob && !isJobExpired(selectedJob.lastDate) && (
        <BotModal
          job={selectedJob}
          user={user}
          onClose={() => setShowBotModal(false)}
          onFinish={(success) => {
            if (success) {
              setAppliedJobs((prev) => [...prev, selectedJob.jobId]);
              toast.success("Application submitted successfully!");
            }
            setShowBotModal(false);
          }}
        />
      )}
    </div>
  );
};

export default JobList;