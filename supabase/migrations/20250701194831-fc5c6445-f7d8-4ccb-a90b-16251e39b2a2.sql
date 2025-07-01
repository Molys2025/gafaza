
-- Create user profiles table with user type
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type TEXT NOT NULL CHECK (user_type IN ('owner', 'harvester')),
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create owner-specific profile data
CREATE TABLE public.owner_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  experience_years INTEGER,
  olive_trees_count INTEGER,
  grove_location TEXT,
  grove_size_hectares DECIMAL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create harvester-specific profile data
CREATE TABLE public.harvester_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  experience_years INTEGER,
  specializations TEXT[], -- Array of specializations
  equipment_owned TEXT[],
  availability_radius_km INTEGER,
  hourly_rate DECIMAL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.owner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.harvester_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for owner_profiles
CREATE POLICY "Owners can view their own profile" ON public.owner_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Owners can update their own profile" ON public.owner_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Owners can insert their own profile" ON public.owner_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for harvester_profiles
CREATE POLICY "Harvesters can view their own profile" ON public.harvester_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Harvesters can update their own profile" ON public.harvester_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Harvesters can insert their own profile" ON public.harvester_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- This will be called after user signs up, but profile creation will be handled in the app
  RETURN NEW;
END;
$$;

-- Create trigger for new users (optional, for future use)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
