import { useEffect, useRef, useState, type JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, LogOut } from 'lucide-react';

const IDLE_TIMEOUT = 14 * 60 * 1000; // Show warning at 1 minute of inactivity
const WARNING_PERIOD = 60 * 1000;    // Give them 60 seconds to respond

const IdleLogout = ({ children }: { children: JSX.Element }) => {
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const navigate = useNavigate();
  
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const logout = () => {
    localStorage.clear();
    setShowWarning(false);
    navigate('/login', { replace: true });
  };

  const startWarning = () => {
    setShowWarning(true);
    setCountdown(60);
    
    // Start the final 60-second countdown
    warningTimerRef.current = setTimeout(logout, WARNING_PERIOD);
    
    countdownIntervalRef.current = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
  };

  const resetTimer = () => {
    // If warning is already showing, don't reset unless they click the button
    if (showWarning) return; 

    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(startWarning, IDLE_TIMEOUT);
  };

  const stayLoggedIn = () => {
    setShowWarning(false);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    resetTimer();
  };

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    resetTimer();

    events.forEach(event => window.addEventListener(event, resetTimer));

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [showWarning]);

  return (
    <>
      {children}

      {/* Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-9999 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mb-6">
                <Clock size={32} className="animate-pulse" />
              </div>
              
              <h2 className="text-xl font-black text-slate-900">Are you still there?</h2>
              <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                Your session is about to expire for security reasons. You will be logged out in:
              </p>
              
              <div className="mt-6 text-4xl font-black text-blue-600 tabular-nums">
                {countdown}s
              </div>

              <div className="flex w-full gap-3 mt-10">
                <button 
                  onClick={logout}
                  className="flex-1 py-4 text-slate-400 font-bold text-sm hover:text-red-500 transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut size={18} /> Logout Now
                </button>
                <button 
                  onClick={stayLoggedIn}
                  className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl shadow-slate-200 active:scale-95 transition-all"
                >
                  Stay Logged In
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IdleLogout;