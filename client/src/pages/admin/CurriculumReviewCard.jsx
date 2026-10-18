import React from 'react';
import { GlassCard, Badge } from '../../components/ui';

const CurriculumReviewCard = ({ 
  group, 
  selectedItemIds = [], 
  onToggleItemSelect, 
  onReview, 
  onApproveItem, 
  onRejectItem, 
  onApproveAll, 
  onRejectAll,
  onApproveSelected,
  onRejectSelected
}) => {
  const isSingleChange = group.pendingCount === 1;

  // Icons based on change type
  const getChangeIcon = (type) => {
    switch(type) {
      case 'resource': return '📄';
      case 'lecture': return '🎥';
      case 'note': return '🤖';
      case 'quiz': return '❓';
      default: return '✓';
    }
  };

  return (
    <GlassCard className="p-6 border-white/10 hover:border-purple-500/30 transition-all flex flex-col justify-between h-full bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl">
      <div>
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="font-extrabold text-white text-base leading-tight tracking-wide">
            {group.courseTitle}
          </h3>
          <Badge color="purple" className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 max-w-[150px] truncate">
            {group.moduleTitle}
          </Badge>
        </div>
        <p className="text-xs text-gray-400 font-medium mb-4">
          Teacher: <span className="text-gray-300">{group.teacherName}</span>
        </p>

        {/* Detailed Breakdown stats */}
        <div className="flex flex-wrap gap-1.5 mb-4 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
          <span>Pending: {group.pendingCount}</span>
          {group.stats.resources > 0 && <span>• Resources: {group.stats.resources}</span>}
          {group.stats.lectures > 0 && <span>• Lectures: {group.stats.lectures}</span>}
          {group.stats.notes > 0 && <span>• AI Notes: {group.stats.notes}</span>}
          {group.stats.quizzes > 0 && <span>• Quiz: {group.stats.quizzes}</span>}
        </div>

        <div className="space-y-2 mb-6">
          {isSingleChange ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 py-2 bg-emerald-500/5 rounded-xl px-3 border border-emerald-500/10">
              {getChangeIcon(group.changes[0].type)} {group.changes[0].title || group.changes[0].description}
            </div>
          ) : (
            <div className="space-y-2 bg-white/[0.01] border border-white/5 rounded-xl p-3 max-h-[160px] overflow-y-auto">
              {group.changes.map((change) => {
                const isChecked = selectedItemIds.includes(change.id);
                return (
                  <label key={change.id} className="flex items-center gap-3 text-xs font-semibold text-gray-300 cursor-pointer hover:text-white transition-colors py-1">
                    <input 
                      type="checkbox"
                      className="rounded border-white/10 bg-[#0a0e1a] text-purple-600 focus:ring-0 cursor-pointer"
                      checked={isChecked}
                      onChange={() => onToggleItemSelect(group.key, change.id)}
                    />
                    <span>{getChangeIcon(change.type)} {change.title || change.description}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-white/5">
        <div className="flex flex-col gap-3">
          {isSingleChange ? (
            <div className="flex gap-2">
              <button 
                className="flex-1 py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-gray-300 hover:text-white transition-colors"
                onClick={() => onReview(group)}
              >
                Review
              </button>
              <button 
                className="flex-1 py-2 px-3 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-xl text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                onClick={() => onApproveItem(group.courseId, group.changes[0].id, group.changes[0].type)}
              >
                Approve
              </button>
              <button 
                className="flex-1 py-2 px-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
                onClick={() => onRejectItem(group.courseId, group.changes[0].id, group.changes[0].type)}
              >
                Reject
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-full flex gap-2">
                <button 
                  className="flex-1 py-2.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-gray-300 hover:text-white transition-colors"
                  onClick={() => onReview(group)}
                >
                  Review Changes
                </button>
                <button 
                  className="flex-1 py-2.5 px-3 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-xl text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  disabled={selectedItemIds.length === 0}
                  onClick={() => onApproveSelected(group.courseId, group.key)}
                >
                  Approve Selected
                </button>
                <button 
                  className="flex-1 py-2.5 px-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  disabled={selectedItemIds.length === 0}
                  onClick={() => onRejectSelected(group.courseId, group.key)}
                >
                  Reject Selected
                </button>
              </div>

              <div className="border-t border-dashed border-white/5 my-1" />

              <div className="w-full flex gap-2">
                <button 
                  className="flex-1 py-2.5 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors shadow-lg shadow-purple-600/20"
                  onClick={() => onApproveAll(group.courseId)}
                >
                  Approve All
                </button>
                <button 
                  className="flex-1 py-2.5 px-3 bg-red-600/20 hover:bg-red-600/30 border border-red-600/30 text-red-400 hover:text-red-300 rounded-xl text-xs font-bold transition-colors"
                  onClick={() => onRejectAll(group.courseId)}
                >
                  Reject All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
};

export default CurriculumReviewCard;
