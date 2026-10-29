import React from 'react';

export default function Footer() {
  const portfolioUrl = 'https://victorjohnmarkportfolio.vercel.app';

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="section-container footer-container">
        <p className="footer-disclaimer">
          An unofficial concept piece. Not affiliated with, or endorsed by, any furniture brand.
        </p>
        <p className="footer-credit">
          Built by{' '}
          <a
            href={portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-author-link"
          >
            Victor Johnmark
          </a>
        </p>
      </div>
    </footer>
  );
}
