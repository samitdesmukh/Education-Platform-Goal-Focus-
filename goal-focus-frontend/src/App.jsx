import React from 'react'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">GBLP</h1>
            <nav className="flex gap-8 items-center text-sm text-gray-300">
              <a href="#" className="hover:text-white">Find Paths</a>
              <a href="#" className="hover:text-white">Get Certified</a>
              <a href="#" className="hover:text-white">Dashboard</a>
              <input type="text" placeholder="Search for anything" className="px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400 text-sm w-48" />
              <a href="#" className="hover:text-white">GBLP Business</a>
              <a href="#" className="hover:text-white">Teach on GBLP</a>
              <button className="text-gray-300 hover:text-white">🛒</button>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm">Log in</button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm">Sign up</button>
            </nav>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <nav className="text-sm text-gray-400">
            <span className="hover:text-white cursor-pointer">Career Path</span>
            <span className="mx-2">›</span>
            <span className="hover:text-white cursor-pointer">Data Science</span>
            <span className="mx-2">›</span>
            <span className="text-white">Senior Analyst</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-3 gap-8">
          {/* Left Section - Main Content */}
          <div className="col-span-2">
            {/* Title Section */}
            <section className="mb-10">
              <h1 className="text-4xl font-bold text-white mb-4">Senior Data Analyst Career Path Goal</h1>
              <p className="text-gray-300 text-lg">A complete, milestone-based learning pathway to transition into a Senior Data Analyst role, leveraging specific project-based courses and skill assessments.</p>
            </section>

            {/* Path Progress Section */}
            <section className="bg-gray-800 rounded-lg p-8 mb-10 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-6">Path Progress</h2>
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="text-gray-400 text-sm">45% Complete</p>
                </div>
                <div className="flex-1 mx-8 flex items-center">
                  <div className="flex items-center flex-1">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="flex-1 h-1 bg-green-500 mx-2"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                    <div className="flex-1 h-1 bg-gray-600 mx-2"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                    <div className="flex-1 h-1 bg-gray-600 mx-2"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between mt-6 text-sm">
                <span className="text-gray-300">Core SQL - <span className="text-green-400">Completed</span></span>
                <span className="text-gray-300">Python Data Science - <span className="text-yellow-400">In Progress</span></span>
                <span className="text-gray-300">Advanced Tableau - <span className="text-gray-400">Future</span></span>
              </div>
            </section>

            {/* My Active Goals Section */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">My Active Goals</h2>
              
              {/* Goal Card */}
              <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-6">Become a Senior Data Analyst</h3>
                
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-gray-400 text-sm">Target Date:</p>
                    <p className="text-2xl font-bold text-white">Dec 2024</p>
                  </div>
                  
                  {/* Course Cards */}
                  <div className="flex gap-4">
                    <div className="bg-gray-700 rounded-lg p-4 flex items-center gap-3 border border-gray-600">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded flex items-center justify-center text-white font-bold">P</div>
                      <div>
                        <p className="text-white font-semibold text-sm">Python for data Analysis</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">Start Course</span>
                          <span className="text-gray-400 text-xs">40% complete</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-700 rounded-lg p-4 flex items-center gap-3 border border-gray-600">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded flex items-center justify-center text-white font-bold">S</div>
                      <div>
                        <p className="text-white font-semibold text-sm">Advanced SQL and BigQuery</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">Start Course</span>
                          <span className="text-gray-400 text-xs">new</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Section - Skills */}
          <div>
            {/* Create/Edit Goal Button */}
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg mb-8">
              Create/Edit Goal
            </button>

            {/* Core Path Skills */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-6">Core Path Skills</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer">
                  <span className="text-2xl">📊</span>
                  <span>SQL Mastery</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer">
                  <span className="text-2xl">🐍</span>
                  <span>Python Programming</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer">
                  <span className="text-2xl">📈</span>
                  <span>Data Visualization</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300 hover:text-white cursor-pointer">
                  <span className="text-2xl">💼</span>
                  <span>Business Intelligence</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
