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
import audio_exhale from '../../audio/exhale.m4a';
import audio_inhale from '../../audio/inhale.wav';

export interface GsapProps {
  isPlaying: boolean;
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  completed: boolean;
  setCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  setBreathCount: React.Dispatch<React.SetStateAction<number>>;
  setCurrentAudio: React.Dispatch<React.SetStateAction<string | null>>;
  isAudioPlaying: boolean;
  setIsAudioPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  audioRef: React.Ref<HTMLAudioElement>;
  setAction: React.Dispatch<React.SetStateAction<Breath>>;
  scope: React.RefObject<HTMLDivElement>;
  onComplete: () => void;
  durations: Duration;
}

const playAudio = (src: string) => {
  const audio = new Audio(src);
  console.log('...audio would play now:', audio);
  audio.volume = 0.1;
  audio.play();
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
    isAudioPlaying,
    setIsAudioPlaying,
    setCurrentAudio,
    audioRef,
    scope,
    durations
  } = props;
  const timelineRef = useRef(null);

  const handleSelectAudio = useCallback(
    (src: string) => {
      console.log(`* handle-SelectAudio() -> setCurrentAudio(${src})`);
      // todo: diagram state updates onStart and onExhale and verify if we can manage both audios like this, some infinite loop is happening when switching from inhale to exhale audio...
      if (isAudioPlaying) {
        console.log('* some audio is currently playing -> pause()');
        audioRef?.current?.pause();
        // setIsAudioPlaying(!isAudioPlaying); // ! why doesnt this work?
      } else {
        console.log('* some audio is NOT currently playing');
        setIsAudioPlaying(!isAudioPlaying);
        setCurrentAudio(src);
      }
      console.log(
        '* regardless of audio is currently playing, set new audio:',
        src
      );
      setCurrentAudio(src);
    },
    [audioRef, isAudioPlaying, setCurrentAudio, setIsAudioPlaying]
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
      console.log('Clear the existing timeline without killing it');
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
            console.log('setAction to INHALE and select audio: BREATHE');
            setAction(INHALE);
            handleSelectAudio(audio_inhale);
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
            console.log('setAction to RETENTION and select audio: HOLD');
            setAction(RETENTION);
            // halfAudioVolume(audio_inhale);
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
            console.log('setAction to EXHALE and select audio: BREATHE');
            setAction(EXHALE);
            handleSelectAudio(audio_exhale);
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
            console.log('setAction to SUSPENSION and select audio: HOLD');
            setAction(SUSPENSION);
            // halfAudioVolume(audio_exhale);
          }
        },
        durations[INHALE] + durations[RETENTION] + durations[EXHALE]
      );

    return () => {
      // Cleanup function to kill the timeline on unmount
      console.log('gsap cleanup');
      if (timelineRef.current) {
        console.log('setPlaying(false) && kill');
        // timelineRef.current?.clear();
        // timelineRef.current?.kill();
        // timelineRef.current = null;
        // setPlaying(false);
      } else {
        console.log('gsap cleanup, no timeline to be found');
      }
    };
    // ! todo: somethings breaking in these deps
  }, [
    durations,
    setAction,
    setBreathCount,
    setPlaying,
    scope,
    handleSelectAudio,
    setCompleted,
    onComplete
  ]);

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
