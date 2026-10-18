import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ReviewModal = ({ 
  selectedReview, 
  onClose, 
  onApproveItem, 
  onRejectItem, 
  onApproveAll, 
  onRejectAll 
}) => {
  return (
    <AnimatePresence>
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div 
            className="bg-[#050816] border border-white/10 rounded-[2.5rem] w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="p-6 border-b border-white/5 bg-white/[0.01]">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">Review Curriculum Changes</h3>
              <p className="text-xs text-gray-400 mt-1">{selectedReview.courseTitle} • Instructor: {selectedReview.teacherName}</p>
            </div>

            <div className="p-6 max-h-[400px] overflow-y-auto space-y-4">
              {selectedReview.changes.map((change) => (
                <div key={change.id} className="flex justify-between items-center p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all">
                  <div>
                    <span className="text-[10px] bg-purple-500/20 border border-purple-500/40 text-purple-400 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block">
                      {change.type}
                    </span>
                    <h4 className="text-sm font-bold text-white">{change.title || change.description}</h4>
                    <p className="text-xs text-gray-500">{change.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      className="py-1 px-3 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 rounded-lg text-xs font-bold transition-colors"
                      onClick={() => onApproveItem(selectedReview.courseId, change.id)}
                    >
                      Approve
                    </button>
                    <button 
                      className="py-1 px-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 hover:text-red-300 rounded-lg text-xs font-bold transition-colors"
                      onClick={() => onRejectItem(selectedReview.courseId, change.id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-white/5 bg-white/[0.01] flex justify-between items-center">
              <button 
                className="py-2.5 px-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-gray-300 hover:text-white transition-colors"
                onClick={onClose}
              >
                Close
              </button>
              <div className="flex gap-2">
                <button 
                  className="py-2.5 px-5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors shadow-lg"
                  onClick={() => onApproveAll(selectedReview.courseId)}
                >
                  Approve All
                </button>
                <button 
                  className="py-2.5 px-5 bg-red-600/20 hover:bg-red-600/30 border border-red-600/30 text-red-400 hover:text-red-300 rounded-xl text-xs font-bold transition-colors"
                  onClick={() => onRejectAll(selectedReview.courseId)}
                >
                  Reject All
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ReviewModal;
