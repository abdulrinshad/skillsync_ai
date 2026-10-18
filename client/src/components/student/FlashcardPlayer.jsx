import React, { useState, useEffect } from "react";
import axios from "axios";
import { Star, RefreshCw, Bookmark, Sparkles, AlertCircle, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { GlassCard, Button, Badge } from "../ui";
import { toast } from "react-toastify";

const FlashcardPlayer = ({ courseId, moduleId, lectureId }) => {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchCards = async () => {
    if (!lectureId) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/flashcards/lecture/${lectureId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCards(res.data || []);
    } catch (err) {
      console.error("Failed to load flashcards:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [lectureId]);

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/flashcards/generate",
        { courseId, moduleId, lectureId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCards(res.data || []);
      setCurrentIndex(0);
      setIsFlipped(false);
      toast.success("AI successfully generated spaced repetition flashcards!");
    } catch (err) {
      toast.error("Failed to generate AI flashcards.");
    } finally {
      setGenerating(false);
    }
  };

  const handleProgress = async (rating) => {
    const activeCard = cards[currentIndex];
    if (!activeCard) return;

    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/api/flashcards/${activeCard._id}/progress`,
        { rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state
      const updatedCards = [...cards];
      updatedCards[currentIndex] = res.data.card;
      setCards(updatedCards);
      
      toast.success(`Card difficulty marked. Next review in ${res.data.card.interval} days.`);
      
      // Go to next card automatically if exists
      if (currentIndex < cards.length - 1) {
        setIsFlipped(false);
        setTimeout(() => setCurrentIndex((prev) => prev + 1), 300);
      }
    } catch (err) {
      toast.error("Failed to update progress.");
    }
  };

  const toggleBookmark = async (cardId) => {
    try {
      const token = localStorage.getItem("token_student") || localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:5000/api/flashcards/${cardId}/bookmark`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const updated = [...cards];
      updated[currentIndex].isBookmarked = res.data.isBookmarked;
      setCards(updated);
      toast.success(res.data.isBookmarked ? "Card bookmarked" : "Bookmark removed");
    } catch (err) {
      toast.error("Action failed.");
    }
  };

  if (loading || generating) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white/[0.01] border border-white/5 rounded-3xl gap-4">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Loading AI study cards...</p>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white/[0.01] border border-white/5 rounded-3xl gap-4">
        <Sparkles size={32} className="text-purple-400" />
        <div>
          <h4 className="text-sm font-black text-white">Generate Spaced Repetition Cards</h4>
          <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto leading-relaxed">
            Create AI cards tailored to the current lecture to start revising using Quizlet/Anki spacing logic.
          </p>
        </div>
        <Button
          onClick={handleGenerate}
          className="py-2.5 px-6 rounded-xl font-bold text-xs bg-purple-600 hover:bg-purple-550 text-white uppercase tracking-wider"
        >
          Generate AI Cards
        </Button>
      </div>
    );
  }

  const activeCard = cards[currentIndex];

  return (
    <div className="space-y-6">
      {/* Flip Card Container */}
      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full aspect-[2/1] min-h-[220px] relative cursor-pointer select-none group [perspective:1000px]"
      >
        <div 
          className="w-full h-full duration-500 [transform-style:preserve-3d] relative rounded-3xl border border-white/5"
          style={{ transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
        >
          {/* Front Side */}
          <div className="absolute inset-0 w-full h-full p-8 rounded-3xl [backface-visibility:hidden] bg-slate-950 flex flex-col justify-between items-center text-center">
            <div className="flex justify-between items-center w-full">
              <Badge color="purple" className="uppercase text-[8px] tracking-wider font-bold">
                {activeCard.difficulty}
              </Badge>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBookmark(activeCard._id);
                }}
                className={`p-1.5 rounded-lg hover:bg-white/5 transition-colors ${
                  activeCard.isBookmarked ? "text-yellow-400" : "text-gray-600"
                }`}
              >
                <Bookmark size={14} className={activeCard.isBookmarked ? "fill-yellow-400" : ""} />
              </button>
            </div>

            <div className="max-w-md">
              <h3 className="text-base font-black text-white leading-relaxed">{activeCard.question}</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-3">Click to Flip</p>
            </div>

            <span className="text-[9px] text-gray-650 font-bold uppercase tracking-wider">
              Question Side
            </span>
          </div>

          {/* Back Side */}
          <div 
            className="absolute inset-0 w-full h-full p-8 rounded-3xl [backface-visibility:hidden] bg-slate-900 flex flex-col justify-between items-center text-center [transform:rotateY(180deg)]"
          >
            <div className="flex justify-between items-center w-full">
              <Badge color="green" className="uppercase text-[8px] tracking-wider font-bold">
                {activeCard.status}
              </Badge>
              <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wider">
                Interval: {activeCard.interval} days
              </span>
            </div>

            <div className="max-w-md">
              <p className="text-sm font-semibold text-gray-200 leading-relaxed">{activeCard.answer}</p>
            </div>

            <span className="text-[9px] text-gray-650 font-bold uppercase tracking-wider">
              Answer Side
            </span>
          </div>
        </div>
      </div>

      {/* SM-2 Spaced Repetition Buttons */}
      {isFlipped && (
        <div className="grid grid-cols-3 gap-3">
          <Button
            onClick={() => handleProgress(1)}
            className="py-3 bg-red-650/15 hover:bg-red-650/25 border border-red-500/20 text-red-400 font-bold text-xs uppercase tracking-wider rounded-xl"
          >
            Again (Reset)
          </Button>
          <Button
            onClick={() => handleProgress(3)}
            className="py-3 bg-orange-650/15 hover:bg-orange-650/25 border border-orange-500/20 text-orange-400 font-bold text-xs uppercase tracking-wider rounded-xl"
          >
            Hard (Review)
          </Button>
          <Button
            onClick={() => handleProgress(5)}
            className="py-3 bg-green-650/15 hover:bg-green-650/25 border border-green-500/20 text-green-400 font-bold text-xs uppercase tracking-wider rounded-xl"
          >
            Easy (Mastered)
          </Button>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
        <Button
          disabled={currentIndex === 0}
          onClick={() => {
            setIsFlipped(false);
            setCurrentIndex((prev) => prev - 1);
          }}
          className="p-2 bg-white/5 text-white rounded-xl disabled:opacity-30"
        >
          <ChevronLeft size={16} />
        </Button>
        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
          Card {currentIndex + 1} of {cards.length}
        </span>
        <Button
          disabled={currentIndex === cards.length - 1}
          onClick={() => {
            setIsFlipped(false);
            setCurrentIndex((prev) => prev + 1);
          }}
          className="p-2 bg-white/5 text-white rounded-xl disabled:opacity-30"
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default FlashcardPlayer;
