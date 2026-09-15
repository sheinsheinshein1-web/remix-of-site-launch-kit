import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import OtherProjectsFeed from "@/components/OtherProjectsFeed";
import { FavoritesProvider } from "@/contexts/FavoritesContext";

let intersectionCallback: IntersectionObserverCallback | undefined;

class IntersectionObserverMock implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "600px 0px";
  readonly thresholds = [0];

  constructor(callback: IntersectionObserverCallback) {
    intersectionCallback = callback;
  }

  disconnect = vi.fn();
  observe = vi.fn();
  takeRecords = vi.fn(() => []);
  unobserve = vi.fn();
}

describe("OtherProjectsFeed", () => {
  beforeEach(() => {
    intersectionCallback = undefined;
    window.sessionStorage.clear();
    vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
  });

  afterEach(() => vi.unstubAllGlobals());

  const renderFeed = () => render(
    <MemoryRouter>
      <FavoritesProvider>
        <OtherProjectsFeed currentId="36" deliveryRegion="ekaterinburg" productType="house" />
      </FavoritesProvider>
    </MemoryRouter>,
  );

  it("mounts only the initial recommendation batch", () => {
    renderFeed();

    expect(screen.getAllByRole("article")).toHaveLength(6);
    expect(screen.getAllByTestId("gallery-pagination")).toHaveLength(6);
    expect(screen.getByTestId("other-projects-load-more")).toBeInTheDocument();
  });

  it("adds one bounded batch when the sentinel approaches the viewport", () => {
    renderFeed();

    act(() => {
      intersectionCallback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(screen.getAllByRole("article")).toHaveLength(18);
  });

  it("restores the loaded recommendation batch after returning to the history entry", () => {
    const firstRender = renderFeed();

    act(() => {
      intersectionCallback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });
    expect(screen.getAllByRole("article")).toHaveLength(18);

    firstRender.unmount();
    renderFeed();

    expect(screen.getAllByRole("article")).toHaveLength(18);
  });
});
