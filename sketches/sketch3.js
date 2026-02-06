// Shopping Clock: aisle path / wandering
registerSketch('sk3', function (p) {
  const W = 800;
  const H = 500;

  p.setup = function () {
    p.createCanvas(W, H);
    p.textFont('Arial');
  };

  p.draw = function () {
    p.background(248);

    const h = p.hour();
    const m = p.minute();
    const s = p.second();

    // Header
    p.noStroke();
    p.fill(20);
    p.textSize(22);
    p.textAlign(p.LEFT, p.TOP);
    p.text('Aisle Path Clock', 24, 20);

    // Hours decide how "many sections" you end up wandering through (1–6 turns)
    const turns = 1 + Math.floor(p.map(h, 0, 23, 1, 6.99));

    // Minutes decide how much of the path is completed (0..1)
    const progress = m / 59;

    // Build a zig-zag path across aisles
    const margin = 90;
    const top = 90;
    const bottom = H - 90;
    const left = margin;
    const right = W - margin;

    const points = [];
    const step = (right - left) / (turns + 1);

    for (let i = 0; i < turns + 2; i++) {
      const x = left + i * step;
      const y = (i % 2 === 0) ? top : bottom;
      points.push({ x, y });
    }

    // Draw full path (light)
    p.stroke(200);
    p.strokeWeight(10);
    p.noFill();
    for (let i = 0; i < points.length - 1; i++) {
      p.line(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
    }

    // Draw progressed path (minutes)
    const totalLen = pathLength(points);
    const targetLen = totalLen * progress;

    p.stroke(70, 160, 120);
    p.strokeWeight(10);
    drawPathUpTo(points, targetLen);

    // Seconds = moving "scanner dot" along the progressed portion (or along full path if you want)
    const scanLen = (totalLen * (s / 59)) * 0.95; // 0..~totalLen
    const scanPos = pointAtLength(points, scanLen);

    p.noStroke();
    p.fill(20, 120, 220);
    p.circle(scanPos.x, scanPos.y, 18);

    // Little “aisle shelves” as context markers
    drawShelves(points);

    // Legend (short, human)
    p.fill(20);
    p.textSize(15);
    p.text('Minutes = how far you’ve wandered', 24, H - 75);
    p.textSize(13);
    p.text('Seconds = scanner dot moving', 24, H - 52);
    p.text('Hours = number of aisle turns', 24, H - 32);

    // Optional small timestamp
    p.fill(30);
    p.textSize(13);
    p.text(`Hour ${h} · Minute ${m} · Second ${s}`, W - 240, 24);
  };

  function drawShelves(points) {
    p.noStroke();
    p.fill(230);
    for (let i = 0; i < points.length; i++) {
      // small shelf blocks near each node
      const px = points[i].x;
      const py = points[i].y;
      const offset = (i % 2 === 0) ? -28 : 28;
      p.rect(px - 22, py + offset - 10, 44, 20, 6);
    }
  }

  function pathLength(points) {
    let len = 0;
    for (let i = 0; i < points.length - 1; i++) {
      len += dist(points[i], points[i + 1]);
    }
    return len;
  }

  function dist(a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function drawPathUpTo(points, targetLen) {
    let drawn = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i];
      const b = points[i + 1];
      const segLen = dist(a, b);

      if (drawn + segLen <= targetLen) {
        p.line(a.x, a.y, b.x, b.y);
        drawn += segLen;
      } else {
        const remaining = targetLen - drawn;
        const t = Math.max(0, Math.min(1, remaining / segLen));
        const x = a.x + (b.x - a.x) * t;
        const y = a.y + (b.y - a.y) * t;
        p.line(a.x, a.y, x, y);
        return;
      }
    }
  }

  function pointAtLength(points, targetLen) {
    let walked = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i];
      const b = points[i + 1];
      const segLen = dist(a, b);

      if (walked + segLen >= targetLen) {
        const t = (targetLen - walked) / segLen;
        return {
          x: a.x + (b.x - a.x) * t,
          y: a.y + (b.y - a.y) * t
        };
      }
      walked += segLen;
    }
    // fallback end
    return points[points.length - 1];
  }
});