import React from 'react';

export default function BuiltForWood() {
  const crafts = [
    {
      title: 'European White Oak',
      detail: 'Selected for dense, interlocking grain and warm undertones that deepen naturally with time and daily touch.',
    },
    {
      title: 'Honest Finishes',
      detail: 'Treated with breathable natural matte oils rather than plasticizing lacquers, preserving the living texture of raw wood.',
    },
    {
      title: 'Quiet Cadence',
      detail: 'Doors weighted to swing with the calm, deliberate resistance of solid timber rather than hurried digital animations.',
    },
  ];

  return (
    <section className="section wood-section" id="built-for-wood" aria-labelledby="wood-heading">
      <div className="section-container">
        
        <header className="section-header">
          <span className="section-eyebrow">Craft & Material</span>
          <h2 className="section-headline" id="wood-heading">
            Built for wood
          </h2>
        </header>

        <div className="wood-story-wrapper">
          <div className="wood-story-narrative">
            <p className="narrative-lead">
              Solid wood furniture is meant to be touched. In a showroom, people run their fingertips across the beveled frame, test the glide of the door hinges, and listen for the quiet close of timber on timber.
            </p>
            <p className="narrative-body">
              Standard product photography flattens all of that physical honesty into static pixels. This interactive piece was designed from the grain up to honor the material: the warm honey tones of oiled oak, the depth of shadow inside the shelves, and the calm ritual of opening a wardrobe at the start of the day.
            </p>
          </div>

          <div className="wood-attributes-grid">
            {crafts.map((item, idx) => (
              <div key={idx} className="wood-attribute-card">
                <div className="attribute-grain-mark" aria-hidden="true" />
                <h3 className="attribute-title">{item.title}</h3>
                <p className="attribute-detail">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
