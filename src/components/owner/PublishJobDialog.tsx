
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Briefcase } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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
}

const PublishJobDialog = ({ oliveGrove }: PublishJobDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [formData, setFormData] = useState({
    title: `Cueillette d'olives - ${oliveGrove.name}`,
    workersNeeded: 3,
    dailyRate: 45,
    paymentType: 'daily',
    description: '',
    workingHours: '8h00 - 17h00',
    facilities: {
      water: true,
      parking: true,
      shelter: true,
      restroom: true,
      tools: true
    }
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePublish = () => {
    if (!startDate || !endDate) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner les dates de début et de fin.",
        variant: "destructive"
      });
      return;
    }

    // Simulation de la publication
    toast({
      title: "Annonce publiée !",
      description: `Votre annonce "${formData.title}" a été publiée avec succès.`,
    });
    
    console.log("Job published:", {
      ...formData,
      oliveGrove,
      startDate,
      endDate
    });
    
    setIsOpen(false);
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
                <Label htmlFor="dailyRate">Tarif journalier (TND)</Label>
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
              <Select value={formData.paymentType} onValueChange={(value) => handleInputChange('paymentType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Journalier</SelectItem>
                  <SelectItem value="weekly">Hebdomadaire</SelectItem>
                  <SelectItem value="total">Forfait total</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="workingHours">Horaires de travail</Label>
              <Input
                id="workingHours"
                value={formData.workingHours}
                onChange={(e) => handleInputChange('workingHours', e.target.value)}
                placeholder="Ex: 8h00 - 17h00"
              />
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
                    checked={formData.facilities.tools}
                    onChange={(e) => handleInputChange('facilities', {...formData.facilities, tools: e.target.checked})}
                  />
                  <span>Outils fournis</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handlePublish} className="bg-olive hover:bg-olive-dark">
              Publier l'annonce
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PublishJobDialog;
