"use client";
import remarkBreaks from "remark-breaks";
import { useEffect, useState, useMemo } from "react";
import ReactMarkdown from 'react-markdown';

const getWindowDimensions = () => {
    // Use window.innerWidth and innerHeight for the viewport size
    const width = window.innerWidth;
    const height = window.innerHeight;
    return {
      width,
      height
    };
};

export default function Info(props: {modOn: boolean}) {

    const [info, setInfo] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [modCount, setModcount] = useState(0);
    const [positions, setPositions] = useState<{x: number, y: number}[]>([]);
    const [functor, setFunctor] = useState(Math.floor(Math.random() * 5));

    const [windowDimensions, setWindowDimensions] = useState<{width: number, height: number}>({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0
    });

    const duration = 100;

    const functors = [
        // 1️⃣ Original semicircle (unchanged)
        () => {
            setModcount(prevCount => {
                const next = prevCount + 1;
                const t = next / duration;
                if (t > 1) return 0;
    
                const W = windowDimensions.width;
                const H = windowDimensions.height;
    
                const theta = Math.PI * t;
    
                const x = ((W / 2) * (1 - Math.cos(theta))) % W;
                const y = (Math.max(0, H * Math.sin(theta))) % H;
    
                setPositions(p => [...p, { x, y }]);
                return next;
            });
        },
    
        // 2️⃣ Diagonal tane wave (erratic but bounded)
        () => {
            setModcount(prevCount => {
                console.log(prevCount);
                const next = prevCount + 1;
                const t = next / duration;
                if (t > 1) return 0;
    
                const W = windowDimensions.width;
                const H = windowDimensions.height;
    
                const base = t;
                const noise =
                    Math.tan(t * 10) * 0.05 +
                    Math.tan(t * 23) * 0.03;
    
                const x = (W * (base + noise)) % W;
                const y = (H * (base + Math.abs(noise))) % H;
    
                setPositions(p => [...p, { x, y }]);
                return next;
            });
        },
    
        // 3️⃣ Expanding spiral arc (quarter-turn)
        () => {
            setModcount(prevCount => {
                console.log(prevCount);
                const next = prevCount + 1;
                const t = next / duration;
                if (t > 1) return 0;
    
                const W = windowDimensions.width;
                const H = windowDimensions.height;
    
                const angle = (Math.PI / 2) * t;
                const radius = t;
    
                const x = (W * radius * Math.cos(angle)) % W;
                const y = (H * radius * Math.tan(angle)) % H;
    
                setPositions(p => [...p, { x, y }]);
                return next;
            });
        },
    
        // 4️⃣ Bouncing curve (mirrored tane)
        () => {
            setModcount(prevCount => {
                console.log(prevCount);
                const next = prevCount + 1;
                const t = next / duration;
                if (t > 1) return 0;
    
                const W = windowDimensions.width;
                const H = windowDimensions.height;
    
                const x = (W * t) % W;
                const y = (H * Math.abs(Math.sin(Math.PI * t))) % H;
    
                setPositions(p => [...p, { x, y }]);
                return next;
            });
        },
    
        // 5️⃣ Ease-in / ease-out arc (smooth S-curve)
        () => {
            setModcount(prevCount => {
                console.log(prevCount);
                const next = prevCount + 1;
                const t = next / duration;
                if (t > 1) return 0;
    
                const W = windowDimensions.width;
                const H = windowDimensions.height;
    
                // cubic ease-in-out
                const eased =
                    t < 0.5
                        ? 4 * t * t * t
                        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    
                const x = (W * eased) % W;
                const y = (H * Math.tan(Math.PI * eased)) % H;
    
                setPositions(p => [...p, { x, y }]);
                return next;
            });
        }
    ];


    useEffect(() => {
        if (positions.length > 600) {
            setPositions(positions.slice(1));
        }
    }, [positions]);


    useEffect(() => {
        if (!props.modOn) {
            return;
        }
        
    
        const interval = setInterval(functors[functor], 100);
    
        return () => {
            clearInterval(interval);
        }
    }, [props.modOn, functor]);

    useEffect(() => {
        const newFunctor = setInterval(() => setFunctor(Math.floor(Math.random() * functors.length)), Math.random() * 10000 + 2000);
        return () => {
            clearInterval(newFunctor);
        }
    }, []);

    useEffect(() => {
        const handleResize = () => setWindowDimensions(getWindowDimensions());
        window.addEventListener('resize', handleResize);

        fetch("https://blip-worker.tomaszkkmaher.workers.dev/?data=info", { next: { revalidate: 3600 } })
        .then((res) => res.json())
        .then((data) => {
            console.log("Fetched info:", data);
            setInfo(data.info);
            setLoading(false);
        }).catch(() => {
            setError(true); 
            setLoading(false);
        }).finally(() => {
            document.body.style.opacity = "1";
        });

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const renderedMarkdown = useMemo(() => (
        <ReactMarkdown remarkPlugins={[remarkBreaks]}>
            {info.replace(/\n/g, "&nbsp; \n")}
        </ReactMarkdown>
    ), [info]);
    

    return (
        <div className="info">
            {!loading && !error && (
                <div id="info-source">
                    <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                        {info.replace(/\n/g, "&nbsp; \n")}
                    </ReactMarkdown>
                    {positions.map((pos, i) => (
                        <div id="absolute-parent" key={i}>
                            <span
                                className="info-absolute"
                                style={{
                                    transform: `translate(${pos.x + i}px, ${pos.y}px) 
                                    `,
                                }}
                            >
                                {renderedMarkdown}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            
        </div>
    )
}