import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const LandingPage = () => {
  const [longUrl, setLongUrl] = useState("");
  const navigate = useNavigate();

  const handleShorten = (e) => {
    e.preventDefault();
    if (longUrl) navigate(`/auth?createNew=${longUrl}`);
  };

  return (
    <div className="flex flex-col items-center px-4 sm:px-8 lg:px-16">
      {/* Title */}
      <h2 className="my-10 sm:my-16 text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white text-center font-extrabold">
        The only URL Shortener <br /> you&rsquo;ll ever need! 👇
      </h2>

      {/* Form */}
      <form
        onSubmit={handleShorten}
        className="sm:h-14 flex flex-col sm:flex-row w-full md:w-2/3 lg:w-1/2 gap-3 sm:gap-2"
      >
        <Input
          type="url"
          placeholder="Enter your loooong URL"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          className="h-full flex-1 py-4 px-4"
        />
        <Button
          type="submit"
          className="h-full w-full sm:w-auto px-6 py-4"
          variant="destructive"
        >
          Shorten!
        </Button>
      </form>

      {/* Image */}
      <img
        src="/Front_Page.jpg"
        className="w-full sm:w-3/4 lg:w-2/3 my-11 md:px-11 rounded-lg shadow-lg h-auto object-contain"
        alt="Landing Page Visual"
      />

      {/* Accordion Section */}
      <Accordion
        type="multiple"
        collapsible
        className="w-full md:w-3/4 lg:w-2/3 md:px-11"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>How does this URL shortener work?</AccordionTrigger>
          <AccordionContent>
            When you enter a long URL, the system generates a shorter version of
            that URL. This shortened URL redirects to the original long URL when
            accessed.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>
            Do I need an account to use the app?
          </AccordionTrigger>
          <AccordionContent>
            Yes. Creating an account allows you to manage your URLs.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>Why you should use this?</AccordionTrigger>
          <AccordionContent>
            You should use this setup for high availability, automatic scaling
            based on traffic, improved fault tolerance, and efficient resource
            management, ensuring optimal performance and cost-effectiveness
            under varying loads.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default LandingPage;
