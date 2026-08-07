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
    want: 'Choosing a direction reorders every row at once — on the animated table, each row deserves to be drawn sliding from where it was.',
    says: ['The animated table’s ruled handler measures the seats before the rule lands — the ' +
      'menu click’s own event reaches the table element — and marks every moved row with its ' +
      'old offset. The same shifted theater the drags use plays for the sort; the rule itself ' +
      'is one state update at the end.'],
    code: [
      {label: 'JS', lines: [
        ...unit(source, 'const ruled = ')
      ]}
    ]
  }
  : {
    title: 'Rule directly',
    dial: 'motion',
    want: 'Motion is not free, and a sort reorders everything at once — the static table answers a menu click with nothing but the rule.',
    says: ['This is the static table: ruled sets the rule and nothing else exists in the file. ' +
      'The rows cut to their ranked seats on the next frame.'],
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
      want: 'A sort chooser needs a popup, and popups built from divs re-invent focus, dismissal, and stacking — badly.',
      says: ['The platform ships the whole apparatus. The toggle is a button whose popoverTarget ' +
        'names a real menu element; popover="auto" gives open, close, light-dismiss, and the ' +
        'top layer for free — no portal, no z-index war, no click-outside listener.',
        'Placement is CSS speaking its newest dialect. A popover defaults to inset: 0 and ' +
        'centers itself, so the first move is inset: auto — hand placement back. Then ' +
        'position-area reads like a compass bearing: block-end (below the invoker), ' +
        'span-inline-start (spreading toward the leading edge). When there is no room below, ' +
        'position-try-fallbacks flips the whole thing above. No measuring, no JavaScript.',
        'Engines that have popovers but not anchor positioning get the @supports fallback: a ' +
        'centered popover. Worse placement, same menu — the feature degrades, the function ' +
        'does not.'],
      code: [
        {label: 'HTML', lines: [
          ...span(menuSource, '<button type="button"', 'aria-label={label}>{toggle}</button>'), gap,
          ...span(menuSource, '<menu id={id}', '</menu>')
        ]},
        {label: 'CSS', lines: [
          ...span(menuCss, 'inset: auto;', 'inset: auto;'),
          aside('/* a popover defaults to inset: 0, centered — take placement back */'), gap,
          ...span(menuCss, 'position-area: block-end span-inline-start;', 'position-try-fallbacks: flip-block;'),
          aside('/* below the invoker, spreading leading; flips above when cramped */'), gap,
          ...unit(menuCss, '@supports not (position-area: block-end)'),
          aside('/* no anchor positioning? centered — worse placement, same menu */')
        ]}
      ]
    },
    {
      title: 'Dress the menu as a card',
      want: 'A list of buttons reads as chrome until it wears the site’s card language — and rounded corners are unforgiving about what happens inside them.',
      says: ['The body is a card: fixed width, paper, the floating shadow. Each item is a button ' +
        'stripped to a full-width row — press glows, hover and focus draw the ring.',
        'The geometry is where the care shows. Hairlines go between neighbours, so ' +
        'li:not(:last-child) — a line after the last item would double the card’s own edge. ' +
        'And only the first and last items get corner radii, top and bottom pairs ' +
        'respectively, so a hovered item’s ring follows the card’s rounded corners instead of ' +
        'poking square through them.'],
      code: [
        {label: 'CSS', lines: [
          ...span(menuCss, 'margin: 0;', 'box-shadow: var(--base-box-shadow);'),
          aside('/* the card body */'), gap,
          ...unit(menuCss, '.item {'),
          aside('/* a button stripped to a row; press glows, hover rings */'), gap,
          ...span(menuCss, 'li:not(:last-child) .item {', '}'),
          aside('/* hairlines between neighbours — never after the last */'), gap,
          ...span(menuCss, 'li:first-child .item {', '}'), gap,
          ...span(menuCss, 'li:last-child .item {', '}'),
          aside('/* radii only where the card’s corners are */')
        ]}
      ]
    },
    {
      title: 'The glyph is the state',
      want: 'A sorted column must say so — to the eye and to assistive tech — without a second source of truth appearing anywhere.',
      says: ['Everything derives from the one rule. The header compares itself against it: the ' +
        'toggle wears the direction’s glyph, and the th announces aria-sort from the same ' +
        'comparison. SortMenu is the whole chooser — three buttons naming the three choices, ' +
        'reporting which column asked for what.'],
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
      want: 'The data keeps streaming, and a sort applied once is stale by the next trade — the rule has to keep ruling.',
      says: ['The rule never rewrites the seats. It drapes over them: standing re-ranks on every ' +
        'render, so as values change under a live feed, rows keep trading places to stay ' +
        'sorted. Bake the sort into the seats and the sorting stops the moment you click — ' +
        'the overlay is the engine, not ceremony.'],
      code: [
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
      want: 'Manual order and ruled order cannot both own the table — the moment you drag a row, whose order is it?',
      says: ['Yours. Touching a row bakes the current standing into the seats and clears the ' +
        'rule — the drape becomes the fabric, and your drag proceeds from exactly what you ' +
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
      want: 'The menu lives inside a draggable header — an unguarded press on the toggle would lift the whole column.',
      says: ['Both the toggle and the menu stop pointer descent, so the header never hears the ' +
        'press. The toggle itself rides the header’s right edge — absolutely placed inside the ' +
        'cell, undressed of its button chrome. And the first column has no menu at all — it ' +
        'anchors the table, and the header only offers sorting from the second seat on.'],
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
        from becoming a drag. The marked step is carved from whichever of the eight tables the
        dials hold.
      </p>
    </header>
    <p className="lead">
      You want each column to offer its own sort — ascending, descending, or back to the deal —
      while the stream keeps writing new values underneath, and you want choosing to feel like
      using a menu, not fighting one. The platform carries more of this than you might expect;
      the interesting parts are what the rule is, and when a hand outranks it.
    </p>
    <StepList steps={steps(pace, origin, motion)
      .map(({dial, ...step}) => ({...step, dial: dial && dials[dial]}))}/>
  </section>;
};
