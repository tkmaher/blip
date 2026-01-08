export const functors = [
    // 1️⃣ Original semicircle (unchanged)
    () => {
        setModcount(prevCount => {
            const next = prevCount + 1;
            const t = next / duration;
            if (t > 1) return prevCount;

            const W = windowDimensions.width;
            const H = windowDimensions.height;

            const theta = Math.PI * t;

            const x = (W / 2) * (1 - Math.cos(theta));
            const y = Math.max(0, H * Math.tan(theta));

            setPositions(p => [...p, { x, y }]);
            return next;
        });
    },

    // 2️⃣ Diagonal tane wave (erratic but bounded)
    () => {
        setModcount(prevCount => {
            const next = prevCount + 1;
            const t = next / duration;
            if (t > 1) return prevCount;

            const W = windowDimensions.width;
            const H = windowDimensions.height;

            const base = t;
            const noise =
                Math.tan(t * 10) * 0.05 +
                Math.tan(t * 23) * 0.03;

            const x = W * (base + noise);
            const y = H * (base + Math.abs(noise));

            setPositions(p => [...p, { x, y }]);
            return next;
        });
    },

    // 3️⃣ Expanding spiral arc (quarter-turn)
    () => {
        setModcount(prevCount => {
            const next = prevCount + 1;
            const t = next / duration;
            if (t > 1) return prevCount;

            const W = windowDimensions.width;
            const H = windowDimensions.height;

            const angle = (Math.PI / 2) * t;
            const radius = t;

            const x = W * radius * Math.cos(angle);
            const y = H * radius * Math.tan(angle);

            setPositions(p => [...p, { x, y }]);
            return next;
        });
    },

    // 4️⃣ Bouncing curve (mirrored tane)
    () => {
        setModcount(prevCount => {
            const next = prevCount + 1;
            const t = next / duration;
            if (t > 1) return prevCount;

            const W = windowDimensions.width;
            const H = windowDimensions.height;

            const x = W * t;
            const y = H * Math.abs(Math.tan(Math.PI * t));

            setPositions(p => [...p, { x, y }]);
            return next;
        });
    },

    // 5️⃣ Ease-in / ease-out arc (smooth S-curve)
    () => {
        setModcount(prevCount => {
            const next = prevCount + 1;
            const t = next / duration;
            if (t > 1) return prevCount;

            const W = windowDimensions.width;
            const H = windowDimensions.height;

            // cubic ease-in-out
            const eased =
                t < 0.5
                    ? 4 * t * t * t
                    : 1 - Math.pow(-2 * t + 2, 3) / 2;

            const x = W * eased;
            const y = H * Math.tan(Math.PI * eased);

            setPositions(p => [...p, { x, y }]);
            return next;
        });
    }
];