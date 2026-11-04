import { Composition, Folder } from "remotion";
import { Ahorro } from "./escenas/Ahorro";
import { Cierre } from "./escenas/Cierre";
import { Intro } from "./escenas/Intro";
import { Pedido } from "./escenas/Pedido";
import { Productos } from "./escenas/Productos";
import { Tienda } from "./escenas/Tienda";
import { ALTO, ANCHO, FPS } from "./marca";
import { DURACION, ESCENAS, VideoPromo } from "./VideoPromo";

const formato = { width: ANCHO, height: ALTO, fps: FPS };

export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="Escenas">
      <Composition id="Intro" component={Intro} durationInFrames={ESCENAS.intro} {...formato} />
      <Composition id="Tienda" component={Tienda} durationInFrames={ESCENAS.tienda} {...formato} />
      <Composition id="Ahorro" component={Ahorro} durationInFrames={ESCENAS.ahorro} {...formato} />
      <Composition id="Productos" component={Productos} durationInFrames={ESCENAS.productos} {...formato} />
      <Composition id="Pedido" component={Pedido} durationInFrames={ESCENAS.pedido} {...formato} />
      <Composition id="Cierre" component={Cierre} durationInFrames={ESCENAS.cierre} {...formato} />
    </Folder>
    <Composition id="VideoPromo" component={VideoPromo} durationInFrames={DURACION} {...formato} />
  </>
);
