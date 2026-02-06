// Shopping Clock: receipt length / checkout pressure
registerSketch('sk4', function (p) {
  const W = 800;
  const H = 500;

  p.setup = function () {
    p.createCanvas(W, H);
    p.textFont('Courier New'); // receipt vibe
  };

  p.draw = function () {
    const h = p.hour();
    const m = p.minute();
    const s = p.second();

    // Hours: subtle “pressure” tint over the day
    const pressure = p.map(h, 0, 23, 0, 1);
    p.background(
      p.lerp(250, 255, pressure),
      p.lerp(250, 230, pressure),
      p.lerp(250, 220, pressure)
    );

    // Title
    p.noStroke();
    p.fill(20);
    p.textSize(22);
    p.textAlign(p.LEFT, p.TOP);
    p.text('Receipt Clock', 24, 20);

    // Receipt panel
    const rx = 240;
    const ry = 80;
    const rw = 320;
    const rh = 380;

    // Paper
    p.fill(255);
    p.stroke(200);
    p.strokeWeight(2);
    p.rect(rx, ry, rw, rh, 10);

    // Jagged tear bottom
    p.noStroke();
    p.fill(245);
    for (let i = 0; i < 18; i++) {
      const x = rx + i * (rw / 18);
      const y = ry + rh + (i % 2 === 0 ? 10 : 2);
      p.triangle(x, ry + rh, x + (rw / 18), ry + rh, x + (rw / 36), y);
    }

    // Minutes: number of items printed
    const maxItems = 24;
    const itemCount = 1 + Math.floor(p.map(m, 0, 59, 1, maxItems));

    // Fake “total” grows with minutes (just for feel)
    const subtotal = p.map(m, 0, 59, 5, 160);
    const tax = subtotal * (0.06 + 0.04 * pressure);
    const total = subtotal + tax;

    // Print area
    const pad = 18;
    const left = rx + pad;
    const top = ry + pad + 10;

    p.fill(30);
    p.textSize(14);
    p.text('STORE', left, top - 10);

    // draw item lines
    const lineH = 14;
    const startY = top + 16;
    for (let i = 0; i < itemCount; i++) {
      const y = startY + i * lineH;

      // Stop if we overflow the receipt
      if (y > ry + rh - 70) break;

      const price = (1.5 + (i % 7) * 0.75) + (m / 59) * 1.2;
      const label = `ITEM ${String(i + 1).padStart(2, '0')}`;
      const priceStr = `$${price.toFixed(2)}`;

      p.text(label, left, y);
      p.textAlign(p.RIGHT, p.BASELINE);
      p.text(priceStr, rx + rw - pad, y);
      p.textAlign(p.LEFT, p.BASELINE);
    }

    // Separator
    const sepY = ry + rh - 82;
    p.stroke(220);
    p.strokeWeight(2);
    p.line(left, sepY, rx + rw - pad, sepY);

    // Totals
    p.noStroke();
    p.fill(30);
    p.textAlign(p.LEFT, p.BASELINE);
    p.text(`SUBTOTAL`, left, sepY + 22);
    p.textAlign(p.RIGHT, p.BASELINE);
    p.text(`$${subtotal.toFixed(2)}`, rx + rw - pad, sepY + 22);

    p.textAlign(p.LEFT, p.BASELINE);
    p.text(`TAX`, left, sepY + 38);
    p.textAlign(p.RIGHT, p.BASELINE);
    p.text(`$${tax.toFixed(2)}`, rx + rw - pad, sepY + 38);

    p.textAlign(p.LEFT, p.BASELINE);
    p.text(`TOTAL`, left, sepY + 58);
    p.textAlign(p.RIGHT, p.BASELINE);
    p.text(`$${total.toFixed(2)}`, rx + rw - pad, sepY + 58);

    // Seconds: blinking “printer cursor” at the current print position
    const cursorOn = (s % 2 === 0);
    const cursorY = startY + Math.min(itemCount - 1, maxItems - 1) * lineH + 10;
    if (cursorOn) {
      p.noStroke();
      p.fill(20, 120, 220);
      p.rect(left, Math.min(cursorY, ry + rh - 90), 14, 3);
    }

    // Legend (short + human)
    p.fill(20);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(15);
    p.text('Minutes = receipt length (items printed)', 24, H - 75);
    p.textSize(13);
    p.text('Seconds = blinking printer cursor', 24, H - 52);
    p.text('Hours = overall pressure tint + tax rate', 24, H - 32);

    // Small timestamp
    p.fill(30);
    p.textAlign(p.RIGHT, p.TOP);
    p.textSize(13);
    p.text(`Hour ${h} · Minute ${m} · Second ${s}`, W - 24, 24);
  };
});
