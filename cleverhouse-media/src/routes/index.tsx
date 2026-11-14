import { createFileRoute } from "@tanstack/react-router";
import { seo } from "../lib/seo";
import { Splash } from "../components/home/Splash";
import { Hero } from "../components/home/Hero";
import { Intro } from "../components/home/Intro";
import { ServicesRows } from "../components/home/ServicesRows";
import { FeaturedWork } from "../components/home/FeaturedWork";
import { ThinkingProcess } from "../components/home/ThinkingProcess";
import { Ecosystem } from "../components/home/Ecosystem";
import { WhyUs } from "../components/home/WhyUs";
import { Industries } from "../components/home/Industries";
import { FinalCta } from "../components/home/FinalCta";

const metadata = {
  title: { absolute: "CleverHouse Media — We build digital experiences that drive growth" },
  description:
    "CleverHouse Media is a Texas-based digital agency specializing in strategic web design, comprehensive SEO, branding, and data-driven marketing that connects you with your ideal audience.",
  alternates: { canonical: "/" },
};

function Home() {
  return (
    <>
      <Splash />
      <Hero />
      <Intro />
      <ServicesRows />
      <FeaturedWork />
      <ThinkingProcess />
      <Ecosystem />
      <WhyUs />
      <Industries />
      <FinalCta />
    </>
  );
}

export const Route = createFileRoute("/")({
  head: () => seo(metadata, "/"),
  component: Home,
});
