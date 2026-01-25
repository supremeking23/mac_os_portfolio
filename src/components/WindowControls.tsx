import useWindowsStore from "#store/window";
import type { WindowKey } from "#types";

const WindowControl = ({target}: {target: WindowKey}) => {
    const { closeWindow } = useWindowsStore();
    return(<div id="window-controls">
        <div className="close" onClick={() => closeWindow(target)}/>
        {/* TODO: Add minimize and maximize functionality */}
        <div className="minimize" />
        <div className="maximize"/>
    </div>);
};

export default WindowControl;


