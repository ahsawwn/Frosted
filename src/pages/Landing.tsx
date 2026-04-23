import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100">
      {/* Simple Navigation Bar */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold tracking-tight text-blue-600">
          Oftsy<span className="text-slate-800">Systems</span>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="text-sm font-medium hover:text-blue-600 transition-colors"
        >
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 pt-20 pb-32 flex flex-col items-center text-center">
        <div className="inline-block px-4 py-1.5 mb-6 text-sm font-medium tracking-wide text-blue-600 uppercase bg-blue-50 rounded-full">
          Powering Modern Business
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 max-w-4xl leading-[1.1]">
          Seamless Management for <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">
            Smart Enterprises.
          </span>
        </h1>
        
        <p className="text-lg text-slate-500 max-w-2xl mb-12 leading-relaxed">
          The all-in-one platform for business logic, real-time inventory, and 
          secure clinical management. Built for speed, scaled for growth.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="px-8 py-4 bg-slate-900 text-white font-semibold rounded-lg shadow-lg shadow-slate-200 hover:bg-slate-800 hover:-translate-y-0.5 transition-all active:scale-95"
          >
            Get Started Now
          </button>
          <button className="px-8 py-4 bg-white border border-slate-200 text-slate-600 font-semibold rounded-lg hover:bg-slate-50 transition-all">
            View Solutions
          </button>
        </div>

        {/* Subtle Visual Element */}
        <div className="mt-20 w-full max-w-5xl aspect-video bg-slate-50 rounded-2xl border border-slate-100 shadow-2xl flex items-center justify-center">
            <p className="text-slate-300 font-medium italic underline decoration-blue-500/30 underline-offset-8">
                [ Dashboard Preview Placeholder ]
            </p>
        </div>
      </main>
    </div>
  );
};

export default Landing;