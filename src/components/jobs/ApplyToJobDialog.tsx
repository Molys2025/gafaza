import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { applyToJob } from "@/services/applicationService";
import type { JobRow } from "@/services/jobService";

interface ApplyToJobDialogProps {
  job: JobRow;
  jobSeekerId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplied?: () => void;
}

const ApplyToJobDialog = ({
  job,
  jobSeekerId,
  open,
  onOpenChange,
  onApplied,
}: ApplyToJobDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [expectedSalary, setExpectedSalary] = useState<string>(
    job.payment_amount != null ? String(job.payment_amount) : "",
  );
  const [availabilityStart, setAvailabilityStart] = useState(job.start_date ?? "");
  const [availabilityEnd, setAvailabilityEnd] = useState(job.end_date ?? "");

  const handleSubmit = async () => {
    if (availabilityStart && availabilityEnd && availabilityEnd < availabilityStart) {
      toast({
        title: "Erreur",
        description: "La date de fin doit être postérieure à la date de début.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await applyToJob(jobSeekerId, {
        jobId: job.id,
        coverLetter,
        expectedSalary: expectedSalary ? Number(expectedSalary) : null,
        availabilityStart: availabilityStart || null,
        availabilityEnd: availabilityEnd || null,
      });

      toast({
        title: "Candidature envoyée !",
        description: `Le propriétaire de "${job.title}" a reçu votre candidature.`,
      });

      onOpenChange(false);
      onApplied?.();
    } catch (error: any) {
      console.error("Error applying to job:", error);
      toast({
        title: "Erreur",
        description: error?.message || "L'envoi de la candidature a échoué.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Postuler à cette annonce</DialogTitle>
          <DialogDescription>{job.title}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label htmlFor="coverLetter">Message au propriétaire</Label>
            <Textarea
              id="coverLetter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Présentez votre expérience, vos disponibilités, si vous venez en équipe..."
              rows={5}
            />
          </div>

          <div>
            <Label htmlFor="expectedSalary">Tarif souhaité (TND)</Label>
            <Input
              id="expectedSalary"
              type="number"
              min="0"
              step="0.5"
              value={expectedSalary}
              onChange={(e) => setExpectedSalary(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Proposé par l'annonce : {job.payment_amount} TND
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="availabilityStart">Disponible à partir du</Label>
              <Input
                id="availabilityStart"
                type="date"
                value={availabilityStart}
                onChange={(e) => setAvailabilityStart(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="availabilityEnd">Jusqu'au</Label>
              <Input
                id="availabilityEnd"
                type="date"
                value={availabilityEnd}
                onChange={(e) => setAvailabilityEnd(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-olive hover:bg-olive-dark"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Envoi..." : "Envoyer ma candidature"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyToJobDialog;
