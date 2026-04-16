const TaglineSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-[1400px] mx-auto px-6 text-center">
        <h2 className="jumbo-text text-primary leading-tight mb-6">
          От дома до бани —<br />все модульные решения<br />в одном месте
        </h2>
        <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Никаких звонков менеджерам и недель ожидания ответа. Смотрите проекты, считайте стоимость и выбирайте производителя так, как вам удобно.
        </p>
      </div>
      {/* Separator lines like Dwellito */}
      <div className="max-w-[1400px] mx-auto mt-12 px-6 grid grid-cols-4 gap-0">
        <div className="line-separator" />
        <div className="line-separator" />
        <div className="line-separator" />
        <div className="line-separator" />
      </div>
    </section>
  );
};

export default TaglineSection;
