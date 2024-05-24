import React, { useEffect, useRef } from 'react';

import gsap from 'gsap/dist/gsap';

import { Duration } from '~/routes/breath';
import { Breath, EXHALE, INHALE, RETENTION, SUSPENSION } from '~/utils/types';
import audio_exhale from '../../audio/exhale.m4a';
import audio_inhale from '../../audio/inhale.wav';

export interface GsapProps {
  isPlaying: boolean;
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  setBreathCount: React.Dispatch<React.SetStateAction<number>>;
  setAction: React.Dispatch<React.SetStateAction<Breath>>;
  scope: React.RefObject<HTMLDivElement>;
  durations: Duration
}
// todo: shorter audio tracks
// ? lower volume on complete?

const playAudio = (src: string) => {
  const audio = new Audio(src);
  console.log('...audio would play now:', audio);
  // audio.play();
};

const pauseAudio = (src: string) => {
  const audio = new Audio(src);
  console.log('...PAUSE', audio);
  audio.pause();
};

const useGSAP = (props: GsapProps) => {
  const { setPlaying, setBreathCount, setAction, scope, durations } = props;

  const contextRef = useRef(null);
  const timelineRef = useRef(null);

  useEffect(() => {
    timelineRef.current = gsap.timeline({
      paused: true,
      repeat: -1,
      smoothChildTiming: true,
      onRepeat: () => setBreathCount((prevCount) => prevCount + 1)
    });
    const timeline = timelineRef.current; // Get the created timeline

    timeline
      .fromTo(
        '.boxes',
        {
          opacity: 0.5,
          height: 0
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
            playAudio(audio_inhale);
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
            playAudio(audio_exhale);
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

    // ? return revert to kill on unmount??
    // Cleanup function to kill the timeline on unmount
    return () => {
      if (timelineRef.current) {
        setPlaying(false)
        timelineRef.current.kill();
      }
    };
  }, [durations, setAction, setBreathCount, setPlaying, scope]);
  // Function to toggle animation play/pause (optional based on your needs)
  const toggleAnimation = () => {
    if (timelineRef.current) {
      if (timelineRef.current.paused()) {
        timelineRef.current.play();
      } else {
        timelineRef.current.pause();
      }
    }
  };

  return { toggleAnimation };
};

export default useGSAP;
