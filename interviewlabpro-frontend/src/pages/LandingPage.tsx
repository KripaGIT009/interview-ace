import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">InterviewLabPro</h1>
          <div className="space-x-4">
            <Link to="/login" className="text-gray-700 hover:text-indigo-600">Login</Link>
            <Link to="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Master Your Coding Interviews with AI
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Practice real coding interviews with AI-powered feedback, voice interaction, 
            and personalized learning paths
          </p>
          <Link 
            to="/signup" 
            className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 inline-block"
          >
            Start Practicing Free
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-2xl font-bold text-gray-400 mb-4">VOICE</div>
            <h3 className="text-xl font-bold mb-2">Voice Interviews</h3>
            <p className="text-gray-600">
              Practice with real voice interaction powered by AI
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-2xl font-bold text-gray-400 mb-4">AI</div>
            <h3 className="text-xl font-bold mb-2">AI Feedback</h3>
            <p className="text-gray-600">
              Get instant, detailed feedback on your solutions
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-2xl font-bold text-gray-400 mb-4">STATS</div>
            <h3 className="text-xl font-bold mb-2">Track Progress</h3>
            <p className="text-gray-600">
              Monitor your improvement with detailed analytics
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
