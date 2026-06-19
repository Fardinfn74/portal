import { useEffect, useState } from 'react';
import { Cloud, Sun, Battery, HardDrive, Cpu, Activity, Paintbrush, Sparkles } from 'lucide-react';
import { usePacStore } from '../../store/usePacStore';

export function WidgetsPanel() {
  const [time, setTime] = useState(new Date());

  const dragonEnabled = usePacStore((state) => state.dragonEnabled);
  const dragonSpeed = usePacStore((state) => state.dragonSpeed);
  const setDragonEnabled = usePacStore((state) => state.setDragonEnabled);
  const setDragonSpeed = usePacStore((state) => state.setDragonSpeed);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const month = time.toLocaleString('default', { month: 'long' });
  const day = time.getDate();
  const dayName = time.toLocaleString('default', { weekday: 'long' });

  return (
    <aside className="absolute right-4 top-12 z-[5] flex w-80 flex-col gap-4">
      
      {/* Clock Widget */}
      <div className="relative overflow-hidden rounded-3xl bg-white/10 p-6 shadow-2xl backdrop-blur-xl border border-white/20 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-light">Dhaka, Bangladesh</h2>
            <div className="text-4xl font-extralight mt-2">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
            </div>
          </div>
          <div className="relative h-16 w-16">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="white"
                strokeWidth="4"
                strokeDasharray={`${(time.getSeconds() / 60) * 283} 283`}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-white/50">{time.getSeconds()}s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Widget */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-3xl bg-white/10 p-5 shadow-2xl backdrop-blur-xl border border-white/20 text-white flex flex-col justify-between">
          <div className="text-sm text-white/70">Weather</div>
          <div className="flex items-end justify-between mt-2">
            <div className="text-3xl font-light">33°</div>
            <Sun size={28} className="text-white" />
          </div>
          <div className="text-xs text-white/50 mt-1">Mostly Cloudy</div>
        </div>
        
        {/* Date Widget */}
        <div className="rounded-3xl bg-white/10 p-5 shadow-2xl backdrop-blur-xl border border-white/20 text-white flex flex-col items-center justify-center">
          <div className="text-sm font-semibold uppercase text-white/70">{month}</div>
          <div className="text-4xl font-bold">{day}</div>
          <div className="text-xs text-white/50">{dayName}</div>
        </div>
      </div>

      {/* Network Stats Widget */}
      <div className="rounded-[16px] border border-white/10 bg-white/5 p-4 backdrop-blur-md">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-white/50">Network Status</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-white/70">Ping</span>
            <span className="font-mono text-xs text-white">12ms</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-white/70">Speed</span>
            <span className="font-mono text-xs text-white">940 Mbps</span>
          </div>
        </div>
      </div>

      {/* BGM Player Widget */}
      <div className="rounded-[16px] border border-white/10 bg-white/5 p-4 backdrop-blur-md">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-white/50">Minecraft BGM</p>
        <audio 
          className="h-[40px] w-full rounded-lg opacity-80 transition-opacity hover:opacity-100"
          src="/bgm.mp3" 
          controls 
          loop
        />
      </div>



      {/* System Stats Widget */}
      <div className="rounded-3xl bg-white/10 p-5 shadow-2xl backdrop-blur-xl border border-white/20 text-white">
        <div className="flex items-center gap-2 mb-4">
          <Activity size={16} className="text-white/70" />
          <span className="text-sm font-medium text-white/70">System Monitor</span>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="flex items-center gap-1"><Cpu size={12} /> CPU</span>
              <span>12%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/10">
              <div className="h-full w-[12%] rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="flex items-center gap-1"><HardDrive size={12} /> RAM</span>
              <span>45%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/10">
              <div className="h-full w-[45%] rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="flex items-center gap-1"><Battery size={12} /> Battery</span>
              <span>95%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/10">
              <div className="h-full w-[95%] rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
            </div>
          </div>
        </div>
      </div>

    </aside>
  );
}
