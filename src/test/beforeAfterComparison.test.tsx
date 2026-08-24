import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import BeforeAfterComparison from "@/components/BeforeAfterComparison";

class TestPointerEvent extends MouseEvent {
  pointerId: number;
  pointerType: string;
  isPrimary: boolean;

  constructor(type: string, init: PointerEventInit = {}) {
    super(type, init);
    this.pointerId = init.pointerId ?? 1;
    this.pointerType = init.pointerType ?? "touch";
    this.isPrimary = init.isPrimary ?? true;
  }
}

beforeAll(() => {
  Object.defineProperty(window, "PointerEvent", {
    configurable: true,
    value: TestPointerEvent,
  });
});

const renderComparison = () => {
  const result = render(
    <BeforeAfterComparison
      beforeSrc="/before.webp"
      afterSrc="/after.webp"
      beforeAlt="До"
      afterAlt="После"
    />,
  );
  const touchArea = result.container.querySelector<HTMLDivElement>("[data-before-after-touch-area]");

  if (!touchArea) throw new Error("Touch area is missing");
  const figure = touchArea.parentElement;
  if (!figure) throw new Error("Comparison figure is missing");

  Object.defineProperty(figure, "getBoundingClientRect", {
    value: () => ({
      x: 0,
      y: 0,
      left: 0,
      top: 0,
      right: 100,
      bottom: 100,
      width: 100,
      height: 100,
      toJSON: () => ({}),
    }),
  });

  const capturedPointers = new Set<number>();
  touchArea.setPointerCapture = vi.fn((pointerId: number) => capturedPointers.add(pointerId));
  touchArea.hasPointerCapture = vi.fn((pointerId: number) => capturedPointers.has(pointerId));
  touchArea.releasePointerCapture = vi.fn((pointerId: number) => capturedPointers.delete(pointerId));

  return { touchArea };
};

describe("BeforeAfterComparison", () => {
  it("keeps a large mobile hit area centered on the divider without covering the whole image", () => {
    const { touchArea } = renderComparison();

    expect(touchArea).toHaveClass("inset-y-0", "w-20", "touch-pan-y");
    expect(touchArea).not.toHaveClass("inset-0");
    expect(touchArea).toHaveStyle({ left: "52%" });
  });

  it("captures a horizontal drag and keeps tracking it at the image edge", () => {
    const { touchArea } = renderComparison();

    fireEvent.pointerDown(touchArea, {
      pointerId: 7,
      pointerType: "touch",
      isPrimary: true,
      clientX: 52,
      clientY: 50,
    });

    expect(touchArea.setPointerCapture).not.toHaveBeenCalled();

    fireEvent.pointerMove(touchArea, {
      pointerId: 7,
      pointerType: "touch",
      isPrimary: true,
      clientX: 70,
      clientY: 51,
    });

    expect(touchArea.setPointerCapture).toHaveBeenCalledWith(7);

    fireEvent.pointerMove(touchArea, {
      pointerId: 7,
      pointerType: "touch",
      isPrimary: true,
      clientX: 100,
      clientY: 51,
    });

    expect(screen.getByRole("slider")).toHaveValue("92");
  });

  it("does not capture a vertical or ambiguous diagonal gesture so the page can keep scrolling", () => {
    const { touchArea } = renderComparison();

    fireEvent.pointerDown(touchArea, {
      pointerId: 9,
      pointerType: "touch",
      isPrimary: true,
      clientX: 52,
      clientY: 50,
    });
    fireEvent.pointerMove(touchArea, {
      pointerId: 9,
      pointerType: "touch",
      isPrimary: true,
      clientX: 58,
      clientY: 56,
    });

    expect(touchArea.setPointerCapture).not.toHaveBeenCalled();
    expect(touchArea.releasePointerCapture).not.toHaveBeenCalled();
    expect(screen.getByRole("slider")).toHaveValue("52");
  });
});
