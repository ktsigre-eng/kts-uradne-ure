-- Ustvarjanje tabele members
CREATE TABLE public.members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    active BOOLEAN DEFAULT false NOT NULL,
    login_time TIMESTAMP WITH TIME ZONE,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Vstavljanje začetnih članov KTŠ
INSERT INTO public.members (name, phone, active, avatar_url) VALUES
('Jan', '069 639 331', false, 'https://api.dicebear.com/7.x/bottts/svg?seed=Jan'),
('Zoja', '031 409 350', false, 'https://api.dicebear.com/7.x/bottts/svg?seed=Zoja'),
('Nik', '031 488 592', false, 'https://api.dicebear.com/7.x/bottts/svg?seed=Nik'),
('Rok', '070 457 881', false, 'https://api.dicebear.com/7.x/bottts/svg?seed=Rok');

-- Funkcija, ki zagotavlja, da je lahko aktiven le en član hkrati
CREATE OR REPLACE FUNCTION check_single_active_member()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.active = true THEN
        UPDATE public.members
        SET active = false, login_time = NULL
        WHERE id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ustvarjanje sprožilca
CREATE TRIGGER enforce_single_active_member
BEFORE UPDATE ON public.members
FOR EACH ROW
WHEN (NEW.active = true AND OLD.active = false)
EXECUTE FUNCTION check_single_active_member();

-- Omogočanje Realtime za tabelo members
ALTER PUBLICATION supabase_realtime ADD TABLE public.members;