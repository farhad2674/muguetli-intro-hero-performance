import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, unlinkSync, writeFileSync, statSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';

const root = process.cwd();
const input = path.resolve(process.argv[2] || 'final.mp4');
if (!existsSync(input)) throw new Error(`Video not found: ${input}. Supply the actual source as the first argument.`);
const framesDir = path.resolve(root, 'public/hero/frames');
if (!framesDir.startsWith(root + path.sep) || path.basename(framesDir) !== 'frames') throw new Error('Unsafe output directory');
const ffmpeg = process.env.FFMPEG_PATH || 'ffmpeg';
const ffprobe = process.env.FFPROBE_PATH || 'ffprobe';
const probe = spawnSync(ffprobe, ['-v','error','-show_entries','format=duration:stream=width,height','-select_streams','v:0','-of','json',input], {encoding:'utf8'});
if (probe.status !== 0 || probe.error) throw new Error(probe.stderr || String(probe.error));
const metadata = JSON.parse(probe.stdout);
const duration = Number(metadata.format.duration);
if (!Number.isFinite(duration) || duration <= 0) throw new Error('Invalid video duration');
let fps = Math.max(12, Math.min(30, Math.round(400 / duration)));
mkdirSync(framesDir,{recursive:true});
const clean = () => { for (const file of readdirSync(framesDir)) { if (/^frame_\d{4,}\.(?:jpg|webp)$/.test(file)) unlinkSync(path.join(framesDir,file)); } };
let files=[];
for(let attempt=0;attempt<3;attempt++) {
 clean();
 const result=spawnSync(ffmpeg,['-hide_banner','-loglevel','error','-y','-i',input,'-vf',`fps=${fps},scale=1920:-2`,'-c:v','libwebp','-quality','74','-compression_level','4','-start_number','1',path.join(framesDir,'frame_%04d.webp')],{stdio:'inherit'});
 if(result.status!==0 || result.error)throw new Error(`ffmpeg failed: ${result.error||result.status}`);
 files=readdirSync(framesDir).filter(f=>/^frame_\d{4}\.webp$/.test(f)).sort();
 if(files.length<=600)break;
 clean();fps=Math.max(1,Math.floor(590/duration));
}
if(!files.length || files.length>600)throw new Error('Frame extraction did not produce 1–600 images');
files.forEach((name,i)=>{if(name!==`frame_${String(i+1).padStart(4,'0')}.webp`)throw new Error('Non-contiguous sequence');});
const report={source:path.relative(root,input).replaceAll('\\','/'),duration,fps,count:files.length,width:1920,height:Math.round(metadata.streams[0].height/metadata.streams[0].width*1920/2)*2,bytes:files.reduce((sum,f)=>sum+statSync(path.join(framesDir,f)).size,0)};
report.version=createHash('sha256').update(readFileSync(input)).update(`1920:webp74:${fps}`).digest('hex').slice(0,12);
writeFileSync(path.join(root,'public/hero/manifest.json'),JSON.stringify(report,null,2)+'\n');
writeFileSync(path.join(root,'lib/hero-frames.ts'),`// Generated from counted files by scripts/extract-hero.mjs. Do not guess this value.\nexport const FRAME_COUNT = ${report.count};\nexport const FRAME_WIDTH = ${report.width};\nexport const FRAME_HEIGHT = ${report.height};\nexport const FRAME_FPS = ${report.fps};\nexport const FRAME_SOURCE = ${JSON.stringify(report.source)};\n`);
writeFileSync(path.join(root,'lib/hero-frames.ts'),`export const FRAME_VERSION = ${JSON.stringify(report.version)};\n`,{flag:'a'});
console.log(JSON.stringify(report,null,2));
