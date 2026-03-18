import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How long does it take to switch energy supplier?",
    answer:
      "Typically it takes 3–5 working days. You'll have a 14-day cooling-off period where you can cancel without paying any fees if you change your mind.",
  },
  {
    question: "What is the energy price cap?",
    answer:
      "The energy price cap, set by Ofgem every quarter, limits the unit rates and standing charges for customers on standard variable tariffs. It doesn't cap your total bill — the more energy you use, the more you'll pay.",
  },
  {
    question: "Can I switch supplier if I have a smart meter?",
    answer:
      "Absolutely. Smart meters don't stop you from switching, regardless of which supplier fitted them. You may just need to submit manual readings briefly while the new supplier connects.",
  },
  {
    question: "What information do I need to get a quote?",
    answer:
      "Having a recent bill handy helps us give an accurate quote. Otherwise, we can estimate based on your home type and household size. At minimum you'll need your postcode, house number, and whether you want gas, electricity, or both.",
  },
  {
    question: "Can I switch energy supplier if I rent?",
    answer:
      "If you pay your energy supplier directly, you're free to switch whenever you like. If your landlord pays, you'll need their permission. Check your tenancy agreement if unsure.",
  },
  {
    question: "Why do some tariffs require smart meters?",
    answer:
      "Smart meters send readings automatically (as often as every 30 minutes), enabling time-of-use tariffs like off-peak EV charging or half-price Sunday electricity. This granular data lets suppliers offer special pricing windows.",
  },
  {
    question: "What does dual fuel mean?",
    answer:
      "Dual fuel simply means getting both gas and electricity from the same supplier on one contract — one account, one bill, and often a small discount for bundling.",
  },
];

const EnergyFAQ = () => {
  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          <CardTitle className="font-display">Frequently Asked Questions</CardTitle>
        </div>
        <CardDescription>
          Common questions about switching, tariffs &amp; smart meters
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-sm">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default EnergyFAQ;
