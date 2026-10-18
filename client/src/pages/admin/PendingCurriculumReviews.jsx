import React from 'react';
import { GlassCard, Badge } from '../../components/ui';
import { Shield } from 'lucide-react';
import CurriculumReviewCard from './CurriculumReviewCard';

const PendingCurriculumReviews = ({
  pendingReviews,
  selectedItemIds,
  onToggleItemSelect,
  onReview,
  onApproveItem,
  onRejectItem,
  onApproveAll,
  onRejectAll,
  onApproveSelected,
  onRejectSelected,
  loadingReviews
}) => {
  return (
    <GlassCard className="p-6 border-purple-500/20 shadow-[0_0_30px_rgba(139,92,246,0.05)] bg-white/5 backdrop-blur-xl rounded-2xl border">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2 text-white">
            <Shield className="text-purple-400" /> Curriculum Review Console
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Review pending syllabus modifications before publishing to the live catalog.
          </p>
        </div>
        {pendingReviews.length > 0 && (
          <Badge color="purple" className="text-xs font-bold px-3 py-1">
            {pendingReviews.length} Modules Pending
          </Badge>
        )}
      </div>

      {loadingReviews ? (
        <div className="text-center py-12 text-gray-400">Loading curriculum reviews...</div>
      ) : pendingReviews.length === 0 ? (
        <div className="text-center py-12 bg-white/[0.01] border border-white/5 rounded-2xl">
          <p className="text-sm text-gray-500 italic">All curriculum updates approved. Platform up to date.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingReviews.map((group) => (
            <CurriculumReviewCard
              key={group.key}
              group={group}
              selectedItemIds={selectedItemIds[group.key] || []}
              onToggleItemSelect={onToggleItemSelect}
              onReview={onReview}
              onApproveItem={onApproveItem}
              onRejectItem={onRejectItem}
              onApproveAll={onApproveAll}
              onRejectAll={onRejectAll}
              onApproveSelected={onApproveSelected}
              onRejectSelected={onRejectSelected}
            />
          ))}
        </div>
      )}
    </GlassCard>
  );
};

export default PendingCurriculumReviews;
