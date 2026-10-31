'use client';
import {useEffect,useRef,useState} from 'react';
import {FRAME_COUNT,FRAME_VERSION} from '@/lib/hero-frames';
import type {Locale} from '@/lib/muguetli';
import {TextDrum} from './text-drum';
import {useMotionPreference} from './motion-preference';
import {markHeroCriticalReady} from './arrival-ready';
import styles from './canvas-hero.module.css';

// Increase for a longer/slower scroll journey; decrease for a shorter/faster one.
export const SCROLL_VH = 600;
const FRAME_LERP = 0.1;
const CRITICAL_FRAME_COUNT = 8;
const frameUrl=(index:number)=>`/hero/frames/frame_${String(index+1).padStart(4,'0')}.webp?v=${FRAME_VERSION}`;
const clamp=(value:number)=>Math.max(0,Math.min(1,value));

export function CanvasHero({locale}:{locale:Locale}){
 const {reduced:motionReduced}=useMotionPreference();
 const track=useRef<HTMLElement>(null),canvas=useRef<HTMLCanvasElement>(null),art=useRef<HTMLDivElement>(null);
 const progress=useRef(0),active=useRef(false);
 const heroSignalled=useRef(false);
 const [mode,setMode]=useState<'desktop'|'static'|null>(null);
 const [ready,setReady]=useState(false);
 const signalHeroReady=()=>{if(heroSignalled.current)return;heroSignalled.current=true;markHeroCriticalReady();};
 useEffect(()=>{delete document.documentElement.dataset.heroCriticalReady;heroSignalled.current=false;return()=>{delete document.documentElement.dataset.heroCriticalReady;};},[]);
 useEffect(()=>{if(mode==='static'){const poster=art.current?.querySelector<HTMLImageElement>('[data-hero-poster]');if(poster?.complete&&poster.naturalWidth>0)signalHeroReady();}},[mode]);
 // Decide eligibility in its own effect before the sequence-loading effect can run.
 useEffect(()=>{const phone=matchMedia('(max-width: 768px)'),reduced=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>{progress.current=0;setReady(false);setMode(phone.matches||reduced.matches||motionReduced?'static':'desktop');};update();phone.addEventListener('change',update);reduced.addEventListener('change',update);return()=>{phone.removeEventListener('change',update);reduced.removeEventListener('change',update);};},[motionReduced]);
 useEffect(()=>{
  if(mode!=='desktop')return;
  const element=track.current,output=canvas.current,wrapper=art.current;
  if(!element||!output||!wrapper)return;
  const context=output.getContext('2d',{alpha:false});if(!context)return;
  let disposed=false,raf=0,current=0,lastDrawn=-1,width=0,height=0,loaded=0,criticalLoaded=0,inFlight=0;
  let px=0,py=0,ex=0,ey=0;
  const images=Array.from({length:FRAME_COUNT},()=>new Image());
  const requested=new Set<number>();
  const queued=new Set<number>();
  const attempts=new Uint8Array(FRAME_COUNT);
  let priorityCenter=0;
  const pump=()=>{
   while(!disposed&&inFlight<6&&queued.size){
    const index=[...queued].sort((a,b)=>Math.abs(a-priorityCenter)-Math.abs(b-priorityCenter))[0];
    queued.delete(index);inFlight++;
    const image=images[index];
    image.decoding='async';
    image.fetchPriority=index===0?'high':index<CRITICAL_FRAME_COUNT?'auto':'low';
    image.onload=()=>{
     inFlight--;if(disposed)return;
     loaded++;element.dataset.loaded=String(loaded);
     if(index<CRITICAL_FRAME_COUNT){criticalLoaded++;element.dataset.criticalLoaded=String(criticalLoaded);if(criticalLoaded>=Math.min(CRITICAL_FRAME_COUNT,FRAME_COUNT))signalHeroReady();}
     if(index===0){size();setReady(true);}else if(active.current)paint();
     pump();
    };
    image.onerror=()=>{
     inFlight--;if(disposed)return;
     if(attempts[index]<2){attempts[index]++;requested.delete(index);window.setTimeout(()=>{if(disposed||requested.has(index))return;requested.add(index);queued.add(index);pump();},250*attempts[index]);}
     pump();
    };
    image.src=frameUrl(index);
   }
  };
  const requestNearby=(center:number)=>{
   const nextCenter=Math.max(0,Math.min(FRAME_COUNT-1,Math.round(center)));
   const jump=Math.abs(nextCenter-priorityCenter);
   priorityCenter=nextCenter;
   const start=Math.max(0,priorityCenter-8),end=Math.min(FRAME_COUNT-1,priorityCenter+Math.min(42,20+jump));
   for(const index of queued)if(index<start||index>end){queued.delete(index);requested.delete(index);}
   for(let i=start;i<=end;i++)if(!requested.has(i)){requested.add(i);queued.add(i);}
   pump();
  };
  const available=(i:number)=>images[i]?.complete&&images[i]?.naturalWidth>0;
  const cover=(image:HTMLImageElement)=>{const scale=Math.max(width/image.naturalWidth,height/image.naturalHeight);const w=image.naturalWidth*scale,h=image.naturalHeight*scale;context.drawImage(image,(width-w)/2,(height-h)/2,w,h);};
  const paint=()=>{
   let lower=Math.floor(current);const requestedLower=lower;const upper=Math.min(FRAME_COUNT-1,lower+1);const blend=current-lower;
   if(!available(lower)){
    let nearest=-1;
    for(let distance=1;distance<FRAME_COUNT;distance++){
     if(lower-distance>=0&&available(lower-distance)){nearest=lower-distance;break;}
     if(lower+distance<FRAME_COUNT&&available(lower+distance)){nearest=lower+distance;break;}
    }
    if(nearest<0)return;
    lower=nearest;
   }
   context.globalAlpha=1;cover(images[lower]);
   if(lower===requestedLower&&upper!==lower&&available(upper)){context.globalAlpha=blend;cover(images[upper]);}
   context.globalAlpha=1;lastDrawn=current;output.dataset.frame=current.toFixed(4);
  };
  const size=()=>{width=output.clientWidth;height=output.clientHeight;const dpr=Math.min(devicePixelRatio||1,2);output.width=Math.round(width*dpr);output.height=Math.round(height*dpr);context.setTransform(dpr,0,0,dpr,0,0);paint();};
  const tick=()=>{
   raf=0;if(!active.current||disposed)return;
   const rect=element.getBoundingClientRect();const raw=clamp(-rect.top/Math.max(1,rect.height-innerHeight));const target=raw*(FRAME_COUNT-1);
   requestNearby(target);
   current+=(target-current)*FRAME_LERP;if(Math.abs(target-current)<.001)current=target;
   progress.current=current/Math.max(1,FRAME_COUNT-1);
   element.style.setProperty('--exit-progress',String(clamp((progress.current-.88)/.12)));element.dataset.progress=progress.current.toFixed(6);element.dataset.targetFrame=target.toFixed(4);
   if(Math.abs(lastDrawn-current)>.00001)paint();
   ex+=(px-ex)*.08;ey+=(py-ey)*.08;const fade=Math.max(0,1-current/6);
   wrapper.style.transform=`perspective(1400px) rotateX(${-ey*2.2*fade}deg) rotateY(${ex*2.2*fade}deg) translate3d(${-ex*8*fade}px,${-ey*8*fade}px,0) scale(${1+.05*fade})`;
   raf=requestAnimationFrame(tick);
  };
  const pointer=(event:PointerEvent)=>{if(event.pointerType==='touch')return;px=(event.clientX/innerWidth)*2-1;py=(event.clientY/innerHeight)*2-1;};
  const reset=()=>{px=0;py=0;};
  const observer=new IntersectionObserver(entries=>{active.current=entries[0].isIntersecting;element.dataset.active=String(active.current);if(active.current&&!raf)raf=requestAnimationFrame(tick);else if(!active.current){cancelAnimationFrame(raf);raf=0;}},{threshold:0});
  observer.observe(element);addEventListener('resize',size);addEventListener('pointermove',pointer,{passive:true});document.addEventListener('pointerleave',reset);
  // The first frame and a small look-ahead window load before later scroll positions.
  requestNearby(0);
  size();
  return()=>{disposed=true;active.current=false;cancelAnimationFrame(raf);observer.disconnect();removeEventListener('resize',size);removeEventListener('pointermove',pointer);document.removeEventListener('pointerleave',reset);images.forEach(image=>{image.onload=null;image.onerror=null;});wrapper.style.transform='none';};
 },[mode]);
 const fa=locale==='fa';
 return <section id="story" ref={track} className={styles.track} data-mode={mode||'pending'} data-frame-count={FRAME_COUNT} style={{'--scroll-vh':`${SCROLL_VH}vh`} as React.CSSProperties} aria-label={fa?'جهان موگه‌تلی':'The world of Muguetli'}>
  <div className={styles.stage}>
   <div className={styles.art} ref={art}>
    <img className={styles.poster} data-hero-poster src={frameUrl(0)} alt="" width={1920} height={1080} fetchPriority="high" decoding="async" onLoad={()=>{if(mode==='static')signalHeroReady();}}/>
    {mode==='desktop'&&<canvas ref={canvas} className={styles.canvas} data-ready={ready||undefined} aria-hidden="true"/>}
   </div>
   <div className={styles.scrimLeft}/><div className={styles.scrimRight}/><div className={styles.scrimTop}/>
   <TextDrum key={mode||'pending'} progress={progress} active={active} enabled={mode==='desktop'} locale={locale}/>
   <aside className={styles.meta} aria-label={fa?'دربارهٔ این داستان':'About this story'}>
    <div><span>{fa?'هنر / استایل / داستان':'ART / STYLE / STORY'}</span><span>{fa?'جهان موگه‌تلی':'THE WORLD OF MUGUETLI'}</span></div>
    <div><span className={styles.metaMuted}>{fa?'اکنون':'CURRENTLY'}</span><p>{fa?'از سوگ تا بیداری':'FROM GRIEF TO AWAKENING'}</p><span className={styles.metaMuted}>{fa?'این سفر':'THE JOURNEY'}</span><p>{fa?'یک آیین گذار':'A SACRED RITE OF PASSAGE'}</p></div>
    <a href="#collections">{fa?'برای کشف، اسکرول کن':'SCROLL TO EXPLORE'}<svg viewBox="0 0 20 30" width="20" height="30" fill="none" stroke="currentColor" aria-hidden="true"><path d="M10 1v26M3 20l7 7 7-7"/></svg></a>
   </aside>
   <a href="#collections" className={styles.mobileExplore}>{fa?'دیدن مجموعه‌ها':'Explore collections'} <span aria-hidden="true">↓</span></a>
  </div>
 </section>;
}
