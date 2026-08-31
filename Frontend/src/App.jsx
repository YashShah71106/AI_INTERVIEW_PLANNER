import { RouterProvider } from "react-router";
import { router } from "./app.routes.jsx";
import {
  AuthProvider,
  AuthContext
} from "./features/auth/auth.context.jsx";
import { useContext } from "react";


// =====================================================
// LOADING ANIMATION
// =====================================================

const LoadingScreen = () => {

  return (
    <div className="loading-screen">

      <div className="loader-container">

        <div className="loader-ring"></div>

        <div className="loader-logo">
          AI
        </div>

        <div className="loading-text">
          <span>Loading</span>
          <span className="dots">...</span>
        </div>

        <div className="loading-subtext">
          Preparing your interview experience
        </div>

      </div>

      <style>{`

        .loading-screen {
          width: 100vw;
          height: 100vh;
          background: #080808;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-family: Arial, sans-serif;
        }

        .loader-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .loader-ring {
          width: 75px;
          height: 75px;
          border: 4px solid rgba(255, 0, 85, 0.15);
          border-top: 4px solid #ff0055;
          border-right: 4px solid #ff0055;
          border-radius: 50%;
          animation: spin 0.9s linear infinite;
          position: absolute;
        }

        .loader-logo {
          width: 55px;
          height: 55px;
          border-radius: 50%;
          background: linear-gradient(
            135deg,
            #ff0055,
            #a000ff
          );
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 18px;
          font-weight: 800;
          box-shadow:
            0 0 25px rgba(255, 0, 85, 0.4);
          animation: pulse 1.5s ease-in-out infinite;
        }

        .loading-text {
          margin-top: 100px;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .dots {
          display: inline-block;
          width: 24px;
          overflow: hidden;
          animation: dots 1.2s steps(4, end) infinite;
        }

        .loading-subtext {
          margin-top: 10px;
          font-size: 13px;
          color: #888;
          letter-spacing: 0.3px;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.08);
          }
        }

        @keyframes dots {
          0% {
            width: 0;
          }

          33% {
            width: 8px;
          }

          66% {
            width: 16px;
          }

          100% {
            width: 24px;
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