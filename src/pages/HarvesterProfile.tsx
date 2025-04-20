
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
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";

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
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [idCardFile, setIdCardFile] = useState<string | null>(null);
  const { t } = useTranslation();
  const { toast } = useToast();

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
    // This will be connected to Supabase in a future step
    toast({
      title: "Profil créé",
      description: "Votre profil a été créé avec succès.",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-olive-dark mb-6">{t('harvester.title')}</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('harvester.personalInfo')}</CardTitle>
              <CardDescription>{t('harvester.personalInfoDesc')}</CardDescription>
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
                  <h3 className="font-medium">{t('harvester.profilePicture')}</h3>
                  <p className="text-sm text-muted-foreground">{t('harvester.profilePictureDesc')}</p>
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('harvester.fullName')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('harvester.fullName')} {...field} />
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
                      <FormLabel>{t('harvester.email')}</FormLabel>
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
                      <FormLabel>{t('harvester.phone')}</FormLabel>
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
                    <FormLabel>{t('harvester.whatsapp')}</FormLabel>
                    <FormControl>
                      <Input placeholder="+216 XX XXX XXX" {...field} />
                    </FormControl>
                    <FormDescription>{t('harvester.whatsappDesc')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Professional information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('harvester.professionalInfo')}</CardTitle>
              <CardDescription>{t('harvester.professionalInfoDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('harvester.experience')}</FormLabel>
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
                      <FormLabel>{t('harvester.dailyRate')}</FormLabel>
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
                    <FormLabel>{t('harvester.skills')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('harvester.skillsSelect')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="harvest">{t('harvester.harvest')}</SelectItem>
                        <SelectItem value="maintenance">{t('harvester.maintenance')}</SelectItem>
                        <SelectItem value="pruning">{t('harvester.pruning')}</SelectItem>
                        <SelectItem value="all">{t('harvester.allSkills')}</SelectItem>
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
                    <FormLabel>{t('harvester.regions')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('harvester.regionsSelect')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="tunis">Tunis</SelectItem>
                        <SelectItem value="sfax">Sfax</SelectItem>
                        <SelectItem value="sousse">Sousse</SelectItem>
                        <SelectItem value="nabeul">Nabeul</SelectItem>
                        <SelectItem value="monastir">Monastir</SelectItem>
                        <SelectItem value="any">{t('harvester.anyRegion')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>{t('harvester.regionsDesc')}</FormDescription>
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
                      <FormLabel>{t('harvester.availabilityStart')}</FormLabel>
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
                      <FormLabel>{t('harvester.availabilityEnd')}</FormLabel>
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
              <CardTitle>{t('harvester.documents')}</CardTitle>
              <CardDescription>{t('harvester.documentsDesc')}</CardDescription>
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
                  <h3 className="font-medium">{t('harvester.idCard')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('harvester.idCardDesc')}
                    <span className="flex items-center text-xs text-orange-500 mt-1">
                      <BadgeCheck className="h-3 w-3 mr-1" /> {t('harvester.idCardRequired')}
                    </span>
                  </p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="references"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('harvester.references')}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={t('harvester.referencesDesc')}
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>{t('harvester.referencesDesc')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="additionalInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('harvester.additionalInfo')}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={t('harvester.additionalInfo')}
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
              {t('harvester.cancel')}
            </Button>
            <Button type="submit" className="bg-olive hover:bg-olive-dark">
              {t('harvester.createProfile')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default HarvesterProfile;
