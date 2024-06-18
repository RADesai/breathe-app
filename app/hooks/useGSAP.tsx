import React, { useCallback, useEffect, useRef } from 'react';

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

export interface GsapProps {
  isPlaying: boolean;
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  completed: boolean;
  setCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  setBreathCount: React.Dispatch<React.SetStateAction<number>>;
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
  setAction: React.Dispatch<React.SetStateAction<Breath>>;
  scope: React.RefObject<HTMLDivElement>;
  onComplete: () => void;
  durations: Duration;
}

const playAudio = (audioRef: React.MutableRefObject<HTMLAudioElement | null>) => {
  if (audioRef.current) {
    audioRef.current.currentTime = 0; // Restart the audio
    audioRef.current.play();
  }
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
    audioRef,
    scope,
    durations
  } = props;
  const timelineRef = useRef(null);

  const handleAudioSwitch = useCallback(
    () => {
      console.log(`* handle-AudioSwitch()`);
      playAudio(audioRef);
    },
    [audioRef]
  );

  useEffect(() => {
    // console.log('useGSAP useEffect');

    if (!timelineRef.current) {
      console.log('!timelineRef.current');
      timelineRef.current = gsap.timeline({
        paused: true,
        repeat: durations[CYCLES] - 1 || -1,
        smoothChildTiming: true,
        onRepeat: () => {
          console.log('TIMELINE:onRepeat');
          setBreathCount((prevCount) => prevCount + 1);
        },
        onStart: () => {
          console.log('TIMELINE:onStart');
        },
        onComplete: () => {
          console.log('TIMELINE:onComplete');
          setBreathCount((prevCount) => prevCount + 1);
          setCompleted(true);
          onComplete();
        }
      });
    } else {
      // console.log('Clear the existing timeline without killing it');
      // Clear the existing timeline without killing it
      timelineRef.current.clear();
    }

    timelineRef.current
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
            console.log('INHALE');
            setAction(INHALE);
            handleAudioSwitch()
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
            console.log('RETENTION');
            setAction(RETENTION);
            handleAudioSwitch()
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
            console.log('EXHALE');
            setAction(EXHALE);
            handleAudioSwitch()
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
            console.log('SUSPENSION');
            setAction(SUSPENSION);
            handleAudioSwitch()
          }
        },
        durations[INHALE] + durations[RETENTION] + durations[EXHALE]
      );

    return () => {
      // Cleanup function to kill the timeline on unmount
      // console.log('gsap cleanup');
      if (timelineRef.current) {
        // console.log('setPlaying(false) && kill');
        // timelineRef.current?.clear();
        // timelineRef.current?.kill();
        // timelineRef.current = null;
        // setPlaying(false);
      } else {
        // console.log('gsap cleanup, no timeline to be found');
      }
    };
    // ! todo: somethings breaking in these deps
  }, [durations, setAction, setBreathCount, setPlaying, scope, setCompleted, onComplete, handleAudioSwitch]);

  // Function to toggle animation play/pause
  const toggleAnimation = useCallback(() => {
    console.log('toggle-animation()');
    if (timelineRef.current) {
      if (timelineRef.current.paused()) {
        console.log('** timeline paused -> play()');
        timelineRef.current.play();
      } else if (completed) {
        console.log(
          '** timeline completed -> restart() && setCompleted(false)'
        );
        timelineRef.current.restart();
        setCompleted(false);
      } else {
        console.log('** -> pause()');
        timelineRef.current.pause();
      }
    }
  }, [completed, setCompleted]);

  return { toggleAnimation };
};

export default useGSAP;
