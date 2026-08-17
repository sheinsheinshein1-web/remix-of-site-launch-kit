import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqListProps = {
  items: FaqItem[];
  idPrefix: string;
};

const FaqList = ({ items, idPrefix }: FaqListProps) => (
  <Accordion type="single" collapsible className="border-b border-border">
    {items.map((item, index) => (
      <AccordionItem
        key={item.question}
        value={`${idPrefix}-${index}`}
        className="border-b border-border last:border-b-0"
      >
        <AccordionTrigger className="min-h-[68px] w-full gap-5 py-4 text-left text-[16px] font-medium leading-snug text-[#342d27] transition-colors duration-200 hover:text-primary hover:no-underline active:text-primary focus-visible:text-primary focus-visible:outline-none data-[state=open]:text-primary md:min-h-[76px] md:text-[18px] [&>svg]:h-4 [&>svg]:w-4 [&>svg]:text-primary">
          {item.question}
        </AccordionTrigger>
        <AccordionContent className="max-w-[760px] pb-5 pr-8 text-[12px] leading-relaxed text-muted-foreground md:text-[14px]">
          {item.answer}
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
);

export default FaqList;
