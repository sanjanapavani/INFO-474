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
  let selectedCompany=null, hoveredBar=null, animProgress=0, tooltipPt=null;
  let barAnims=companies.map(()=>0);
  let W,H,PAD,TL,BC;

  function computeLayout(){
    const el=p.canvas?p.canvas.parentElement:null;
    W=(el?el.offsetWidth:900)||900;
    H=Math.max(600,W*0.85);
    PAD=Math.max(20,W*0.038);
    const topH=H*0.20, panelY=topH+8, panelH=H*0.40;
    TL={x:PAD,y:panelY,w:W*0.54-PAD,h:panelH};
    BC={x:W*0.565,y:panelY,w:W*0.435-PAD,h:panelH};
  }

  p.setup=function(){
    computeLayout();
    p.createCanvas(W,H);
    p.textFont('monospace');
    p.frameRate(60);
  };

  p.windowResized=function(){computeLayout();p.resizeCanvas(W,H);};

  p.draw=function(){
    animProgress=p.min(animProgress+0.016,1);
    barAnims=barAnims.map((_,i)=>p.min(p.max(0,(animProgress-i*0.06)/0.7),1));
    drawBg();drawHeader();tooltipPt=null;drawTimeline();drawBarChart();drawLegend();drawFooter();
    if(tooltipPt)drawTooltip(tooltipPt);
  };

  function drawBg(){
    p.background(13,13,13);
    p.stroke(22,22,22);p.strokeWeight(1);
    const s=Math.max(28,W/34);
    for(let x=0;x<W;x+=s)p.line(x,0,x,H);
    for(let y=0;y<H;y+=s)p.line(0,y,W,y);
    p.noStroke();p.fill(210,38,38);p.rect(0,0,W,5);
  }

  function drawHeader(){
    const fs1=Math.max(24,W*0.048),fs2=Math.max(10,W*0.012),fs3=Math.max(9,W*0.010);
    p.noStroke();p.fill(255);p.textSize(fs1);p.textAlign(p.LEFT,p.TOP);
    p.text("The Great Tech",PAD,H*0.030);
    p.fill(210,38,38);p.text("Correction",PAD,H*0.030+fs1*1.12);
    p.fill(120,120,120);p.textSize(fs2);
    p.text("500,000+ jobs lost  ·  2020–2024  ·  Source: layoffs.fyi",PAD,H*0.030+fs1*2.45);
    p.fill(75,75,75);p.textSize(fs3);
    p.text("LAYOFFS OVER TIME (thousands)",TL.x,TL.y-14);
    p.text("TOP COMPANIES — click bar to filter",BC.x,BC.y-14);
    p.stroke(35,35,35);p.strokeWeight(1);p.line(PAD,TL.y-3,W-PAD,TL.y-3);
  }

  function drawTimeline(){
    const raw=selectedCompany
      ?companyTimelines[selectedCompany].map((v,i)=>({month:timelineData[i].month,val:v}))
      :timelineData;
    const maxVal=Math.max(...raw.map(d=>d.val),1);
    p.noStroke();p.fill(18,18,18);p.rect(TL.x,TL.y,TL.w,TL.h,3);
    const iX=TL.x+TL.w*0.10,iW=TL.w*0.87,iY=TL.y+TL.h*0.07,iH=TL.h*0.78;
    const fs=Math.max(8,W*0.009);
    for(let i=0;i<=4;i++){
      const yy=iY+iH-(i/4)*iH;
      p.stroke(32,32,32);p.strokeWeight(1);p.line(iX,yy,iX+iW,yy);
      p.noStroke();p.fill(60,60,60);p.textSize(fs);p.textAlign(p.RIGHT);
      p.text(selectedCompany?(i/4*maxVal).toFixed(1)+"k":Math.round(i/4*maxVal)+"k",iX-5,yy+4);
    }
    const pts=raw.map((d,i)=>({
      x:iX+(i/(raw.length-1))*iW,
      y:iY+iH-(d.val/maxVal)*iH*animProgress,
      val:d.val,month:d.month
    }));
    p.noStroke();p.fill(210,38,38,22);
    p.beginShape();p.vertex(pts[0].x,iY+iH);
    pts.forEach(pt=>p.vertex(pt.x,pt.y));
    p.vertex(pts[pts.length-1].x,iY+iH);p.endShape(p.CLOSE);
    for(let i=0;i<pts.length-1;i++){
      const t=i/(pts.length-1);
      p.stroke(p.lerp(140,255,t),p.lerp(30,55,t),35);p.strokeWeight(2);
      p.line(pts[i].x,pts[i].y,pts[i+1].x,pts[i+1].y);
    }
    if(pts[12]&&animProgress>0.65){
      const alpha=p.map(animProgress,0.65,1,0,255),pk=pts[12];
      p.noStroke();p.fill(255,70,70,alpha);p.ellipse(pk.x,pk.y,11,11);
      p.stroke(255,70,70,alpha*0.5);p.strokeWeight(1);p.line(pk.x+7,pk.y-7,pk.x+26,pk.y-26);
      p.noStroke();p.fill(255,70,70,alpha);p.textSize(Math.max(10,W*0.011));p.textAlign(p.LEFT);
      p.text("JAN '23 PEAK",pk.x+28,pk.y-28);
      p.fill(110,110,110,alpha);p.textSize(Math.max(9,W*0.009));p.text("55k+ laid off",pk.x+28,pk.y-15);
    }
    pts.forEach(pt=>{
      const near=p.dist(p.mouseX,p.mouseY,pt.x,pt.y)<13;
      p.noStroke();
      if(near){p.fill(255,80,80);p.ellipse(pt.x,pt.y,12,12);tooltipPt=pt;}
      else{p.fill(155,35,35);p.ellipse(pt.x,pt.y,5,5);}
    });
    p.noStroke();p.fill(60,60,60);p.textSize(fs);p.textAlign(p.CENTER);
    ["2020","2021","2022","2023","2024"].forEach((yr,i)=>{
      p.text(yr,iX+(i*4/(raw.length-1))*iW,iY+iH+16);
    });
    if(selectedCompany){
      p.noStroke();p.fill(210,38,38);p.textSize(Math.max(9,W*0.010));p.textAlign(p.LEFT);
      p.text("↑ filtered: "+selectedCompany.toUpperCase()+"   (click again to reset)",TL.x+4,TL.y+TL.h-7);
    }
  }

  function drawBarChart(){
    const maxTotal=Math.max(...companies.map(c=>c.total));
    p.noStroke();p.fill(18,18,18);p.rect(BC.x,BC.y,BC.w,BC.h,3);
    const iX=BC.x+BC.w*0.30,iW=BC.w*0.52,gap=(BC.h-20)/companies.length,bH=Math.max(10,gap*0.60);
    const fs=Math.max(9,W*0.011);
    hoveredBar=null;
    companies.forEach((co,i)=>{
      const yy=BC.y+12+i*gap,barW=(co.total/maxTotal)*iW*barAnims[i];
      const isSel=selectedCompany===co.name;
      const isHov=p.mouseX>=iX&&p.mouseX<=BC.x+BC.w&&p.mouseY>=yy&&p.mouseY<=yy+bH;
      if(isHov)hoveredBar=i;
      const bru=p.map(p.constrain(co.pct,0,100),0,100,0.22,1.0);
      p.noStroke();p.fill(26,26,26);p.rect(iX,yy,iW,bH,2);
      if(isSel)p.fill(255,255,255);
      else if(isHov)p.fill(255,100,55);
      else p.fill(255*bru,38*bru*0.25,30*bru*0.2);
      p.rect(iX,yy,barW,bH,2);
      const na=isSel||isHov?255:145;
      p.noStroke();p.fill(na,na,na);p.textSize(fs);p.textAlign(p.RIGHT);
      p.text(co.name,iX-5,yy+bH-2);
      p.fill(isSel?255:95,isSel?255:95,isSel?255:95);
      p.textSize(Math.max(8,W*0.010));p.textAlign(p.LEFT);
      p.text(co.total>=1000?(co.total/1000).toFixed(1)+"k":co.total,iX+barW+4,yy+bH-2);
      if(co.pct>=15){
        const bx=BC.x+BC.w-PAD*0.6-32;
        p.fill(150,18,18,215);p.rect(bx,yy+1,32,bH-2,2);
        p.fill(255,185,185);p.textSize(Math.max(8,W*0.009));p.textAlign(p.CENTER);
        p.text(co.pct+"%",bx+16,yy+bH-2);
      }
    });
    p.cursor(hoveredBar!==null?'pointer':'default');
  }

  function drawLegend(){
    const lx=TL.x,ly=TL.y+TL.h+Math.max(12,H*0.022),fs=Math.max(9,W*0.010);
    p.noStroke();p.fill(65,65,65);p.textSize(fs);p.textAlign(p.LEFT);
    p.text("BAR DARKNESS = % OF WORKFORCE CUT",lx,ly);
    const gw=Math.min(220,TL.w*0.46);
    for(let i=0;i<gw;i++){
      const t=i/gw;
      p.stroke(p.lerp(55,255,t),p.lerp(8,35,t*(1-t)*4),18);p.strokeWeight(1);
      p.line(lx+i,ly+8,lx+i,ly+20);
    }
    p.noStroke();p.fill(55,55,55);p.textSize(fs-1);p.textAlign(p.LEFT);p.text("small %",lx,ly+32);
    p.fill(210,38,38);p.textAlign(p.RIGHT);p.text("brutal cut",lx+gw,ly+32);
    const stats=[{val:"~500k+",lbl:"TOTAL LAID OFF"},{val:"Jan 2023",lbl:"PEAK MONTH"},{val:"75%",lbl:"TWITTER/X WORKFORCE"}];
    const startX=lx+gw+Math.max(20,W*0.03),colW=(W-PAD-startX)/3;
    stats.forEach((s,i)=>{
      const sx=startX+i*colW;
      p.noStroke();p.fill(210,38,38);p.textSize(Math.max(16,W*0.020));p.textAlign(p.LEFT);
      p.text(s.val,sx,ly+20);
      p.fill(70,70,70);p.textSize(Math.max(8,W*0.009));p.text(s.lbl,sx,ly+34);
    });
  }

  function drawTooltip(pt){
    const tw=110,th=36;
    let tx=pt.x+10,ty=pt.y-th-6;
    if(tx+tw>W-PAD)tx=pt.x-tw-10;
    if(ty<0)ty=pt.y+10;
    p.noStroke();p.fill(12,12,12,230);p.rect(tx,ty,tw,th,3);
    p.stroke(210,38,38,160);p.strokeWeight(1);p.rect(tx,ty,tw,th,3);
    p.noStroke();p.fill(210,38,38);p.textSize(Math.max(9,W*0.010));p.textAlign(p.LEFT);
    p.text(pt.month,tx+8,ty+14);
    p.fill(200,200,200);p.text(pt.val.toFixed(1)+"k laid off",tx+8,ty+28);
  }

  function drawFooter(){
    const fy=H-Math.max(18,H*0.030);
    p.stroke(30,30,30);p.strokeWeight(1);p.line(PAD,fy-8,W-PAD,fy-8);
    p.noStroke();p.fill(50,50,50);p.textSize(Math.max(8,W*0.009));
    p.textAlign(p.LEFT);p.text("DATA: layoffs.fyi  ·  INFO 474 HWK 5  ·  WINTER 2026",PAD,fy+4);
    p.textAlign(p.RIGHT);p.text("CLICK A BAR TO FILTER TIMELINE",W-PAD,fy+4);
  }

  p.mouseClicked=function(){
    const iX=BC.x+BC.w*0.30,gap=(BC.h-20)/companies.length,bH=Math.max(10,gap*0.60);
    companies.forEach((co,i)=>{
      const yy=BC.y+12+i*gap;
      if(p.mouseX>=iX&&p.mouseX<=BC.x+BC.w&&p.mouseY>=yy&&p.mouseY<=yy+bH){
        selectedCompany=(selectedCompany===co.name)?null:co.name;
        animProgress=0.35;
      }
    });
  };
});
