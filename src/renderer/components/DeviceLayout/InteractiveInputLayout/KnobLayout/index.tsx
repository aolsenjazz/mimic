import { KnobInputImpl } from '@shared/input-impl';

import AbsoluteKnob from './AbsoluteKnobLayout';
import EndlessKnob from './EndlessKnobLayout';

type PropTypes = {
  input: KnobInputImpl;
  deviceId: string;
};

export default function KnobLayout(props: PropTypes) {
  const { input, deviceId } = props;

  return input.knobType === 'endless' ? (
    <EndlessKnob deviceId={deviceId} input={input} />
  ) : (
    <AbsoluteKnob deviceId={deviceId} input={input} />
  );
}
