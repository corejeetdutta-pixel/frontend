import './PaymentSuccess.css';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import timeMoneyGif from './../../assets/time-is-money.gif'; // Adjust path as needed

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [amount, setAmount] = useState(null);
    const [loading, setLoading] = useState(true);

    // Extract session_id from URL query params
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get('session_id');

    useEffect(() => {
        const verifyPayment = async () => {
            if (!sessionId) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL_NODE}/verify-checkout-session?session_id=${sessionId}`
                );
                const data = await res.json();
                console.log(data);
                if (data.success) setAmount(data.payment.amount);
            } catch (err) {
                console.error("Payment verification failed:", err);
            } finally {
                setLoading(false);
            }
        };

        verifyPayment();
    }, [sessionId]);

    return (
        <div className="success-container">
            <div className="success-box">
                {loading ? (
                    <div className='success-box-loading'>
                        <img
                            src={timeMoneyGif}
                            alt='Hold On'
                            width={120}
                            height={120}
                            style={{ marginBottom: 18 }}
                        />
                        <div className="loading-msg">
                            Hold on... we are verifying your payment
                        </div>
                    </div>
                ) : amount ? (
                    <>
                        <div className="tick-mark">
                            <IoCheckmarkDoneCircle />
                        </div>
                        <h1>Payment Successful</h1>
                        <div className="amount-paid">₹{amount}</div>
                        <div className="message">
                            Thank you! Your payment was processed successfully.
                        </div>
                        <div className="btn-row">
                            <button className="home-btn" onClick={() => navigate("/")}>
                                Back to Home
                            </button>
                            <button className="resume-btn" onClick={() => navigate("/resume-dashboard")}>
                                Go to Dashboard
                            </button>
                        </div>
                    </>
                ) : (
                    <div>
                        <div className="tick-mark fail">
                            <IoCheckmarkDoneCircle />
                        </div>
                        <h1>Something went wrong</h1>
                        <div className="message">
                            We couldn't verify your payment. Please contact support.
                        </div>
                        <button className="home-btn" onClick={() => navigate("/")}>
                            Back to Home
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentSuccess;
