import React from 'react'
import { useState, useRef, useEffect, memo } from "react"

import { HiOutlineDocumentText } from "react-icons/hi2";
import { HiOutlineSparkles } from "react-icons/hi2";
import { HiOutlineClock } from "react-icons/hi2";
import { HiOutlineChartBar } from "react-icons/hi2";

const stats = [
  { num: 50000, suffix: "+", label: "Posts Generated", icon: <HiOutlineDocumentText /> },
  { num: 98, suffix: "%", label: "Satisfaction Rate", icon: <HiOutlineSparkles /> },
  { num: 80, suffix: "%", label: "Time Saved", icon: <HiOutlineClock /> },
  { num: 6, suffix: "×", label: "Avg Reach Boost", icon: <HiOutlineChartBar /> },
];

const AnimatedNumber = memo(function AnimatedNumber({ target, suffix = "" }) {
    console.log("re-rendering again ")
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const started = useRef(false);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started.current) {
                started.current = true;
                let start = 0;
                const step = target / 60;
                const timer = setInterval(() => {
                    start += step;
                    if (start >= target) { setCount(target); clearInterval(timer); }
                    else setCount(Math.floor(start));
                }, 20);
            }
        }, { threshold: 0.5 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target]);
    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
});


export default function Stats() {




    return (
        <section
            className="relative z-10 py-14 px-4"
            style={{ background: "linear-gradient(135deg, #be185d, #9d174d)" }}
        >
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 25% 50%, white 1px, transparent 1px), radial-gradient(circle at 75% 50%, white 1px, transparent 1px)",
                    backgroundSize: "30px 30px",
                }}
            />

            <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 relative">
                {stats.map((s) => (
                    <div key={s.label} className="text-center group cursor-default">

                        <div className="text-3xl text-white mb-2 group-hover:scale-125 transition-transform duration-300 flex justify-center">
                            {s.icon}
                        </div>

                        <div className="font-display font-black text-4xl text-white mb-1">
                            <AnimatedNumber target={s.num} suffix={s.suffix} />
                        </div>

                        <div className="text-xs font-bold tracking-wide text-pink-200 uppercase">
                            {s.label}
                        </div>

                    </div>
                ))}
            </div>
        </section>
    )
}