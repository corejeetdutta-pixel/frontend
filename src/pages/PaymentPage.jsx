// src/pages/PaymentPage.jsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PaymentPage = ({ purpose, amount, onSuccess, onCancel, embedded = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get parameters from props if embedded, otherwise from location state
  const params = embedded ? { purpose, amount } : location.state || {};
  const { jobId, userId, job, purpose: purposeFromState, amount: amountFromState, onSuccess: onSuccessFromState } = params;

  const [step, setStep] = useState("method");
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({
    upiId: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    name: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Use the appropriate values based on whether we're embedded or not
  const finalPurpose = embedded ? purpose : purposeFromState;
  const finalAmount = embedded ? amount : amountFromState;
  const finalOnSuccess = embedded ? onSuccess : onSuccessFromState;

  // Check if we have the required parameters based on payment purpose
  if (finalPurpose === "job-application" && (!jobId || !userId)) {
    return renderInvalidNavigation("Job application");
  }
  
  if (finalPurpose === "cv-enhancement" && !finalAmount) {
    return renderInvalidNavigation("CV enhancement");
  }

  function renderInvalidNavigation(paymentType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 shadow rounded-lg max-w-sm w-full text-center">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Invalid Navigation</h2>
          <p className="text-gray-600 mb-4">Please try again from the {paymentType} page.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const validateUPI = () => {
    const newErrors = {};
    if (!paymentDetails.upiId) {
      newErrors.upiId = "UPI ID is required";
    } else if (!/^[a-zA-Z0-9.\-_]{2,49}@[a-zA-Z]{2,}$/.test(paymentDetails.upiId)) {
      newErrors.upiId = "Please enter a valid UPI ID (e.g. name@upi)";
    }
    return newErrors;
  };

  const validateCard = () => {
    const newErrors = {};
    
    if (!paymentDetails.cardNumber) {
      newErrors.cardNumber = "Card number is required";
    } else if (!/^\d{16}$/.test(paymentDetails.cardNumber.replace(/\s/g, ""))) {
      newErrors.cardNumber = "Please enter a valid 16-digit card number";
    }
    
    if (!paymentDetails.expiry) {
      newErrors.expiry = "Expiry date is required";
    } else if (!/^\d{2}\/\d{2}$/.test(paymentDetails.expiry)) {
      newErrors.expiry = "Please use MM/YY format";
    } else {
      const [month, year] = paymentDetails.expiry.split('/');
      const now = new Date();
      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;
      
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiry = "Please enter a valid month";
      } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiry = "Card has expired";
      }
    }
    
    if (!paymentDetails.cvv) {
      newErrors.cvv = "CVV is required";
    } else if (!/^\d{3,4}$/.test(paymentDetails.cvv)) {
      newErrors.cvv = "Please enter a valid CVV (3 or 4 digits)";
    }
    
    if (!paymentDetails.name) {
      newErrors.name = "Cardholder name is required";
    }
    
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === "cardNumber") {
      const formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19);
      setPaymentDetails({ ...paymentDetails, [name]: formattedValue });
    } 
    // Format expiry date with slash
    else if (name === "expiry") {
      const formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2")
        .slice(0, 5);
      setPaymentDetails({ ...paymentDetails, [name]: formattedValue });
    }
    // Limit CVV to 4 digits
    else if (name === "cvv") {
      setPaymentDetails({ ...paymentDetails, [name]: value.replace(/\D/g, "").slice(0, 4) });
    }
    else {
      setPaymentDetails({ ...paymentDetails, [name]: value });
    }
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handlePayNow = async () => {
    let newErrors = {};
    
    if (paymentMethod === "upi") {
      newErrors = validateUPI();
    } else {
      newErrors = validateCard();
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors before proceeding");
      return;
    }
    
    setSubmitting(true);
    toast.info("Processing payment...");

    // Simulate API call
    setTimeout(() => {
      toast.success("✅ Payment successful!");
      setSubmitting(false);
      
      // Handle different payment purposes
      if (finalPurpose === "cv-enhancement" && finalOnSuccess) {
        // For CV enhancement, call the success callback
        finalOnSuccess();
        if (!embedded) {
          navigate(0); // Only navigate if not embedded
        }
      } else if (!embedded) {
        // For job applications, use the existing flow only if not embedded
        navigate(0, {
          state: { paymentDone: true },
        });
      }
    }, 2000);
  };

  // Determine payment amount based on purpose
  const paymentAmount = finalPurpose === "cv-enhancement" 
    ? `₹${finalAmount || 299}` 
    : job ? `₹${job.price}` : "₹499";

  return (
    <div className={embedded ? "" : "min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4"}>
      <ToastContainer position="top-center" autoClose={3000} />
      <div className={`bg-white p-6 md:p-8 shadow rounded-lg max-w-md w-full ${embedded ? "h-full" : ""}`}>
        {step === "method" && (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">💳 Choose Payment Method</h2>
              <p className="text-gray-600 mt-2">
                {finalPurpose === "cv-enhancement" 
                  ? "Pay to enhance your resume" 
                  : "Complete your job application payment"}
              </p>
              <p className="font-semibold text-lg mt-2">{paymentAmount}</p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => {
                  setPaymentMethod("upi");
                  setStep("form");
                }}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors w-full"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-medium">UPI</div>
                    <div className="text-sm text-gray-500">Pay using your UPI ID</div>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <button
                onClick={() => {
                  setPaymentMethod("card");
                  setStep("form");
                }}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors w-full"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Credit/Debit Card</div>
                    <div className="text-sm text-gray-500">Pay using your card</div>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {embedded && onCancel && (
              <button
                onClick={onCancel}
                className="mt-4 w-full bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            )}
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-blue-700">This is a secure payment processed by our trusted partner.</p>
              </div>
            </div>
          </>
        )}

        {step === "form" && (
          <>
            <button
              onClick={() => setStep("method")}
              className="flex items-center text-gray-600 mb-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to payment methods
            </button>
            
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {paymentMethod === "upi" ? "Enter UPI Details" : "Enter Card Details"}
              </h2>
              <p className="text-gray-600 mt-1">
                {paymentMethod === "upi" 
                  ? "Enter your UPI ID to complete the payment" 
                  : "Enter your card information to complete the payment"}
              </p>
            </div>
            
            {paymentMethod === "upi" ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-1">
                    UPI ID
                  </label>
                  <input
                    id="upiId"
                    name="upiId"
                    type="text"
                    placeholder="yourname@upi"
                    value={paymentDetails.upiId}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                      errors.upiId ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                    }`}
                  />
                  {errors.upiId && <p className="mt-1 text-sm text-red-600">{errors.upiId}</p>}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    id="cardNumber"
                    name="cardNumber"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={paymentDetails.cardNumber}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                      errors.cardNumber ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                    }`}
                  />
                  {errors.cardNumber && <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>}
                </div>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={paymentDetails.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                      errors.name ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                    }`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      id="expiry"
                      name="expiry"
                      type="text"
                      placeholder="MM/YY"
                      value={paymentDetails.expiry}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                        errors.expiry ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                      }`}
                    />
                    {errors.expiry && <p className="mt-1 text-sm text-red-600">{errors.expiry}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      id="cvv"
                      name="cvv"
                      type="text"
                      placeholder="123"
                      value={paymentDetails.cvv}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                        errors.cvv ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                      }`}
                    />
                    {errors.cvv && <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>}
                  </div>
                </div>
              </div>
            )}
            
            <button
              onClick={handlePayNow}
              disabled={submitting}
              className={`mt-6 w-full py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                submitting
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500"
              }`}
            >
              {submitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                `Pay Now - ${paymentAmount}`
              )}
            </button>
            
            <div className="mt-4 flex items-center justify-center text-gray-500 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Your payment details are secure and encrypted
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;