import blueprintHome from "@/assets/blueprint-home.jpg";

const BlueprintSection = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-[1400px] mx-auto px-6 flex justify-center">
        <img
          src={blueprintHome}
          alt="Чертёж модульного дома"
          loading="lazy"
          width={1280}
          height={720}
          className="max-w-4xl w-full opacity-50"
        />
      </div>
    </section>
  );
};

export default BlueprintSection;
