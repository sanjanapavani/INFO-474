const fs = require('fs');

const path = 'index.html';
let html = fs.readFileSync(path, 'utf8');

const narrativeA = `
<div class="sketch-narrative" aria-labelledby="sk2-narrative-title">
  <h3 id="sk2-narrative-title">Sketch narrative</h3>
  <p><strong>Context</strong><br>
  This sketch is for everyday shoppers and represents the passage of time during a grocery run. It frames time as a feeling of accumulation and urgency rather than precise numbers.</p>

  <p><strong>Design decisions</strong><br>
  Minutes are mapped to the cart fill level because items naturally accumulate over time and are easy to read visually. Seconds are shown as a moving scan line and bouncing items to represent constant activity. Hours affect the background color, shifting from calm to warmer tones to suggest increasing pressure throughout the day.</p>

  <p><strong>Future work</strong><br>
  Future improvements could include interaction to simulate different shopping speeds or adding item categories that change based on time of day.</p>
</div>
`;

const narrativeB = `
<div class="sketch-narrative" aria-labelledby="sk3-narrative-title">
  <h3 id="sk3-narrative-title">Sketch narrative</h3>
  <p><strong>Context</strong><br>
  This sketch represents wandering through grocery store aisles and is meant for exploratory shopping situations where time feels nonlinear.</p>

  <p><strong>Design decisions</strong><br>
  Minutes control how far along the aisle path the user has traveled, emphasizing distance rather than completion. Seconds are shown as a moving scanner dot inspired by barcode scanning. Hours determine the number of aisle turns, creating larger structural changes over time.</p>

  <p><strong>Future work</strong><br>
  This could be extended by animating the path drawing progressively or adding aisle labels and subtle sound cues.</p>
</div>
`;

const narrativeC = `
<div class="sketch-narrative" aria-labelledby="sk4-narrative-title">
  <h3 id="sk4-narrative-title">Sketch narrative</h3>
  <p><strong>Context</strong><br>
  This sketch visualizes time through a checkout receipt metaphor, focusing on completion and end-of-task moments.</p>

  <p><strong>Design decisions</strong><br>
  Minutes determine the receipt length, representing how longer shopping sessions produce longer receipts. Seconds appear as a blinking printer cursor to mimic printing rhythm. Hours influence the background tint and pricing pressure to suggest end-of-day checkout stress.</p>

  <p><strong>Future work</strong><br>
  Future versions could animate the receipt feeding downward or vary item prices and tax rates based on the hour.</p>
</div>
`;

// 1) Replace the placeholder narrative block in tab2
html = html.replace(
  /<div class="sketch-narrative"[\s\S]*?<\/div>\s*\n\s*<h3>Sketch evolution<\/h3>/m,
  narrativeA + '\n\n        <h3>Sketch evolution</h3>'
);

// 2) Add narrative+evolution structure to tab3 if missing
if (!html.includes('id="sketch-drawing-sk3"')) {
  html = html.replace(
    /<section id="tab3" class="tab-content" role="tabpanel">\s*<div id="sketch-container-sk3" class="sketch-container"><\/div>\s*<\/section>/m,
`<section id="tab3" class="tab-content" role="tabpanel">
  <div id="sketch-container-sk3" class="sketch-container"></div>
  <div id="sketch-drawing-sk3" class="sketch-evolution">
    ${narrativeB}

    <h3>Sketch evolution</h3>
    <p class="small-note">Replace <b>these images</b> with your own sketch evolution images.</p>
    <figure>
      <figcaption>Step 1 — initial layout and annotated design decisions</figcaption>
    </figure>
    <figure>
      <figcaption>Step 2 — second layout after peer feedback</figcaption>
    </figure>
    <figure>
      <figcaption>Step 3 — refined visuals and annotations</figcaption>
    </figure>
  </div>
</section>`
  );
}

// 3) Add narrative+evolution structure to tab4 if missing
if (!html.includes('id="sketch-drawing-sk4"')) {
  html = html.replace(
    /<section id="tab4" class="tab-content" role="tabpanel">\s*<div id="sketch-container-sk4" class="sketch-container"><\/div>\s*<\/section>/m,
`<section id="tab4" class="tab-content" role="tabpanel">
  <div id="sketch-container-sk4" class="sketch-container"></div>
  <div id="sketch-drawing-sk4" class="sketch-evolution">
    ${narrativeC}

    <h3>Sketch evolution</h3>
    <p class="small-note">Replace <b>these images</b> with your own sketch evolution images.</p>
    <figure>
      <figcaption>Step 1 — initial layout and annotated design decisions</figcaption>
    </figure>
    <figure>
      <figcaption>Step 2 — second layout after peer feedback</figcaption>
    </figure>
    <figure>
      <figcaption>Step 3 — refined visuals and annotations</figcaption>
    </figure>
  </div>
</section>`
  );
}

fs.writeFileSync(path, html, 'utf8');
console.log('✅ Patched narratives into tab2/tab3/tab4');
