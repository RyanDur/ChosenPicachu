import {landing, Measured, Watch} from '../landing';

const at = (top: number, pageHeight: number, visible = true): Measured => ({top, pageHeight, visible});

const after = (frames: readonly Measured[], from: Watch = landing.watching): Watch | 'land' =>
  frames.reduce<Watch | 'land'>((watch, frame) => watch === 'land' ? watch : landing.watched(watch, frame), from);

describe('the landing on a fragment', () => {
  test('should land once the target has held its place on the page for two frames', () => {
    expect(after([at(4530, 9000), at(4530, 9000)])).not.toEqual('land');
    expect(after([at(4530, 9000), at(4530, 9000), at(4530, 9000)])).toEqual('land');
  });

  test('should keep waiting while the page still grows under a target that holds its place', () => {
    const growing = Array.from({length: 60}, (_, frame) => at(4530, 1000 + frame * 50));

    expect(after(growing)).not.toEqual('land');
  });

  test('should keep waiting while the target still moves on a page whose height holds', () => {
    const moving = Array.from({length: 60}, (_, frame) => at(4530 + frame * 10, 9000));

    expect(after(moving)).not.toEqual('land');
  });

  test('should keep waiting while the target is hidden, however still it is', () => {
    expect(after([at(4530, 9000, false), at(4530, 9000, false), at(4530, 9000, false)])).not.toEqual('land');
  });

  test('should land anyway after 120 frames of a page that never holds still', () => {
    const restless = Array.from({length: 121}, (_, frame) => at(4530, 1000 + frame));

    expect(after(restless.slice(0, 120))).not.toEqual('land');
    expect(after(restless)).toEqual('land');
  });
});

describe('the search for a target the page has not drawn yet', () => {
  const lookedFor = (frames: number): Watch | 'given up' => Array.from({length: frames})
    .reduce<Watch | 'given up'>(watch => watch === 'given up' ? watch : landing.lookedFor(watch), landing.watching);

  const stillLooking = (frames: number): Watch => {
    const looked = lookedFor(frames);
    if (looked === 'given up') throw new Error(`gave up within ${frames} frames`);
    return looked;
  };

  test('should spend none of the frames the landing waits for the page to hold still', () => {
    const restless = Array.from({length: 120}, (_, frame) => at(4530, 1000 + frame));

    expect(after(restless, stillLooking(300))).not.toEqual('land');
  });

  test('should give up after 600 frames with no target drawn', () => {
    expect(lookedFor(600)).not.toEqual('given up');
    expect(lookedFor(601)).toEqual('given up');
  });
});
