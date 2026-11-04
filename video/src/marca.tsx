import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { Easing } from "remotion";
import { ICONOS } from "./iconos";

// Misma fuente y colores que la tienda
export const { fontFamily } = loadFont("normal", {
  weights: ["500", "600", "700", "800"],
  subsets: ["latin"],
});

export const AMARILLO = "#fffc3a";
export const NEGRO = "#0b0b0a";
export const BLANCO = "#ffffff";
export const GRIS = "#9a9a92";
export const VERDE = "#22c55e";

export const FPS = 30;
export const ANCHO = 1080;
export const ALTO = 1920;

export const TIENDA = "romanacompuservice-tienda.vercel.app";
export const TELEFONO = "(829) 753-8736";
export const INSTAGRAM = "@romanacompuservice";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const suave = Easing.bezier(0.16, 1, 0.3, 1);
export const resorte = Easing.spring({ damping: 14 });

export const Icono: React.FC<{ nombre: string; size: number; color: string; grosor?: number }> = ({
  nombre,
  size,
  color,
  grosor = 2,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={grosor}
    strokeLinecap="round"
    strokeLinejoin="round"
    dangerouslySetInnerHTML={{ __html: ICONOS[nombre] }}
  />
);

// La flecha del logo (misma forma que en la imagen para redes)
export const Flecha: React.FC<{ size: number; color: string; style?: React.CSSProperties }> = ({
  size,
  color,
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <g fill="none" stroke={color} strokeWidth={20} strokeLinecap="butt" strokeLinejoin="miter">
      <path d="M0 100 L90 10" />
      <path d="M25 10 L90 10 L90 75" />
    </g>
  </svg>
);
