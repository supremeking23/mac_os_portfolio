import { techStack } from "#constants";
import WindowWrapper from "#hoc/WindowWrapper";
import { Check, Flag } from "lucide-react";
import WindowControls from "#components/WindowControls";

const Terminal = () => {
  return (
    <>
        <div id="window-header">
            <WindowControls target="terminal" />
            <h2>Tech Stack</h2>
        </div>

        <div className="techstack">
            <p>
                <span className="font-bold">@ivan % </span>
                show tech stack
            </p>
            <div className="label">
                <p className="w-32">Category</p>
                <p>Terminologies</p>
            </div>

            <ul className="content">
               {techStack.map(({ category, items}) => (
                 <li className="flex">
                    <Check className="check" />
                    <h3>{category}</h3>
                    <ul>
                        {items.map((item, index) =>(
                            <li key={index}>{item} {index < items.length - 1 ? "•" : ""}</li>
                        ))}
                    </ul>
                 </li>
               ))}
            </ul>

            <div className="footnote">
                <p>
                    <Check size={20} /> 5 of 5stacks loaded successfully. (100%)
                </p>
                <p className="text-black">
                    <Flag size={15} fill="black" /> Render time: 0.0234s
                </p>
            </div>
        </div>
    </>
    );
};

const TerminalWindow = WindowWrapper(Terminal, "terminal");
export default TerminalWindow;

