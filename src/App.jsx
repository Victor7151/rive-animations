import React, { Suspense, lazy, useEffect, useState } from 'react';
import ShowcaseNav from './components/ShowcaseNav.jsx';

const DeskLampPage = lazy(() => import('./pages/DeskLampPage.jsx'));
const WardrobePage = lazy(() => import('./pages/WardrobePage.jsx'));

/*
 * Tiny dependency-free router.
 * "/"          -> Desk lamp (the original Lamplight site)
 * "/wardrobe"  -> Interactive oak wardrobe pitch
 */
const PAGES = {
  'desk-lamp': {
    path: '/',
    title: 'Lamplight — A Nightly Ritual for Readers',
    Component: DeskLampPage,
  },
  wardrobe: {
    path: '/wardrobe',
    title: 'A Concept Piece — Interactive Oak Wardrobe for Product Pages',
    Component: WardrobePage,
  },
};

function pageFromPath(pathname) {
  const clean = pathname.replace(/\/+$/, '') || '/';
  return clean === '/wardrobe' ? 'wardrobe' : 'desk-lamp';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => pageFromPath(window.location.pathname));

  // Keep in sync with browser back/forward
  useEffect(() => {
    const onPopState = () => setCurrentPage(pageFromPath(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Per-page document title
  useEffect(() => {
    document.title = PAGES[currentPage].title;
  }, [currentPage]);

  const navigate = (pageId) => {
    if (pageId === currentPage) return;
    window.history.pushState({}, '', PAGES[pageId].path);
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const { Component } = PAGES[currentPage];

  return (
    <>
      <Suspense fallback={<div className="page-loading-skeleton" />}>
        {/* key forces a clean mount so each Rive instance is torn down between pages */}
        <Component key={currentPage} />
      </Suspense>
      {/* Spacer so the floating switcher never covers the footer */}
      <div
        className="showcase-nav-spacer"
        style={{ background: currentPage === 'desk-lamp' ? '#080C10' : 'transparent' }}
        aria-hidden="true"
      />
      <ShowcaseNav currentPage={currentPage} onNavigate={navigate} />
    </>
  );
}
