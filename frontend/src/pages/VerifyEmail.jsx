import React, { useEffect, useRef, useState } from 'react';
import { authAPI } from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Bot,
  Mail,
  ShieldCheck,
  LockKeyhole,
  RefreshCw,
  Info,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || '');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(45);

  const inputRefs = useRef([]);

  // =========================================================
  // RESEND COUNTDOWN
  // =========================================================

  useEffect(() => {
    if (countdown <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setCountdown((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // =========================================================
  // OTP INPUT
  // =========================================================

  const handleCodeChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);

    const codeArray = code.padEnd(6, '').split('');

    codeArray[index] = digit;

    const newCode = codeArray.join('').slice(0, 6);

    setCode(newCode);
    setError('');
    setMessage('');

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // =========================================================
  // OTP KEYBOARD NAVIGATION
  // =========================================================

  const handleKeyDown = (index, event) => {
    if (
      event.key === 'Backspace' &&
      !code[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }

    if (
      event.key === 'ArrowLeft' &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }

    if (
      event.key === 'ArrowRight' &&
      index < 5
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // =========================================================
  // OTP PASTE
  // =========================================================

  const handlePaste = (event) => {
    event.preventDefault();

    const pastedCode = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6);

    if (!pastedCode) {
      return;
    }

    setCode(pastedCode);
    setError('');
    setMessage('');

    const focusIndex = Math.min(pastedCode.length, 5);

    inputRefs.current[focusIndex]?.focus();
  };

  // =========================================================
  // VERIFY EMAIL
  // =========================================================

  const handleVerify = async (event) => {
    event.preventDefault();

    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      setError(
        'Please enter a valid 6-digit verification code.'
      );
      return;
    }

    try {
      setLoading(true);

      const response = await authAPI.verifyEmail(
        email.trim(),
        code
      );

      if (response.data.success) {
        setMessage('Email verified successfully!');

        setTimeout(() => {
          navigate('/login');
        }, 1200);
      } else {
        setError(
          response.data.message ||
            'Verification failed.'
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Invalid or expired verification code.'
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // RESEND VERIFICATION CODE
  // =========================================================

  const handleResend = async () => {
    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (countdown > 0) {
      return;
    }

    try {
      setResending(true);

      const response =
        await authAPI.resendVerificationCode(
          email.trim()
        );

      if (response.data.success) {
        setMessage(
          'A new verification code has been sent.'
        );

        setCode('');
        setCountdown(45);

        inputRefs.current[0]?.focus();
      } else {
        setError(
          response.data.message ||
            'Failed to resend verification code.'
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to resend verification code.'
      );
    } finally {
      setResending(false);
    }
  };

  // =========================================================
  // DATA
  // =========================================================
const codeArray = Array.from(
  { length: 6 },
  (_, index) => code[index] || ''
);

  const formattedCountdown =
    `00:${String(countdown).padStart(2, '0')}`;

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-[#05001d]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="h-[86px] bg-[#030018] border-b border-white/10 px-6 md:px-10 lg:px-16 flex items-center justify-between">

        {/* LOGO */}

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8f38ff] to-[#d32cff] flex items-center justify-center shadow-lg shadow-purple-500/30">

            <Bot
              size={28}
              className="!text-white"
              strokeWidth={2.5}
            />

          </div>

          <div className="text-2xl md:text-[27px] font-bold tracking-tight">

            <span className="!text-white">
              InterviewTwin
            </span>

            <span className="!text-[#b33cff]">
              {' '}AI
            </span>

          </div>

        </div>


        {/* BACK TO LOGIN */}

        <div className="flex items-center gap-4">

          <span className="hidden sm:block !text-white text-sm md:text-base">
            Already verified?
          </span>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="px-5 md:px-6 py-3 rounded-xl border border-[#a93cff] bg-transparent !text-[#c05aff] font-semibold hover:bg-[#a93cff]/10 transition-all"
          >
            Back to Login
          </button>

        </div>

      </header>


      {/* =====================================================
          MAIN BACKGROUND
      ===================================================== */}

      <main className="min-h-[calc(100vh-86px)] bg-gradient-to-br from-[#08004d] via-[#1a056c] to-[#7200a7] px-4 py-6 md:px-8 lg:px-16 flex items-center justify-center">

        {/* ===================================================
            MAIN CARD
        =================================================== */}

        <div className="w-full max-w-[1400px] min-h-[720px] rounded-[22px] overflow-hidden border border-white/25 shadow-[0_30px_100px_rgba(0,0,0,0.45)] grid lg:grid-cols-2">


          {/* =================================================
              LEFT PANEL
          ================================================= */}

          <section className="relative overflow-hidden bg-gradient-to-br from-[#17105d] via-[#24117d] to-[#08052f] px-8 py-10 md:px-12 lg:px-16 flex flex-col justify-between">

            {/* Decorative circles */}

            <div className="absolute top-24 left-20 w-8 h-8 rounded-full border border-purple-300/20" />

            <div className="absolute top-28 right-28 w-8 h-8 rounded-full border border-purple-300/20" />

            <div className="absolute bottom-48 right-20 w-8 h-8 rounded-full border border-purple-300/20" />

            <div className="absolute top-40 left-48 w-1 h-1 rounded-full bg-purple-300 shadow-[0_0_12px_5px_rgba(168,85,247,0.7)]" />

            <div className="absolute top-52 right-24 w-1 h-1 rounded-full bg-purple-300 shadow-[0_0_12px_5px_rgba(168,85,247,0.7)]" />


            {/* ILLUSTRATION */}

            <div className="flex-1 flex flex-col items-center justify-center">

              <div className="relative w-[310px] h-[330px] md:w-[350px] md:h-[360px]">

                {/* Glow */}

                <div className="absolute inset-10 bg-purple-600/30 rounded-full blur-[70px]" />


                {/* Paper */}

                <div className="absolute top-4 left-[72px] w-[170px] h-[125px] bg-gradient-to-br from-[#a56aff] to-[#6631e5] rounded-[22px] rotate-[-6deg] opacity-90" />


                {/* White security card */}

                <div className="absolute top-[35px] left-1/2 -translate-x-1/2 w-[185px] h-[165px] bg-white rounded-2xl shadow-2xl z-20 flex items-center justify-center">

                  <div className="w-[82px] h-[82px] rounded-full bg-gradient-to-br from-[#793bff] to-[#5422d9] flex items-center justify-center">

                    <ShieldCheck
                      size={50}
                      className="!text-white"
                      strokeWidth={2}
                    />

                  </div>

                </div>


                {/* Envelope */}

                <div className="absolute bottom-7 left-1/2 -translate-x-1/2 w-[280px] h-[185px] rounded-2xl bg-gradient-to-br from-[#8041ff] to-[#4d1dd0] shadow-[0_25px_45px_rgba(0,0,0,0.4)] z-10">

                  {/* Top flap */}

                  <div className="absolute -top-[88px] left-0 w-full h-[115px] overflow-hidden">

                    <div className="absolute left-1/2 -translate-x-1/2 top-8 w-[205px] h-[205px] rotate-45 rounded-[25px] bg-gradient-to-br from-[#a061ff] to-[#6630e6]" />

                  </div>


                  {/* Bottom flap */}

                  <div className="absolute bottom-0 left-0 w-full h-[120px] overflow-hidden rounded-b-2xl">

                    <div className="absolute left-1/2 -translate-x-1/2 -bottom-[80px] w-[230px] h-[230px] rotate-45 rounded-[25px] bg-gradient-to-br from-[#8e50ff] to-[#5c25df]" />

                  </div>

                </div>

              </div>


              {/* LEFT HEADING */}

              <div className="text-center -mt-1">

                <h1 className="text-4xl md:text-5xl font-bold !text-white">

                  Verify Your{' '}

                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b657ff] to-[#d438ff]">
                    Email
                  </span>

                </h1>

                <p className="mt-4 text-lg md:text-xl !text-[#d5d0f1] leading-relaxed">

                  We've sent a 6-digit verification code

                  <br />

                  to your email address.

                </p>

              </div>

            </div>


            {/* SECURITY BOX */}

            <div className="rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-sm px-6 py-6 flex items-center gap-5">

              <div className="w-16 h-16 shrink-0 rounded-full bg-gradient-to-br from-[#7b3cff] to-[#5420dc] flex items-center justify-center">

                <LockKeyhole
                  size={30}
                  className="!text-white"
                />

              </div>

              <div>

                <h3 className="text-xl font-bold !text-white">
                  Secure & Safe
                </h3>

                <p className="mt-2 !text-[#c9c5e6] leading-relaxed">
                  Your verification code is 6 digits long
                  <br />
                  and will expire in 10 minutes.
                </p>

              </div>

            </div>

          </section>


          {/* =================================================
              RIGHT PANEL
          ================================================= */}

          <section className="bg-white !text-[#171a35] px-7 py-10 md:px-12 lg:px-12 xl:px-14 flex items-center">

            <div className="w-full max-w-[680px] mx-auto">


              {/* MAIL ICON */}

              <div className="flex justify-center mb-6">

                <div className="w-24 h-24 rounded-full bg-[#f0e9ff] flex items-center justify-center">

                  <Mail
                    size={48}
                    strokeWidth={2}
                    className="!text-[#6630e8]"
                  />

                </div>

              </div>


              {/* TITLE */}

              <div className="text-center">

                <h2 className="text-[30px] md:text-[32px] font-bold !text-[#10142b]">
                  Enter Verification Code
                </h2>

                <p className="mt-4 text-lg !text-[#66709b] leading-relaxed">
                  Please enter the 6-digit verification code
                  <br />
                  sent to your email address.
                </p>

              </div>


              {/* FORM */}

              <form
                onSubmit={handleVerify}
                className="mt-8"
              >

                {/* EMAIL */}

                <div>

                  <label className="block text-lg font-semibold !text-[#171a35] mb-3">
                    Email Address
                  </label>

                  <div className="relative">

                    <Mail
                      size={24}
                      className="absolute left-5 top-1/2 -translate-y-1/2 !text-[#7881a5]"
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="Enter your email"
                      className="w-full h-16 rounded-xl border-2 border-[#c8a8ff] !bg-white pl-16 pr-5 text-lg !text-[#171a35] placeholder:!text-[#7780a4] caret-[#7131ff] outline-none focus:border-[#7131ff] focus:ring-4 focus:ring-[#7131ff]/10 transition-all"
                      required
                    />

                  </div>

                </div>


                {/* VERIFICATION CODE */}

                <div className="mt-7">

                  <label className="block text-lg font-semibold !text-[#171a35] mb-4">
                    Verification Code
                  </label>


                  {/* SIX OTP BOXES */}

                  <div className="grid grid-cols-6 gap-2.5 sm:gap-4">

                    {codeArray.map((digit, index) => (

                      <input
                        key={index}
                        ref={(element) => {
                          inputRefs.current[index] = element;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        placeholder="–"
                        onChange={(event) =>
                          handleCodeChange(
                            index,
                            event.target.value
                          )
                        }
                        onKeyDown={(event) =>
                          handleKeyDown(
                            index,
                            event
                          )
                        }
                        onPaste={handlePaste}
                        className={`w-full h-[68px] text-center text-2xl font-bold rounded-xl border-2 !bg-white outline-none caret-[#7131ff] transition-all ${
                          digit
                            ? '!border-[#7131ff] !text-[#5f27db]'
                            : '!border-[#c8a8ff] !text-[#7780a4]'
                        } placeholder:!text-[#7780a4] focus:!border-[#7131ff] focus:ring-4 focus:ring-[#7131ff]/10`}
                        aria-label={`Verification digit ${index + 1}`}
                      />

                    ))}

                  </div>

                </div>


                {/* INFORMATION BOX */}

                <div className="mt-6 rounded-xl !bg-[#f5f1ff] px-5 py-4 flex items-center gap-3">

                  <Info
                    size={22}
                    className="!text-[#7535ff] shrink-0"
                  />

                  <p className="text-base !text-[#5f668e]">
                    Didn't receive the code? Check your spam folder.
                  </p>

                </div>


                {/* ERROR */}

                {error && (

                  <div className="mt-4 rounded-xl !bg-red-50 border border-red-100 px-4 py-3 flex items-center gap-3">

                    <AlertCircle
                      size={20}
                      className="!text-red-500 shrink-0"
                    />

                    <p className="text-sm !text-red-600">
                      {error}
                    </p>

                  </div>

                )}


                {/* SUCCESS */}

                {message && (

                  <div className="mt-4 rounded-xl !bg-green-50 border border-green-100 px-4 py-3 flex items-center gap-3">

                    <CheckCircle2
                      size={20}
                      className="!text-green-500 shrink-0"
                    />

                    <p className="text-sm !text-green-600">
                      {message}
                    </p>

                  </div>

                )}


                {/* VERIFY BUTTON */}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 w-full h-[62px] rounded-xl bg-gradient-to-r from-[#6927ff] via-[#8d2fff] to-[#c02cff] !text-white text-lg font-bold shadow-lg shadow-purple-500/25 hover:brightness-105 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
                >

                  {loading ? (

                    <>
                      <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Verifying...
                    </>

                  ) : (

                    <>
                      <ShieldCheck
                        size={25}
                        className="!text-white"
                      />
                      Verify Email
                    </>

                  )}

                </button>

              </form>


              {/* OR DIVIDER */}

              <div className="flex items-center gap-5 my-7">

                <div className="flex-1 h-px bg-[#d7d8e5]" />

                <span className="!text-[#687095] text-lg">
                  or
                </span>

                <div className="flex-1 h-px bg-[#d7d8e5]" />

              </div>


              {/* RESEND */}

              <button
                type="button"
                onClick={handleResend}
                disabled={
                  resending ||
                  countdown > 0
                }
                className="w-full h-[62px] rounded-xl border-2 border-[#c8a8ff] !bg-white !text-[#7030f5] text-lg font-semibold hover:bg-[#faf7ff] disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
              >

                <RefreshCw
                  size={25}
                  className={`!text-[#7030f5] ${
                    resending
                      ? 'animate-spin'
                      : ''
                  }`}
                />

                {resending
                  ? 'Sending...'
                  : countdown > 0
                  ? `Resend Verification Code (${formattedCountdown})`
                  : 'Resend Verification Code'}

              </button>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
};

export default VerifyEmail;