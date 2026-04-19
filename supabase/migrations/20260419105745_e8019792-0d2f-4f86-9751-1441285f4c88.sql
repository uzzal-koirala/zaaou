CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active team members are publicly viewable"
ON public.team_members
FOR SELECT
TO public
USING (is_active = true);

CREATE POLICY "Admins can view all team members"
ON public.team_members
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert team members"
ON public.team_members
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update team members"
ON public.team_members
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete team members"
ON public.team_members
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER team_members_set_updated_at
BEFORE UPDATE ON public.team_members
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_team_members_order ON public.team_members(display_order);
CREATE INDEX idx_team_members_featured ON public.team_members(is_featured) WHERE is_featured = true;

INSERT INTO public.team_members (name, role, bio, avatar_url, display_order, is_featured) VALUES
('Aarav Sharma', 'Founder & CEO', 'Driving Zaaou Food''s mission to bring Itahari''s best flavours to every doorstep.', 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=600&q=80', 1, true),
('Priya Karki', 'Head of Operations', 'Makes sure every order moves smoothly from kitchen to your door.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80', 2, true),
('Rohan Thapa', 'Lead Rider Captain', 'Leads our rider fleet across Itahari with speed, safety and a smile.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80', 3, true),
('Sneha Limbu', 'Restaurant Partnerships', 'Onboards Itahari''s favourite restaurants onto the Zaaou platform.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80', 4, true),
('Bibek Rai', 'Customer Experience Lead', 'Here to make sure every Zaaou order feels effortless and delightful.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80', 5, true),
('Anjali Magar', 'Marketing Manager', 'Tells the Zaaou story across Itahari and beyond.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80', 6, false),
('Suman Gurung', 'Tech & Product', 'Keeps the Zaaou app fast, reliable and a joy to use.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80', 7, false);