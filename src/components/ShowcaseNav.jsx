import React from 'react';

export default function ShowcaseNav({ currentPage, onNavigate }) {
  const routes = [
    {
      id: 'desk-lamp',
      path: '/',
      title: 'Desk Lamp',
      badge: 'Lamplight',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
        </svg>
      ),
    },
    {
      id: 'wardrobe',
      path: '/wardrobe',
      title: 'Oak Wardrobe',
      badge: 'Concept Pitch',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M12 3v18" />
          <path d="M9 10v4" />
          <path d="M15 10v4" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="showcase-nav-bar" aria-label="Showcase piece navigation">
      <div className="showcase-nav-pill">
        <span className="showcase-nav-label">Rive Showcase</span>
        <div className="showcase-nav-divider" aria-hidden="true" />
        
        <div className="showcase-nav-links">
          {routes.map((route) => {
            const isActive = currentPage === route.id;
            return (
              <a
                key={route.id}
                href={route.path}
                aria-current={isActive ? 'page' : undefined}
                className={`showcase-nav-button ${isActive ? 'is-active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(route.id);
                }}
              >
                <span className="showcase-button-icon">{route.icon}</span>
                <span className="showcase-button-text">{route.title}</span>
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
