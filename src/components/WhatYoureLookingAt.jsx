import React from 'react';

export default function WhatYoureLookingAt() {
  const points = [
    {
      step: '01',
      title: 'Doors that swing in perspective',
      description: 'Calculated vector perspective reveals realistic door depth, hinge clearances, and inner shelf layout without the weight of a 3D model.',
      highlight: 'Perspective & Depth',
    },
    {
      step: '02',
      title: 'Clothes that sway when a door opens',
      description: 'Subtle secondary physics give hung garments natural weight and momentum the moment moving doors stir the interior air.',
      highlight: 'Secondary Motion',
    },
    {
      step: '03',
      title: 'A light that turns night into morning',
      description: 'An integrated lighting switch shifts the scene from evening shadow into warm daylight, showcasing wood tones in every atmosphere.',
      highlight: 'Ambient Light',
    },
  ];

  return (
    <section className="section what-section" id="what-youre-looking-at" aria-labelledby="what-heading">
      <div className="section-container">
        
        <header className="section-header">
          <span className="section-eyebrow">Interaction in Detail</span>
          <h2 className="section-headline" id="what-heading">
            What you’re looking at
          </h2>
          <p className="section-intro">
            A vector-driven interactive scene crafted to capture the physical reality of finely made furniture.
          </p>
        </header>

        {/* 3-column clean row that stacks on mobile */}
        <div className="points-grid">
          {points.map((point) => (
            <article key={point.step} className="point-card">
              <div className="point-card-top">
                <span className="point-step">{point.step}</span>
                <span className="point-tag">{point.highlight}</span>
              </div>
              <h3 className="point-title">{point.title}</h3>
              <p className="point-description">{point.description}</p>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
