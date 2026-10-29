import React from 'react';

export default function WhyItWorks() {
  const benefits = [
    {
      num: '01',
      title: 'More time on page',
      description: 'When shoppers can open doors, inspect internal shelves, and toggle the morning lamp, passive scrolling turns into curious, hands-on exploration.',
      tag: 'Engagement',
    },
    {
      num: '02',
      title: 'A product people want to share',
      description: 'Delightful, tactile digital craftsmanship stands apart from flat catalog photos, making the listing something visitors bookmark and show friends.',
      tag: 'Memorability',
    },
    {
      num: '03',
      title: 'One lightweight file',
      description: 'Around the size of a single photo, running natively on both web and mobile without the battery drain, slow loads, or complexity of 3D engines.',
      tag: 'Performance',
    },
  ];

  return (
    <section className="section why-section" id="why-it-works" aria-labelledby="why-heading">
      <div className="section-container">
        
        <header className="section-header">
          <span className="section-eyebrow">On The Product Page</span>
          <h2 className="section-headline" id="why-heading">
            Why it works on a product page
          </h2>
          <p className="section-intro">
            Interactive detail that earns its place without slowing down your e-commerce storefront.
          </p>
        </header>

        <div className="benefits-grid">
          {benefits.map((benefit) => (
            <div key={benefit.num} className="benefit-card">
              <div className="benefit-header">
                <span className="benefit-index">{benefit.num}</span>
                <span className="benefit-pill">{benefit.tag}</span>
              </div>
              <h3 className="benefit-title">{benefit.title}</h3>
              <p className="benefit-text">{benefit.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
