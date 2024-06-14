
interface AudioControlProps {
  isAudioPlaying: boolean;
  setIsAudioPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  currentAudio: string | null;
  setCurrentAudio: React.Dispatch<React.SetStateAction<string | null>>;
  volume: number;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  audioRef: React.Ref<HTMLAudioElement>;
}

const AudioControl = (props: AudioControlProps) => {
  const {
    isAudioPlaying,
    setIsAudioPlaying,
    currentAudio,
    // setCurrentAudio,
    // volume,
    // setVolume,
    audioRef
  } = props;

  // const handleVolumeChange = (event) => {
  //   const newVolume = event.target.value;
  //   setVolume(newVolume);
  //   if (audioRef.current) {
  //     audioRef.current.volume = newVolume;
  //   }
  // };

  return (
    <div>
      <div>
        {isAudioPlaying ? (
          <div className="text-xs">
            {currentAudio}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              className='size-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z'
              />
            </svg>
          </div>
        ) : (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            className='size-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z'
            />
          </svg>
        )}
      </div>

      {/* <div>
        <label htmlFor='volume'>Volume: </label>
        <input
          id='volume'
          type='range'
          min='0'
          max='1'
          step='0.01'
          value={volume}
          onChange={handleVolumeChange}
        />
      </div> */}

      <audio
        ref={audioRef}
        src={currentAudio ?? undefined}
        onEnded={() => setIsAudioPlaying(false)}
      >
        <track kind='captions' />
      </audio>
    </div>
  );
};

export default AudioControl;
