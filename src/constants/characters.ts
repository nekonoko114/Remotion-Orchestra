import { staticFile } from 'remotion';

/**
 * Character Reference Assets
 * These are master reference images (Generation Inputs) for the characters.
 * Not necessarily intended for direct display in the final video, but used as
 * references for image generation or placeholders.
 */

const ASSET_PREFIX = process.env.REMOTION_LAMBDA ? 'public/' : '';

export const CHARACTER_ASSETS = {
  nova: {
    name: 'Nova',
    file: staticFile(`${ASSET_PREFIX}assets/characters/nova.webp`),
    variation: staticFile(
      `${ASSET_PREFIX}assets/characters/nova-variatoin.webp`,
    ),
    color: '#9b5de5', // Purple
  },
  yuka: {
    name: 'Yuka',
    file: staticFile(`${ASSET_PREFIX}assets/characters/yuuka.webp`),
    color: '#f15bb5', // Pink
  },
  rin: {
    name: 'Rin',
    file: staticFile(`${ASSET_PREFIX}assets/characters/rin.webp`),
    color: '#00bbf9', // Light Blue
  },
  shiori: {
    name: 'Shiori',
    file: staticFile(`${ASSET_PREFIX}assets/characters/shiori.webp`),
    color: '#00f5d4', // Green
  },
  asuka: {
    name: 'Asuka',
    file: staticFile(`${ASSET_PREFIX}assets/characters/asuka.webp`),
    color: '#fee440', // Blonde/Yellow
  },
  group: {
    friends: staticFile(`${ASSET_PREFIX}assets/characters/frends.webp`),
  },
};
