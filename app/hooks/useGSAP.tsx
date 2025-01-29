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
import { formatTime } from '~/components/BreathTiles';

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

const playAudio = (
  audioRef: React.MutableRefObject<HTMLAudioElement | null>
) => {
  if (audioRef.current) {
    audioRef.current.currentTime = 0; // Restart the audio
    audioRef.current.play();
  }
};

const useGSAP = (props: GsapProps) => {
  const [seconds, setSeconds] = React.useState(0);

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

  const handleAudioSwitch = useCallback(() => playAudio(audioRef), [audioRef]);

  useEffect(() => {
    // console.log('useGSAP useEffect');

    if (!timelineRef.current) {
      console.log('!timelineRef.current');
      timelineRef.current = gsap.timeline({
        paused: true,
        repeat: durations[CYCLES] - 1 || -1,
        smoothChildTiming: true,
        onStart: () => {
          console.log('TIMELINE:onStart');
          setBreathCount(0);
        },
        onUpdate: () => {
          const time = timelineRef?.current?.time();
          setSeconds(formatTime(time));
        },
        onRepeat: () => {
          console.log('TIMELINE:onRepeat');
          setBreathCount((prevCount) => prevCount + 1);
        },
        onComplete: () => {
          console.log('TIMELINE:onComplete');
          setBreathCount((prevCount) => prevCount + 1);
          setSeconds(0);
          setCompleted(true);
          onComplete();
        }
      });
    } else {
      // console.log('Clear the existing timeline without killing it');
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
          backgroundColor: '#E56399',
          duration: durations[INHALE] - 1.2,
          stagger: {
            each: 0.005,
            from: 'center',
            axis: 'x'
          },
          onStart: () => {
            console.log('INHALE');
            setAction(INHALE);
            handleAudioSwitch();
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
            handleAudioSwitch();
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
            handleAudioSwitch();
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
            handleAudioSwitch();
          }
        },
        durations[INHALE] + durations[RETENTION] + durations[EXHALE]
      );

    return () => {
      // TODO: Cleanup function to kill the timeline on unmount, its still playing on route changes
      // console.log('gsap cleanup');
      if (timelineRef.current) {
        // console.log('setPlaying(false) && kill');
      } else {
        // console.log('gsap cleanup, no timeline to be found');
      }
    };
  }, [
    durations,
    setAction,
    setBreathCount,
    setPlaying,
    scope,
    setCompleted,
    onComplete,
    handleAudioSwitch
  ]);

  const restartAnimation = () => {
    if (timelineRef.current) {
      // reset timeline
      timelineRef.current.seek(0);
      timelineRef.current.pause();
      // reset state
      setPlaying(false);
      setCompleted(false);
      setSeconds(0);
      setBreathCount(0);
      setAction(INHALE);
    }
  };

  const toggleAnimation = useCallback(() => {
    if (timelineRef.current) {
      if (timelineRef.current.paused()) {
        timelineRef.current.play();
      } else if (completed) {
        timelineRef.current.restart();
        setCompleted(false);
      } else {
        timelineRef.current.pause();
      }
    }
  }, [completed, setCompleted]);

  return { toggleAnimation, seconds, restartAnimation };
};

export default useGSAP;
