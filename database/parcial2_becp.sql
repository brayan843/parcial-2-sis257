--
-- PostgreSQL database dump
--

\restrict TjVukuuWfPEWzq9ZusZWvkkucoVVXbxJY2flxjtvmY8LAyabQkb1WNtCbZ87KcY

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

-- Started on 2026-11-05 16:34:47

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 858 (class 1247 OID 18649)
-- Name: eventos_culturales_estado_enum; Type: TYPE; Schema: public; Owner: usrparcial2
--

CREATE TYPE public.eventos_culturales_estado_enum AS ENUM (
    'Programado',
    'Agotado',
    'Cancelado'
);


ALTER TYPE public.eventos_culturales_estado_enum OWNER TO usrparcial2;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 18656)
-- Name: eventos_culturales; Type: TABLE; Schema: public; Owner: usrparcial2
--

CREATE TABLE public.eventos_culturales (
    id integer NOT NULL,
    id_recinto integer NOT NULL,
    titulo character varying(150) NOT NULL,
    artista_principal character varying(100) NOT NULL,
    duracion_minutos integer NOT NULL,
    precio_entrada numeric(10,2) NOT NULL,
    fecha_evento date NOT NULL,
    estado character varying(20) DEFAULT 'Programado'::character varying NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    fecha_modificacion timestamp without time zone DEFAULT now() NOT NULL,
    fecha_eliminacion timestamp without time zone
);


ALTER TABLE public.eventos_culturales OWNER TO usrparcial2;

--
-- TOC entry 221 (class 1259 OID 18655)
-- Name: eventos_culturales_id_seq; Type: SEQUENCE; Schema: public; Owner: usrparcial2
--

CREATE SEQUENCE public.eventos_culturales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.eventos_culturales_id_seq OWNER TO usrparcial2;

--
-- TOC entry 4985 (class 0 OID 0)
-- Dependencies: 221
-- Name: eventos_culturales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: usrparcial2
--

ALTER SEQUENCE public.eventos_culturales_id_seq OWNED BY public.eventos_culturales.id;


--
-- TOC entry 220 (class 1259 OID 18639)
-- Name: recintos; Type: TABLE; Schema: public; Owner: usrparcial2
--

CREATE TABLE public.recintos (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    ciudad character varying(50) NOT NULL,
    aforo_maximo integer,
    fecha_eliminacion timestamp without time zone,
    fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    fecha_modificacion timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.recintos OWNER TO usrparcial2;

--
-- TOC entry 219 (class 1259 OID 18638)
-- Name: recintos_id_seq; Type: SEQUENCE; Schema: public; Owner: usrparcial2
--

CREATE SEQUENCE public.recintos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.recintos_id_seq OWNER TO usrparcial2;

--
-- TOC entry 4986 (class 0 OID 0)
-- Dependencies: 219
-- Name: recintos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: usrparcial2
--

ALTER SEQUENCE public.recintos_id_seq OWNED BY public.recintos.id;


--
-- TOC entry 4820 (class 2604 OID 18659)
-- Name: eventos_culturales id; Type: DEFAULT; Schema: public; Owner: usrparcial2
--

ALTER TABLE ONLY public.eventos_culturales ALTER COLUMN id SET DEFAULT nextval('public.eventos_culturales_id_seq'::regclass);


--
-- TOC entry 4817 (class 2604 OID 18642)
-- Name: recintos id; Type: DEFAULT; Schema: public; Owner: usrparcial2
--

ALTER TABLE ONLY public.recintos ALTER COLUMN id SET DEFAULT nextval('public.recintos_id_seq'::regclass);


--
-- TOC entry 4979 (class 0 OID 18656)
-- Dependencies: 222
-- Data for Name: eventos_culturales; Type: TABLE DATA; Schema: public; Owner: usrparcial2
--

COPY public.eventos_culturales (id, id_recinto, titulo, artista_principal, duracion_minutos, precio_entrada, fecha_evento, estado, fecha_creacion, fecha_modificacion, fecha_eliminacion) FROM stdin;
4	1	Festival Cultural de Sucre 2026	Grupo folklorico Los Kjarkas	120	60.00	2026-12-15	Programado	2026-11-05 15:32:34.854604	2026-11-05 15:35:41.900618	2026-11-05 15:35:41.900618
5	2	Salón de Pruebas	huascar aparcio	150	300.00	2026-11-05	Agotado	2026-11-05 16:29:30.877856	2026-11-05 16:30:16.827938	\N
3	1	Concierto de Primavera	Orquesta Sinfónica	300	50.00	2026-06-15	Programado	2026-11-05 15:23:44.233571	2026-11-05 16:30:26.316095	2026-11-05 16:30:26.316095
\.


--
-- TOC entry 4977 (class 0 OID 18639)
-- Dependencies: 220
-- Data for Name: recintos; Type: TABLE DATA; Schema: public; Owner: usrparcial2
--

COPY public.recintos (id, nombre, ciudad, aforo_maximo, fecha_eliminacion, fecha_creacion, fecha_modificacion) FROM stdin;
1	Teatro Gran Mariscal	Sucre	800	\N	2026-11-05 15:42:38.806879	2026-11-05 15:42:38.806879
2	Casa de la Cultura	Sucre	500	\N	2026-11-05 15:42:38.806879	2026-11-05 15:42:38.806879
3	prueba	sucre	100	\N	2026-11-05 16:28:26.307597	2026-11-05 16:28:26.307597
\.


--
-- TOC entry 4987 (class 0 OID 0)
-- Dependencies: 221
-- Name: eventos_culturales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: usrparcial2
--

SELECT pg_catalog.setval('public.eventos_culturales_id_seq', 5, true);


--
-- TOC entry 4988 (class 0 OID 0)
-- Dependencies: 219
-- Name: recintos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: usrparcial2
--

SELECT pg_catalog.setval('public.recintos_id_seq', 3, true);


--
-- TOC entry 4827 (class 2606 OID 18674)
-- Name: eventos_culturales PK_8287edf9f923f26cc99a6dabf96; Type: CONSTRAINT; Schema: public; Owner: usrparcial2
--

ALTER TABLE ONLY public.eventos_culturales
    ADD CONSTRAINT "PK_8287edf9f923f26cc99a6dabf96" PRIMARY KEY (id);


--
-- TOC entry 4825 (class 2606 OID 18647)
-- Name: recintos PK_d5f5c70d808240edd3865a20f58; Type: CONSTRAINT; Schema: public; Owner: usrparcial2
--

ALTER TABLE ONLY public.recintos
    ADD CONSTRAINT "PK_d5f5c70d808240edd3865a20f58" PRIMARY KEY (id);


--
-- TOC entry 4828 (class 2606 OID 18675)
-- Name: eventos_culturales FK_1dd3f89296c2188a411c8e5b9b8; Type: FK CONSTRAINT; Schema: public; Owner: usrparcial2
--

ALTER TABLE ONLY public.eventos_culturales
    ADD CONSTRAINT "FK_1dd3f89296c2188a411c8e5b9b8" FOREIGN KEY (id_recinto) REFERENCES public.recintos(id);


-- Completed on 2026-11-05 16:34:47

--
-- PostgreSQL database dump complete
--

\unrestrict TjVukuuWfPEWzq9ZusZWvkkucoVVXbxJY2flxjtvmY8LAyabQkb1WNtCbZ87KcY

