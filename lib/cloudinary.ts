/**
 * Cloudinary CDN URL builders.
 *
 * All media for A Little Journey lives in one Cloudinary account. Public IDs
 * are the original filenames with spaces/punctuation collapsed to
 * underscores (Cloudinary's upload convention). Verified against the account's
 * resource list — do not guess IDs.
 *
 * ENV: set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME to override the default cloud.
 */
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'sarc7qfk';

const BASE = `https://res.cloudinary.com/${CLOUD_NAME}`;

/** Cloudinary stores audio alongside video (both are `video` resource type). */
export const cldVideo = (id: string) => `${BASE}/video/upload/v1/${id}.mp4`;

export const cldAudio = (id: string) => `${BASE}/video/upload/v1/${id}.mp3`;

export const cldImage = (id: string) => `${BASE}/image/upload/v1/${id}.png`;

/** Poster frame: the video's first frame as a JPEG (DESIGN.md §19 poster-first). */
export const cldPoster = (id: string) =>
  `${BASE}/video/upload/so_0,w_1280,q_auto/v1/${id}.jpg`;
