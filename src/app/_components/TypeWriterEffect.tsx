import { ReactTyped } from "react-typed";
interface TypeWriterProps {
    display: string[];
    speed: number;
    className: string;
}
export default function TypeWriter({ display, speed, className }: TypeWriterProps) {

    return <ReactTyped
        strings={display}
        className={className}
        typeSpeed={speed}
        loop
        cursorChar="|"
        showCursor={true}
    />
}