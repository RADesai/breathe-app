import React from 'react';

import { useGSAP as useGSAPHook } from '@gsap/react';
import gsap from 'gsap/dist/gsap';
import { Breath, EXHALE, INHALE, RETENTION, SUSPENSION } from '~/routes/breath';

export interface GsapProps {
  setBreathCount: React.Dispatch<React.SetStateAction<number>>;
  setAction: React.Dispatch<React.SetStateAction<Breath>>;
  scope: React.RefObject<HTMLDivElement>;
  durations: {
    inhale: number;
    retention: number;
    exhale: number;
    suspension: number;
  };
}

const useGSAP = (props: GsapProps) => {
  const { setBreathCount, setAction, scope, durations } = props;

  useGSAPHook(
    () => {
      const boxes = gsap.timeline({
        repeat: -1,
        smoothChildTiming: true,
        onRepeat: () => setBreathCount((prevCount) => prevCount + 1)
      });

      boxes
        .fromTo(
          '.boxes',
          {
            opacity: 0.5,
            height: 0,
          },
          {
            opacity: 1,
            height: 318,
            backgroundColor: '#c54c82',
            duration: durations[INHALE] - 1.95,
            stagger: {
              each: 0.015,
              from: 'center',
              axis: 'x'
            },
            onStart: () => {
              console.log('onStart:INHALE');
              setAction(INHALE);
            }
          },
          0
        )
        .to(
          '.boxes',
          {
            opacity: 0.5,
            duration: durations[RETENTION],
            onStart: () => {
              console.log('onStart:RETENTION');
              setAction(RETENTION);
            }
          },
          durations[INHALE]
        )
        .to(
          '.boxes',
          {
            backgroundColor: '#c54c82',
            height: 0,
            duration: durations[EXHALE] - 1.95,
            stagger: {
              each: 0.015,
              from: 'center',
              axis: 'x'
            },
            onStart: () => {
              console.log('onStart:EXHALE');
              setAction(EXHALE);
            }
          },
          durations[INHALE] + durations[RETENTION]
        )
        .to(
          '.boxes',
          {
            duration: durations[SUSPENSION],
            onStart: () => {
              console.log('onStart:SUSPENSION');
              setAction(SUSPENSION);
            }
          },
          durations[INHALE] + durations[RETENTION] + durations[EXHALE]
        );

      gsap.timeline().add(boxes);
    },
    {
      scope,
      dependencies: [
        durations[INHALE],
        durations[RETENTION],
        durations[EXHALE],
        durations[SUSPENSION]
      ]
    }
  );
};

export default useGSAP;
