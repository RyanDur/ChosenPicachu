type Page = Pick<Window, 'document' | 'addEventListener'>;

// React can miss a move that Back undoes before it is drawn, leaving a gallery form showing words the address dropped,
// so the gallery's forms go back to what React last drew
export const galleryForms = (page: Page) => ({
  putBackOnBackAndForward: (): void => page.addEventListener('popstate', () =>
    page.document.querySelectorAll<HTMLFormElement>('.search-form, .page-control').forEach(form => form.reset()))
});
