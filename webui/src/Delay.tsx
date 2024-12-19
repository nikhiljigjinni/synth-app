
import React from 'react';
import { DelayState } from './types';

type HandleDelayState = (
  e: React.ChangeEvent<HTMLInputElement>
) => void;

export default function Delay({
  delayState,
  handleDelayState,
}: {
  delayState: DelayState;
  handleDelayState: HandleDelayState;
}) {
  return (
    <>
      <input type="checkbox" name="delayEnabled" checked={delayState.delayEnabled} onChange={handleDelayState}/>
      <label htmlFor="delayTime">Delay Time</label>
      <input
        type="range"
        name="delayTime"
        min="0"
        max="3"
        step="0.1"
        value={delayState.delayTime}
        onChange={handleDelayState}
      />

      <label htmlFor="delayFeedback">Delay Feedback</label>
      <input
        type="range"
        name="delayFeedback"
        min="0"
        max="1"
        step="0.01"
        value={delayState.delayFeedback}
        onChange={handleDelayState}
      />
    </>
  );
}
