import { track, type SpringConfig } from "./spring";

/** The frame the camera films; each format passes its own. */
export type Frame = { width: number; height: number };

/** Camera keys in world units: the world point at the frame's center, and the zoom. */
export type CameraKey = readonly [time: number, x: number, y: number, zoom: number];
export type Camera = { x: number; y: number; zoom: number };

/** Slow, heavy, no overshoot: a camera that feels held, not thrown. */
export const cameraSpring: SpringConfig = { damping: 30, mass: 1.2, stiffness: 120 };

/** The camera at time t. Zoom springs in log space, so a push reads the same at any scale. */
export function camera(t: number, keys: readonly CameraKey[], config: SpringConfig = cameraSpring): Camera {
  return {
    x: track(t, keys.map(([time, x]) => [time, x] as const), config),
    y: track(t, keys.map(([time, , y]) => [time, y] as const), config),
    zoom: Math.exp(track(t, keys.map(([time, , , zoom]) => [time, Math.log(zoom)] as const), config)),
  };
}

/** Keep the view inside the world so no empty edge ever shows. */
export function clampView(view: Camera, frame: Frame, world: Frame): Camera {
  const zoom = Math.max(view.zoom, frame.width / world.width, frame.height / world.height);
  const hw = frame.width / zoom / 2;
  const hh = frame.height / zoom / 2;
  return {
    zoom,
    x: Math.min(world.width - hw, Math.max(hw, view.x)),
    y: Math.min(world.height - hh, Math.max(hh, view.y)),
  };
}

/** Screen position of a world point. */
export function project(frame: Frame, view: Camera, x: number, y: number) {
  return { x: frame.width / 2 + (x - view.x) * view.zoom, y: frame.height / 2 + (y - view.y) * view.zoom };
}

/** CSS transform for a world layer (transform-origin 0 0). Never add will-change to it. */
export function worldTransform(frame: Frame, view: Camera) {
  return `translate(${frame.width / 2}px, ${frame.height / 2}px) scale(${view.zoom}) translate(${-view.x}px, ${-view.y}px)`;
}
