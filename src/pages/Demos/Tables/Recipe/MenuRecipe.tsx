import {FC} from 'react';
import {PillGlider} from '@components/PillGlider';
import {Motion, Origin, Pace} from '../../Controls';
import {StepEntry, StepList, aside, plain} from '../../Recipe';
import {span, unit} from '../../Recipe/carve';
import menuSource from '@components/Menu/index.tsx?raw';
import menuCss from '@components/Menu/Menu.css?raw';
import headerCss from '@components/DragSortableTable/Header.css?raw';
import sortMenuSource from '@components/DragSortableTable/SortMenu.tsx?raw';
import sortingSource from '@components/DragSortableTable/sorting.ts?raw';
import {headerSources, tableSources} from './sources';
import '../../Recipe/Recipe.css';

const gap = plain(' ');

type Step = Omit<StepEntry, 'dial'> & {
  dial?: 'motion';
};

const ruled = (motion: Motion, source: string): Step => motion === 'animated'
  ? {
    title: 'Rule, measure, and mark',
    dial: 'motion',
    want: 'Choosing a direction reorders every row at once. On the animated table, each row deserves to be drawn sliding from where it was.',
    says: ['Your menu click’s own event reaches the table element, so the animated table’s ' +
      'ruled handler measures the seats before the rule lands and marks every moved row with ' +
      'its old offset. The same shifted theater your drags play runs for the sort; the rule ' +
      'itself is one state update at the end.'],
    code: [
      {label: 'JS', lines: [
        ...unit(source, 'const ruled = ')
      ]}
    ]
  }
  : {
    title: 'Rule directly',
    dial: 'motion',
    want: 'Motion is not free, and a sort reorders everything at once. The static table answers a menu click with nothing but the rule.',
    says: ['This is the static table: ruled sets the rule, and nothing else exists in the ' +
      'file. Your rows cut to their ranked seats on the next frame.'],
    code: [
      {label: 'JS', lines: [
        ...unit(source, 'const ruled = ')
      ]}
    ]
  };

const steps = (pace: Pace, origin: Origin, motion: Motion): Step[] => {
  const source = tableSources[pace][origin][motion];
  const headerSrc = headerSources[pace][origin][motion];
  return [
    {
      title: 'A menu that is a menu',
      want: 'A sort chooser needs a popup, and popups built from divs re-invent focus, dismissal, and stacking. Badly.',
      says: ['You reach for the state you always reach for: a boolean, a conditional render, ' +
        'a z-index. It works on the first click, and then the bill arrives. Outside clicks ' +
        'need a document listener you must remember to remove. Escape needs another. Focus ' +
        'has to find its way back to the button. Assistive tech needs telling that the button ' +
        'owns a popup. And somewhere above your table, a stacking context is already beating ' +
        'z-index: 999.',
        'The platform takes all of that off your hands once you name the relationship. Give ' +
        'the menu an id and point the button’s popoverTarget at it; that is the whole ' +
        'wiring. Pressing the button toggles the popover (the default popovertargetaction) ' +
        'with no onClick anywhere, and the invoker-to-popup accessibility relationship comes ' +
        'along free. popover="auto" chooses the managed mode: the top layer, above every ' +
        'z-index you have ever lost to; light-dismiss on outside click or Escape; one auto ' +
        'popover open at a time.',
        'The invoker relationship carries one more gift: it makes your button the popover’s ' +
        'implicit anchor. Anchor positioning normally asks you to declare an anchor-name on ' +
        'one element and point another at it. But a popover opened by an invoker is anchored ' +
        'to that invoker automatically, which is why you get to write position-area with no ' +
        'anchor-name in sight.',
        'Read the new syntax as a compass around the anchor. Picture your toggle as the ' +
        'middle cell of a three-by-three grid drawn over the page: position-area picks cells. ' +
        'block-end takes the row below the toggle; span-inline-start starts from the toggle’s ' +
        'own column and spreads toward the line’s start: under the toggle, hanging left, in ' +
        'this writing mode. position-try-fallbacks: flip-block is the escape hatch: when the ' +
        'row below has no room, the whole area flips above. You measure nothing, and you ' +
        'wrote no JavaScript.',
        'A popover also ships dressed in auto margins, a border, and padding, but none of ' +
        'that is this rule’s business: your site reset already zeroes menu, and author styles beat ' +
        'user-agent styles no matter the specificity. Two cancellations remain that the reset ' +
        'cannot make. inset: auto, because the reset never speaks inset and the UA centers ' +
        'every popover with inset: 0. And list-style: none, because the reset drops markers ' +
        'for ol and ul, and menu is not in that rule.',
        'Engines that have popovers but not anchor positioning get your @supports fallback: ' +
        'a centered popover. Worse placement, same menu: the feature degrades, the function ' +
        'does not.'],
      code: [
        {label: 'JS', foil: true, lines: [
          plain('const [open, setOpen] = useState(false);'), gap,
          plain('<button onClick={() => setOpen(!open)}>⇅</button>'),
          plain('{open && <menu className="popup">…</menu>}'), gap,
          aside('// now you owe: outside clicks, Escape, focus return,'),
          aside('// aria wiring, and a z-index war you cannot win')
        ]},
        {label: 'HTML', lines: [
          ...span(menuSource, '<button type="button"', 'aria-label={label}>{toggle}</button>'), gap,
          ...span(menuSource, '<menu id={id}', '</menu>')
        ]},
        {label: 'CSS', lines: [
          ...span(menuCss, 'inset: auto;', 'list-style: none;'),
          aside('/* the two cancellations the reset cannot make */'), gap,
          ...span(menuCss, 'position-area: block-end span-inline-start;', 'position-try-fallbacks: flip-block;'),
          aside('/* the invoker is the implicit anchor: below it, hanging leading; flips when cramped */'), gap,
          ...span(menuCss, 'width: var(--base-x-25);', 'box-shadow: var(--base-box-shadow);'),
          aside('/* the card language: fixed width, paper, floating shadow as the edge */'), gap,
          ...unit(menuCss, '@supports not (position-area: block-end)'),
          aside('/* no anchor positioning? centered: worse placement, same menu */')
        ]}
      ]
    },
    {
      title: 'Dress the menu as a card',
      want: 'A list of buttons reads as chrome until it wears the site’s card language, and rounded corners are unforgiving about what happens inside them.',
      says: ['The body is a card at a fixed width, so the items have something to measure ' +
        'against. Each item is a button you undress to a full-width row: strip the ' +
        'background, border, and outline, center the label with flex, and take width 100% so ' +
        'the whole row is your hit area, height and type from the scale. Focus deliberately ' +
        'loses the UA outline and gains the same ring hover draws, so your keyboard and your ' +
        'pointer speak one language, and the press answers with the glow.',
        'The geometry is where the care shows. Hairlines go between neighbours, ' +
        'li:not(:last-child), because a line after the last item would double the card’s own ' +
        'edge. And you round only the first and last items, top and bottom pairs ' +
        'respectively, so a hovered item’s ring follows the card’s corners instead of poking ' +
        'square through them.'],
      code: [
        {label: 'CSS', lines: [
          ...unit(menuCss, '.item {'),
          aside('/* a button stripped to a row; press glows, hover rings */'), gap,
          ...span(menuCss, 'li:not(:last-child) .item {', '}'),
          aside('/* hairlines between neighbours, never after the last */'), gap,
          ...span(menuCss, 'li:first-child .item {', '}'), gap,
          ...span(menuCss, 'li:last-child .item {', '}'),
          aside('/* radii only where the card’s corners are */')
        ]}
      ]
    },
    {
      title: 'The glyph is the state',
      want: 'A sorted column must say so, to the eye and to assistive tech, without a second source of truth appearing anywhere.',
      says: ['Everything derives from the one rule; you never store which column is sorted ' +
        'anywhere else. The header compares itself against the rule: the toggle wears the ' +
        'direction’s glyph, and the th announces aria-sort from the same comparison. SortMenu ' +
        'is the whole chooser: three buttons naming the three choices, reporting which ' +
        'column asked for what.'],
      code: [
        {label: 'JS', lines: [
          ...span(sortMenuSource, 'export const SortMenu', '</Menu>;')
        ]},
        {label: 'HTML', lines: [
          ...span(headerSrc, 'const sorted = rule?.column === columnName ? rule.direction : undefined;',
            'const sorted = rule?.column === columnName ? rule.direction : undefined;'), gap,
          ...span(headerSrc, 'aria-sort={sorted}', 'aria-sort={sorted}')
        ]}
      ]
    },
    {
      title: 'The rule is a drape, not a bake',
      want: 'The data keeps streaming under the sort, so the rule has to keep ruling.',
      says: ['Your first instinct is to bake: rank the seats once when the direction is ' +
        'chosen, store the result, move on. It even looks right, until the feed writes the ' +
        'next value and the table quietly stops being sorted. A sort applied once is stale by ' +
        'the next trade, and this data never stops trading.',
        'So the rule never rewrites the seats. It drapes over them: standing re-ranks on ' +
        'every render, and as values change underneath, your rows keep trading places to ' +
        'stay sorted. Bake and the sort is a moment; drape and it is a property. The overlay ' +
        'is the engine, not ceremony.'],
      code: [
        {label: 'JS', foil: true, lines: [
          plain('const ruled = (column, direction) =>'),
          plain('    setSeats(ranked(rows, seats, {column, direction}));'),
          aside('// ranked once, unsorted by the next trade')
        ]},
        {label: 'JS', lines: [
          ...unit(sortingSource, 'export const ranked'), gap,
          ...span(source, 'const standing = has(rule) ? ranked(rows, dealt, rule) : dealt;',
            'const standing = has(rule) ? ranked(rows, dealt, rule) : dealt;')
        ]}
      ]
    },
    ruled(motion, source),
    {
      title: 'A hand ends the rule',
      want: 'Manual order and ruled order cannot both own the table. The moment you drag a row, whose order is it?',
      says: ['Yours. Touch a row and the current standing bakes into the seats as the rule ' +
        'clears: the drape becomes the fabric, and your drag proceeds from exactly what you ' +
        'saw. Choosing "as dealt" clears the rule the other way: back to the seats as they ' +
        'stand, no drape at all.'],
      code: [
        {label: 'JS', lines: [
          ...unit(source, 'onLift={lifted => event => {')
        ]}
      ]
    },
    {
      title: 'The press never becomes a drag',
      want: 'The menu lives inside a draggable header, where an unguarded press on the toggle would lift the whole column.',
      says: ['Both the toggle and the menu stop pointer descent, so the header never hears ' +
        'your press. The toggle itself rides the header’s right edge, absolutely placed ' +
        'inside the cell, undressed of its button chrome. And the first column offers you no ' +
        'menu at all: it anchors the table, and the header only offers sorting from the ' +
        'second seat on.'],
      code: [
        {label: 'JS', lines: [
          ...span(menuSource, 'onPointerDown={event => event.stopPropagation()}',
            'onPointerDown={event => event.stopPropagation()}'),
          aside('// on the toggle and on the menu both')
        ]},
        {label: 'HTML', lines: [
          ...span(headerSrc, '{has(onRule) && position > 0 &&', '{has(onRule) && position > 0 &&')
        ]},
        {label: 'CSS', lines: [
          ...unit(headerCss, '.sortable .menu-toggle {')
        ]}
      ]
    }
  ];
};

type Props = {
  pace: Pace;
  origin: Origin;
  motion: Motion;
  onMotion: (motion: Motion) => void;
};

export const MenuRecipe: FC<Props> = ({pace, origin, motion, onMotion}) => {
  const dials = {
    motion: <PillGlider label="motion"
                        name="menu-motion"
                        options={[
                          {display: 'Animate', value: 'animated'},
                          {display: 'Static', value: 'static'}
                        ]}
                        chosen={motion}
                        onChoose={onMotion}/>
  };
  return <section aria-label="build the sort menu yourself" className="build-steps">
    <header className="brief-line">
      <h2 className="kicker">build the sort menu yourself</h2>
      <p className="brief">
        Seven steps on the chooser that rides every header: a native menu on the popover API,
        dressed as a card, one rule draped over live data, and the armistice that keeps a press
        from becoming a drag. Where there is a wrong way you would reach for first, it appears
        in a dashed frame before the real one. The marked step is carved from whichever of the eight
        tables the dials hold.
      </p>
    </header>
    <p className="lead">
      You want each column to offer its own sort: ascending, descending, or back to the deal.
      The stream keeps writing new values underneath, and you want choosing to feel like
      using a menu, not fighting one. The platform carries more of this than you might expect;
      the interesting parts are what the rule is, and when a hand outranks it.
    </p>
    <StepList steps={steps(pace, origin, motion)
      .map(({dial, ...step}) => ({...step, dial: dial && dials[dial]}))}/>
  </section>;
};
