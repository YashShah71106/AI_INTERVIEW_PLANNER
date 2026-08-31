import { useContext } from "react";
import { RouterProvider } from "react-router";
import { router } from "./app.routes.jsx";
import {
  AuthProvider,
  AuthContext
} from "./features/auth/auth.context.jsx";


// =====================================================
// PREMIUM LOADING SCREEN
// =====================================================

const LoadingScreen = () => {

  return (
    <div className="premium-loader">

      {/* Background glow */}
      <div className="background-glow glow-one"></div>
      <div className="background-glow glow-two"></div>


      {/* Floating particles */}
      <div className="particles">

        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>

      </div>


      {/* Main animation */}
      <div className="loader-wrapper">

        <div className="orbit-system">

          {/* Outer rings */}
          <div className="orbit orbit-one">
            <div className="orbit-dot"></div>
          </div>

          <div className="orbit orbit-two">
            <div className="orbit-dot"></div>
          </div>

          <div className="orbit orbit-three">
            <div className="orbit-dot"></div>
          </div>


          {/* Center */}
          <div className="loader-core">

            <div className="core-inner">
              <span></span>
            </div>

          </div>

        </div>


        {/* Loading text */}
        <div className="loader-content">

          <h1>
            Please wait<span className="animated-dots">...</span>
          </h1>

          <p>
            Preparing your experience
          </p>


          {/* Progress bar */}
          <div className="progress-container">

            <div className="progress-track">
              <div className="progress-bar"></div>
            </div>

          </div>

        </div>

      </div>


      {/* Bottom status */}
      <div className="loader-status">

        <div className="status-item">
          <span className="status-dot"></span>
          Secure
        </div>

        <div className="status-line"></div>

        <div className="status-item">
          <span className="status-dot"></span>
          Connecting
        </div>

        <div className="status-line"></div>

        <div className="status-item">
          <span className="status-dot"></span>
          Almost there
        </div>

      </div>


      {/* CSS */}
      <style>{`

        * {
          box-sizing: border-box;
        }


        .premium-loader {
          position: fixed;
          inset: 0;

          width: 100%;
          height: 100vh;

          overflow: hidden;

          display: flex;
          align-items: center;
          justify-content: center;

          background:
            radial-gradient(
              circle at 50% 45%,
              rgba(120, 30, 120, 0.12),
              transparent 35%
            ),
            radial-gradient(
              circle at 20% 80%,
              rgba(255, 0, 120, 0.06),
              transparent 30%
            ),
            #070708;

          color: white;

          font-family:
            Inter,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;

          z-index: 999999;
        }


        /* =============================================
           BACKGROUND GLOW
        ============================================= */

        .background-glow {
          position: absolute;

          width: 450px;
          height: 450px;

          border-radius: 50%;

          filter: blur(100px);

          pointer-events: none;

          opacity: 0.15;
        }


        .glow-one {
          background: #ff006f;

          top: 15%;
          left: 25%;

          animation: glowMoveOne 7s ease-in-out infinite;
        }


        .glow-two {
          background: #7b2cff;

          bottom: 10%;
          right: 20%;

          animation: glowMoveTwo 8s ease-in-out infinite;
        }


        @keyframes glowMoveOne {

          0%,
          100% {
            transform: translate(0, 0);
          }

          50% {
            transform: translate(80px, -40px);
          }

        }


        @keyframes glowMoveTwo {

          0%,
          100% {
            transform: translate(0, 0);
          }

          50% {
            transform: translate(-70px, 50px);
          }

        }


        /* =============================================
           PARTICLES
        ============================================= */

        .particles {
          position: absolute;

          inset: 0;

          pointer-events: none;
        }


        .particles span {
          position: absolute;

          width: 3px;
          height: 3px;

          border-radius: 50%;

          background: #ffffff;

          opacity: 0;

          box-shadow:
            0 0 8px rgba(255, 255, 255, 0.8);

          animation: particleFloat 4s ease-in-out infinite;
        }


        .particles span:nth-child(1) {
          left: 18%;
          top: 25%;
          animation-delay: 0s;
        }

        .particles span:nth-child(2) {
          left: 75%;
          top: 22%;
          animation-delay: 1s;
        }

        .particles span:nth-child(3) {
          left: 82%;
          top: 65%;
          animation-delay: 2s;
        }

        .particles span:nth-child(4) {
          left: 15%;
          top: 70%;
          animation-delay: 0.7s;
        }

        .particles span:nth-child(5) {
          left: 30%;
          top: 15%;
          animation-delay: 1.5s;
        }

        .particles span:nth-child(6) {
          left: 68%;
          top: 78%;
          animation-delay: 2.5s;
        }

        .particles span:nth-child(7) {
          left: 52%;
          top: 12%;
          animation-delay: 1.2s;
        }

        .particles span:nth-child(8) {
          left: 45%;
          top: 82%;
          animation-delay: 3s;
        }


        @keyframes particleFloat {

          0% {
            opacity: 0;
            transform: translateY(15px) scale(0.5);
          }

          50% {
            opacity: 0.8;
            transform: translateY(-15px) scale(1);
          }

          100% {
            opacity: 0;
            transform: translateY(-35px) scale(0.5);
          }

        }


        /* =============================================
           MAIN WRAPPER
        ============================================= */

        .loader-wrapper {
          position: relative;

          display: flex;
          flex-direction: column;

          align-items: center;
          justify-content: center;

          transform: translateY(-20px);
        }


        /* =============================================
           ORBIT SYSTEM
        ============================================= */

        .orbit-system {
          position: relative;

          width: 230px;
          height: 230px;

          display: flex;
          align-items: center;
          justify-content: center;
        }


        /* =============================================
           ORBITS
        ============================================= */

        .orbit {
          position: absolute;

          border-radius: 50%;

          border-style: solid;

          transform-origin: center;

        }


        .orbit-one {
          width: 220px;
          height: 220px;

          border-width: 1px;

          border-color:
            rgba(255, 0, 110, 0.05)
            rgba(255, 0, 110, 0.8)
            rgba(255, 0, 110, 0.1)
            rgba(255, 0, 110, 0.05);

          animation:
            rotateClockwise 5s linear infinite;
        }


        .orbit-two {
          width: 170px;
          height: 170px;

          border-width: 1px;

          border-color:
            rgba(130, 70, 255, 0.8)
            rgba(130, 70, 255, 0.05)
            rgba(130, 70, 255, 0.2)
            rgba(130, 70, 255, 0.05);

          animation:
            rotateReverse 4s linear infinite;
        }


        .orbit-three {
          width: 125px;
          height: 125px;

          border-width: 1px;

          border-color:
            rgba(0, 220, 255, 0.4)
            rgba(0, 220, 255, 0.05)
            rgba(0, 220, 255, 0.05)
            rgba(0, 220, 255, 0.6);

          animation:
            rotateClockwise 3s linear infinite;
        }


        @keyframes rotateClockwise {

          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }

        }


        @keyframes rotateReverse {

          from {
            transform: rotate(360deg);
          }

          to {
            transform: rotate(0deg);
          }

        }


        /* =============================================
           ORBIT DOTS
        ============================================= */

        .orbit-dot {
          position: absolute;

          width: 7px;
          height: 7px;

          border-radius: 50%;

          top: -3px;
          left: 50%;

          transform: translateX(-50%);

          background: #ff3b9d;

          box-shadow:
            0 0 8px #ff3b9d,
            0 0 18px rgba(255, 59, 157, 0.7);
        }


        .orbit-two .orbit-dot {
          background: #8c5cff;

          box-shadow:
            0 0 8px #8c5cff,
            0 0 18px rgba(140, 92, 255, 0.7);
        }


        .orbit-three .orbit-dot {
          background: #42ddff;

          box-shadow:
            0 0 8px #42ddff,
            0 0 18px rgba(66, 221, 255, 0.7);
        }


        /* =============================================
           CENTER CORE
        ============================================= */

        .loader-core {
          position: relative;

          width: 82px;
          height: 82px;

          border-radius: 50%;

          display: flex;
          align-items: center;
          justify-content: center;

          background:
            radial-gradient(
              circle at 35% 30%,
              #34343b,
              #121217 65%,
              #09090c
            );

          border: 1px solid rgba(255, 255, 255, 0.16);

          box-shadow:
            inset 0 0 25px rgba(255, 255, 255, 0.04),
            0 0 25px rgba(255, 0, 120, 0.18),
            0 0 55px rgba(130, 50, 255, 0.12);

          animation: corePulse 2s ease-in-out infinite;
        }


        .loader-core::before {
          content: "";

          position: absolute;

          inset: -5px;

          border-radius: 50%;

          border: 1px solid rgba(255, 0, 120, 0.4);

          animation: coreRing 2s ease-in-out infinite;
        }


        .core-inner {
          width: 42px;
          height: 42px;

          border-radius: 50%;

          display: flex;
          align-items: center;
          justify-content: center;

          background:
            linear-gradient(
              135deg,
              #ff267f,
              #a83bff
            );

          box-shadow:
            0 0 20px rgba(255, 38, 127, 0.5),
            0 0 40px rgba(168, 59, 255, 0.25);

          animation: innerPulse 1.8s ease-in-out infinite;
        }


        .core-inner span {
          width: 11px;
          height: 11px;

          border-radius: 50%;

          background: white;

          box-shadow:
            0 0 10px white,
            0 0 22px rgba(255, 255, 255, 0.8);

          animation: dotPulse 1.4s ease-in-out infinite;
        }


        @keyframes corePulse {

          0%,
          100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.04);
          }

        }


        @keyframes coreRing {

          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }

          50% {
            opacity: 0.8;
            transform: scale(1.08);
          }

        }


        @keyframes innerPulse {

          0%,
          100% {
            transform: scale(0.95);
          }

          50% {
            transform: scale(1.08);
          }

        }


        @keyframes dotPulse {

          0%,
          100% {
            transform: scale(0.8);
          }

          50% {
            transform: scale(1.2);
          }

        }


        /* =============================================
           TEXT
        ============================================= */

        .loader-content {
          margin-top: 25px;

          text-align: center;
        }


        .loader-content h1 {
          margin: 0;

          font-size: 24px;

          font-weight: 600;

          letter-spacing: -0.3px;

          color: #f5f5f7;
        }


        .loader-content h1::first-letter {
          color: white;
        }


        .loader-content p {
          margin: 9px 0 0;

          font-size: 14px;

          color: #777781;

          letter-spacing: 0.2px;
        }


        .animated-dots {
          display: inline-block;

          width: 24px;

          text-align: left;

          animation: dotsAnimation 1.3s steps(4, end) infinite;
        }


        @keyframes dotsAnimation {

          0% {
            width: 0;
          }

          25% {
            width: 6px;
          }

          50% {
            width: 12px;
          }

          75% {
            width: 18px;
          }

          100% {
            width: 24px;
          }

        }


        /* =============================================
           PROGRESS BAR
        ============================================= */

        .progress-container {
          width: 250px;

          margin: 22px auto 0;
        }


        .progress-track {
          width: 100%;

          height: 3px;

          overflow: hidden;

          border-radius: 10px;

          background: rgba(255, 255, 255, 0.07);
        }


        .progress-bar {
          width: 45%;

          height: 100%;

          border-radius: 10px;

          background:
            linear-gradient(
              90deg,
              #ff287f,
              #b638ff,
              #42dfff
            );

          box-shadow:
            0 0 10px rgba(255, 40, 127, 0.6);

          animation: progressAnimation 2s ease-in-out infinite;
        }


        @keyframes progressAnimation {

          0% {
            transform: translateX(-110%);
          }

          50% {
            transform: translateX(110%);
          }

          100% {
            transform: translateX(230%);
          }

        }


        /* =============================================
           BOTTOM STATUS
        ============================================= */

        .loader-status {
          position: absolute;

          bottom: 45px;

          display: flex;

          align-items: center;

          gap: 16px;

          font-size: 12px;

          color: #66666f;
        }


        .status-item {
          display: flex;

          align-items: center;

          gap: 7px;

          white-space: nowrap;
        }


        .status-dot {
          width: 5px;
          height: 5px;

          border-radius: 50%;

          background: #ff267f;

          box-shadow:
            0 0 8px rgba(255, 38, 127, 0.7);

          animation: statusPulse 1.5s ease-in-out infinite;
        }


        .status-item:nth-child(3)
        .status-dot {
          background: #9b55ff;

          box-shadow:
            0 0 8px rgba(155, 85, 255, 0.7);

          animation-delay: 0.3s;
        }


        .status-item:nth-child(5)
        .status-dot {
          background: #42dfff;

          box-shadow:
            0 0 8px rgba(66, 223, 255, 0.7);

          animation-delay: 0.6s;
        }


        @keyframes statusPulse {

          0%,
          100% {
            opacity: 0.4;
            transform: scale(0.8);
          }

          50% {
            opacity: 1;
            transform: scale(1.2);
          }

        }


        .status-line {
          width: 25px;

          height: 1px;

          background: rgba(255, 255, 255, 0.08);
        }


        /* =============================================
           MOBILE
        ============================================= */

        @media (max-width: 600px) {

          .orbit-system {
            width: 190px;
            height: 190px;
          }


          .orbit-one {
            width: 180px;
            height: 180px;
          }


          .orbit-two {
            width: 140px;
            height: 140px;
          }


          .orbit-three {
            width: 105px;
            height: 105px;
          }


          .loader-core {
            width: 70px;
            height: 70px;
          }


          .core-inner {
            width: 36px;
            height: 36px;
          }


          .loader-content h1 {
            font-size: 21px;
          }


          .loader-content p {
            font-size: 13px;
          }


          .progress-container {
            width: 210px;
          }


          .loader-status {
            bottom: 25px;

            gap: 8px;

            font-size: 10px;
          }


          .status-line {
            width: 12px;
          }

        }

      `}</style>

    </div>
  );
};


// =====================================================
// APP CONTENT
// =====================================================

const AppContent = () => {

  const { loading } = useContext(AuthContext);


  if (loading) {
    return <LoadingScreen />;
  }


  return (
    <RouterProvider router={router} />
  );
};


// =====================================================
// APP
// =====================================================

const App = () => {

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};


export default App;