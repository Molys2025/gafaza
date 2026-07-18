
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Briefcase, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { createJob, type JobPaymentType } from "@/services/jobService";

interface OliveGrove {
  id: number;
  name: string;
  location: string;
  trees: number;
  variety: string;
  estimatedYield: string;
}

interface PublishJobDialogProps {
  oliveGrove: OliveGrove;
  onPublished?: () => void;
}

/** yyyy-MM-dd, the format Postgres date columns expect. */
const toDateColumn = (date: Date) => format(date, 'yyyy-MM-dd');

const PublishJobDialog = ({ oliveGrove, onPublished }: PublishJobDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [isPublishing, setIsPublishing] = useState(false);
  const [formData, setFormData] = useState({
    title: `Cueillette d'olives - ${oliveGrove.name}`,
    workersNeeded: 3,
    dailyRate: 45,
    paymentType: 'daily' as JobPaymentType,
    description: '',
    workingHours: { start: '08:00', end: '17:00', break_time: '1h' },
    facilities: {
      water: true,
      parking: true,
      shelter: true,
      restroom: true,
      tools_provided: true
    }
  });
  const { toast } = useToast();
  const { user } = useAuth();

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePublish = async () => {
    if (!startDate || !endDate) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner les dates de début et de fin.",
        variant: "destructive"
      });
      return;
    }

    if (endDate < startDate) {
      toast({
        title: "Erreur",
        description: "La date de fin doit être postérieure à la date de début.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour publier une annonce.",
        variant: "destructive"
      });
      return;
    }

    setIsPublishing(true);
    try {
      await createJob(user.id, {
        title: formData.title,
        description: formData.description,
        jobType: 'harvest',
        startDate: toDateColumn(startDate),
        endDate: toDateColumn(endDate),
        workersNeeded: formData.workersNeeded,
        paymentType: formData.paymentType,
        paymentAmount: formData.dailyRate,
        workingHours: formData.workingHours,
        facilities: formData.facilities,
        locationAddress: oliveGrove.location,
        treeCount: oliveGrove.trees,
        oliveTypes: oliveGrove.variety ? [oliveGrove.variety] : null,
      });

      toast({
        title: "Annonce publiée !",
        description: `Votre annonce "${formData.title}" est maintenant visible par les cueilleurs.`,
      });

      setIsOpen(false);
      onPublished?.();
    } catch (error: any) {
      console.error('Error publishing job:', error);
      toast({
        title: "Erreur",
        description: error?.message || "La publication de l'annonce a échoué.",
        variant: "destructive"
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-olive hover:bg-olive-dark flex items-center gap-2">
          <Briefcase size={16} />
          Publier une annonce
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-olive" />
            Publier une annonce pour {oliveGrove.name}
          </DialogTitle>
          <DialogDescription>
            Créez une annonce de travail pour votre oliveraie
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Informations de l'oliveraie */}
          <div className="p-4 bg-olive/5 rounded-lg">
            <h3 className="font-semibold text-olive-dark mb-2">Informations de l'oliveraie</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Nom :</span>
                <span className="ml-2 font-medium">{oliveGrove.name}</span>
              </div>
              <div>
                <span className="text-gray-500">Localisation :</span>
                <span className="ml-2 font-medium">{oliveGrove.location}</span>
              </div>
              <div>
                <span className="text-gray-500">Nombre d'arbres :</span>
                <span className="ml-2 font-medium">{oliveGrove.trees}</span>
              </div>
              <div>
                <span className="text-gray-500">Variété :</span>
                <span className="ml-2 font-medium">{oliveGrove.variety}</span>
              </div>
            </div>
          </div>

          {/* Formulaire de l'annonce */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Titre de l'annonce</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Ex: Cueillette d'olives - Oliveraie Nord"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date de début</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP", { locale: fr }) : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Date de fin</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP", { locale: fr }) : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="workersNeeded">Nombre de cueilleurs</Label>
                <Input
                  id="workersNeeded"
                  type="number"
                  min="1"
                  value={formData.workersNeeded}
                  onChange={(e) => handleInputChange('workersNeeded', parseInt(e.target.value))}
                />
              </div>

              <div>
                <Label htmlFor="dailyRate">Montant du paiement (TND)</Label>
                <Input
                  id="dailyRate"
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.dailyRate}
                  onChange={(e) => handleInputChange('dailyRate', parseFloat(e.target.value))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="paymentType">Type de paiement</Label>
              <Select value={formData.paymentType} onValueChange={(value) => handleInputChange('paymentType', value as JobPaymentType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Journalier</SelectItem>
                  <SelectItem value="hourly">Horaire</SelectItem>
                  <SelectItem value="fixed">Forfait total</SelectItem>
                  <SelectItem value="per_kg">Au kilo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hoursStart">Heure de début</Label>
                <Input
                  id="hoursStart"
                  type="time"
                  value={formData.workingHours.start}
                  onChange={(e) => handleInputChange('workingHours', { ...formData.workingHours, start: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="hoursEnd">Heure de fin</Label>
                <Input
                  id="hoursEnd"
                  type="time"
                  value={formData.workingHours.end}
                  onChange={(e) => handleInputChange('workingHours', { ...formData.workingHours, end: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description du travail</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Décrivez les tâches à accomplir, les conditions de travail, etc."
                rows={4}
              />
            </div>

            <div>
              <Label className="text-base font-medium">Équipements fournis</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.facilities.water}
                    onChange={(e) => handleInputChange('facilities', {...formData.facilities, water: e.target.checked})}
                  />
                  <span>Eau potable</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.facilities.parking}
                    onChange={(e) => handleInputChange('facilities', {...formData.facilities, parking: e.target.checked})}
                  />
                  <span>Parking</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.facilities.shelter}
                    onChange={(e) => handleInputChange('facilities', {...formData.facilities, shelter: e.target.checked})}
                  />
                  <span>Abri</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.facilities.restroom}
                    onChange={(e) => handleInputChange('facilities', {...formData.facilities, restroom: e.target.checked})}
                  />
                  <span>Sanitaires</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.facilities.tools_provided}
                    onChange={(e) => handleInputChange('facilities', {...formData.facilities, tools_provided: e.target.checked})}
                  />
                  <span>Outils fournis</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isPublishing}>
              Annuler
            </Button>
            <Button onClick={handlePublish} className="bg-olive hover:bg-olive-dark" disabled={isPublishing}>
              {isPublishing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPublishing ? "Publication..." : "Publier l'annonce"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PublishJobDialog;
