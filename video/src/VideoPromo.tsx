import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { Ahorro } from "./escenas/Ahorro";
import { Cierre } from "./escenas/Cierre";
import { Intro } from "./escenas/Intro";
import { Pedido } from "./escenas/Pedido";
import { Productos } from "./escenas/Productos";
import { Tienda } from "./escenas/Tienda";

export const ESCENAS = { intro: 90, tienda: 120, ahorro: 105, productos: 186, pedido: 130, cierre: 135 };
export const CRUCE = 12;
export const DURACION = Object.values(ESCENAS).reduce((a, b) => a + b, 0) - CRUCE * 5;

const cruce = linearTiming({ durationInFrames: CRUCE });

export const VideoPromo: React.FC = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence name="Intro" durationInFrames={90}>
      <Intro />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={cruce} />
    <TransitionSeries.Sequence name="Tienda" durationInFrames={120}>
      <Tienda />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({ direction: "from-bottom-left" })} timing={cruce} />
    <TransitionSeries.Sequence name="Ahorro" durationInFrames={105}>
      <Ahorro />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={cruce} />
    <TransitionSeries.Sequence name="Productos" durationInFrames={186}>
      <Productos />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={wipe({ direction: "from-bottom-left" })} timing={cruce} />
    <TransitionSeries.Sequence name="Pedido" durationInFrames={130}>
      <Pedido />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={cruce} />
    <TransitionSeries.Sequence name="Cierre" durationInFrames={135}>
      <Cierre />
    </TransitionSeries.Sequence>
  </TransitionSeries>
);
