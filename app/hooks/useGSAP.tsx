import React, { useEffect, useRef } from 'react';

import gsap from 'gsap/dist/gsap';

import {
  Breath,
  CYCLES,
  Duration,
  EXHALE,
  INHALE,
  RETENTION,
  SUSPENSION
} from '~/utils/types';
import audio_exhale from '../../audio/exhale.m4a';
import audio_inhale from '../../audio/inhale.wav';

export interface GsapProps {
  isPlaying: boolean;
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  completed: boolean;
  setCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  setBreathCount: React.Dispatch<React.SetStateAction<number>>;
  setAction: React.Dispatch<React.SetStateAction<Breath>>;
  scope: React.RefObject<HTMLDivElement>;
  onComplete: () => void;
  durations: Duration;
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
  const contextRef = useRef(null);
  const {
    setPlaying,
    setBreathCount,
    setAction,
    onComplete,
    completed,
    setCompleted,
    scope,
    durations
  } = props;
  const timelineRef = useRef(null);

  useEffect(() => {
    console.log('creating timeline for:', durations);
    // todo: onComplete now that we have cycles
    timelineRef.current = gsap.timeline({
      paused: true,
      repeat: durations[CYCLES] - 1 || -1,
      smoothChildTiming: true,
      onRepeat: () => {
        console.log('repeating!');
        setBreathCount((prevCount) => {
          console.log('set breath count', prevCount, '+ 1 -> ', prevCount + 1);
          return prevCount + 1;
        });
      },
      onComplete: () => {
        console.log('completed a breath cycle!');
        setBreathCount((prevCount) => {
          console.log('add one final to breath count:', prevCount, '+ 1 -> ', prevCount + 1);
          return prevCount + 1;
        });
        setCompleted(true)
        onComplete();
      }
    });
    const timeline = timelineRef.current; // Get the created timeline

    timeline
      .fromTo(
        '.boxes',
        {
          opacity: 0,
          height: 0
        },
        {
          opacity: 1,
          height: 315,
          backgroundColor: '#c54c82',
          duration: durations[INHALE] - 1.2,
          stagger: {
            each: 0.005,
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
          opacity: 1,
          height: 0,
          duration: durations[EXHALE] - 1.2,
          stagger: {
            each: 0.005,
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
          opacity: 0,
          onStart: () => {
            console.log('onStart:SUSPENSION');
            setAction(SUSPENSION);
          }
        },
        durations[INHALE] + durations[RETENTION] + durations[EXHALE]
      );

    // Cleanup function to kill the timeline on unmount
    return () => {
      if (timelineRef.current) {
        setPlaying(false);
        timelineRef.current.kill();
      }
    };
  }, [durations, setAction, setBreathCount, setPlaying, scope]);
  // Function to toggle animation play/pause
  const toggleAnimation = () => {
    if (timelineRef.current) {
      if (timelineRef.current.paused()) {
        timelineRef.current.play();
      } else if (completed) {
        timelineRef.current.restart();
        setCompleted(false)
      } else {
        timelineRef.current.pause();
      }
    }
  };

  return { toggleAnimation };
};

export default useGSAP;
