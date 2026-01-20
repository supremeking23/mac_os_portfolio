import { useRef } from "react";
import { Tooltip } from "react-tooltip";
import gsap from "gsap";

import { dockApps } from "#constants";
import { useGSAP } from "@gsap/react";
import useWindowsStore from "#store/window";
import type { ToggleAppParams, WindowKey } from "#types";

const Dock = () => {
    const {openWindow, closeWindow, windows } = useWindowsStore();
    const dockRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const dock = dockRef.current;
        if(!dock) return;

        const icons = dock.querySelectorAll(".dock-icon");

        const animateIcons = (mouseX: number) => {
            const {left} = dock.getBoundingClientRect();

            icons.forEach((icon) => {
                const {left: iconLeft, width} = icon.getBoundingClientRect();
                const center = iconLeft - left + width / 2;
                const distance = Math.abs(mouseX - center);

                // Gaussian falloff: intensity = 1 when distance = 0, decreases smoothly as distance increases
                // The 10000 divisor controls the "spread" - larger = wider effect radius
                const intensity = Math.exp(-(distance ** 2.5) / 10000);

                gsap.to(icon, {
                    scale: 1 + 0.25 * intensity,
                    y: -15 * intensity,
                    duration: 0.2,
                    ease: "power1.out",
                });
            });
        };

        const handleMouseMove = (event: MouseEvent) => {
            const { left } = dock.getBoundingClientRect();
            animateIcons(event.clientX - left);
        };

        const resetIcons = () => icons.forEach((icon) => gsap.to(icon, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out",
        }));

        dock.addEventListener("mousemove", handleMouseMove);
        dock.addEventListener("mouseleave", resetIcons);

        // Return cleanup function (called when component unmounts)
        return () => {
            dock.removeEventListener("mousemove", handleMouseMove);
            dock.removeEventListener("mouseleave", resetIcons);
        }

    },[]);  

    // Handles opening/closing a window when a dock icon is clicked
    const toggleApp = (app: ToggleAppParams) => {
        if (!app.canOpen) return;

        // Safe to cast: we only reach here if canOpen is true,
        // meaning the app has a corresponding window config
        const windowKey = app.id as WindowKey;
        const window = windows[windowKey];

        if (!window) {
            console.error(`No window found for app ID: ${app.id}`);
            return;
        }

        if (window.isOpen) {
            closeWindow(windowKey);
        } else {
            openWindow(windowKey);
        }
    };
  return (
    <section id="dock">
    <div ref={dockRef} className="dock-container">
        {dockApps.map(({id, name, icon, canOpen}) => (
            <div key={id} className="relative flex justify-center">
                <button 
                    type="button"
                    className="dock-icon"
                    aria-label={name}
                    data-tooltip-id="dock-tooltip"
                    data-tooltip-content={name}
                    data-tooltip-delay-show={150}
                    disabled={!canOpen}
                    onClick={() => toggleApp({id, canOpen})}
                >
                    <img 
                        src={`/images/${icon}`}
                        alt={name}
                        loading="lazy"
                        className={canOpen ? "" : "opacity-60"}
                    />
                </button>
            </div>
        ))}
        <Tooltip 
            id="dock-tooltip" 
            place="top" 
            className="tooltip"
        />
    </div>
  </section>
  );
}

export default Dock;
