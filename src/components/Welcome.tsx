import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * Font weight configuration for variable font animation.
 * Variable fonts allow smooth transitions between font weights (unlike static fonts).
 * - min: lightest weight when mouse is far away
 * - max: boldest weight when mouse is directly over the letter
 * - default: the starting/resting weight
 */
const FONT_WEIGHTS = {
    subtitle: {min: 100, max: 400, default: 100},
    title: {min: 400, max: 900, default: 400}
};

/**
 * Splits text into individual <span> elements for per-letter animation.
 * Each letter gets its own span so we can animate them independently.
 * 
 * Accessibility: The container element has aria-label set to the original text
 * and role="text", while each individual letter span is marked with aria-hidden="true"
 * so screen readers announce only the aria-label, not each letter individually.
 * 
 * @param text - The text to render
 * @param className - Tailwind/CSS classes to apply to each letter
 * @param baseWeight - Initial font weight (using CSS fontVariationSettings for variable fonts)
 * 
 * Note: "\u00A0" is a non-breaking space - regular spaces would collapse in HTML
 */
const renderText = (text:string, className?:string, baseWeight:number = 400) => {
    return (
        <span aria-label={text} role="text">
            {[...text].map((char, index) => (
                <span key={index} className={className} style={{fontVariationSettings: `'wght' ${baseWeight}`}} aria-hidden="true">
                    {char ===" " ? "\u00A0" : char}
                </span>
            ))}
        </span>
    )
};

/**
 * Sets up mouse-tracking hover animation for text.
 * Letters get bolder as the mouse gets closer to them (proximity-based effect).
 * 
 * @param container - The DOM element containing the letter spans
 * @param type - "title" or "subtitle" to determine weight range
 * @returns Cleanup function to remove event listeners
 */
const setupTextHover = (container: HTMLElement, type:"title" | "subtitle") => {
    if (!container) return;

    // Get all letter spans inside the container
    const letters = container.querySelectorAll("span");
    const {min, max, default: base} = FONT_WEIGHTS[type];

    /**
     * Animates a letter's font weight using GSAP.
     * GSAP smoothly transitions the fontVariationSettings property.
     */
    const animateLetter = (letter:any, weight:any, duration = 0.25 ) => {
        gsap.to(letter, {
            duration,
            ease: "power2.out",
             fontVariationSettings: `'wght' ${weight}`,
        });
    }

    /**
     * Handles mouse movement - calculates distance from mouse to each letter
     * and adjusts font weight based on proximity.
     * 
     * ANIMATION FIX EXPLANATION:
     * getBoundingClientRect() returns positions relative to the VIEWPORT (browser window).
     * But we need positions relative to the CONTAINER for accurate distance calculation.
     * 
     * Original buggy code:
     *   mouseX = event.clientX - container.left  (relative to container ✓)
     *   letterCenter = letter.left + letter.width/2  (relative to viewport ✗)
     *   
     * Fixed code:
     *   mouseX = event.clientX - containerRect.left  (relative to container ✓)
     *   letterCenterX = letterRect.left - containerRect.left + letterRect.width/2  (relative to container ✓)
     *   
     * Now both mouseX and letterCenterX use the same coordinate system!
     */
    const handleMouseMove = (event: MouseEvent) => {
        const containerRect = container.getBoundingClientRect();
        // Convert mouse position from viewport coords to container-relative coords
        const mouseX = event.clientX - containerRect.left;

        letters.forEach((letter) => {
            const letterRect = letter.getBoundingClientRect();
            // Convert letter center from viewport coords to container-relative coords
            const letterCenterX = letterRect.left - containerRect.left + letterRect.width / 2;
            // Distance between mouse and letter center
            const distance = Math.abs(mouseX - letterCenterX);
            
            // Gaussian falloff: intensity = 1 when distance = 0, decreases smoothly as distance increases
            // The 10000 divisor controls the "spread" - larger = wider effect radius
            const intensity = Math.exp(-(distance ** 2) / 10000);

            // Calculate weight: starts at min, increases toward max based on intensity
            animateLetter(letter, min + (max - base) * intensity);
        })
    }

    // Reset all letters to base weight when mouse leaves
    const handleMouseLeave = () => animateLetter(letters, base, 0.3);
    
    // Attach event listeners
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    // Return cleanup function (called when component unmounts)
    return () => {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
    }
};

const Welcome = () => {
    /**
     * useRef vs useState vs useEffect:
     * 
     * - useState: For data that, when changed, should re-render the component.
     *   Example: counter value, form input, toggle state
     *   
     * - useEffect: For side effects (things outside React's render cycle).
     *   Example: API calls, subscriptions, DOM manipulation after render
     *   
     * - useRef: For values that persist across renders WITHOUT causing re-renders.
     *   Two main uses:
     *   1. Accessing DOM elements directly (like document.getElementById but React-way)
     *   2. Storing mutable values that don't need to trigger re-renders
     *   
     * Here we use useRef to get direct access to the <h1> and <p> DOM elements.
     * We need the actual DOM nodes to:
     *   - Query their child <span> elements
     *   - Attach mouse event listeners
     *   - Get their positions via getBoundingClientRect()
     *   
     * The generic type <HTMLHeadingElement> tells TypeScript what DOM element type
     * the ref will hold. This provides autocomplete and type checking.
     * - HTMLHeadingElement for <h1>, <h2>, etc.
     * - HTMLParagraphElement for <p>
     * - HTMLDivElement for <div>
     * - HTMLInputElement for <input>
     */
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subTitleRef = useRef<HTMLParagraphElement>(null);

    /**
     * useGSAP is GSAP's React hook - similar to useEffect but optimized for GSAP.
     * It automatically cleans up GSAP animations when the component unmounts.
     * 
     * The empty dependency array [] means this runs once after the component mounts.
     * At that point, the refs will have their .current values populated with DOM elements.
     * 
     * The ?. (optional chaining) in cleanup handles the case where setupTextHover
     * returns undefined (if container was null).
     */
    useGSAP(() => {
        const titleCleanup = setupTextHover(titleRef.current as HTMLElement, "title");
        const subTitleCleanup = setupTextHover(subTitleRef.current as HTMLElement, "subtitle");

        return () => {
            subTitleCleanup?.();
            titleCleanup?.();
        }
    }, []);

  return (
    <section id="welcome">     
        {/* ref={subTitleRef} connects this <p> element to our useRef variable */}
        {/* After render, subTitleRef.current will be this actual DOM node */}
        <p ref={subTitleRef}>{renderText
            ("Hey, I'm Ivan! Welcome to my", "text-3xl font-georama",100)}
        </p>
        <h1 ref={titleRef} className="mt-7">
            {renderText
            ("Portfolio", "text-9xl italic font-georama")}
        </h1>

        <div className="small-screen">
            <p>This Portfolio is designed for desktop/tablet screens only</p>
        </div>
    </section>
    );
};

export default Welcome;
