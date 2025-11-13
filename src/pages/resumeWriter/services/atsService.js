import axios from 'axios';



export const getATSAnalysis = async (userId, jobId) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL_NODE}/analyze`, {
            userId,
            jobId
        });
        return response.data;
    } catch (error) {
        console.error("Error getting ATS analysis:", error);
        throw error;
    }
};

export const enhanceResume = async (userId, jobId) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL_NODE}/enhance-resume-jd`, {
            userId,
            jobId,
        });
        return response.data;
    } catch (error) {
        console.error("Error enhancing resume:", error);
        throw error;
    }
};
