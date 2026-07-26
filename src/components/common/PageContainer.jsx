/**
 * PageContainer
 *
 * Consistent max-width and padding wrapper used at the top level of every
 * page so spacing stays uniform without repeating layout classes.
 */
const PageContainer = ({ children }) => (
  <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
);

export default PageContainer;