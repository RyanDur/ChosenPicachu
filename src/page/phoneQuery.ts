// CSS can't read a script's string, so the sheets repeat this query; keep them in step. The whole query:
// BasePage.css, Banners.css, Feedback.css, Tabs.css, TabPager.css, DemosPage.css, ZIndexDemo.css, ArtGalleryPage.css,
// GallerySettings.css, GalleryNav.css, PageControl.css, Home.css, placement.css, surface.css and typography.css. Its
// sideways half alone: BasePage.css, DemosPage.css, Gallery.css, GallerySettings.css, Home.css and
// typography.css. Its upright half alone: BasePage.css, Feedback.css, sortable-list.css, Recipe.css, Aggregations.css,
// Tutorials.css, Record.css, UsersPage.css and surface.css
export const phoneQuery = '(width <= 600px), (width <= 1100px) and (height <= 600px)';
