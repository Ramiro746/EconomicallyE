import { useEffect, useRef } from 'react';
import anime from 'animejs';
import './SpiralAnimation.css';

const SpiralAnimation = () => {
    const spiralPathRef = useRef(null);

    useEffect(() => {
        const spiralPath = spiralPathRef.current;
        if (!spiralPath) return;

        function createSpiralPath() {
            const centerX = 68;
            const centerY = 59;
            const totalPoints = 75;
            let path = `M ${centerX} ${centerY}`;

            for (let i = 0; i < totalPoints; i++) {
                const angle = i * 0.2;
                const scale = 0.9;
                const radius = scale * 2.5 * angle;
                const x = centerX + radius * Math.cos(-angle);
                const y = centerY + radius * Math.sin(-angle);
                path += ` L ${x} ${y}`;
            }
            return path;
        }

        spiralPath.setAttribute('d', createSpiralPath());

        const pathLength = spiralPath.getTotalLength();
        spiralPath.setAttribute('stroke-dasharray', pathLength);
        spiralPath.setAttribute('stroke-dashoffset', pathLength);

        anime({
            targets: spiralPath,
            strokeDashoffset: [pathLength, 0],
            duration: 2000,
            easing: 'easeInOutSine',
            autoplay: true,
        });
    }, []);

    return (
        <div className="logo-container">
            <svg
                id="spiral-svg"
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid meet"
            >
                <defs>
                    <mask id="spiral-mask" >
                        <path
                            ref={spiralPathRef}
                            stroke="white"
                            strokeWidth="14"
                            fill="none"
                        />
                    </mask>
                </defs>
            </svg>

            <img
                src="/uzumaki.png"
                className="logo-img"
                style={{
                    mask: 'url(#spiral-mask)',
                    WebkitMask: 'url(#spiral-mask)'
                }}
                alt="Logo EconomicallyE"
            />
        </div>
    );
};

export default SpiralAnimation;