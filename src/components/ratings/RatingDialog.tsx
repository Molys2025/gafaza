import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { createRating, RATING_CRITERIA } from "@/services/ratingService";

interface RatingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  raterId: string;
  ratedId: string;
  ratedName: string;
  applicationId: string;
  jobId?: string | null;
  /** What is being rated: the work provider or the job seeker. */
  ratingType: 'work_provider' | 'job_seeker';
  onRated?: () => void;
}

const StarInput = ({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (value: number) => void;
  label: string;
}) => (
  <div className="flex items-center justify-between gap-4">
    <Label className="font-normal">{label}</Label>
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((score) => (
        <button
          key={score}
          type="button"
          onClick={() => onChange(score)}
          aria-label={`${label} : ${score} sur 5`}
          className="p-0.5"
        >
          <Star
            className={cn(
              "h-5 w-5 transition-colors",
              score <= value ? "fill-olive text-olive" : "text-gray-300",
            )}
          />
        </button>
      ))}
    </div>
  </div>
);

const RatingDialog = ({
  open,
  onOpenChange,
  raterId,
  ratedId,
  ratedName,
  applicationId,
  jobId,
  ratingType,
  onRated,
}: RatingDialogProps) => {
  const { toast } = useToast();
  const criteria = RATING_CRITERIA[ratingType];

  const [overall, setOverall] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (overall < 1) {
      toast({
        title: "Note manquante",
        description: "Donnez au moins une note globale.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createRating(raterId, {
        applicationId,
        jobId,
        ratedId,
        ratingType,
        scores: { overall, ...scores },
        comment,
      });

      toast({
        title: "Évaluation publiée",
        description: `Merci d'avoir évalué ${ratedName}.`,
      });

      onOpenChange(false);
      onRated?.();
    } catch (error: any) {
      console.error("Error creating rating:", error);
      toast({
        title: "Erreur",
        description: error?.message || "L'évaluation n'a pas pu être enregistrée.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Évaluer {ratedName}</DialogTitle>
          <DialogDescription>
            Votre avis est public et aide les autres utilisateurs à choisir.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="p-3 bg-olive/5 rounded-lg">
            <StarInput value={overall} onChange={setOverall} label="Note globale" />
          </div>

          {criteria.map(({ key, label }) => (
            <StarInput
              key={key}
              label={label}
              value={scores[key] ?? 0}
              onChange={(value) => setScores((prev) => ({ ...prev, [key]: value }))}
            />
          ))}

          <div>
            <Label htmlFor="comment">Commentaire (facultatif)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Comment s'est passée la mission ?"
              rows={4}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-olive hover:bg-olive-dark"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Publier mon évaluation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RatingDialog;
