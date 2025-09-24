-- Create enum types for better data integrity
CREATE TYPE train_status AS ENUM ('running', 'delayed', 'stopped', 'maintenance');
CREATE TYPE train_type AS ENUM ('passenger', 'express', 'freight', 'special');
CREATE TYPE signal_state AS ENUM ('green', 'yellow', 'red');
CREATE TYPE platform_status AS ENUM ('free', 'occupied', 'overdue');

-- User profiles table for railway controllers
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'controller',
  station_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Trains table for real-time train tracking
CREATE TABLE public.trains (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  train_number TEXT NOT NULL UNIQUE,
  train_name TEXT NOT NULL,
  status train_status NOT NULL DEFAULT 'running',
  train_type train_type NOT NULL,
  current_location TEXT NOT NULL,
  destination TEXT NOT NULL,
  origin TEXT NOT NULL,
  delay_minutes INTEGER DEFAULT 0,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  speed_kmh INTEGER DEFAULT 0,
  scheduled_arrival TIMESTAMP WITH TIME ZONE,
  actual_arrival TIMESTAMP WITH TIME ZONE,
  scheduled_departure TIMESTAMP WITH TIME ZONE,
  actual_departure TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Signals table for signal control system
CREATE TABLE public.signals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  signal_code TEXT NOT NULL UNIQUE,
  signal_name TEXT NOT NULL,
  state signal_state NOT NULL DEFAULT 'red',
  location TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  section TEXT,
  is_automatic BOOLEAN DEFAULT false,
  last_changed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_changed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Platforms table for platform management
CREATE TABLE public.platforms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform_number TEXT NOT NULL,
  station_code TEXT NOT NULL,
  station_name TEXT NOT NULL,
  status platform_status NOT NULL DEFAULT 'free',
  assigned_train_id UUID REFERENCES public.trains(id),
  scheduled_arrival TIMESTAMP WITH TIME ZONE,
  scheduled_departure TIMESTAMP WITH TIME ZONE,
  track_number TEXT,
  capacity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(station_code, platform_number)
);

-- Reports table for analytics and reporting
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_type TEXT NOT NULL,
  report_date DATE NOT NULL,
  data JSONB NOT NULL,
  generated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for trains (authenticated users can view/update)
CREATE POLICY "Authenticated users can view trains" ON public.trains
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can update trains" ON public.trains
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert trains" ON public.trains
  FOR INSERT TO authenticated WITH CHECK (true);

-- RLS Policies for signals
CREATE POLICY "Authenticated users can view signals" ON public.signals
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can update signals" ON public.signals
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert signals" ON public.signals
  FOR INSERT TO authenticated WITH CHECK (true);

-- RLS Policies for platforms
CREATE POLICY "Authenticated users can view platforms" ON public.platforms
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can update platforms" ON public.platforms
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert platforms" ON public.platforms
  FOR INSERT TO authenticated WITH CHECK (true);

-- RLS Policies for reports
CREATE POLICY "Authenticated users can view reports" ON public.reports
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create reports" ON public.reports
  FOR INSERT TO authenticated WITH CHECK (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trains_updated_at
  BEFORE UPDATE ON public.trains
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_signals_updated_at
  BEFORE UPDATE ON public.signals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_platforms_updated_at
  BEFORE UPDATE ON public.platforms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'Railway Controller'));
  RETURN NEW;
END;
$$;

-- Trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime for all tables
ALTER TABLE public.trains REPLICA IDENTITY FULL;
ALTER TABLE public.signals REPLICA IDENTITY FULL;
ALTER TABLE public.platforms REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.trains;
ALTER PUBLICATION supabase_realtime ADD TABLE public.signals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.platforms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;

-- Insert sample data for testing
INSERT INTO public.trains (train_number, train_name, status, train_type, current_location, destination, origin, delay_minutes, latitude, longitude, speed_kmh) VALUES
('12345', 'Rajdhani Express', 'running', 'express', 'Section A-B', 'New Delhi', 'Mumbai Central', 0, 28.6139, 77.2090, 120),
('56789', 'Shatabdi Express', 'delayed', 'express', 'Section B-C', 'Chennai Central', 'Bangalore', 15, 13.0827, 80.2707, 85),
('98765', 'Freight Special', 'stopped', 'freight', 'Yard D', 'Kolkata', 'Chennai', 45, 22.5726, 88.3639, 0),
('11223', 'Local Passenger', 'running', 'passenger', 'Platform 3', 'Mumbai Local', 'Dadar', 5, 19.0760, 72.8777, 60),
('33445', 'Maintenance Train', 'maintenance', 'special', 'Workshop Bay 2', 'Workshop', 'Depot', 0, 28.7041, 77.1025, 0);

INSERT INTO public.signals (signal_code, signal_name, state, location, latitude, longitude, section) VALUES
('SIG001', 'Main Line Entry', 'green', 'Junction A', 28.6139, 77.2090, 'Section A'),
('SIG002', 'Platform 1 Approach', 'yellow', 'Platform Area', 28.6129, 77.2100, 'Section A'),
('SIG003', 'Yard Entry', 'red', 'Yard Junction', 28.6149, 77.2080, 'Section B'),
('SIG004', 'Loop Line', 'green', 'Loop Junction', 28.6159, 77.2070, 'Section B'),
('SIG005', 'Departure Signal', 'green', 'Platform Exit', 28.6119, 77.2110, 'Section C');

INSERT INTO public.platforms (platform_number, station_code, station_name, status, track_number, scheduled_arrival, scheduled_departure) VALUES
('1', 'NDLS', 'New Delhi', 'occupied', 'Track 1', now() + interval '30 minutes', now() + interval '45 minutes'),
('2', 'NDLS', 'New Delhi', 'free', 'Track 2', now() + interval '1 hour', now() + interval '1 hour 15 minutes'),
('3', 'MAS', 'Chennai Central', 'occupied', 'Track 3', now() + interval '2 hours', now() + interval '2 hours 30 minutes'),
('4', 'MAS', 'Chennai Central', 'free', 'Track 4', now() + interval '3 hours', now() + interval '3 hours 20 minutes'),
('1', 'CSMT', 'Mumbai CST', 'overdue', 'Track 1', now() - interval '30 minutes', now() - interval '15 minutes');