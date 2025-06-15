import React, { useState, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { useOnboarding } from '@/hooks/useOnboarding';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import { useAuth } from '@/hooks/useAuth';
import { createHarvester, uploadProfilePicture, uploadIdCard } from '@/services/harvesterService';

const formSchema = z.object({
  // Personal information
  fullName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  whatsapp: z.string().optional(),
  
  // Professional information
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
  const { shouldShowOnboarding, markOnboardingComplete } = useOnboarding();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [idCardFile, setIdCardFile] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [idCardImageFile, setIdCardImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

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

  useEffect(() => {
    if (shouldShowOnboarding('harvester')) {
      setShowOnboarding(true);
    }
  }, [shouldShowOnboarding]);

  const handleOnboardingComplete = () => {
    markOnboardingComplete('harvester');
    setShowOnboarding(false);
  };

  const handleOnboardingSkip = () => {
    markOnboardingComplete('harvester');
    setShowOnboarding(false);
  };

  const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdCardUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIdCardImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setIdCardFile(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour créer un profil.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    console.log('Submitting harvester profile:', values);

    try {
      // Prepare the data for the service
      const harvesterData = {
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        whatsapp: values.whatsapp,
        experience: parseInt(values.experience),
        skills: [values.skills], // Convert to array as expected by service
        availabilityStart: values.availabilityStart,
        availabilityEnd: values.availabilityEnd,
        preferredRegions: [values.preferredRegions], // Convert to array as expected by service
        dailyRate: parseFloat(values.dailyRate),
        references: values.references,
        additionalInfo: values.additionalInfo,
      };

      console.log('Creating harvester profile in database...');
      await createHarvester(user.id, harvesterData);
      console.log('Harvester profile created successfully');

      // Upload profile picture if provided
      if (profileImageFile) {
        console.log('Uploading profile picture...');
        await uploadProfilePicture(user.id, profileImageFile);
        console.log('Profile picture uploaded successfully');
      }

      // Upload ID card if provided
      if (idCardImageFile) {
        console.log('Uploading ID card...');
        await uploadIdCard(user.id, idCardImageFile);
        console.log('ID card uploaded successfully');
      }

      toast({
        title: "Profil créé avec succès",
        description: "Votre profil de cueilleur a été enregistré en base de données.",
      });

    } catch (error: any) {
      console.error('Error creating harvester profile:', error);
      toast({
        title: "Erreur lors de la création",
        description: error.message || "Une erreur est survenue lors de la création de votre profil.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-light py-8">
      {showOnboarding && (
        <OnboardingFlow
          userType="harvester"
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}
      
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-olive-dark mb-6">Profil Cueilleur</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal information */}
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>Vos informations de contact</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center mb-6">
                  <div className="relative w-24 h-24 bg-gray-200 rounded-full overflow-hidden mr-6 flex items-center justify-center">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-gray-400" />
                    )}
                    <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md cursor-pointer">
                      <Upload className="h-4 w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div>
                    <h3 className="font-medium">Photo de profil</h3>
                    <p className="text-sm text-muted-foreground">Ajoutez une photo pour vous présenter</p>
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
                      <FormDescription>Pour faciliter la communication</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Professional information */}
            <Card>
              <CardHeader>
                <CardTitle>Informations professionnelles</CardTitle>
                <CardDescription>Votre expérience et vos compétences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Années d'expérience</FormLabel>
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
                        <FormLabel>Tarif journalier (TND)</FormLabel>
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
                            <SelectValue placeholder="Sélectionnez vos compétences" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="harvest">Récolte uniquement</SelectItem>
                          <SelectItem value="maintenance">Entretien des oliviers</SelectItem>
                          <SelectItem value="pruning">Taille des arbres</SelectItem>
                          <SelectItem value="all">Toutes les compétences</SelectItem>
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
                            <SelectValue placeholder="Sélectionnez vos régions" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="tunis">Tunis</SelectItem>
                          <SelectItem value="sfax">Sfax</SelectItem>
                          <SelectItem value="sousse">Sousse</SelectItem>
                          <SelectItem value="nabeul">Nabeul</SelectItem>
                          <SelectItem value="monastir">Monastir</SelectItem>
                          <SelectItem value="any">Toute la Tunisie</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Où acceptez-vous de travailler</FormDescription>
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
                        <FormLabel>Disponible à partir du</FormLabel>
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
                        <FormLabel>Disponible jusqu'au</FormLabel>
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
                <CardTitle>Documents</CardTitle>
                <CardDescription>Références et documents officiels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center mb-6">
                  <div className="relative w-40 h-24 bg-gray-200 rounded-md overflow-hidden mr-6 flex items-center justify-center border border-dashed border-gray-300">
                    {idCardFile ? (
                      <img src={idCardFile} alt="ID Card" className="w-full h-full object-cover" />
                    ) : (
                      <FileText className="w-12 h-12 text-gray-400" />
                    )}
                    <label className="absolute bottom-2 right-2 bg-white rounded-md p-1 shadow-md cursor-pointer">
                      <Upload className="h-4 w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleIdCardUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div>
                    <h3 className="font-medium">Carte d'identité</h3>
                    <p className="text-sm text-muted-foreground">
                      Photo de votre carte d'identité
                      <span className="flex items-center text-xs text-orange-500 mt-1">
                        <BadgeCheck className="h-3 w-3 mr-1" /> Requis pour la vérification
                      </span>
                    </p>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="references"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Références</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Noms et contacts de propriétaires pour qui vous avez travaillé"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Propriétaires qui peuvent témoigner de votre travail</FormDescription>
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
                          placeholder="Autres informations pertinentes"
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
              <Button type="submit" className="bg-olive hover:bg-olive-dark" disabled={isSubmitting}>
                {isSubmitting ? "Création en cours..." : "Créer mon profil"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default HarvesterProfile;
