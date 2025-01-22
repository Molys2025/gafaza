import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, MapPin, Calendar, Wrench, Euro } from "lucide-react";

const formSchema = z.object({
  // Informations personnelles
  fullName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  city: z.string().min(2, "La ville est requise"),
  region: z.string().min(2, "La région est requise"),
  
  // Détails du terrain
  address: z.string().min(5, "L'adresse est requise"),
  governorate: z.string().min(2, "Le gouvernorat est requis"),
  area: z.string().min(1, "La superficie est requise"),
  treesCount: z.string().min(1, "Le nombre d'oliviers est requis"),
  oliveVariety: z.string().min(2, "La variété d'oliviers est requise"),
  accessibility: z.string().min(2, "L'accessibilité est requise"),
  
  // Besoins spécifiques
  requiredWork: z.string().min(2, "Le type de travail est requis"),
  workPeriod: z.string().min(2, "La période de travail est requise"),
  estimatedDuration: z.string().min(1, "La durée estimée est requise"),
  providedEquipment: z.string(),
  budget: z.string().optional(),
  additionalInfo: z.string().optional(),
});

const OwnerProfile = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [fieldImages, setFieldImages] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      city: "",
      region: "",
      address: "",
      governorate: "",
      area: "",
      treesCount: "",
      oliveVariety: "",
      accessibility: "",
      requiredWork: "",
      workPeriod: "",
      estimatedDuration: "",
      providedEquipment: "",
      budget: "",
      additionalInfo: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    // TODO: Implement form submission
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-olive-dark mb-6">Créer votre profil propriétaire</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Informations personnelles */}
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>Vos informations de contact principales</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom complet</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre nom complet" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="votre@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input placeholder="+216 XX XXX XXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ville</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre ville" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Région</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre région" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Détails du terrain */}
          <Card>
            <CardHeader>
              <CardTitle>Détails du terrain</CardTitle>
              <CardDescription>Informations sur votre terrain d'oliviers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse du terrain</FormLabel>
                    <FormControl>
                      <Input placeholder="Adresse exacte ou coordonnées GPS" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="governorate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gouvernorat</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="tunis">Tunis</SelectItem>
                          <SelectItem value="sfax">Sfax</SelectItem>
                          <SelectItem value="sousse">Sousse</SelectItem>
                          {/* Ajouter les autres gouvernorats */}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Superficie (hectares)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="treesCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre d'oliviers</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="oliveVariety"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Variété d'oliviers</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner la variété" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="chemlali">Chemlali</SelectItem>
                          <SelectItem value="chetoui">Chetoui</SelectItem>
                          <SelectItem value="other">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accessibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Accessibilité</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner l'accessibilité" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="car">Accessible en voiture</SelectItem>
                          <SelectItem value="foot">Accessible à pied uniquement</SelectItem>
                          <SelectItem value="special">Équipement spécial requis</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Besoins spécifiques */}
          <Card>
            <CardHeader>
              <CardTitle>Besoins spécifiques</CardTitle>
              <CardDescription>Détaillez vos besoins en main d'œuvre</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="requiredWork"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type de travail requis</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner le type de travail" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="harvest">Récolte uniquement</SelectItem>
                          <SelectItem value="maintenance">Entretien</SelectItem>
                          <SelectItem value="both">Récolte et entretien</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Période de travail</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner la période" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="nov-dec">Novembre-Décembre</SelectItem>
                          <SelectItem value="dec-jan">Décembre-Janvier</SelectItem>
                          <SelectItem value="other">Autre période</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="estimatedDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Durée estimée (jours)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="providedEquipment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Équipement fourni</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Aucun équipement fourni</SelectItem>
                          <SelectItem value="partial">Équipement partiel</SelectItem>
                          <SelectItem value="full">Tout équipement fourni</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget indicatif (DT/jour)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Budget journalier" {...field} />
                    </FormControl>
                    <FormDescription>Optionnel - Indiquez votre budget journalier</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="additionalInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Informations supplémentaires</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Ajoutez toute information complémentaire utile pour les cueilleurs"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline">
              Annuler
            </Button>
            <Button type="submit" className="bg-olive hover:bg-olive-dark">
              Créer le profil
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default OwnerProfile;
