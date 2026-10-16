import {Measured, Watch, watched, watching} from '../landing';

const at = (top: number, pageHeight: number, visible = true): Measured => ({top, pageHeight, visible});

const after = (frames: readonly Measured[]): Watch | 'land' =>
  frames.reduce<Watch | 'land'>((watch, frame) => watch === 'land' ? watch : watched(watch, frame), watching);

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
