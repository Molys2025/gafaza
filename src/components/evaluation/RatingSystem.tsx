
import { useState } from "react";
import { Star, StarHalf, StarOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type CriteriaType = "propriétaire" | "cueilleur";

interface RatingSystemProps {
  type: CriteriaType;
  onRatingSubmit?: (ratings: Record<string, number>) => void;
}

const criteriaMap: Record<CriteriaType, string[]> = {
  propriétaire: ["ponctualité", "conditions de travail", "paiement", "communication"],
  cueilleur: ["qualité du travail", "professionnalisme", "ponctualité", "communication"]
};

export function RatingSystem({ type, onRatingSubmit }: RatingSystemProps) {
  const criteria = criteriaMap[type];
  const [ratings, setRatings] = useState<Record<string, number>>(
    Object.fromEntries(criteria.map(c => [c, 0]))
  );
  const [hoveredStars, setHoveredStars] = useState<Record<string, number>>(
    Object.fromEntries(criteria.map(c => [c, 0]))
  );

  const handleRatingChange = (criterion: string, rating: number) => {
    const newRatings = { ...ratings, [criterion]: rating };
    setRatings(newRatings);
  };

  const handleSubmit = () => {
    if (onRatingSubmit) {
      onRatingSubmit(ratings);
    }
  };

  const getAverageRating = () => {
    const values = Object.values(ratings);
    const sum = values.reduce((acc, value) => acc + value, 0);
    return values.length > 0 ? sum / values.length : 0;
  };

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">
          Évaluation {type === "propriétaire" ? "du propriétaire" : "du cueilleur"}
        </h3>
        <Badge variant="outline" className="bg-olive/10 text-olive">
          {getAverageRating().toFixed(1)} / 5
        </Badge>
      </div>

      <div className="space-y-4">
        {criteria.map((criterion) => (
          <div key={criterion} className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium capitalize">
                {criterion}
              </label>
              <span className="text-sm text-muted-foreground">
                {ratings[criterion] || 0}/5
              </span>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none transition-colors"
                  onClick={() => handleRatingChange(criterion, star)}
                  onMouseEnter={() => setHoveredStars({ ...hoveredStars, [criterion]: star })}
                  onMouseLeave={() => setHoveredStars({ ...hoveredStars, [criterion]: 0 })}
                >
                  {star <= (hoveredStars[criterion] || ratings[criterion]) ? (
                    <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                  ) : (
                    <StarOff className="w-6 h-6 text-gray-300" />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-2 px-4 bg-olive text-white rounded-md hover:bg-olive-dark transition-colors"
      >
        Soumettre l'évaluation
      </button>
    </div>
  );
}
