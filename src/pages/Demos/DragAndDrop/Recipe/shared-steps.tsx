import {ReactNode} from 'react';
import {Link} from 'react-router';
import {Paths} from '@pages/Paths';
import {DemoTopics} from '../../types';
import {Codes, Says, Snippet, Step, Tell, Words, aside, plain} from '../../Recipe';
import {unit} from '../../Recipe/carve';
import crossingSource from '../crossing.ts?raw';

export type Dials = Record<'pace' | 'origin' | 'motion', ReactNode>;

export const gap = plain(' ');

export const currencyTell =
  <Tell>The tables build their drag from pointer events and own every pixel; this
    list pays platform currency instead. Mark a card draggable and the ceremony
    arrives: the snapshot, the cursor, the cancel. What the platform asks in return is
    protocol, a series of consents and timings, and the steps below are those
    consents.</Tell>;

export const neverOursTell =
  <Tell>Some pixels are never ours on this road: the snapshot, the cursor, the macOS
    cancel. We name them instead of faking them, and the <Link className="signpost"
    to={`${Paths.demos}?tab=${DemoTopics.tables}`}>Tables demo</Link> walks the road that
    owns them.</Tell>;

export const crossingStep =
  <Step title="Find the crossing with the inner half">
    <Words want="Swap at the first touch of a neighbour and the order chatters: at a boundary, every pixel of movement flips it back and forth.">
      <Says>There is no survey on this road: the platform fires dragover on whatever the
        pointer is really over, so the event’s own target is the neighbour and its bounding
        box is the slot. A crossing only counts once the pointer reaches the inner half; the
        outer quarter holds still, and an item already sliding cannot be overtaken.</Says>
    </Words>
    <Codes>
      <Snippet label="JS" lines={[
        ...unit(crossingSource, 'export const crossed')
      ]}/>
    </Codes>
  </Step>;

export const roadEndStep =
  <Step title="Know where the road ends">
    <Words want="Some pixels on this road are never yours: the snapshot, the cursor, the cancel. And the keyboard never gets a session at all.">
      <Says>The drag image is a bitmap taken at dragstart, so it cannot be animated and cannot
        be made opaque on macOS; the cursor belongs to the platform; on macOS even the cancel is
        the platform’s animation to run; and drag-and-drop itself never answers the keyboard:
        the arrows on the grips work because they change the order directly, without the
        API. When those pixels matter, build the drag from pointer events instead; the Tables
        demo walks that road.</Says>
    </Words>
    <Codes>
      <Snippet label="JS" lines={[
        aside('// no API exists for these pixels; when they matter,'),
        aside('// take the pointer road')
      ]}/>
    </Codes>
  </Step>;
