--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

-- Started on 2024-11-16 17:32:26

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 229 (class 1259 OID 114804)
-- Name: administrar_productos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.administrar_productos (
    admin_id integer,
    producto_id integer,
    accion character varying(20) NOT NULL,
    fecha_accion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT administrar_productos_accion_check CHECK (((accion)::text = ANY ((ARRAY['agregar'::character varying, 'eliminar'::character varying, 'modificar'::character varying])::text[])))
);


ALTER TABLE public.administrar_productos OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 114722)
-- Name: carrito; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carrito (
    carrito_id integer NOT NULL,
    user_id integer,
    producto_id integer,
    cantidad integer NOT NULL,
    CONSTRAINT carrito_cantidad_check CHECK ((cantidad > 0))
);


ALTER TABLE public.carrito OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 114721)
-- Name: carrito_carrito_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.carrito_carrito_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.carrito_carrito_id_seq OWNER TO postgres;

--
-- TOC entry 4945 (class 0 OID 0)
-- Dependencies: 219
-- Name: carrito_carrito_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.carrito_carrito_id_seq OWNED BY public.carrito.carrito_id;


--
-- TOC entry 224 (class 1259 OID 114755)
-- Name: detalles_pedido; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.detalles_pedido (
    detalle_id integer NOT NULL,
    pedido_id integer,
    producto_id integer,
    cantidad integer NOT NULL,
    precio numeric(10,2) NOT NULL,
    CONSTRAINT detalles_pedido_cantidad_check CHECK ((cantidad > 0))
);


ALTER TABLE public.detalles_pedido OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 114754)
-- Name: detalles_pedido_detalle_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.detalles_pedido_detalle_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.detalles_pedido_detalle_id_seq OWNER TO postgres;

--
-- TOC entry 4946 (class 0 OID 0)
-- Dependencies: 223
-- Name: detalles_pedido_detalle_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.detalles_pedido_detalle_id_seq OWNED BY public.detalles_pedido.detalle_id;


--
-- TOC entry 226 (class 1259 OID 114773)
-- Name: favoritos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.favoritos (
    favorito_id integer NOT NULL,
    user_id integer,
    producto_id integer
);


ALTER TABLE public.favoritos OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 114772)
-- Name: favoritos_favorito_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.favoritos_favorito_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.favoritos_favorito_id_seq OWNER TO postgres;

--
-- TOC entry 4947 (class 0 OID 0)
-- Dependencies: 225
-- Name: favoritos_favorito_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.favoritos_favorito_id_seq OWNED BY public.favoritos.favorito_id;


--
-- TOC entry 231 (class 1259 OID 114820)
-- Name: mis_compras; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mis_compras (
    compra_id integer NOT NULL,
    user_id integer,
    pedido_id integer,
    fecha_compra timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.mis_compras OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 114819)
-- Name: mis_compras_compra_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mis_compras_compra_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mis_compras_compra_id_seq OWNER TO postgres;

--
-- TOC entry 4948 (class 0 OID 0)
-- Dependencies: 230
-- Name: mis_compras_compra_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mis_compras_compra_id_seq OWNED BY public.mis_compras.compra_id;


--
-- TOC entry 228 (class 1259 OID 114790)
-- Name: pagos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pagos (
    pago_id integer NOT NULL,
    pedido_id integer,
    monto numeric(10,2) NOT NULL,
    fecha_pago timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    estado_pago character varying(20) DEFAULT 'pendiente'::character varying,
    CONSTRAINT pagos_estado_pago_check CHECK (((estado_pago)::text = ANY ((ARRAY['pendiente'::character varying, 'completado'::character varying])::text[])))
);


ALTER TABLE public.pagos OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 114789)
-- Name: pagos_pago_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pagos_pago_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pagos_pago_id_seq OWNER TO postgres;

--
-- TOC entry 4949 (class 0 OID 0)
-- Dependencies: 227
-- Name: pagos_pago_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pagos_pago_id_seq OWNED BY public.pagos.pago_id;


--
-- TOC entry 222 (class 1259 OID 114740)
-- Name: pedidos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pedidos (
    pedido_id integer NOT NULL,
    user_id integer,
    fecha_pedido timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    estado character varying(20) DEFAULT 'pendiente'::character varying,
    total numeric(10,2) NOT NULL,
    CONSTRAINT pedidos_estado_check CHECK (((estado)::text = ANY ((ARRAY['pendiente'::character varying, 'enviado'::character varying, 'completado'::character varying])::text[])))
);


ALTER TABLE public.pedidos OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 114739)
-- Name: pedidos_pedido_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pedidos_pedido_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pedidos_pedido_id_seq OWNER TO postgres;

--
-- TOC entry 4950 (class 0 OID 0)
-- Dependencies: 221
-- Name: pedidos_pedido_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pedidos_pedido_id_seq OWNED BY public.pedidos.pedido_id;


--
-- TOC entry 218 (class 1259 OID 114711)
-- Name: productos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.productos (
    producto_id integer NOT NULL,
    nombre character varying(255) NOT NULL,
    descripcion text,
    precio numeric(10,2) NOT NULL,
    talla character varying(20) NOT NULL,
    color character varying(50) NOT NULL,
    stock integer DEFAULT 0,
    imagen character varying(255),
    fecha_agregado timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.productos OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 114710)
-- Name: productos_producto_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.productos_producto_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.productos_producto_id_seq OWNER TO postgres;

--
-- TOC entry 4951 (class 0 OID 0)
-- Dependencies: 217
-- Name: productos_producto_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.productos_producto_id_seq OWNED BY public.productos.producto_id;


--
-- TOC entry 216 (class 1259 OID 114698)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    user_id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    "contraseña" character varying(255) NOT NULL,
    rol character varying(20) NOT NULL,
    direccion character varying(255),
    ciudad character varying(100),
    pais character varying(100),
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT usuarios_rol_check CHECK (((rol)::text = ANY ((ARRAY['cliente'::character varying, 'administrador'::character varying])::text[])))
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 114697)
-- Name: usuarios_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_user_id_seq OWNER TO postgres;

--
-- TOC entry 4952 (class 0 OID 0)
-- Dependencies: 215
-- Name: usuarios_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_user_id_seq OWNED BY public.usuarios.user_id;


--
-- TOC entry 4732 (class 2604 OID 114725)
-- Name: carrito carrito_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrito ALTER COLUMN carrito_id SET DEFAULT nextval('public.carrito_carrito_id_seq'::regclass);


--
-- TOC entry 4736 (class 2604 OID 114758)
-- Name: detalles_pedido detalle_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalles_pedido ALTER COLUMN detalle_id SET DEFAULT nextval('public.detalles_pedido_detalle_id_seq'::regclass);


--
-- TOC entry 4737 (class 2604 OID 114776)
-- Name: favoritos favorito_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favoritos ALTER COLUMN favorito_id SET DEFAULT nextval('public.favoritos_favorito_id_seq'::regclass);


--
-- TOC entry 4742 (class 2604 OID 114823)
-- Name: mis_compras compra_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mis_compras ALTER COLUMN compra_id SET DEFAULT nextval('public.mis_compras_compra_id_seq'::regclass);


--
-- TOC entry 4738 (class 2604 OID 114793)
-- Name: pagos pago_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos ALTER COLUMN pago_id SET DEFAULT nextval('public.pagos_pago_id_seq'::regclass);


--
-- TOC entry 4733 (class 2604 OID 114743)
-- Name: pedidos pedido_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos ALTER COLUMN pedido_id SET DEFAULT nextval('public.pedidos_pedido_id_seq'::regclass);


--
-- TOC entry 4729 (class 2604 OID 114714)
-- Name: productos producto_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos ALTER COLUMN producto_id SET DEFAULT nextval('public.productos_producto_id_seq'::regclass);


--
-- TOC entry 4727 (class 2604 OID 114701)
-- Name: usuarios user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN user_id SET DEFAULT nextval('public.usuarios_user_id_seq'::regclass);


--
-- TOC entry 4937 (class 0 OID 114804)
-- Dependencies: 229
-- Data for Name: administrar_productos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.administrar_productos (admin_id, producto_id, accion, fecha_accion) FROM stdin;
\.


--
-- TOC entry 4928 (class 0 OID 114722)
-- Dependencies: 220
-- Data for Name: carrito; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carrito (carrito_id, user_id, producto_id, cantidad) FROM stdin;
\.


--
-- TOC entry 4932 (class 0 OID 114755)
-- Dependencies: 224
-- Data for Name: detalles_pedido; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.detalles_pedido (detalle_id, pedido_id, producto_id, cantidad, precio) FROM stdin;
\.


--
-- TOC entry 4934 (class 0 OID 114773)
-- Dependencies: 226
-- Data for Name: favoritos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.favoritos (favorito_id, user_id, producto_id) FROM stdin;
\.


--
-- TOC entry 4939 (class 0 OID 114820)
-- Dependencies: 231
-- Data for Name: mis_compras; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mis_compras (compra_id, user_id, pedido_id, fecha_compra) FROM stdin;
\.


--
-- TOC entry 4936 (class 0 OID 114790)
-- Dependencies: 228
-- Data for Name: pagos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pagos (pago_id, pedido_id, monto, fecha_pago, estado_pago) FROM stdin;
\.


--
-- TOC entry 4930 (class 0 OID 114740)
-- Dependencies: 222
-- Data for Name: pedidos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pedidos (pedido_id, user_id, fecha_pedido, estado, total) FROM stdin;
\.


--
-- TOC entry 4926 (class 0 OID 114711)
-- Dependencies: 218
-- Data for Name: productos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.productos (producto_id, nombre, descripcion, precio, talla, color, stock, imagen, fecha_agregado) FROM stdin;
\.


--
-- TOC entry 4924 (class 0 OID 114698)
-- Dependencies: 216
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (user_id, nombre, email, "contraseña", rol, direccion, ciudad, pais, fecha_registro) FROM stdin;
\.


--
-- TOC entry 4953 (class 0 OID 0)
-- Dependencies: 219
-- Name: carrito_carrito_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.carrito_carrito_id_seq', 1, false);


--
-- TOC entry 4954 (class 0 OID 0)
-- Dependencies: 223
-- Name: detalles_pedido_detalle_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.detalles_pedido_detalle_id_seq', 1, false);


--
-- TOC entry 4955 (class 0 OID 0)
-- Dependencies: 225
-- Name: favoritos_favorito_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.favoritos_favorito_id_seq', 1, false);


--
-- TOC entry 4956 (class 0 OID 0)
-- Dependencies: 230
-- Name: mis_compras_compra_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mis_compras_compra_id_seq', 1, false);


--
-- TOC entry 4957 (class 0 OID 0)
-- Dependencies: 227
-- Name: pagos_pago_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pagos_pago_id_seq', 1, false);


--
-- TOC entry 4958 (class 0 OID 0)
-- Dependencies: 221
-- Name: pedidos_pedido_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pedidos_pedido_id_seq', 1, false);


--
-- TOC entry 4959 (class 0 OID 0)
-- Dependencies: 217
-- Name: productos_producto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.productos_producto_id_seq', 1, false);


--
-- TOC entry 4960 (class 0 OID 0)
-- Dependencies: 215
-- Name: usuarios_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_user_id_seq', 1, false);


--
-- TOC entry 4757 (class 2606 OID 114728)
-- Name: carrito carrito_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrito
    ADD CONSTRAINT carrito_pkey PRIMARY KEY (carrito_id);


--
-- TOC entry 4761 (class 2606 OID 114761)
-- Name: detalles_pedido detalles_pedido_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalles_pedido
    ADD CONSTRAINT detalles_pedido_pkey PRIMARY KEY (detalle_id);


--
-- TOC entry 4763 (class 2606 OID 114778)
-- Name: favoritos favoritos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favoritos
    ADD CONSTRAINT favoritos_pkey PRIMARY KEY (favorito_id);


--
-- TOC entry 4767 (class 2606 OID 114826)
-- Name: mis_compras mis_compras_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mis_compras
    ADD CONSTRAINT mis_compras_pkey PRIMARY KEY (compra_id);


--
-- TOC entry 4765 (class 2606 OID 114798)
-- Name: pagos pagos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT pagos_pkey PRIMARY KEY (pago_id);


--
-- TOC entry 4759 (class 2606 OID 114748)
-- Name: pedidos pedidos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_pkey PRIMARY KEY (pedido_id);


--
-- TOC entry 4755 (class 2606 OID 114720)
-- Name: productos productos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_pkey PRIMARY KEY (producto_id);


--
-- TOC entry 4751 (class 2606 OID 114709)
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- TOC entry 4753 (class 2606 OID 114707)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4776 (class 2606 OID 114809)
-- Name: administrar_productos administrar_productos_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrar_productos
    ADD CONSTRAINT administrar_productos_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.usuarios(user_id) ON DELETE CASCADE;


--
-- TOC entry 4777 (class 2606 OID 114814)
-- Name: administrar_productos administrar_productos_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrar_productos
    ADD CONSTRAINT administrar_productos_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(producto_id) ON DELETE CASCADE;


--
-- TOC entry 4768 (class 2606 OID 114734)
-- Name: carrito carrito_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrito
    ADD CONSTRAINT carrito_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(producto_id) ON DELETE CASCADE;


--
-- TOC entry 4769 (class 2606 OID 114729)
-- Name: carrito carrito_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carrito
    ADD CONSTRAINT carrito_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.usuarios(user_id) ON DELETE CASCADE;


--
-- TOC entry 4771 (class 2606 OID 114762)
-- Name: detalles_pedido detalles_pedido_pedido_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalles_pedido
    ADD CONSTRAINT detalles_pedido_pedido_id_fkey FOREIGN KEY (pedido_id) REFERENCES public.pedidos(pedido_id) ON DELETE CASCADE;


--
-- TOC entry 4772 (class 2606 OID 114767)
-- Name: detalles_pedido detalles_pedido_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalles_pedido
    ADD CONSTRAINT detalles_pedido_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(producto_id) ON DELETE CASCADE;


--
-- TOC entry 4773 (class 2606 OID 114784)
-- Name: favoritos favoritos_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favoritos
    ADD CONSTRAINT favoritos_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(producto_id) ON DELETE CASCADE;


--
-- TOC entry 4774 (class 2606 OID 114779)
-- Name: favoritos favoritos_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favoritos
    ADD CONSTRAINT favoritos_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.usuarios(user_id) ON DELETE CASCADE;


--
-- TOC entry 4778 (class 2606 OID 114832)
-- Name: mis_compras mis_compras_pedido_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mis_compras
    ADD CONSTRAINT mis_compras_pedido_id_fkey FOREIGN KEY (pedido_id) REFERENCES public.pedidos(pedido_id) ON DELETE CASCADE;


--
-- TOC entry 4779 (class 2606 OID 114827)
-- Name: mis_compras mis_compras_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mis_compras
    ADD CONSTRAINT mis_compras_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.usuarios(user_id) ON DELETE CASCADE;


--
-- TOC entry 4775 (class 2606 OID 114799)
-- Name: pagos pagos_pedido_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pagos
    ADD CONSTRAINT pagos_pedido_id_fkey FOREIGN KEY (pedido_id) REFERENCES public.pedidos(pedido_id) ON DELETE CASCADE;


--
-- TOC entry 4770 (class 2606 OID 114749)
-- Name: pedidos pedidos_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedidos
    ADD CONSTRAINT pedidos_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.usuarios(user_id) ON DELETE CASCADE;


-- Completed on 2024-11-16 17:32:26

--
-- PostgreSQL database dump complete
--


