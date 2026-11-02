import { FRAME_VERSION } from './hero-frames';

export const heroFrameUrl = (index: number) => `/hero/frames/frame_${String(index + 1).padStart(4, '0')}.webp?v=${FRAME_VERSION}`;
