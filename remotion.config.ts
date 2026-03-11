import { Config } from '@remotion/cli/config';
import { enableTailwind } from '@remotion/tailwind-v4';
import { enableSkia } from '@remotion/skia/enable';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setDelayRenderTimeoutInMilliseconds(120000); // 120 seconds

Config.overrideWebpackConfig((currentConfiguration) => {
  return enableSkia(enableTailwind(currentConfiguration));
});
