import React from 'react';

export default function ContactSection() {
  const emailRecipient = 'victorbarau3@gmail.com';
  const emailSubject = encodeURIComponent('Interactive wardrobe for our product page');
  const mailtoLink = `mailto:${emailRecipient}?subject=${emailSubject}`;
  const portfolioUrl = 'https://victorjohnmarkportfolio.vercel.app';

  return (
    <section className="section contact-section" id="contact" aria-labelledby="contact-heading">
      <div className="section-container contact-container">
        
        <div className="contact-box">
          <span className="section-eyebrow">Direct Collaboration</span>
          
          <h2 className="contact-headline" id="contact-heading">
            Want this for your range?
          </h2>

          <p className="contact-subline">
            Let’s bring tactile, lightweight interaction to your furniture collections.
          </p>

          <div className="contact-action">
            <a
              href={mailtoLink}
              className="contact-button"
              id="contact-email-btn"
              aria-label="Send email to Victor Johnmark about interactive wardrobe for your product page"
            >
              <span className="contact-button-icon" aria-hidden="true">✉</span>
              <span className="contact-button-text">victorbarau3@gmail.com</span>
            </a>
          </div>

          <div className="contact-portfolio-link">
            <a
              href={portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="portfolio-link"
              id="portfolio-external-link"
            >
              Explore more interactive work at victorjohnmarkportfolio.vercel.app
              <span className="link-arrow" aria-hidden="true"> →</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
