import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { resumeAPI } from '../services/api';
import { Search, AlertCircle, FileText, CheckCircle2, XCircle, BookOpen } from 'lucide-react';

export default function PDFSearch() {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [searchMode, setSearchMode] = useState('single'); // 'single' or 'all'

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const response = await resumeAPI.getResumes();
      setResumes(response.data);
      if (response.data.length > 0) {
        setSelectedResume(response.data[0].resumeId);
      }
    } catch (err) {
      setError('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }
    if (!selectedResume && searchMode === 'single') {
      setError('Please select a resume');
      return;
    }

    setSearching(true);
    setError('');
    setSearchResults(null);

    try {
      let response;
      if (searchMode === 'single') {
        response = await resumeAPI.searchInResume(selectedResume, searchQuery);
      } else {
        response = await resumeAPI.searchAcrossAllResumes(searchQuery);
      }
      setSearchResults(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="spinner h-12 w-12 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading resumes...</p>
        </div>
      </div>
    );
  }

  const results = searchMode === 'single' ? (searchResults ? [searchResults] : []) : (searchResults || []);
  const totalMatches = results.reduce((sum, r) => sum + (r.totalMatches || 0), 0);

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">PDF Search</h1>
        <p className="text-gray-600 dark:text-gray-400">Search within your uploaded PDF and DOCX resumes using AI-powered text extraction</p>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex gap-3">
            <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0" size={20} />
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {/* Search Mode Toggle */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
          <label className="form-label">Search Mode</label>
          <div className="flex gap-4">
            <button
              onClick={() => setSearchMode('single')}
              className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                searchMode === 'single'
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary-300'
              }`}
            >
              <FileText className="mx-auto mb-2" size={24} />
              <p className="font-medium text-sm">Single Resume</p>
              <p className="text-xs mt-1">Search in one specific resume</p>
            </button>
            <button
              onClick={() => setSearchMode('all')}
              className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                searchMode === 'all'
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary-300'
              }`}
            >
              <BookOpen className="mx-auto mb-2" size={24} />
              <p className="font-medium text-sm">All Resumes</p>
              <p className="text-xs mt-1">Search across all resumes</p>
            </button>
          </div>
        </motion.div>

        {/* Resume Selection (only for single mode) */}
        {searchMode === 'single' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
            <label className="form-label">Select Resume</label>
            {resumes.length > 0 ? (
              <select value={selectedResume || ''} onChange={(e) => setSelectedResume(parseInt(e.target.value))} className="input-field">
                {resumes.map((resume) => (
                  <option key={resume.resumeId} value={resume.resumeId}>
                    {resume.fileName} {resume.isPrimary ? '(Primary)' : ''}
                  </option>
                ))}
              </select>
            ) : (
              <div className="empty-state py-6">
                <div className="empty-state-icon mx-auto mb-3"><FileText size={28} /></div>
                <p className="text-gray-500 dark:text-gray-400 mb-3 text-sm">No resumes found</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Search Input */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
          <label className="form-label">Search Query</label>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter keywords to search (e.g., 'Java', 'Spring Boot', 'project manager')"
                className="input-field pl-10"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handleSearch}
              disabled={!searchQuery.trim() || searching || (searchMode === 'single' && !selectedResume)}
              className="btn-primary disabled:opacity-50"
            >
              {searching ? (
                <span className="flex items-center gap-2"><div className="spinner h-4 w-4 border-white/30 border-t-white"></div>Searching...</span>
              ) : (
                <span className="flex items-center gap-2"><Search size={18} /> Search</span>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Search Results */}
        {searchResults && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Results Summary */}
            <div className="card bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
                  <CheckCircle2 className="text-primary-600 dark:text-primary-400" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-primary-900 dark:text-primary-300">Search Complete</h3>
                  <p className="text-sm text-primary-700 dark:text-primary-400">
                    Found {totalMatches} match{totalMatches !== 1 ? 'es' : ''} in {results.length} resume{results.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Results List */}
            {results.map((result, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="card"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <FileText size={20} className="text-primary-600 dark:text-primary-400" />
                      {result.fileName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {result.totalMatches} match{result.totalMatches !== 1 ? 'es' : ''} found
                    </p>
                  </div>
                </div>

                {result.results && result.results.length > 0 ? (
                  <div className="space-y-3">
                    {result.results.map((searchResult, resultIdx) => (
                      <motion.div
                        key={resultIdx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: resultIdx * 0.05 }}
                        className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-l-4 border-primary-500"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                              <span className="font-semibold">Line {searchResult.lineNumber}:</span> {searchResult.context}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                              <span>Position: {searchResult.position}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <XCircle className="mx-auto mb-3 text-gray-400" size={32} />
                    <p className="text-gray-500 dark:text-gray-400">No matches found in this resume</p>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!searchResults && !searching && resumes.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card text-center py-16">
            <div className="empty-state-icon mx-auto mb-4"><Search size={32} /></div>
            <p className="text-gray-500 dark:text-gray-400 mb-2">Ready to search!</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Enter keywords to search within your resumes</p>
          </motion.div>
        )}

        {/* No Resumes State */}
        {!loading && resumes.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card text-center py-16">
            <div className="empty-state-icon mx-auto mb-4"><FileText size={32} /></div>
            <p className="text-gray-500 dark:text-gray-400 mb-2">No resumes uploaded yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">Upload a resume first to search within it</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}