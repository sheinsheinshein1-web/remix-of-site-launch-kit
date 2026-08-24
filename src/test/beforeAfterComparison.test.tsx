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

  Object.defineProperty(touchArea, "getBoundingClientRect", {
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
  it("captures a touch immediately and keeps dragging at the image edge", () => {
    const { touchArea } = renderComparison();

    fireEvent.pointerDown(touchArea, {
      pointerId: 7,
      pointerType: "touch",
      isPrimary: true,
      clientX: 52,
      clientY: 50,
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

  it("releases a vertical gesture so the page can keep scrolling", () => {
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
      clientX: 53,
      clientY: 70,
    });

    expect(touchArea.releasePointerCapture).toHaveBeenCalledWith(9);
    expect(screen.getByRole("slider")).toHaveValue("52");
  });
});
