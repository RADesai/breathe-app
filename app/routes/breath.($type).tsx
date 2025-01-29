import { useCallback, useRef, useState } from "react";
import {
  AppLoadContext,
  useLoaderData,
  useOutletContext,
  useRouteError,
} from "react-router";
import AudioControl from "~/components/AudioControl";
import { PleaseLogin } from "~/components/auth/PleaseLogin";
import BreathTiles from "~/components/BreathTiles";
import ProgressBar from "~/components/ProgressBar";
import { useSession } from "~/context/SessionProvider";
import useGSAP from "~/hooks/useGSAP";
import { animationStyles } from "~/utils/styles";

import { Action, Breath, INHALE } from "~/utils/types";

export async function loader(args: {
  params: { type: string };
  request: Request;
  context: AppLoadContext;
}) {
  // check auth
  const { params } = args;

  if (params.type) {
    // TODO: use js map for list of changing breath timings
    try {
      const type = params.type; // Get the type from the URL params

      const longMatch = type.match(/i(\d+)r(\d+)e(\d+)s(\d+)c?(\d+)?/);
      const shortMatch = type.match(/i(\d+)e(\d+)c?(\d+)?/);

      if (!longMatch && !shortMatch) {
        console.error(`Invalid path format: ${type}`);
      }

      let durations: { [key: string]: number } = {};

      if (longMatch) {
        const [, i, r, e, s, c] = longMatch;
        durations = {
          inhale: parseInt(i) || 0,
          retention: parseInt(r) || 0,
          exhale: parseInt(e) || 0,
          suspension: parseInt(s) || 0,
          cycles: parseInt(c) || 0,
        };
        return Response.json({ durations });
      } else if (shortMatch) {
        const [, i, e, c] = shortMatch;
        durations = {
          inhale: parseInt(i),
          exhale: parseInt(e),
          cycles: parseInt(c) || 0,
        };
        return Response.json({ durations });
      } else {
        console.error(`Unable to match route: ${type}`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return Response.json({ durations: null, userId: null });
}

interface OutletContext {
  action: Action;
  setBreathCount: React.Dispatch<React.SetStateAction<number>>;
  setAction: React.Dispatch<React.SetStateAction<Breath>>;
  breathCount: number;
}

const BreathComp = () => {
  const { session } = useSession();

  const { durations } = useLoaderData();
  const { action, setAction, breathCount, setBreathCount } =
    useOutletContext<OutletContext>();
  const [isPlaying, setPlaying] = useState(false);
  const [completed, setCompleted] = useState(false);

  const container = useRef<HTMLDivElement>(null);

  const onComplete = useCallback(() => {
    setAction(INHALE);
    setPlaying(false);
  }, [setAction]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // todo: extract animation to comp?
  const { toggleAnimation, seconds, restartAnimation } = useGSAP({
    isPlaying,
    setPlaying,
    setBreathCount,
    setAction,
    onComplete,
    completed,
    setCompleted,
    scope: container,
    durations,
    audioRef,
  });

  if (!session?.user) {
    return <PleaseLogin message="to use the Breathwork tool" />;
  }

  return (
    <div className="space-1 flex flex-wrap justify-center self-center overflow-scroll px-2 text-dark md:w-2/3">
      <div className="mb-4 w-full justify-items-center text-center">
        <h2 className="mb-2 text-lg font-bold tracking-wide">Instructions</h2>
        <p className="rounded bg-white bg-opacity-50 p-2 text-center text-sm sm:w-2/3">
          Follow the guided animation to regulate your breathing.
          <br />
          <span className="font-bold">Inhale</span>,{" "}
          <span className="font-bold">Hold (Retention)</span>,{" "}
          <span className="font-bold">Exhale</span>, and{" "}
          <span className="font-bold">Hold (Suspension)</span> again in a
          rhythmic cycle to calm your mind and body.
        </p>
      </div>

      <ProgressBar cycles={durations.cycles} breathCount={breathCount} />

      <div id="carousel" className="text-sm font-bold uppercase">
        <div className="mb-3 text-center text-xl font-bold uppercase tracking-widest">
          Steps
        </div>
        <BreathTiles action={action} durations={durations} seconds={seconds} />
      </div>

      <div id="visuals">
        <div className="mb-3 text-center text-xl font-bold uppercase tracking-widest">
          Breath
        </div>
        <div className="flex h-80 w-60 flex-col rounded border-4 border-dark bg-dark bg-opacity-5">
          <div ref={container} className="flex justify-center">
            {Array.from({ length: 240 }, (_, index) => (
              <div
                key={index}
                className={`boxes -z-10 w-[1px] first-of-type:rounded-bl last-of-type:rounded-br`}
              />
            ))}
          </div>
          {completed && (
            <div className="-z-10 h-full w-full bg-white bg-opacity-50 p-3 pt-5 text-center font-bold text-purple">
              <div className="p-2">
                You have completed a breath cycle!
                <br />
                <br />
                We hope you were able to positively impact your physical or
                mental state with this breathing routine.
                <br />
                <br />
                You can repeat this cycle, or if you like, you can browse some
                of the others
                {/* TODO: animate in success */}
              </div>
            </div>
          )}
        </div>
        {/* TODO: extract btn controls to component */}
        <div className="flex justify-center gap-4">
          <AudioControl audioRef={audioRef} />
          <button
            disabled={!isPlaying}
            className={animationStyles.controlButton}
            onClick={() => {
              if (isPlaying) {
                setPlaying(false);
                toggleAnimation();
              }
            }}
          >
            <svg
              aria-hidden="true"
              className="h-8 w-8"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 5.25v13.5m-7.5-13.5v13.5"
              />
            </svg>
          </button>
          <button
            disabled={isPlaying}
            className={animationStyles.controlButton}
            onClick={() => {
              if (!isPlaying) {
                setPlaying(true);
                toggleAnimation();
              }
            }}
          >
            <svg
              aria-hidden="true"
              className="h-8 w-8"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
              />
            </svg>
          </button>
          <div>
            <button
              className={animationStyles.controlButton}
              onClick={() => restartAnimation()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-8 w-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreathComp;

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  // When NODE_ENV=production:
  // error.message = "Unexpected Server Error"
  // error.stack = undefined
  return (
    <div className="flex flex-wrap justify-around gap-1 overflow-scroll bg-red p-2 font-bold">
      Error loading animation, please try again...
    </div>
  );
}
