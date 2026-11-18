// CSS can't read a script's string, so the sheets repeat this query; keep them in step. The whole query:
// BasePage.css, Banners.css, Feedback.css, Tabs.css, ZIndexDemo.css, GallerySettings.css, GalleryNav.css,
// PageControl.css, Home.css and typography.css. Its sideways half alone: BasePage.css, Gallery.css,
// PagePulledApart.css and typography.css. Its upright half alone: BasePage.css, Feedback.css, sortable-list.css,
// Recipe.css, Aggregations.css, Tutorials.css, Record.css, UsersPage.css and surface.css
export const phoneQuery = '(width <= 600px), (width <= 1100px) and (height <= 600px)';
