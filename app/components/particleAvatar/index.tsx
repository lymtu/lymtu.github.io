import { useEffect, useRef } from "react";

import { ParticleCanvas } from "./ParticleCanvas";
import { getParticleTintColor, watchParticleTintColor } from "./themeColor";
import { type ParticleOptions } from "./types";
import { particlesData } from "./particlesData";

const AVATAR_PARSE_SIZE = 360;

const DEFAULT_PARTICLE_OPTIONS: ParticleOptions = {
  particleSize: 2,
  particleAcceleration: 0.05,
  mouseInfluenceRange: 50,
  tintColor: "#000000",
};

export function Avatar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const options = {
      ...DEFAULT_PARTICLE_OPTIONS,
      tintColor: getParticleTintColor(),
    };

    const particleCanvas = new ParticleCanvas(canvas, options, AVATAR_PARSE_SIZE);
    particleCanvas.init(particlesData);

    const unwatchTheme = watchParticleTintColor((color) => {
      particleCanvas.setTintColor(color);
    });

    return () => {
      unwatchTheme();
      particleCanvas.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full max-w-72 aspect-square lg:max-w-80 2xl:max-w-96"
    />
  );
}
