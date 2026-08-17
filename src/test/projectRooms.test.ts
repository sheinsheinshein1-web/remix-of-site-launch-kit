import { describe, expect, it } from "vitest";
import { getProjectRoomRows } from "@/components/ProjectRooms";

describe("getProjectRoomRows", () => {
  it("uses the same bedroom and bathroom rows for every project", () => {
    expect(getProjectRoomRows({ beds: 2, baths: 1 })).toEqual([
      { label: "Спальни", value: 2 },
      { label: "Санузел", value: 1 },
    ]);
  });

  it("shows a kitchen only when it is present in verified project data", () => {
    expect(getProjectRoomRows({ beds: 3, kitchens: 1, baths: 2 })).toEqual([
      { label: "Спальни", value: 3 },
      { label: "Кухня", value: 1 },
      { label: "Санузла", value: 2 },
    ]);
  });
});
