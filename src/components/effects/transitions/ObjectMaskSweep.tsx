import React from 'react';
import { TransitionPresentation } from '@remotion/transitions';
import { ObjectWipeTransition } from '../../../compositions/Battles/shared/TransitionsTikTok15';

export const objectMaskSweep = (): TransitionPresentation<any> => {
  return {
    component: (props: any) => {
      const { presentationProgress, presentationDurationInFrames, children } = props;
      const arr = React.Children.toArray(children);
      return (
        <ObjectWipeTransition
          frame={presentationProgress * presentationDurationInFrames}
          duration={presentationDurationInFrames}
          SceneA={arr[0]}
          SceneB={arr[1]}
        />
      );
    },
    props: {},
  };
};
