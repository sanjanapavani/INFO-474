registerSketch('sk15', function(p) {
  const companies = [
    { name: "Amazon",     total: 18150, pct: 5  },
    { name: "Meta",       total: 11000, pct: 13 },
    { name: "Google",     total: 12000, pct: 6  },
    { name: "Microsoft",  total: 10000, pct: 5  },
    { name: "Salesforce", total: 8000,  pct: 10 },
    { name: "Twitter/X",  total: 6000,  pct: 75 },
    { name: "Lyft",       total: 1700,  pct: 26 },
    { name: "Spotify",    total: 1500,  pct: 17 },
    { name: "Snap",       total: 1300,  pct: 20 },
    { name: "Stripe",     total: 1100,  pct: 14 },
  ];
  const timelineData = [
    {month:"Jan'20",val:0.5},{month:"Apr'20",val:2.1},{month:"Jul'20",val:1.8},{month:"Oct'20",val:1.2},
    {month:"Jan'21",val:0.8},{month:"Apr'21",val:0.6},{month:"Jul'21",val:0.4},{month:"Oct'21",val:0.9},
    {month:"Jan'22",val:3.2},{month:"Apr'22",val:8.5},{month:"Jul'22",val:18.4},{month:"Oct'22",val:32.1},
    {month:"Jan'23",val:55.2},{month:"Apr'23",val:38.6},{month:"Jul'23",val:22.3},{month:"Oct'23",val:15.4},
    {month:"Jan'24",val:28.1},{month:"Apr'24",val:12.2},{month:"Jul'24",val:8.6},{month:"Oct'24",val:5.3},
  ];
  const companyTimelines = {
    "Amazon":    [0,0,0,0,0,0,0,0,1,2,3,4,18,5,2,1,3,2,1,0],
    "Meta":      [0,0,0,0,0,0,0,0,0,0,1,2,11,3,1,0,2,1,0,0],
    "Google":    [0,0,0,0,0,0,0,0,0,1,2,3,12,4,2,1,4,2,1,0],
    "Microsoft": [0,0,0,0,0,0,0,0,1,1,2,3,10,3,1,1,2,1,1,0],
    "Salesforce":[0,0,0,0,0,0,0,0,0,0,1,2,8,2,1,0,1,1,0,0],
    "Twitter/X": [0,0,0,0,0,0,0,0,0,0,0,1,6,0,0,0,0,0,0,0],
    "Lyft":      [0,0,0,0,0,0,0,0,0,0,0,1,1.7,0,0,0,0,0,0,0],
    "Spotify":   [0,0,0,0,0,0,0,0,0,0,0,0,0,1.5,0,0,0.5,0,0,0],
    "Snap":      [0,0,0,0,0,0,0,0,0,0,0,0.5,1.3,0,0,0,0,0,0,0],
    "Stripe":    [0,0,0,0,0,0,0,0,0,0,0,0,1.1,0,0,0,0,0,0,0],
  };
  let sel=null, anim=0;
  let barA=companies.map(()=>0);
  let tipPt=null;
  const W=900, H=700, PAD=36;
  const TL={x:PAD,y:160,w:480,h:300};
  const BC={x:510,y:160,w:354,h:300};

  p.setup=function(){
    p.createCanvas(W,H);
    p.textFont('monospace');
  };

  p.draw=function(){
    anim=p.min(anim+0.018,1);
    barA=barA.map((_,i)=>p.min(p.max(0,(anim-i*0.06)/0.7),1));
    p.background(13,13,13);
    p.stroke(22,22,22);p.strokeWeight(1);
    for(let x=0;x<W;x+=32)p.line(x,0,x,H);
    for(let y=0;y<H;y+=32)p.line(0,y,W,y);
    p.noStroke();p.fill(210,38,38);p.rect(0,0,W,5);
    drawHeader();tipPt=null;drawTimeline();drawBars();drawLegend();drawFooter();
    if(tipPt)drawTip(tipPt);
  };

  function drawHeader(){
    p.noStroke();p.fill(255);p.textSize(42);p.textAlign(p.LEFT,p.TOP);
    p.text("The Great Tech",PAD,28);
    p.fill(210,38,38);p.text("Correction",PAD,76);
    p.fill(110,110,110);p.textSize(12);
    p.text("500,000+ jobs lost  2020-2024  Source: layoffs.fyi",PAD,130);
    p.fill(70,70,70);p.textSize(10);
    p.text("LAYOFFS OVER TIME (thousands)",TL.x,TL.y-14);
    p.text("TOP COMPANIES - click to filter",BC.x,BC.y-14);
    p.stroke(35,35,35);p.strokeWeight(1);p.line(PAD,TL.y-4,W-PAD,TL.y-4);
  }

  function drawTimeline(){
    const raw=sel?companyTimelines[sel].map((v,i)=>({month:timelineData[i].month,val:v})):timelineData;
    const mx=Math.max(...raw.map(d=>d.val),1);
    p.noStroke();p.fill(18,18,18);p.rect(TL.x,TL.y,TL.w,TL.h,3);
    const iX=TL.x+48,iW=TL.w-60,iY=TL.y+16,iH=TL.h-40;
    for(let i=0;i<=4;i++){
      const yy=iY+iH-(i/4)*iH;
      p.stroke(32,32,32);p.strokeWeight(1);p.line(iX,yy,iX+iW,yy);
      p.noStroke();p.fill(55,55,55);p.textSize(9);p.textAlign(p.RIGHT);
      p.text(sel?(i/4*mx).toFixed(1)+"k":Math.round(i/4*mx)+"k",iX-4,yy+4);
    }
    const pts=raw.map((d,i)=>({
      x:iX+(i/(raw.length-1))*iW,
      y:iY+iH-(d.val/mx)*iH*anim,
      val:d.val,month:d.month
    }));
    p.noStroke();p.fill(210,38,38,20);
    p.beginShape();p.vertex(pts[0].x,iY+iH);
    pts.forEach(pt=>p.vertex(pt.x,pt.y));
    p.vertex(pts[pts.length-1].x,iY+iH);p.endShape(p.CLOSE);
    for(let i=0;i<pts.length-1;i++){
      p.stroke(p.lerp(140,255,i/(pts.length-1)),30,35);p.strokeWeight(2);
      p.line(pts[i].x,pts[i].y,pts[i+1].x,pts[i+1].y);
    }
    if(pts[12]&&anim>0.65){
      const al=p.map(anim,0.65,1,0,255),pk=pts[12];
      p.noStroke();p.fill(255,70,70,al);p.ellipse(pk.x,pk.y,10,10);
      p.stroke(255,70,70,al*0.5);p.strokeWeight(1);p.line(pk.x+6,pk.y-6,pk.x+22,pk.y-22);
      p.noStroke();p.fill(255,70,70,al);p.textSize(10);p.textAlign(p.LEFT);
      p.text("JAN '23 PEAK",pk.x+24,pk.y-24);
      p.fill(100,100,100,al);p.textSize(9);p.text("55k+ laid off",pk.x+24,pk.y-12);
    }
    pts.forEach(pt=>{
      const nr=p.dist(p.mouseX,p.mouseY,pt.x,pt.y)<12;
      p.noStroke();
      if(nr){p.fill(255,80,80);p.ellipse(pt.x,pt.y,11,11);tipPt=pt;}
      else{p.fill(140,30,30);p.ellipse(pt.x,pt.y,5,5);}
    });
    p.noStroke();p.fill(55,55,55);p.textSize(9);p.textAlign(p.CENTER);
    ["2020","2021","2022","2023","2024"].forEach((yr,i)=>{
      p.text(yr,iX+(i*4/(raw.length-1))*iW,iY+iH+14);
    });
    if(sel){p.noStroke();p.fill(210,38,38);p.textSize(10);p.textAlign(p.LEFT);
      p.text("filtered: "+sel+" (click again to reset)",TL.x+4,TL.y+TL.h-6);}
  }

  function drawBars(){
    const mx=Math.max(...companies.map(c=>c.total));
    p.noStroke();p.fill(18,18,18);p.rect(BC.x,BC.y,BC.w,BC.h,3);
    const iX=BC.x+BC.w*0.30,iW=BC.w*0.50,gap=(BC.h-16)/companies.length,bH=Math.max(10,gap*0.60);
    companies.forEach((co,i)=>{
      const yy=BC.y+10+i*gap,bw=(co.total/mx)*iW*barA[i];
      const isSel=sel===co.name;
      const isHov=p.mouseX>=iX&&p.mouseX<=BC.x+BC.w&&p.mouseY>=yy&&p.mouseY<=yy+bH;
      const br=p.map(p.constrain(co.pct,0,100),0,100,0.22,1.0);
      p.noStroke();p.fill(24,24,24);p.rect(iX,yy,iW,bH,2);
      if(isSel)p.fill(255,255,255);
      else if(isHov)p.fill(255,100,55);
      else p.fill(255*br,38*br*0.25,30*br*0.2);
      p.rect(iX,yy,bw,bH,2);
      const na=isSel||isHov?255:140;
      p.noStroke();p.fill(na,na,na);p.textSize(10);p.textAlign(p.RIGHT);
      p.text(co.name,iX-4,yy+bH-2);
      p.fill(isSel?255:90);p.textSize(9);p.textAlign(p.LEFT);
      p.text(co.total>=1000?(co.total/1000).toFixed(1)+"k":co.total,iX+bw+3,yy+bH-2);
      if(co.pct>=15){
        const bx=BC.x+BC.w-38;
        p.fill(140,15,15,210);p.rect(bx,yy+1,30,bH-2,2);
        p.fill(255,180,180);p.textSize(8);p.textAlign(p.CENTER);
        p.text(co.pct+"%",bx+15,yy+bH-2);
      }
    });
    p.cursor(companies.some((_,i)=>{
      const yy=BC.y+10+i*gap;
      return p.mouseX>=iX&&p.mouseX<=BC.x+BC.w&&p.mouseY>=yy&&p.mouseY<=yy+(Math.max(10,gap*0.60));
    })?'pointer':'default');
  }

  function drawLegend(){
    const lx=PAD,ly=480,gw=200;
    p.noStroke();p.fill(60,60,60);p.textSize(10);p.textAlign(p.LEFT);
    p.text("BAR DARKNESS = % OF WORKFORCE CUT",lx,ly);
    for(let i=0;i<gw;i++){
      const t=i/gw;p.stroke(p.lerp(50,255,t),p.lerp(8,30,t*(1-t)*4),15);
      p.strokeWeight(1);p.line(lx+i,ly+8,lx+i,ly+18);
    }
    p.noStroke();p.fill(50,50,50);p.textSize(9);p.textAlign(p.LEFT);p.text("small %",lx,ly+30);
    p.fill(210,38,38);p.textAlign(p.RIGHT);p.text("brutal",lx+gw,ly+30);
    const stats=[{v:"~500k+",l:"TOTAL"},{v:"Jan 2023",l:"PEAK"},{v:"75%",l:"TWITTER/X"}];
    stats.forEach((s,i)=>{
      const sx=lx+gw+30+i*130;
      p.noStroke();p.fill(210,38,38);p.textSize(18);p.textAlign(p.LEFT);p.text(s.v,sx,ly+18);
      p.fill(65,65,65);p.textSize(9);p.text(s.l,sx,ly+30);
    });
  }

  function drawTip(pt){
    let tx=pt.x+10,ty=pt.y-44;
    if(tx+105>W)tx=pt.x-115;if(ty<0)ty=pt.y+8;
    p.noStroke();p.fill(10,10,10,230);p.rect(tx,ty,105,34,3);
    p.stroke(210,38,38,150);p.strokeWeight(1);p.rect(tx,ty,105,34,3);
    p.noStroke();p.fill(210,38,38);p.textSize(10);p.textAlign(p.LEFT);
    p.text(pt.month,tx+7,ty+13);
    p.fill(190,190,190);p.text(pt.val.toFixed(1)+"k laid off",tx+7,ty+26);
  }

  function drawFooter(){
    p.stroke(28,28,28);p.strokeWeight(1);p.line(PAD,H-26,W-PAD,H-26);
    p.noStroke();p.fill(45,45,45);p.textSize(9);
    p.textAlign(p.LEFT);p.text("DATA: layoffs.fyi  INFO 474 HWK5  WINTER 2026",PAD,H-12);
    p.textAlign(p.RIGHT);p.text("CLICK A BAR TO FILTER",W-PAD,H-12);
  }

  p.mouseClicked=function(){
    const gap=(BC.h-16)/companies.length,bH=Math.max(10,gap*0.60);
    const iX=BC.x+BC.w*0.30;
    companies.forEach((co,i)=>{
      const yy=BC.y+10+i*gap;
      if(p.mouseX>=iX&&p.mouseX<=BC.x+BC.w&&p.mouseY>=yy&&p.mouseY<=yy+bH){
        sel=(sel===co.name)?null:co.name;anim=0.35;
      }
    });
  };
});
