"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";

type Vec2 = { x: number; y: number };

const DURATION = 600;
const MAX_POSITIONS = 600;

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

export default function Info({ modOn }: { modOn: boolean }) {
    const [info, setInfo] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
  
    const [positions, setPositions] = useState<Vec2[]>([]);
    const [functorIndex, setFunctorIndex] = useState(
      Math.floor(Math.random() * 5)
    );
  
    const tickRef = useRef(0);
    const viewportRef = useRef({ width: 0, height: 0 });
  
    /* -----------------------------
     * Viewport tracking (X only matters)
     */
    useEffect(() => {
        const update = () => {
            viewportRef.current.width =
              document.documentElement.clientWidth;
            viewportRef.current.height =
              document.documentElement.clientHeight;
           
          };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);
  
    /* -----------------------------
     * Motion generators
     * (Y may grow unbounded, X is clamped later)
     */
    const functors: Array<(t: number, W: number, H: number) => Vec2> = [
      // 1️⃣ Semicircle
      (t, W, H) => ({
        x: (W / 2) * (1 - Math.cos(Math.PI * t)),
        y: H * Math.sin(Math.PI * t),
      }),
  
      // 2️⃣ Diagonal noisy drift
      (t, W, H) => {
        const noise = Math.tan(t * 10) * 0.05 + Math.tan(t * 23) * 0.03;
        return {
          x: W * (t + noise),
          y: H * (t + Math.abs(noise)) * 1.2,
        };
      },
  
      // 3️⃣ Downward spiral
      (t, W, H) => ({
        x: W * 0.5 + Math.cos(t * Math.PI * 2) * W * 0.25,
        y: H * t * 1.5,
      }),
  
      // 4️⃣ Bounce → fall
      (t, W, H) => ({
        x: W * t,
        y: H * Math.abs(Math.sin(Math.PI * t)) + H * t,
      }),
  
      // 5️⃣ Ease drift downward
      (t, W, H) => {
        const eased =
          t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
        return {
          x: W * eased,
          y: H * eased * 1.8,
        };
      },
    ];
  
    /* -----------------------------
     * Animation loop
     */
    useEffect(() => {
      if (!modOn) return;
  
      const interval = setInterval(() => {
        const next = tickRef.current + 1;
        const t = next / DURATION;
  
        if (t > 1) {
          tickRef.current = 0;
          return;
        }
  
        tickRef.current = next;
  
        const { width: W, height: H } = viewportRef.current;
        const { x, y } = functors[functorIndex](t, W, H);
  
        setPositions((prev) => {

          const nextPos = {
            x: x % Math.floor(viewportRef.current.width),
            y: y % Math.floor(viewportRef.current.height),                
          };
          const next = [...prev, nextPos];
          return next.length > MAX_POSITIONS ? next.slice(1) : next;
        });
      }, 100);
  
      return () => clearInterval(interval);
    }, [modOn, functorIndex]);
  
    /* -----------------------------
     * Random functor switching
     */
    useEffect(() => {
      const interval = setInterval(
        () => setFunctorIndex(Math.floor(Math.random() * functors.length)),
        Math.random() * 10000 + 2000
      );
      return () => clearInterval(interval);
    }, []);
  
    /* -----------------------------
     * Fetch content
     */
    useEffect(() => {
      fetch("https://blip-worker.tomaszkkmaher.workers.dev/?data=info")
        .then((r) => r.json())
        .then((d) => setInfo(d.info))
        .catch(() => setError(true))
        .finally(() => { 
            setLoading(false);
            document.body.style.opacity = "1";
        }
            );
    }, []);
  
    const markdown = useMemo(
      () => (
        <ReactMarkdown remarkPlugins={[remarkBreaks]}>
          {info.replace(/\n/g, "&nbsp;\n")}
        </ReactMarkdown>
      ),
      [info]
    );

  if (loading || error) return null;

  return (
    <div className="info">
         <div id="info-source">{markdown}</div>

        <div className="info-overlay-backdrop">
            <div
                className="info-overlay"
            >
                {positions.map((p, i) => (
                <span
                    key={i}
                    className="info-absolute"
                    style={{
                    
                    transform: `translate(${p.x}px, ${(p.y)}px)`,
                    willChange: "transform",
                    }}
                >
                    {markdown}
                </span>
                ))}
            </div>
            </div>
        </div>
  );
}
