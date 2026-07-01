import { useState, useRef, useEffect, useMemo } from "react";

// ── DATA ──────────────────────────────────────────────────────────────────────
const XY_GRID = {"0_0":1.0,"0_1":0.9477,"0_2":0.8955,"0_3":0.8436,"0_4":0.7919,"0_5":0.7408,"0_6":0.6901,"0_7":0.6402,"0_8":0.591,"0_9":0.5429,"0_10":0.4959,"0_11":0.4502,"0_12":0.4723,"0_13":0.4852,"2_0":0.9211,"2_1":0.9074,"2_2":0.87,"2_3":0.8244,"2_4":0.7761,"2_5":0.7269,"2_6":0.6775,"2_7":0.6286,"2_8":0.5802,"2_9":0.5327,"2_10":0.4862,"2_11":0.4409,"2_12":0.4623,"2_13":0.4742,"4_0":0.8424,"4_1":0.8365,"4_2":0.8151,"4_3":0.7809,"4_4":0.7413,"4_5":0.698,"4_6":0.6524,"4_7":0.6062,"4_8":0.5602,"4_9":0.5144,"4_10":0.4692,"4_11":0.4249,"4_12":0.4444,"4_13":0.4552,"6_0":0.7638,"6_1":0.7602,"6_2":0.7475,"6_3":0.7236,"6_4":0.6908,"6_5":0.6549,"6_6":0.6153,"6_7":0.574,"6_8":0.5313,"6_9":0.488,"6_10":0.4451,"6_11":0.403,"6_12":0.4205,"6_13":0.4304,"8_0":0.6856,"8_1":0.6832,"8_2":0.6743,"8_3":0.6581,"8_4":0.6332,"8_5":0.6019,"8_6":0.5679,"8_7":0.5321,"8_8":0.4937,"8_9":0.4545,"8_10":0.4152,"8_11":0.3753,"8_12":0.3914,"8_13":0.4005,"10_0":0.6078,"10_1":0.6059,"10_2":0.5995,"10_3":0.5875,"10_4":0.5695,"10_5":0.5445,"10_6":0.5145,"10_7":0.4822,"10_8":0.449,"10_9":0.4144,"10_10":0.378,"10_11":0.3417,"10_12":0.3563,"10_13":0.365,"12_0":0.5306,"12_1":0.5291,"12_2":0.5241,"12_3":0.515,"12_4":0.5012,"12_5":0.4823,"12_6":0.4577,"12_7":0.4292,"12_8":0.3987,"12_9":0.3677,"12_10":0.3361,"12_11":0.3036,"12_12":0.3172,"12_13":0.3255,"14_0":0.4541,"14_1":0.453,"14_2":0.4492,"14_3":0.4419,"14_4":0.4313,"14_5":0.4166,"14_6":0.3973,"14_7":0.3736,"14_8":0.3466,"14_9":0.3182,"14_10":0.2892,"14_11":0.2602,"14_12":0.2732,"14_13":0.2816,"16_0":0.3786,"16_1":0.3777,"16_2":0.3747,"16_3":0.3691,"16_4":0.3605,"16_5":0.3489,"16_6":0.334,"16_7":0.315,"16_8":0.2925,"16_9":0.2672,"16_10":0.241,"16_11":0.2141,"16_12":0.227,"16_13":0.2356,"18_0":0.3043,"18_1":0.3037,"18_2":0.3011,"18_3":0.2968,"18_4":0.2901,"18_5":0.2811,"18_6":0.269,"18_7":0.2544,"18_8":0.2362,"18_9":0.2149,"18_10":0.1916,"18_11":0.1678,"18_12":0.1805,"18_13":0.1891,"20_0":0.2316,"20_1":0.2311,"20_2":0.229,"20_3":0.2258,"20_4":0.2206,"20_5":0.2133,"20_6":0.204,"20_7":0.1924,"20_8":0.1783,"20_9":0.1612,"20_10":0.1416,"20_11":0.1204,"20_12":0.1332,"20_13":0.1419,"22_0":0.1608,"22_1":0.1604,"22_2":0.1588,"22_3":0.1567,"22_4":0.1524,"22_5":0.1468,"22_6":0.1397,"22_7":0.1304,"22_8":0.1196,"22_9":0.1062,"22_10":0.0906,"22_11":0.073,"22_12":0.0859,"22_13":0.0948,"24_0":0.0924,"24_1":0.0922,"24_2":0.091,"24_3":0.0894,"24_4":0.0862,"24_5":0.082,"24_6":0.0765,"24_7":0.0699,"24_8":0.0612,"24_9":0.0513,"24_10":0.0391,"24_11":0.0253,"24_12":0.0384,"24_13":0.0476};
const ROT_DATA = {0:1.0,15:0.992,30:0.9869,45:0.9851,60:0.9864,75:0.9917,90:1.0,105:0.992,120:0.9869,135:0.9851,150:0.9864,165:0.9917,180:1.0};
const Z_DATA = {200:1.0,400:0.9679,600:0.9519,800:0.9423,1000:0.9359,1200:0.9313,1400:0.9279,1600:0.9252,1800:0.923,2000:0.9213,2200:0.9198,2400:0.9186,2600:0.9175,2800:0.9166,3000:0.9158,3200:0.9151,3400:0.9145,3600:0.9139,3800:0.9134,4000:0.913,4200:0.9125,4400:0.9122,4600:0.9118,4800:0.9115,5000:0.9112};
const X_SQI = [1.0,0.9477,0.8955,0.8436,0.7919,0.7408,0.6901,0.6402,0.591,0.5429,0.4959,0.4502,0.4723,0.4852];
const Y_SQI = [1.0,0.9586,0.9173,0.8759,0.8346,0.7934,0.7522,0.7111,0.6701,0.6292,0.5884,0.5478,0.5074,0.4671,0.4271,0.3874,0.3479,0.3087,0.2699,0.2316,0.1936,0.1562,0.1193,0.0831,0.0476];
const ROT_SQI = [1.0,0.9968,0.9942,0.9917,0.9897,0.9877,0.9863,0.9853,0.9843,0.9844,0.9841,0.9848,0.9857,0.9871,0.9892,0.9913,0.994,0.9967,1.0,0.9968,0.9942,0.9917,0.9897,0.9877,0.9863,0.9853,0.9843,0.9844,0.9841,0.9848,0.9857,0.9871,0.9892,0.9913,0.994,0.9967,1.0];
const Z_SQI = [1.0,0.9679,0.9519,0.9423,0.9359,0.9313,0.9279,0.9252,0.923,0.9213,0.9198,0.9186,0.9175,0.9166,0.9158,0.9151,0.9145,0.9139,0.9134,0.913,0.9125,0.9122,0.9118,0.9115,0.9112];
const Z_VALS = [200,400,600,800,1000,1200,1400,1600,1800,2000,2200,2400,2600,2800,3000,3200,3400,3600,3800,4000,4200,4400,4600,4800,5000];
const Y_RANGE = [0,2,4,6,8,10,12,14,16,18,20,22,24];
const X_RANGE = [0,1,2,3,4,5,6,7,8,9,10,11,12,13];

// ── HELPERS ───────────────────────────────────────────────────────────────────
function sqiRGB(v) {
  if (v>0.85) return [74,222,128];
  if (v>0.65) return [163,230,53];
  if (v>0.45) return [250,204,21];
  if (v>0.25) return [251,146,60];
  return [248,113,113];
}
function sqiHex(v){ const[r,g,b]=sqiRGB(v); return "rgb("+r+","+g+","+b+")"; }
function sqiLabel(v){ return v>0.85?"Excellent":v>0.65?"Good":v>0.45?"Fair":v>0.25?"Poor":"Critical"; }
function sqiLabelColour(v){ return v>0.85?"#4ade80":v>0.65?"#a3e635":v>0.45?"#facc15":v>0.25?"#fb923c":"#f87171"; }

function lookupSQI(dy,dx,rot,zR){
  const yS=Y_RANGE.reduce((a,b)=>Math.abs(b-dy)<Math.abs(a-dy)?b:a);
  const xS=X_RANGE.reduce((a,b)=>Math.abs(b-dx)<Math.abs(a-dx)?b:a);
  const rS=[0,15,30,45,60,75,90,105,120,135,150,165,180].reduce((a,b)=>Math.abs(b-rot)<Math.abs(a-rot)?b:a);
  const zS=Z_VALS.reduce((a,b)=>Math.abs(b-zR)<Math.abs(a-zR)?b:a);
  return Math.min(1,Math.max(0,(XY_GRID[yS+"_"+xS]||1)*(ROT_DATA[rS]||1)*(Z_DATA[zS]||1)));
}

// ── MAT GENERATION ────────────────────────────────────────────────────────────
const H=64,W=32;
function makeBase(lv=1000,rv=1000){
  const m=Array.from({length:H},()=>new Array(W).fill(0));
  const r0=27,r1=37,c0=11,c1=21;
  for(let r=r0;r<r1;r++) for(let c=c0;c<c1;c++){
    const f=(c-c0)/Math.max(1,c1-c0-1);
    m[r][c]=lv+f*(rv-lv);
  }
  return m;
}
function rollY(m,d){const Ht=m.length;return m.map((_,r)=>m[((r-d)%Ht+Ht)%Ht]);}
function rollX(m,d){const Wt=m[0].length;return m.map(row=>{const s=((d%Wt)+Wt)%Wt;return[...row.slice(Wt-s),...row.slice(0,Wt-s)];});}
function rotMat(m,deg){
  const Ht=m.length,Wt=m[0].length,out=Array.from({length:Ht},()=>new Array(Wt).fill(0));
  const rad=deg*Math.PI/180,cos=Math.cos(rad),sin=Math.sin(rad),cr=Ht/2,cc=Wt/2;
  for(let r=0;r<Ht;r++)for(let c=0;c<Wt;c++){
    const sr=Math.round((r-cr)*cos+(c-cc)*sin+cr),sc=Math.round(-(r-cr)*sin+(c-cc)*cos+cc);
    if(sr>=0&&sr<Ht&&sc>=0&&sc<Wt)out[r][c]=m[sr][sc];
  }
  return out;
}
function buildMat(dx,dy,rot,zR){
  let m=makeBase(200,zR);
  if(rot!==0)m=rotMat(m,rot);
  m=rollY(m,dy);m=rollX(m,dx);
  return m;
}

// ── PRESSURE MAT CANVAS ───────────────────────────────────────────────────────
function pressureRGB(v,mx){
  const t=Math.min(1,mx>0?v/mx:0);
  if(t<0.3)return[Math.round(15+t/0.3*68),Math.round(16+t/0.3*36),Math.round(30+t/0.3*66)];
  if(t<0.65){const u=(t-0.3)/0.35;return[Math.round(83+u*150),Math.round(52+u*17),Math.round(96)]}
  if(t<0.9){const u=(t-0.65)/0.25;return[Math.round(233+u*12),Math.round(69+u*97),Math.round(96-u*61)]}
  const u=(t-0.9)/0.1;return[Math.round(245+u*10),Math.round(166+u*89),Math.round(35+u*220)];
}
function PressureMat({mat,cell=3,label,sqi}){
  const ref=useRef(null);
  useEffect(()=>{
    const c=ref.current;if(!c)return;
    const ctx=c.getContext("2d");
    const mx=Math.max(...mat.flat());
    mat.forEach((row,r)=>row.forEach((v,col)=>{
      const[R,G,B]=pressureRGB(v,mx||1);
      ctx.fillStyle="rgb("+R+","+G+","+B+")";
      ctx.fillRect(col*cell,r*cell,cell,cell);
    }));
  },[mat,cell]);
  const col=sqi!==undefined?sqiHex(sqi):"#94a3b8";
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
      <canvas ref={ref} width={W*cell} height={H*cell} style={{borderRadius:2,border:"1px solid #1e293b"}}/>
      {label&&<div style={{fontSize:9,color:"#64748b"}}>{label}</div>}
      {sqi!==undefined&&<div style={{fontSize:11,fontWeight:800,color:col}}>SQI {sqi.toFixed(3)}</div>}
    </div>
  );
}

// ── MINI LINE CHART CANVAS ────────────────────────────────────────────────────
function MiniChart({data,xVals,colour,curIdx,label,yMin=0,yMax=1,width=220,height=80}){
  const ref=useRef(null);
  useEffect(()=>{
    const c=ref.current;if(!c)return;
    const ctx=c.getContext("2d");
    ctx.clearRect(0,0,width,height);
    const pad={t:8,r:8,b:20,l:28};
    const pw=width-pad.l-pad.r,ph=height-pad.t-pad.b;
    const toX=i=>pad.l+pw*i/(data.length-1);
    const toY=v=>pad.t+ph*(1-(v-yMin)/(yMax-yMin));
    // Grid
    [0,0.5,1.0].forEach(v=>{
      if(v<yMin||v>yMax)return;
      const y=toY(v);
      ctx.strokeStyle="#1e293b";ctx.lineWidth=0.5;
      ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(pad.l+pw,y);ctx.stroke();
      ctx.fillStyle="#334155";ctx.font="8px Inter";ctx.fillText(v.toFixed(1),2,y+3);
    });
    // Fill
    ctx.beginPath();ctx.moveTo(toX(0),toY(data[0]));
    data.forEach((v,i)=>ctx.lineTo(toX(i),toY(v)));
    ctx.lineTo(toX(data.length-1),pad.t+ph);ctx.lineTo(toX(0),pad.t+ph);ctx.closePath();
    ctx.fillStyle=colour+"22";ctx.fill();
    // Line
    ctx.beginPath();ctx.strokeStyle=colour;ctx.lineWidth=2;
    data.forEach((v,i)=>i===0?ctx.moveTo(toX(i),toY(v)):ctx.lineTo(toX(i),toY(v)));
    ctx.stroke();
    // Current marker
    if(curIdx>=0&&curIdx<data.length){
      const cx=toX(curIdx),cy=toY(data[curIdx]);
      ctx.beginPath();ctx.arc(cx,cy,4,0,Math.PI*2);
      ctx.fillStyle=colour;ctx.fill();
      ctx.strokeStyle="white";ctx.lineWidth=1.5;ctx.stroke();
      ctx.fillStyle="white";ctx.font="bold 9px Inter";
      ctx.fillText(data[curIdx].toFixed(3),cx+6,cy-3);
    }
    // X axis label
    ctx.fillStyle="#334155";ctx.font="8px Inter";
    ctx.fillText(xVals[0],pad.l-4,height-4);
    ctx.fillText(xVals[Math.floor(xVals.length/2)],toX(Math.floor(data.length/2))-6,height-4);
    ctx.fillText(xVals[xVals.length-1],toX(data.length-1)-10,height-4);
    // Label
    ctx.fillStyle=colour;ctx.font="bold 9px Inter";ctx.fillText(label,pad.l,pad.t+8);
  },[data,curIdx,colour,yMin,yMax,width,height,xVals,label]);
  return <canvas ref={ref} width={width} height={height} style={{borderRadius:4,background:"#020617"}}/>;
}

// ── 3D CUBE SCENE ─────────────────────────────────────────────────────────────
function Scene3D({dx,dy,rot,zR,sqi,W3=480,H3=320}){
  const ref=useRef(null);
  const drag=useRef({active:false,lastX:0,lastY:0});
  const orbit=useRef({az:Math.PI/4,el:Math.PI/5});
  const [tick,setTick]=useState(0);

  useEffect(()=>{
    const c=ref.current;if(!c)return;
    const ctx=c.getContext("2d");
    ctx.clearRect(0,0,W3,H3);

    const az=orbit.current.az;
    const el=orbit.current.el;
    // Scale so the floor grid fills the canvas nicely
    const sc=Math.min(W3,H3)*0.28;

    // Orbit projection
    function iso(x,y,z){
      const rx=x*Math.cos(az)+z*Math.sin(az);
      const rz=-x*Math.sin(az)+z*Math.cos(az);
      const ry2=y*Math.cos(el)-rz*Math.sin(el);
      return[W3*0.5+rx*sc, H3*0.58-ry2*sc];
    }
    function edge(a,b,col="#1e3a5f",lw=0.8,dash=[]){
      ctx.beginPath();const[ax,ay]=iso(...a),[bx,by]=iso(...b);
      ctx.moveTo(ax,ay);ctx.lineTo(bx,by);
      ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([]);
    }

    // Floor grid — fills the full -1 to +1 space
    for(let i=-1;i<=1;i+=0.25){
      edge([-1,0,i],[1,0,i],"#0c1f3a",0.5);
      edge([i,0,-1],[i,0,1],"#0c1f3a",0.5);
    }
    // Floor border
    edge([-1,0,-1],[1,0,-1],"#253a5f",1.8);
    edge([1,0,-1],[1,0,1],"#253a5f",1.8);
    edge([1,0,1],[-1,0,1],"#253a5f",1.8);
    edge([-1,0,1],[-1,0,-1],"#253a5f",1.8);

    // Axes
    edge([-1,0,-1],[1.2,0,-1],"#38bdf8",2.2);   // X
    edge([-1,0,-1],[-1,0,1.2],"#4ade80",2.2);   // Y (row)
    edge([-1,0,-1],[-1,0.9,-1],"#fb923c",2.2);  // Z (pressure)

    // Axis labels
    ctx.font="bold 11px 'Inter',sans-serif";ctx.textAlign="center";
    const[xlx,xly]=iso(1.3,0,-1);ctx.fillStyle="#38bdf8";ctx.fillText("X col",xlx,xly);
    const[ylx,yly]=iso(-1,0,1.3);ctx.fillStyle="#4ade80";ctx.fillText("Y row",ylx,yly+4);
    const[zlx,zly]=iso(-1,1.0,-1);ctx.fillStyle="#fb923c";ctx.fillText("Z",zlx-14,zly);
    ctx.textAlign="left";

    // ── SP1 GHOST SQUARE ──────────────────────────────────────────────────────
    // SP1 sits at origin (0,0) in 3D — this is where dx=0,dy=0 maps to
    const sz=0.55;
    const sp1=[[-sz,0,-sz],[sz,0,-sz],[sz,0,sz],[-sz,0,sz]];
    const sp1Top=[[-sz,0.04,-sz],[sz,0.04,-sz],[sz,0.04,sz],[-sz,0.04,sz]];
    // Top face
    ctx.beginPath();
    sp1Top.forEach((p,i)=>{const[px,py]=iso(...p);i===0?ctx.moveTo(px,py):ctx.lineTo(px,py);});
    ctx.closePath();ctx.fillStyle="rgba(56,189,248,0.08)";ctx.fill();
    ctx.strokeStyle="rgba(56,189,248,0.4)";ctx.lineWidth=1.2;ctx.setLineDash([4,4]);ctx.stroke();ctx.setLineDash([]);
    // Side edges
    sp1.forEach((p,i)=>edge(p,sp1Top[i],"rgba(56,189,248,0.2)",0.8,[3,3]));
    // Label
    const[slx,sly]=iso(sz+0.06,0.06,sz);
    ctx.fillStyle="rgba(56,189,248,0.7)";ctx.font="bold 10px Inter";ctx.fillText("SP1",slx,sly);

    // ── CURRENT SQUARE ────────────────────────────────────────────────────────
    // At dx=0,dy=0 → txPos=0,tzPos=0 → sits exactly on SP1 → SQI=1
    // At dx=13,dy=24 → txPos=±0.8,tzPos=±0.8 → moved to grid edge
    const txPos=(dx/13)*0.8;
    const tzPos=(dy/24)*0.8;
    const zLH=0.04;
    const zRH=0.04+(zR-200)/5000*0.65;
    const rad=rot*Math.PI/180;

    function rp([x,z]){
      return[x*Math.cos(rad)-z*Math.sin(rad)+txPos, x*Math.sin(rad)+z*Math.cos(rad)+tzPos];
    }
    const corners=[[-sz,-sz],[sz,-sz],[sz,sz],[-sz,sz]];
    const bot=corners.map(([x,z])=>{const[rx,rz]=rp([x,z]);return[rx,0,rz];});
    const top=corners.map(([x,z],i)=>{
      const[rx,rz]=rp([x,z]);
      const h=(i===0||i===3)?zLH:zRH;
      return[rx,h,rz];
    });

    const[R,G,B]=sqiRGB(sqi);
    const mk=(r,g,b,a)=>"rgba("+r+","+g+","+b+","+a+")";

    // Displacement lines
    bot.forEach((p,i)=>edge(sp1[i],p,"rgba(255,255,255,0.1)",0.7,[3,5]));

    // Faces — painter's sort
    const faces=[
      {pts:[bot[0],bot[1],top[1],top[0]],bright:0.5},
      {pts:[bot[1],bot[2],top[2],top[1]],bright:0.55},
      {pts:[bot[2],bot[3],top[3],top[2]],bright:0.65},
      {pts:[bot[3],bot[0],top[0],top[3]],bright:0.6},
    ];
    faces.sort((a,b)=>{
      const az=a.pts.reduce((s,p)=>s+iso(...p)[1],0)/4;
      const bz=b.pts.reduce((s,p)=>s+iso(...p)[1],0)/4;
      return az-bz;
    });
    faces.forEach(({pts,bright})=>{
      ctx.beginPath();
      pts.forEach((p,i)=>{const[px,py]=iso(...p);i===0?ctx.moveTo(px,py):ctx.lineTo(px,py);});
      ctx.closePath();
      ctx.fillStyle=mk(Math.round(R*bright),Math.round(G*bright),Math.round(B*bright),0.85);
      ctx.fill();ctx.strokeStyle="rgba(0,0,0,0.25)";ctx.lineWidth=0.6;ctx.stroke();
    });

    // Top face with gradient (shows Z asymmetry)
    ctx.beginPath();
    top.forEach((p,i)=>{const[px,py]=iso(...p);i===0?ctx.moveTo(px,py):ctx.lineTo(px,py);});
    ctx.closePath();
    const[t0x,t0y]=iso(...top[0]),[t1x,t1y]=iso(...top[1]);
    const grd=ctx.createLinearGradient(t0x,t0y,t1x,t1y);
    grd.addColorStop(0,mk(R,G,B,0.7));
    grd.addColorStop(1,mk(Math.min(255,R+50),Math.min(255,G+50),Math.min(255,B+50),0.95));
    ctx.fillStyle=grd;ctx.fill();
    ctx.strokeStyle="rgba(255,255,255,0.4)";ctx.lineWidth=1.4;ctx.stroke();



    // Floor shadow
    ctx.beginPath();
    bot.forEach((p,i)=>{const[px,py]=iso(...p);i===0?ctx.moveTo(px,py):ctx.lineTo(px,py);});
    ctx.closePath();ctx.fillStyle=mk(R,G,B,0.08);ctx.fill();

    // Drag hint
    ctx.fillStyle="#1e293b";ctx.font="9px Inter";ctx.textAlign="right";
    ctx.fillText("Drag to orbit",W3-6,H3-6);ctx.textAlign="left";

  },[dx,dy,rot,zR,sqi,W3,H3,tick]);

  const onDown=e=>{drag.current={active:true,lastX:e.clientX,lastY:e.clientY};e.preventDefault();};
  const onMove=e=>{
    if(!drag.current.active)return;
    orbit.current.az+=(e.clientX-drag.current.lastX)*0.012;
    orbit.current.el=Math.max(-0.4,Math.min(1.2,orbit.current.el-(e.clientY-drag.current.lastY)*0.010));
    drag.current.lastX=e.clientX;drag.current.lastY=e.clientY;
    setTick(n=>n+1);
  };
  const onUp=()=>{drag.current.active=false;};
  const onTD=e=>{const t=e.touches[0];drag.current={active:true,lastX:t.clientX,lastY:t.clientY};};
  const onTM=e=>{
    if(!drag.current.active)return;
    const t=e.touches[0];
    orbit.current.az+=(t.clientX-drag.current.lastX)*0.012;
    orbit.current.el=Math.max(-0.4,Math.min(1.2,orbit.current.el-(t.clientY-drag.current.lastY)*0.010));
    drag.current.lastX=t.clientX;drag.current.lastY=t.clientY;
    setTick(n=>n+1);e.preventDefault();
  };

  return <canvas ref={ref} width={W3} height={H3}
    onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
    onTouchStart={onTD} onTouchMove={onTM} onTouchEnd={onUp}
    style={{borderRadius:8,background:"#020617",display:"block",
      cursor:drag.current.active?"grabbing":"grab"}}/>;
}

// ── SLIDER + GAUGE ────────────────────────────────────────────────────────────
function Slider({label,value,min,max,step=1,onChange,colour,unit=""}){
  return(
    <div style={{marginBottom:10}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
        <span style={{fontSize:11,color:"#94a3b8",fontWeight:600}}>{label}</span>
        <span style={{fontSize:11,fontWeight:800,color:colour}}>{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e=>onChange(Number(e.target.value))} style={{width:"100%",accentColor:colour}}/>
    </div>
  );
}
function Gauge({sqi}){
  const col=sqiHex(sqi);
  const lblCol=sqiLabelColour(sqi);
  return(
    <div style={{background:"#0f172a",borderRadius:10,padding:"12px 14px",border:"1px solid #1e293b",marginBottom:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
        <span style={{fontSize:10,color:"#64748b",fontWeight:700,letterSpacing:2,textTransform:"uppercase"}}>Combined SQI</span>
        <span style={{fontSize:26,fontWeight:900,color:col}}>{sqi.toFixed(3)}</span>
      </div>
      <div style={{background:"#1e293b",borderRadius:5,height:10,overflow:"hidden",marginTop:6}}>
        <div style={{width:(sqi*100)+"%",height:"100%",background:"linear-gradient(90deg,#1e3a5f,"+col+")",transition:"width 0.12s",borderRadius:5}}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
        <span style={{fontSize:9,color:"#334155"}}>0  critical</span>
        <span style={{fontSize:10,fontWeight:700,color:lblCol}}>{sqiLabel(sqi)}</span>
        <span style={{fontSize:9,color:"#334155"}}>perfect  1</span>
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App(){
  const [dx,setDx]=useState(0);
  const [dy,setDy]=useState(0);
  const [rot,setRot]=useState(0);
  const [zR,setZR]=useState(200);
  const [tab,setTab]=useState("3d");

  const sqi=useMemo(()=>lookupSQI(dy,dx,rot,zR),[dy,dx,rot,zR]);
  const mat=useMemo(()=>buildMat(dx,dy,rot,zR),[dx,dy,rot,zR]);
  const base=useMemo(()=>makeBase(),[]);

  const xIdx=X_RANGE.indexOf(X_RANGE.reduce((a,b)=>Math.abs(b-dx)<Math.abs(a-dx)?b:a));
  const yIdx=Math.round(dy);
  const rIdx=Math.round(rot/5);
  const zIdx=Z_VALS.indexOf(Z_VALS.reduce((a,b)=>Math.abs(b-zR)<Math.abs(a-zR)?b:a));

  const TABS=[
    {id:"3d",label:"3D View"},
    {id:"xy",label:"X & Y Charts"},
    {id:"rz",label:"Rotation & Z"},
    {id:"mat",label:"Pressure Mats"},
  ];

  return(
    <div style={{fontFamily:"'Inter',system-ui,sans-serif",background:"#020617",minHeight:"100vh",color:"white",padding:"16px"}}>
      {/* Header */}
      <div style={{marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:9,letterSpacing:3,color:"#38bdf8",textTransform:"uppercase",marginBottom:3}}>SitWell · Formula Unit Test</div>
          <div style={{fontSize:17,fontWeight:800}}>Square Shape — XYZ Transform Explorer</div>
          <div style={{fontFamily:"monospace",fontSize:10,color:"#475569",marginTop:3}}>SQI(t) = 1 - SWD(P_now, P_SP1) / SWD_max</div>
        </div>
        <button onClick={()=>{setDx(0);setDy(0);setRot(0);setZR(200);}}
          style={{padding:"6px 14px",borderRadius:6,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,background:"#1e293b",color:"#94a3b8"}}>
          Reset
        </button>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"190px 1fr",gap:14,alignItems:"start"}}>
        {/* Left controls */}
        <div>
          <Gauge sqi={sqi}/>
          <div style={{background:"#0f172a",borderRadius:10,padding:"14px",border:"1px solid #1e293b",marginBottom:10}}>
            <div style={{fontSize:10,fontWeight:700,color:"#64748b",letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>Transforms</div>
            <Slider label="X  Column" value={dx} min={0} max={13} onChange={setDx} colour="#38bdf8" unit="px"/>
            <Slider label="Y  Row"    value={dy} min={0} max={24} onChange={setDy} colour="#4ade80" unit="px"/>
            <Slider label="↺ Rotation" value={rot} min={0} max={180} step={5} onChange={setRot} colour="#a78bfa" unit="°"/>
            <Slider label="Z  Right P" value={zR} min={200} max={5000} step={200} onChange={setZR} colour="#fb923c"/>
          </div>
          {/* Per-axis breakdown */}
          <div style={{background:"#0f172a",borderRadius:10,padding:"12px 14px",border:"1px solid #1e293b",marginBottom:10}}>
            <div style={{fontSize:10,fontWeight:700,color:"#64748b",letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>Axis Breakdown</div>
            {[
              {label:"X only",val:X_SQI[xIdx]??1,col:"#38bdf8"},
              {label:"Y only",val:Y_SQI[dy]??1,col:"#4ade80"},
              {label:"Rotation",val:ROT_SQI[rIdx]??1,col:"#a78bfa"},
              {label:"Z asym",val:Z_SQI[zIdx]??1,col:"#fb923c"},
            ].map(({label,val,col})=>(
              <div key={label} style={{marginBottom:7}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                  <span style={{fontSize:10,color:"#64748b"}}>{label}</span>
                  <span style={{fontSize:10,fontWeight:700,color:col}}>{val.toFixed(3)}</span>
                </div>
                <div style={{background:"#1e293b",borderRadius:3,height:5}}>
                  <div style={{width:(val*100)+"%",height:"100%",background:col,borderRadius:3,transition:"width 0.12s"}}/>
                </div>
              </div>
            ))}
          </div>
          {/* Key findings */}
          <div style={{background:"#0f172a",borderRadius:10,padding:"12px 14px",border:"1px solid #1e293b"}}>
            <div style={{fontSize:10,fontWeight:700,color:"#64748b",letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>Properties</div>
            {[
              {label:"X/Y translation",result:"SQI ↓ smoothly with distance"},
              {label:"Rotation",result:"Near-invariant (min 0.984)"},
              {label:"Uniform Z",result:"SQI = 1.0 always"},
              {label:"Asymmetric Z",result:"Small drop ≈ 0.09 max"},
            ].map(({label,result})=>(
              <div key={label} style={{marginBottom:6,paddingBottom:6,borderBottom:"1px solid #0f1f38"}}>
                <div style={{fontSize:10,fontWeight:600,color:"#94a3b8"}}>{label}</div>
                <div style={{fontSize:9,color:"#475569"}}>{result}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right content */}
        <div>
          {/* Tab bar */}
          <div style={{display:"flex",gap:6,marginBottom:12}}>
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)} style={{
                padding:"6px 16px",borderRadius:6,border:"none",cursor:"pointer",
                fontSize:11,fontWeight:600,transition:"all 0.12s",
                background:tab===t.id?"#38bdf8":"#1e293b",
                color:tab===t.id?"#020617":"#64748b",
              }}>{t.label}</button>
            ))}
          </div>

          {/* 3D VIEW */}
          {tab==="3d"&&(
            <div style={{background:"#0a0f1e",borderRadius:12,border:"1px solid #1e293b",padding:"12px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div>
                  <div style={{fontSize:12,fontWeight:700}}>3D Pressure Space</div>
                  <div style={{fontSize:10,color:"#475569"}}>
                    Dashed outline = SP1 · Solid = current posture · Z height = right-side pressure
                  </div>
                </div>
                <div style={{fontFamily:"monospace",fontSize:11,color:sqiHex(sqi),fontWeight:700}}>
                  ({dx},{dy})px  {rot}°  Z:{zR}
                </div>
              </div>
              <Scene3D dx={dx} dy={dy} rot={rot} zR={zR} sqi={sqi} W3={560} H3={380}/>
              <div style={{display:"flex",gap:12,marginTop:10,fontSize:10}}>
                {[["#38bdf8","X axis — column shift"],["#4ade80","Y axis — row shift"],["#fb923c","Z axis — pressure height"],["rgba(56,189,248,0.4)","Dashed = SP1 reference"]].map(([col,lbl])=>(
                  <div key={lbl} style={{display:"flex",alignItems:"center",gap:5}}>
                    <div style={{width:10,height:3,background:col,borderRadius:2}}/>
                    <span style={{color:"#475569"}}>{lbl}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* X & Y CHARTS */}
          {tab==="xy"&&(
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div style={{background:"#0f172a",borderRadius:10,border:"1px solid #1e293b",padding:"14px"}}>
                <div style={{fontSize:12,fontWeight:700,marginBottom:2}}>X Axis — Column Translation</div>
                <div style={{fontSize:10,color:"#475569",marginBottom:8}}>
                  Same shape shifted left→right. SQI decreases as square moves away from SP1.
                  Current: {dx}px → SQI {X_SQI[xIdx]?.toFixed(3)}
                </div>
                <MiniChart data={X_SQI} xVals={X_RANGE.map(String)} colour="#38bdf8" curIdx={xIdx}
                  label="SQI vs X shift" width={540} height={100}/>
                <div style={{marginTop:10,fontSize:10,color:"#475569",fontStyle:"italic"}}>
                  Note: slight uptick at 12–13px is a circular boundary effect (wrap-around).
                </div>
              </div>
              <div style={{background:"#0f172a",borderRadius:10,border:"1px solid #1e293b",padding:"14px"}}>
                <div style={{fontSize:12,fontWeight:700,marginBottom:2}}>Y Axis — Row Translation</div>
                <div style={{fontSize:10,color:"#475569",marginBottom:8}}>
                  Vertical shift. Gradient shallower than X — mat is 64 rows tall vs 32 cols wide.
                  Current: {dy}px → SQI {Y_SQI[dy]?.toFixed(3)}
                </div>
                <MiniChart data={Y_SQI} xVals={Array.from({length:25},(_,i)=>String(i))} colour="#4ade80"
                  curIdx={dy} label="SQI vs Y shift" width={540} height={100}/>
              </div>
            </div>
          )}

          {/* ROTATION & Z */}
          {tab==="rz"&&(
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div style={{background:"#0f172a",borderRadius:10,border:"1px solid #1e293b",padding:"14px"}}>
                <div style={{fontSize:12,fontWeight:700,marginBottom:2}}>Rotation</div>
                <div style={{fontSize:10,color:"#475569",marginBottom:8}}>
                  SQI barely changes — minimum 0.984 at 50°. Returns to 1.0 at 90° and 180° (square symmetry).
                  Current: {rot}° → SQI {ROT_SQI[rIdx]?.toFixed(4)}
                </div>
                <MiniChart data={ROT_SQI} xVals={Array.from({length:37},(_,i)=>i%6===0?String(i*5):"").map(String)}
                  colour="#a78bfa" curIdx={rIdx} label="SQI vs Rotation" yMin={0.97} yMax={1.01} width={540} height={100}/>
                <div style={{marginTop:8,fontSize:10,color:"#475569",fontStyle:"italic"}}>
                  SQI is near-invariant to rotation for a square. SWD measures spatial displacement, not orientation.
                </div>
              </div>
              <div style={{background:"#0f172a",borderRadius:10,border:"1px solid #1e293b",padding:"14px"}}>
                <div style={{fontSize:12,fontWeight:700,marginBottom:2}}>Z Axis — Pressure Asymmetry</div>
                <div style={{fontSize:10,color:"#475569",marginBottom:8}}>
                  Left side fixed at 200. Right side increases 200→5000. Simulates leaning right.
                  Uniform Z = always 1.0. Current right: {zR} → SQI {Z_SQI[zIdx]?.toFixed(4)}
                </div>
                <MiniChart data={Z_SQI} xVals={Z_VALS.map(String)} colour="#fb923c" curIdx={zIdx}
                  label="SQI vs Z right pressure" yMin={0.88} yMax={1.02} width={540} height={100}/>
                <div style={{marginTop:8,fontSize:10,color:"#475569",fontStyle:"italic"}}>
                  SQI drops only ~0.09 even at 25× asymmetry. Uniform pressure scaling has zero effect.
                </div>
              </div>
            </div>
          )}

          {/* PRESSURE MATS */}
          {tab==="mat"&&(
            <div style={{background:"#0f172a",borderRadius:10,border:"1px solid #1e293b",padding:"16px"}}>
              <div style={{fontSize:12,fontWeight:700,marginBottom:4}}>Live Pressure Map Comparison</div>
              <div style={{fontSize:10,color:"#475569",marginBottom:14}}>
                Left = SP1 reference (upright). Right = current transformed posture. Colour = pressure intensity.
              </div>
              <div style={{display:"flex",gap:32,justifyContent:"center",alignItems:"flex-start"}}>
                <PressureMat mat={base} cell={5} label="SP1 Reference" sqi={1.0}/>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,paddingTop:80}}>
                  <div style={{fontSize:24,color:"#1e3a5f"}}>→</div>
                  <div style={{fontSize:9,color:"#334155",textAlign:"center"}}>
                    X:{dx}px<br/>Y:{dy}px<br/>R:{rot}°<br/>Z:{zR}
                  </div>
                </div>
                <PressureMat mat={mat} cell={5} label="Current posture" sqi={sqi}/>
              </div>
              <div style={{marginTop:16,display:"flex",gap:6,justifyContent:"center"}}>
                {[["#0f2240","~0 (none)"],["#531633","Low"],["#e94560","Medium"],["#f5a623","High"],["#ffffff","Peak"]].map(([col,lbl])=>(
                  <div key={lbl} style={{display:"flex",alignItems:"center",gap:4}}>
                    <div style={{width:12,height:12,background:col,borderRadius:2,border:"1px solid #1e293b"}}/>
                    <span style={{fontSize:9,color:"#475569"}}>{lbl}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
