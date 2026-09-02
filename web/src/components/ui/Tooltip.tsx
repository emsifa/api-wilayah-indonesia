import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  arrow,
} from "@floating-ui/react";
import { useRef, useState } from "react";

export function Tooltip({
  content,
  children,
  placement = "top",
}: {
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const arrowRef = useRef(null);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [offset(6), flip(), shift({ padding: 8 }), arrow({ element: arrowRef })],
  });

  const hover = useHover(context, { move: false, delay: { open: 100, close: 50 } });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);

  const { x, y } = (context as unknown as { middlewareData: { arrow?: { x?: number; y?: number } } }).middlewareData
    ?.arrow ?? {};

  const staticSide =
    {
      top: "bottom",
      right: "left",
      bottom: "top",
      left: "right",
    }[placement] ?? "bottom";

  return (
    <>
      <span ref={refs.setReference} {...getReferenceProps()} className="inline-flex">
        {children}
      </span>
      {open && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-[60] max-w-[220px] rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-medium leading-relaxed text-white shadow-xl"
          >
            {content}
            <div
              ref={arrowRef}
              className="absolute h-2 w-2 rotate-45 bg-slate-900"
              style={{
                left: x != null ? `${x}px` : "",
                top: y != null ? `${y}px` : "",
                [staticSide]: "-4px",
              }}
            />
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
