import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sparkles, Minus, Plus, X, CheckCircle2 } from 'lucide-react';
import { REGIONS } from '@/constants/regions';

interface ProfileConfirmationProps {
  initialData: any;
  userType: 'owner' | 'harvester';
  onProfileComplete: (profileData: any) => void;
  onRerecord?: () => void;
}

/** Utility: track whether a field was pre-filled by AI so we can show a badge. */
const useSuggested = (initialValue: unknown) =>
  useMemo(
    () => initialValue !== undefined && initialValue !== null && initialValue !== '',
    [initialValue],
  );

const AiBadge = () => (
  <Badge variant="secondary" className="ml-2 text-[10px] gap-1 py-0 px-1.5">
    <Sparkles className="h-3 w-3" /> IA
  </Badge>
);

interface StepperProps {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  step?: number;
  suffix?: string;
}
const Stepper = ({ value, onChange, min = 0, step = 1, suffix }: StepperProps) => (
  <div className="flex items-center gap-2">
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={() => onChange(Math.max(min, value - step))}
    >
      <Minus className="h-4 w-4" />
    </Button>
    <Input
      type="number"
      inputMode="numeric"
      className="text-center"
      value={Number.isFinite(value) ? value : 0}
      onChange={(e) => onChange(Math.max(min, Number(e.target.value) || 0))}
    />
    <Button type="button" variant="outline" size="icon" onClick={() => onChange(value + step)}>
      <Plus className="h-4 w-4" />
    </Button>
    {suffix && <span className="text-sm text-muted-foreground min-w-16">{suffix}</span>}
  </div>
);

interface ChipsProps {
  values: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
}
const Chips = ({ values, onChange, placeholder, suggestions = [] }: ChipsProps) => {
  const [draft, setDraft] = useState('');
  const add = (raw: string) => {
    const v = raw.trim();
    if (!v || values.includes(v)) return;
    onChange([...values, v]);
    setDraft('');
  };
  const remove = (v: string) => onChange(values.filter((x) => x !== v));
  return (
    <div className="space-y-2">
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {values.map((v) => (
            <Badge key={v} variant="secondary" className="gap-1">
              {v}
              <button type="button" onClick={() => remove(v)} aria-label={`Retirer ${v}`}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              add(draft);
            }
          }}
          placeholder={placeholder}
        />
        <Button type="button" variant="outline" onClick={() => add(draft)}>
          Ajouter
        </Button>
      </div>
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {suggestions
            .filter((s) => !values.includes(s))
            .map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => add(s)}
                className="text-xs px-2 py-1 rounded-full border border-dashed hover:bg-sand-light"
              >
                + {s}
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

const RegionsSelect = ({
  values,
  onChange,
}: {
  values: string[];
  onChange: (next: string[]) => void;
}) => {
  const remove = (v: string) => onChange(values.filter((x) => x !== v));
  const add = (v: string) => {
    if (!values.includes(v)) onChange([...values, v]);
  };
  return (
    <div className="space-y-2">
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {values.map((v) => (
            <Badge key={v} variant="secondary" className="gap-1">
              {v}
              <button type="button" onClick={() => remove(v)} aria-label={`Retirer ${v}`}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      <Select onValueChange={add}>
        <SelectTrigger>
          <SelectValue placeholder="Ajouter une région" />
        </SelectTrigger>
        <SelectContent>
          {REGIONS.filter((r) => !values.includes(r)).map((r) => (
            <SelectItem key={r} value={r}>
              {r}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

const ProfileConfirmation = ({
  initialData,
  userType,
  onProfileComplete,
  onRerecord,
}: ProfileConfirmationProps) => {
  const p = initialData?.personal_info ?? {};
  const prop = initialData?.property_info ?? {};
  const skills = initialData?.skills_and_services ?? {};
  const workPref = initialData?.work_preferences ?? {};
  const extra = initialData?.additional_info ?? {};

  // Common
  const [name, setName] = useState<string>(p.name ?? '');
  const [location, setLocation] = useState<string>(p.location ?? '');
  const [phone, setPhone] = useState<string>(initialData?.phone ?? '');
  const [whatsapp, setWhatsapp] = useState<string>(initialData?.whatsapp ?? '');
  const [specialNotes, setSpecialNotes] = useState<string>(extra.special_notes ?? '');

  // Owner
  const [businessName, setBusinessName] = useState<string>(prop.business_name ?? '');
  const [propertyAddress, setPropertyAddress] = useState<string>(prop.property_address ?? '');
  const [propertySize, setPropertySize] = useState<number>(Number(prop.property_size) || 0);
  const [treeCount, setTreeCount] = useState<number>(Number(prop.tree_count) || 0);
  const [oliveTypes, setOliveTypes] = useState<string[]>(
    Array.isArray(prop.olive_types) ? prop.olive_types : [],
  );

  // Harvester
  const [experienceYears, setExperienceYears] = useState<number>(
    Number(p.experience_years) || 0,
  );
  const [specializations, setSpecializations] = useState<string[]>(
    Array.isArray(skills.specializations) ? skills.specializations : [],
  );
  const [dailyRate, setDailyRate] = useState<number>(Number(skills.daily_rate) || 0);
  const [preferredRegions, setPreferredRegions] = useState<string[]>(
    Array.isArray(workPref.preferred_regions) ? workPref.preferred_regions : [],
  );

  // Track initial AI-suggestion state (badges)
  const nameSuggested = useSuggested(p.name);
  const locationSuggested = useSuggested(p.location);
  const phoneSuggested = useSuggested(initialData?.phone);
  const whatsappSuggested = useSuggested(initialData?.whatsapp);
  const businessSuggested = useSuggested(prop.business_name);
  const propertyAddressSuggested = useSuggested(prop.property_address);
  const propertySizeSuggested = useSuggested(prop.property_size);
  const treeCountSuggested = useSuggested(prop.tree_count);
  const oliveTypesSuggested = useSuggested(prop.olive_types);
  const experienceSuggested = useSuggested(p.experience_years);
  const specializationsSuggested = useSuggested(skills.specializations);
  const dailyRateSuggested = useSuggested(skills.daily_rate);
  const regionsSuggested = useSuggested(workPref.preferred_regions);

  const primaryLocation = userType === 'owner' ? propertyAddress : location;
  const hasLocation =
    userType === 'owner'
      ? propertyAddress.trim().length > 0 || location.trim().length > 0
      : preferredRegions.length > 0 || location.trim().length > 0;

  const canSubmit =
    name.trim().length > 0 && phone.trim().length > 0 && hasLocation;

  const missingRing = (missing: boolean) =>
    missing ? 'ring-2 ring-amber-400 ring-offset-1' : '';

  const handleSubmit = () => {
    const payload: any = {
      personal_info: {
        name,
        location: userType === 'owner' ? location || propertyAddress : location,
        experience_years: userType === 'harvester' ? experienceYears : undefined,
      },
      phone,
      whatsapp,
      additional_info: { special_notes: specialNotes || undefined },
    };

    if (userType === 'owner') {
      payload.property_info = {
        business_name: businessName,
        property_address: propertyAddress || primaryLocation,
        property_size: propertySize,
        tree_count: treeCount,
        olive_types: oliveTypes,
      };
    } else {
      payload.skills_and_services = {
        specializations,
        daily_rate: dailyRate,
      };
      payload.work_preferences = {
        preferred_regions: preferredRegions,
      };
    }

    onProfileComplete(payload);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-olive-dark">
          <CheckCircle2 className="h-5 w-5 text-olive" />
          Confirmez votre profil
        </CardTitle>
        <CardDescription>
          L'IA a pré-rempli les champs à partir de votre audio. Vérifiez, corrigez et validez.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Common: name */}
        <div className="space-y-2">
          <Label className="flex items-center">
            Nom complet <span className="text-red-500 ml-1">*</span>
            {nameSuggested && <AiBadge />}
          </Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={missingRing(!name.trim())}
            placeholder="Ex : Mohamed Ben Ali"
          />
        </div>

        {/* Location (owner keeps a soft city; harvester uses it as free-text city) */}
        <div className="space-y-2">
          <Label className="flex items-center">
            {userType === 'owner' ? 'Ville / région' : 'Ville actuelle'}
            {locationSuggested && <AiBadge />}
          </Label>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ex : Sfax"
          />
        </div>

        {/* Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center">
              Téléphone <span className="text-red-500 ml-1">*</span>
              {phoneSuggested && <AiBadge />}
            </Label>
            <Input
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={missingRing(!phone.trim())}
              placeholder="+216 ..."
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center">
              WhatsApp
              {whatsappSuggested && <AiBadge />}
            </Label>
            <Input
              type="tel"
              inputMode="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+216 ..."
            />
          </div>
        </div>

        {userType === 'owner' ? (
          <>
            <div className="space-y-2">
              <Label className="flex items-center">
                Nom de l'exploitation
                {businessSuggested && <AiBadge />}
              </Label>
              <Input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Ex : Domaine des Oliviers"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center">
                Adresse de la propriété
                {propertyAddressSuggested && <AiBadge />}
              </Label>
              <Input
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
                className={missingRing(!hasLocation)}
                placeholder="Ex : Route de Gabès, Sfax"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center">
                  Superficie
                  {propertySizeSuggested && <AiBadge />}
                </Label>
                <Stepper
                  value={propertySize}
                  onChange={setPropertySize}
                  step={1}
                  suffix="hectares"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center">
                  Nombre d'oliviers
                  {treeCountSuggested && <AiBadge />}
                </Label>
                <Stepper
                  value={treeCount}
                  onChange={setTreeCount}
                  step={10}
                  suffix="oliviers"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center">
                Variétés d'olives
                {oliveTypesSuggested && <AiBadge />}
              </Label>
              <Chips
                values={oliveTypes}
                onChange={setOliveTypes}
                placeholder="Ex : Chemlali"
                suggestions={['Chemlali', 'Chetoui', 'Meski', 'Oueslati']}
              />
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Label className="flex items-center">
                Années d'expérience
                {experienceSuggested && <AiBadge />}
              </Label>
              <Stepper
                value={experienceYears}
                onChange={setExperienceYears}
                step={1}
                suffix="ans"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center">
                Compétences
                {specializationsSuggested && <AiBadge />}
              </Label>
              <Chips
                values={specializations}
                onChange={setSpecializations}
                placeholder="Ex : Cueillette manuelle"
                suggestions={['Cueillette manuelle', 'Taille', 'Conduite tracteur', 'Récolte mécanique']}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center">
                Tarif journalier
                {dailyRateSuggested && <AiBadge />}
              </Label>
              <Stepper
                value={dailyRate}
                onChange={setDailyRate}
                step={5}
                suffix="TND / jour"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center">
                Régions préférées <span className="text-red-500 ml-1">*</span>
                {regionsSuggested && <AiBadge />}
              </Label>
              <div className={missingRing(preferredRegions.length === 0 && !location.trim()) + ' rounded-md'}>
                <RegionsSelect values={preferredRegions} onChange={setPreferredRegions} />
              </div>
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label>Notes supplémentaires (optionnel)</Label>
          <Textarea
            value={specialNotes}
            onChange={(e) => setSpecialNotes(e.target.value)}
            placeholder="Toute information utile que vous souhaitez ajouter"
            rows={3}
          />
        </div>

        <div className="pt-2 space-y-3">
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            size="lg"
            className="w-full bg-olive hover:bg-olive-dark text-white"
          >
            Confirmer mon profil
          </Button>
          {onRerecord && (
            <button
              type="button"
              onClick={onRerecord}
              className="w-full text-center text-sm text-muted-foreground underline hover:text-olive-dark"
            >
              Réenregistrer l'audio
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileConfirmation;