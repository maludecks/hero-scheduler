CREATE TABLE IF NOT EXISTS public."HeroConfiguration"
(
    id uuid NOT NULL,
    number_of_heroes integer,
    last_modified timestamp with time zone DEFAULT now(),
    CONSTRAINT "HeroConfiguration_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."HeroConfiguration"
    OWNER to supabase_admin;

GRANT ALL ON TABLE public."HeroConfiguration" TO anon;

GRANT ALL ON TABLE public."HeroConfiguration" TO authenticated;

GRANT ALL ON TABLE public."HeroConfiguration" TO postgres;

GRANT ALL ON TABLE public."HeroConfiguration" TO service_role;

GRANT ALL ON TABLE public."HeroConfiguration" TO supabase_admin;

CREATE TABLE IF NOT EXISTS public."HeroMembers"
(
    id character varying COLLATE pg_catalog."default" NOT NULL,
    slack_handle character varying COLLATE pg_catalog."default",
    is_selected boolean,
    is_available boolean,
    config_id uuid,
    last_selected timestamp with time zone,
    CONSTRAINT "HeroMembers_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."HeroMembers"
    OWNER to supabase_admin;

GRANT ALL ON TABLE public."HeroMembers" TO anon;

GRANT ALL ON TABLE public."HeroMembers" TO authenticated;

GRANT ALL ON TABLE public."HeroMembers" TO postgres;

GRANT ALL ON TABLE public."HeroMembers" TO service_role;

GRANT ALL ON TABLE public."HeroMembers" TO supabase_admin;
