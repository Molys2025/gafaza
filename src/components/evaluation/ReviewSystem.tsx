
import { useState } from "react";
import { Upload, Flag, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ReviewSystemProps {
  onReviewSubmit?: (review: { text: string; photos: File[] }) => void;
}

export function ReviewSystem({ onReviewSubmit }: ReviewSystemProps) {
  const [reviewText, setReviewText] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const { toast } = useToast();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReviewText(e.target.value);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      if (photos.length + newFiles.length > 3) {
        toast({
          title: "Limite atteinte",
          description: "Vous pouvez télécharger un maximum de 3 photos",
          variant: "destructive",
        });
        return;
      }

      setPhotos([...photos, ...newFiles]);
      
      // Create preview URLs for the new files
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls([...previewUrls, ...newPreviewUrls]);
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);

    // Revoke the URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    const newPreviewUrls = [...previewUrls];
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);
  };

  const handleSubmit = () => {
    if (reviewText.trim() === "") {
      toast({
        title: "Commentaire requis",
        description: "Veuillez rédiger un commentaire avant de soumettre",
        variant: "destructive",
      });
      return;
    }

    if (onReviewSubmit) {
      onReviewSubmit({ text: reviewText, photos });
    }

    // Clear form after submission
    setReviewText("");
    setPhotos([]);
    setPreviewUrls([]);

    toast({
      title: "Commentaire soumis",
      description: "Votre commentaire a été soumis avec succès",
    });
  };

  const reportReview = () => {
    toast({
      title: "Signalement envoyé",
      description: "Nous examinerons ce commentaire dans les plus brefs délais",
    });
  };

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-medium">Laissez un commentaire</h3>

      <Textarea 
        placeholder="Partagez votre expérience..." 
        value={reviewText}
        onChange={handleTextChange}
        className="min-h-32"
      />

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Button variant="outline" size="sm" className="gap-2" asChild>
            <label>
              <Upload className="h-4 w-4" />
              Ajouter des photos
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                className="hidden" 
                onChange={handlePhotoUpload}
              />
            </label>
          </Button>
          <span className="text-xs text-muted-foreground">
            {photos.length}/3 photos
          </span>
        </div>

        {previewUrls.length > 0 && (
          <div className="flex gap-2 mt-2">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative">
                <img 
                  src={url} 
                  alt={`Preview ${index}`} 
                  className="w-16 h-16 object-cover rounded-md border" 
                />
                <button 
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                  onClick={() => removePhoto(index)}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-red-500" 
          onClick={reportReview}
        >
          <Flag className="h-4 w-4 mr-1" />
          Signaler un abus
        </Button>
        <Button onClick={handleSubmit}>
          <Check className="h-4 w-4 mr-1" />
          Soumettre
        </Button>
      </div>
    </div>
  );
}
