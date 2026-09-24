import type { MousePosition, ParticleOptions } from "./types";

export class Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx = 0;
  vy = 0;
  size: number;

  constructor(
    originX: number,
    originY: number,
    canvasWidth: number,
    canvasHeight: number,
    size: number,
  ) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.originX = originX;
    this.originY = originY;
    this.size = size;
  }

  update(
    ctx: CanvasRenderingContext2D,
    mouse: MousePosition | null,
    options: ParticleOptions,
  ) {
    let targetX = this.originX;
    let targetY = this.originY;

    if (mouse) {
      const distanceX = this.originX - mouse.x;
      const distanceY = this.originY - mouse.y;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      if (distance < options.mouseInfluenceRange) {
        const angle = Math.atan2(distanceY, distanceX);
        targetX = mouse.x + Math.cos(angle) * options.mouseInfluenceRange;
        targetY = mouse.y + Math.sin(angle) * options.mouseInfluenceRange;
      }
    }

    this.vx = (targetX - this.x) * options.particleAcceleration;
    this.vy = (targetY - this.y) * options.particleAcceleration;
    this.x += this.vx;
    this.y += this.vy;
    this.draw(ctx);
  }

  snapToOrigin(ctx: CanvasRenderingContext2D) {
    this.x = this.originX;
    this.y = this.originY;
    this.draw(ctx);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}
