import {screen} from '@testing-library/react';

const britishForms = new RegExp(`\\b(${[
  'behaviours?', 'behavioural', 'colours?', 'coloured', 'organis(e|es|ed|ing|ation|ations)', 'centres?', 'centred', 'centring',
  'licences?', 'defence', 'neighbours?', 'neighbouring', 'labelled', 'labelling', 'cancelled', 'cancelling', 'travelling',
  'travelled', 'recognis(e|es|ed|ing)', 'greys?', 'greyed', 'summaris(e|es|ed|ing)', 'honours?', 'favour(s|ed|ite|ites)?',
  'catalogu(e|es|ed|ing)', 'standardis(e|es|ed|ing|ation)', 'industrialis(e|ed|ation)', 'analys(e|es|ed|ing)', 'modell(ed|ing)', 'pencill(ed|ing)'
].join('|')})\\b`, 'gi');

const prose = (holder: Element): string => {
  const walker = document.createTreeWalker(holder, NodeFilter.SHOW_TEXT);
  const words: string[] = [];
  while (walker.nextNode()) {
    if (!walker.currentNode.parentElement?.closest('code, pre')) words.push(walker.currentNode.textContent ?? '');
  }
  return words.join('').replace(/“[^”]*”/g, ' ');
};

export const britishSpellingsIn = (holder: Element): string[] => prose(holder).match(britishForms) ?? [];

export const britishSpellingsOnThePage = (): string[] => britishSpellingsIn(screen.getByRole('main'));
