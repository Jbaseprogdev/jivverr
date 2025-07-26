import { useState, useRef, useEffect } from "react";
import { Phone, MessageSquare, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { getFirebaseApp } from "../firebase/init";

export default function PhoneAuth({ onSuccess, onBack }) {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState("input"); // input | code | success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const recaptchaRef = useRef(null);
  const [auth, setAuth] = useState(null);

  // Initialize Firebase auth
  useEffect(() => {
    const initAuth = async () => {
      try {
        const app = await getFirebaseApp();
        const authInstance = getAuth(app);
        setAuth(authInstance);
      } catch (error) {
        console.error('PhoneAuth: Firebase initialization error:', error);
        setError('Failed to initialize authentication');
      }
    };

    if (typeof window !== 'undefined') {
      initAuth();
    }
  }, []);

  // Countdown timer for resend code
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const setupRecaptcha = async () => {
    if (!auth) return false;
    
    try {
      // Clear existing recaptcha
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
      
      // Create new recaptcha verifier
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
          console.log('reCAPTCHA solved');
        }
      });
      
      await window.recaptchaVerifier.render();
      return true;
    } catch (error) {
      console.error('reCAPTCHA setup error:', error);
      return false;
    }
  };

  const sendCode = async (e) => {
    e.preventDefault();
    if (!auth) {
      setError('Authentication not initialized');
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      // Setup reCAPTCHA
      const recaptchaReady = await setupRecaptcha();
      if (!recaptchaReady) {
        throw new Error('Failed to setup reCAPTCHA');
      }
      
      // Send verification code
      const result = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
      setConfirmationResult(result);
      setStep("code");
      setCountdown(60); // 60 second countdown
    } catch (err) {
      console.error('Send code error:', err);
      setError(err.message || 'Failed to send verification code');
    }
    setLoading(false);
  };

  const verifyCode = async (e) => {
    e.preventDefault();
    if (!confirmationResult) {
      setError('No confirmation result available');
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const result = await confirmationResult.confirm(code);
      if (result.user) {
        setStep("success");
        if (onSuccess) {
          onSuccess(result.user);
        }
      }
    } catch (err) {
      console.error('Verify code error:', err);
      setError(err.message || 'Failed to verify code');
    }
    setLoading(false);
  };

  const resendCode = async () => {
    if (countdown > 0 || !auth) return;
    
    setLoading(true);
    setError("");
    
    try {
      // Setup reCAPTCHA again
      const recaptchaReady = await setupRecaptcha();
      if (!recaptchaReady) {
        throw new Error('Failed to setup reCAPTCHA');
      }
      
      // Resend verification code
      const result = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
      setConfirmationResult(result);
      setCountdown(60);
    } catch (err) {
      console.error('Resend code error:', err);
      setError(err.message || 'Failed to resend code');
    }
    setLoading(false);
  };

  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const phoneNumber = value.replace(/\D/g, '');
    
    // Format as +1 (234) 567-8900
    if (phoneNumber.length <= 1) {
      return phoneNumber ? `+${phoneNumber}` : '';
    } else if (phoneNumber.length <= 4) {
      return `+${phoneNumber.slice(0, 1)} (${phoneNumber.slice(1)}`;
    } else if (phoneNumber.length <= 7) {
      return `+${phoneNumber.slice(0, 1)} (${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(4)}`;
    } else {
      return `+${phoneNumber.slice(0, 1)} (${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(4, 7)}-${phoneNumber.slice(7, 11)}`;
    }
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  return (
    <div className="space-y-6">
      {/* reCAPTCHA container */}
      <div ref={recaptchaRef} id="recaptcha-container" />
      
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl mb-4">
          <Phone className="w-6 h-6 text-primary-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {step === "input" && "Phone Authentication"}
          {step === "code" && "Verify Your Phone"}
          {step === "success" && "Success!"}
        </h2>
        <p className="text-gray-600">
          {step === "input" && "Enter your phone number to receive a verification code"}
          {step === "code" && `We've sent a code to ${phone}`}
          {step === "success" && "Your phone number has been verified"}
        </p>
      </div>

      {/* Back button for code step */}
      {step === "code" && (
        <button
          onClick={() => setStep("input")}
          className="btn-ghost flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Change Phone Number
        </button>
      )}

      {/* Phone Input Step */}
      {step === "input" && (
        <form onSubmit={sendCode} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                className="input-field pl-12"
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="+1 (234) 567-8900"
                required
                maxLength="17"
              />
            </div>
            <p className="form-help">We'll send you a verification code via SMS</p>
          </div>

          {error && (
            <div className="p-4 bg-danger-50 border border-danger-200 rounded-xl">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-danger-500" />
                <p className="text-sm text-danger-700">{error}</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !phone || phone.length < 14}
            className="btn-primary w-full flex items-center justify-center gap-2 py-4"
          >
            {loading ? (
              <>
                <div className="loading-spinner w-5 h-5"></div>
                Sending Code...
              </>
            ) : (
              <>
                <MessageSquare className="w-5 h-5" />
                Send Verification Code
              </>
            )}
          </button>
        </form>
      )}

      {/* Code Verification Step */}
      {step === "code" && (
        <form onSubmit={verifyCode} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Verification Code</label>
            <input
              className="input-field text-center text-2xl font-mono tracking-widest"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              required
              maxLength="6"
            />
            <p className="form-help">Enter the 6-digit code sent to your phone</p>
          </div>

          {error && (
            <div className="p-4 bg-danger-50 border border-danger-200 rounded-xl">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-danger-500" />
                <p className="text-sm text-danger-700">{error}</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="btn-primary w-full flex items-center justify-center gap-2 py-4"
          >
            {loading ? (
              <>
                <div className="loading-spinner w-5 h-5"></div>
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Verify Code
              </>
            )}
          </button>

          {/* Resend Code */}
          <div className="text-center">
            <button
              type="button"
              onClick={resendCode}
              disabled={countdown > 0 || loading}
              className="btn-ghost text-sm"
            >
              {countdown > 0 
                ? `Resend code in ${countdown}s` 
                : "Didn't receive code? Resend"
              }
            </button>
          </div>
        </form>
      )}

      {/* Success Step */}
      {step === "success" && (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-success-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Phone Verified!</h3>
            <p className="text-gray-600">You can now use all features of the app</p>
          </div>
        </div>
      )}

      {/* Back to Email Auth */}
      {step === "input" && onBack && (
        <div className="text-center">
          <button
            onClick={onBack}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
          >
            ← Back to Email Sign In
          </button>
        </div>
      )}
    </div>
  );
} 