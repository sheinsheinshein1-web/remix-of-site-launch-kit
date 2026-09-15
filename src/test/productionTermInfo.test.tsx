import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProductionTermInfo from "@/components/ProductionTermInfo";

describe("ProductionTermInfo", () => {
  it("opens the production term disclaimer on click", () => {
    render(<ProductionTermInfo />);

    expect(screen.queryByLabelText("Пояснение о сроке производства")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Что означает срок производства" }));

    expect(screen.getByLabelText("Пояснение о сроке производства")).toHaveTextContent(
      "Он зависит от текущей загрузки производства и выбранной комплектации",
    );
  });
});
