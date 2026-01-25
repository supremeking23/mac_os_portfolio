import Navbar from "#components/Navbar.tsx";
import Welcome  from "#components/Welcome.tsx";
import Dock from "#components/Dock.tsx";
import { gsap } from "gsap";

import { Draggable } from "gsap/all";
gsap.registerPlugin(Draggable);

export { Navbar, Welcome, Dock };