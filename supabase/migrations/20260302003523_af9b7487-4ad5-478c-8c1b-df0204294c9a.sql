
CREATE TABLE public.clubs (
  id text NOT NULL PRIMARY KEY,
  name text NOT NULL,
  short_name text NOT NULL,
  league text NOT NULL CHECK (league IN ('serie_a', 'serie_b')),
  city text NOT NULL,
  color text NOT NULL,
  season text NOT NULL DEFAULT '2025-26',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;

-- Clubs are publicly readable
CREATE POLICY "Clubs are publicly readable"
ON public.clubs FOR SELECT
USING (true);

-- Insert current 2025-26 season data
INSERT INTO public.clubs (id, name, short_name, league, city, color, season) VALUES
-- Serie A
('atalanta', 'Atalanta', 'ATA', 'serie_a', 'Bergamo', '210 100% 30%', '2025-26'),
('bologna', 'Bologna', 'BOL', 'serie_a', 'Bologna', '210 80% 35%', '2025-26'),
('cagliari', 'Cagliari', 'CAG', 'serie_a', 'Cagliari', '0 70% 40%', '2025-26'),
('como', 'Como 1907', 'COM', 'serie_a', 'Como', '210 90% 45%', '2025-26'),
('cremonese', 'Cremonese', 'CRE', 'serie_a', 'Cremona', '0 70% 38%', '2025-26'),
('fiorentina', 'Fiorentina', 'FIO', 'serie_a', 'Firenze', '270 60% 45%', '2025-26'),
('genoa', 'Genoa', 'GEN', 'serie_a', 'Genova', '0 80% 35%', '2025-26'),
('inter', 'Inter', 'INT', 'serie_a', 'Milano', '220 80% 40%', '2025-26'),
('juventus', 'Juventus', 'JUV', 'serie_a', 'Torino', '0 0% 15%', '2025-26'),
('lazio', 'Lazio', 'LAZ', 'serie_a', 'Roma', '200 70% 55%', '2025-26'),
('lecce', 'Lecce', 'LEC', 'serie_a', 'Lecce', '45 90% 50%', '2025-26'),
('milan', 'AC Milan', 'MIL', 'serie_a', 'Milano', '0 85% 45%', '2025-26'),
('napoli', 'Napoli', 'NAP', 'serie_a', 'Napoli', '200 100% 40%', '2025-26'),
('parma', 'Parma', 'PAR', 'serie_a', 'Parma', '50 80% 45%', '2025-26'),
('pisa', 'Pisa', 'PIS', 'serie_a', 'Pisa', '220 60% 30%', '2025-26'),
('roma', 'AS Roma', 'ROM', 'serie_a', 'Roma', '25 85% 45%', '2025-26'),
('sassuolo', 'Sassuolo', 'SAS', 'serie_a', 'Sassuolo', '145 70% 35%', '2025-26'),
('torino', 'Torino', 'TOR', 'serie_a', 'Torino', '0 60% 30%', '2025-26'),
('udinese', 'Udinese', 'UDI', 'serie_a', 'Udine', '0 0% 25%', '2025-26'),
('verona', 'Hellas Verona', 'VER', 'serie_a', 'Verona', '55 70% 40%', '2025-26'),
-- Serie B
('avellino', 'Avellino', 'AVE', 'serie_b', 'Avellino', '120 60% 35%', '2025-26'),
('bari', 'Bari', 'BAR', 'serie_b', 'Bari', '0 80% 48%', '2025-26'),
('brescia', 'Brescia', 'BRE', 'serie_b', 'Brescia', '215 70% 45%', '2025-26'),
('carrarese', 'Carrarese', 'CAR', 'serie_b', 'Carrara', '210 55% 42%', '2025-26'),
('cesena', 'Cesena', 'CES', 'serie_b', 'Cesena', '0 0% 20%', '2025-26'),
('cittadella', 'Cittadella', 'CIT', 'serie_b', 'Cittadella', '0 65% 42%', '2025-26'),
('cosenza', 'Cosenza', 'COS', 'serie_b', 'Cosenza', '0 75% 40%', '2025-26'),
('empoli', 'Empoli', 'EMP', 'serie_b', 'Empoli', '215 85% 50%', '2025-26'),
('frosinone', 'Frosinone', 'FRO', 'serie_b', 'Frosinone', '55 85% 50%', '2025-26'),
('mantova', 'Mantova', 'MAN', 'serie_b', 'Mantova', '0 0% 30%', '2025-26'),
('modena', 'Modena', 'MOD', 'serie_b', 'Modena', '50 90% 45%', '2025-26'),
('monza', 'Monza', 'MON', 'serie_b', 'Monza', '0 75% 50%', '2025-26'),
('palermo', 'Palermo', 'PAL', 'serie_b', 'Palermo', '330 65% 50%', '2025-26'),
('pescara', 'Pescara', 'PES', 'serie_b', 'Pescara', '200 60% 45%', '2025-26'),
('reggiana', 'Reggiana', 'REG', 'serie_b', 'Reggio Emilia', '0 60% 35%', '2025-26'),
('sampdoria', 'Sampdoria', 'SAM', 'serie_b', 'Genova', '220 75% 50%', '2025-26'),
('spezia', 'Spezia', 'SPE', 'serie_b', 'La Spezia', '0 0% 18%', '2025-26'),
('sudtirol', 'Südtirol', 'SUD', 'serie_b', 'Bolzano', '0 50% 38%', '2025-26'),
('venezia', 'Venezia', 'VEN', 'serie_b', 'Venezia', '30 80% 40%', '2025-26'),
('virtus-entella', 'Virtus Entella', 'VIR', 'serie_b', 'Chiavari', '210 40% 35%', '2025-26');
