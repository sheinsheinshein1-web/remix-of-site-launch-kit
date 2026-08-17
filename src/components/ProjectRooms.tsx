type ProjectRoomsProps = {
  beds: number;
  baths: number;
  kitchens?: number;
  className?: string;
};

type RoomRow = {
  label: string;
  value: number;
};

const wordForm = (count: number, forms: [string, string, string]) => {
  const mod100 = Math.abs(count) % 100;
  const mod10 = mod100 % 10;
  if (mod100 > 10 && mod100 < 20) return forms[2];
  if (mod10 > 1 && mod10 < 5) return forms[1];
  if (mod10 === 1) return forms[0];
  return forms[2];
};

export const getProjectRoomRows = ({ beds, baths, kitchens }: Omit<ProjectRoomsProps, "className">): RoomRow[] => [
  ...(beds > 0
    ? [{ label: wordForm(beds, ["Спальня", "Спальни", "Спален"]), value: beds }]
    : []),
  ...(typeof kitchens === "number" && kitchens > 0
    ? [{ label: wordForm(kitchens, ["Кухня", "Кухни", "Кухонь"]), value: kitchens }]
    : []),
  ...(baths > 0
    ? [{ label: wordForm(baths, ["Санузел", "Санузла", "Санузлов"]), value: baths }]
    : []),
];

const ProjectRooms = ({ beds, baths, kitchens, className = "" }: ProjectRoomsProps) => {
  const rows = getProjectRoomRows({ beds, baths, kitchens });

  if (rows.length === 0) return null;

  return (
    <section className={`mt-10 ${className}`} aria-labelledby="project-rooms-heading">
      <h3 id="project-rooms-heading" className="text-[20px] font-semibold text-[#342d27] dark:text-foreground">
        Помещения
      </h3>
      <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:gap-x-12 md:max-w-[680px]">
        {rows.map(({ label, value }) => (
          <div key={label} className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3 text-[14px] sm:text-[15px]">
            <dt className="text-[#717b8e]">{label}</dt>
            <dd className="font-medium tabular-nums text-[#342d27] dark:text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default ProjectRooms;
