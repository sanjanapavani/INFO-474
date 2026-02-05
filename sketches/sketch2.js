// Shopping Clock: cart fills up as time passes
registerSketch('sk2', function (p) {
  const W = 800;
  const H = 500;

  p.setup = function () {
    p.createCanvas(W, H);
    p.textFont('Arial');
  };

  p.draw = function () {
    const h = p.hour();
    const m = p.minute();
    const s = p.second();

    // Background shifts over the day (calmer earlier, more urgent later)
    const urgency = p.map(h, 0, 23, 0, 1);
    const topCol = p.lerpColor(p.color(235, 245, 255), p.color(255, 230, 225), urgency);
    const bottomCol = p.lerpColor(p.color(255, 255, 255), p.color(255, 210, 200), urgency);
    drawGradient(topCol, bottomCol);

    p.fill(20);
    p.textSize(22);
    p.textAlign(p.LEFT, p.TOP);
    p.text('Shopping Cart Clock', 24, 20);

    // Minutes control how full the cart looks
    drawCart(m / 59, s);

    // Small timestamp (helps with readability/testing)
    p.textSize(14);
    p.fill(30);
    p.text(`Hour ${h} · Minute ${m} · Second ${s}`, 24, H - 24);
  };

  function drawCart(fillPct, s) {
    const x = 120;
    const y = 110;
    const w = 560;
    const h = 260;

    // Cart outline + wheels
    p.stroke(30);
    p.strokeWeight(3);
    p.noFill();
    p.rect(x, y, w, h, 18);
    p.line(x + 40, y, x - 20, y - 60);
    p.line(x - 20, y - 60, x + 40, y - 60);

    p.noStroke();
    p.fill(40);
    p.circle(x + 120, y + h + 30, 28);
    p.circle(x + w - 120, y + h + 30, 28);

    const pad = 16;
    const ix = x + pad;
    const iy = y + pad;
    const iw = w - pad * 2;
    const ih = h - pad * 2;

    // Inside of cart
    p.fill(255, 255, 255, 190);
    p.rect(ix, iy, iw, ih, 12);

    // Fill rises as minutes increase
    const filledH = ih * fillPct;
    p.fill(80, 160, 120, 210);
    p.rect(ix, iy + (ih - filledH), iw, filledH, 12);

    // Seconds show up as a scan line moving through the cart
    const scanY = p.map(s, 0, 59, iy + ih, iy);
    p.stroke(20, 120, 220, 180);
    p.strokeWeight(4);
    p.line(ix, scanY, ix + iw, scanY);

    // Little “items” bounce near the top of the fill
    p.noStroke();
    for (let i = 0; i < 6; i++) {
      const bx = ix + (i + 0.5) * (iw / 6);
      const by = iy + (ih - filledH) - 14 + 6 * p.sin(p.radians(s * 6 + i * 40));
      p.fill(240, 200, 80);
      p.rect(bx - 18, by, 36, 22, 6);
    }

    // Quick legend (so it’s obvious how to read it)
    p.fill(20);
    p.noStroke();
    p.textSize(15);
    p.text('Minutes = fill level', x, y + h + 80);
    p.textSize(13);
    p.text('Seconds = scan line + bounce', x, y + h + 102);
    p.text('Hours = background shift', x, y + h + 122);
  }

  function drawGradient(topC, bottomC) {
    p.noStroke();
    for (let y = 0; y < H; y++) {
      const t = y / (H - 1);
      p.fill(p.lerpColor(topC, bottomC, t));
      p.rect(0, y, W, 1);
    }
  }
});