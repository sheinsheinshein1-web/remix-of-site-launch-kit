import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import ProjectCard from "@/components/ProjectCard";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { projects } from "@/data/projects";
import { getProjectPath } from "@/lib/siteRoutes";

describe("ProjectCard", () => {
  beforeEach(() => localStorage.clear());

  it("keeps the favorite control outside the project link", () => {
    const project = projects[0];
    render(
      <MemoryRouter>
        <FavoritesProvider>
          <ProjectCard projectId={project.id} singleImage />
        </FavoritesProvider>
      </MemoryRouter>,
    );

    const link = screen.getByRole("link", { name: new RegExp(project.name, "i") });
    const favorite = screen.getByRole("button", { name: /добавить в избранное/i });

    expect(link).toHaveAttribute("href", getProjectPath(project));
    expect(favorite.closest("a")).toBeNull();
  });
});
