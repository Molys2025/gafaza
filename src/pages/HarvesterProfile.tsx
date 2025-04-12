
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
import { Upload, MapPin, Calendar, Briefcase, FileText, BadgeCheck, User } from "lucide-react";

const formSchema = z.object({
  // Informations personnelles
  fullName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  whatsapp: z.string().optional(),
  
  // Informations professionnelles
  experience: z.string().min(1, "L'expérience est requise"),
  skills: z.string().min(2, "Les compétences sont requises"),
  availabilityStart: z.string().min(2, "La date de début est requise"),
  availabilityEnd: z.string().min(2, "La date de fin est requise"),
  preferredRegions: z.string().min(2, "Les régions préférées sont requises"),
  dailyRate: z.string().min(1, "Le tarif journalier est requis"),
  
  // Documents
  references: z.string().optional(),
  additionalInfo: z.string().optional(),
});

const HarvesterProfile = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [idCardFile, setIdCardFile] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      whatsapp: "",
      experience: "",
      skills: "",
      availabilityStart: "",
      availabilityEnd: "",
      preferredRegions: "",
      dailyRate: "",
      references: "",
      additionalInfo: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    // TODO: Implement form submission
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-olive-dark mb-6">Créer votre profil cueilleur</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Informations personnelles */}
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>Vos informations de contact principales</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center mb-6">
                <div className="relative w-24 h-24 bg-gray-200 rounded-full overflow-hidden mr-6 flex items-center justify-center">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md"
                    type="button"
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <h3 className="font-medium">Photo de profil</h3>
                  <p className="text-sm text-muted-foreground">Téléchargez une photo claire de vous</p>
                </div>
              </div>
              
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

              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp (optionnel)</FormLabel>
                    <FormControl>
                      <Input placeholder="+216 XX XXX XXX" {...field} />
                    </FormControl>
                    <FormDescription>Numéro WhatsApp si différent du téléphone principal</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Informations professionnelles */}
          <Card>
            <CardHeader>
              <CardTitle>Informations professionnelles</CardTitle>
              <CardDescription>Détaillez votre expérience et disponibilité</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expérience (années)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dailyRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tarif journalier (DT)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compétences</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner vos compétences" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="harvest">Récolte uniquement</SelectItem>
                        <SelectItem value="maintenance">Entretien</SelectItem>
                        <SelectItem value="pruning">Taille</SelectItem>
                        <SelectItem value="all">Toutes compétences</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferredRegions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Régions préférées</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner les régions" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="tunis">Tunis</SelectItem>
                        <SelectItem value="sfax">Sfax</SelectItem>
                        <SelectItem value="sousse">Sousse</SelectItem>
                        <SelectItem value="nabeul">Nabeul</SelectItem>
                        <SelectItem value="monastir">Monastir</SelectItem>
                        <SelectItem value="any">Toutes régions</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Sélectionnez les régions où vous préférez travailler</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="availabilityStart"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Disponibilité début</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="availabilityEnd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Disponibilité fin</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Documents et références</CardTitle>
              <CardDescription>Ajoutez des documents pour vérifier votre identité</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center mb-6">
                <div className="relative w-40 h-24 bg-gray-200 rounded-md overflow-hidden mr-6 flex items-center justify-center border border-dashed border-gray-300">
                  {idCardFile ? (
                    <img src={idCardFile} alt="ID Card" className="w-full h-full object-cover" />
                  ) : (
                    <FileText className="w-12 h-12 text-gray-400" />
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute bottom-2 right-2 bg-white rounded-md p-1 shadow-md"
                    type="button"
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <h3 className="font-medium">Carte d'identité</h3>
                  <p className="text-sm text-muted-foreground">
                    Téléchargez une copie de votre CIN
                    <span className="flex items-center text-xs text-orange-500 mt-1">
                      <BadgeCheck className="h-3 w-3 mr-1" /> Document requis pour la vérification
                    </span>
                  </p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="references"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Références professionnelles</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Ajoutez des noms et contacts de références professionnelles"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Optionnel - Ajoutez des références de précédents employeurs</FormDescription>
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
                        placeholder="Toute information additionnelle que vous souhaitez partager"
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

export default HarvesterProfile;
