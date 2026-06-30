import React from "react";
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import Branches from "../components/home/Branches";
import MembershipPlans from "../components/home/MembershipPlans"; // Added Premium Plans Matrix
import TrainersPreview from "../components/home/TrainersPreview"; // Added Expert Profiles
import GalleryPreview from "../components/home/GalleryPreview"; // Added Inspire Carousel Slider

const Home = () => {
  return (
    <div className="bg-dark-bg min-h-screen luxury-grid overflow-x-hidden">
      <Hero />

      <Features />

      <Branches />

      <MembershipPlans />

      <TrainersPreview />

      <GalleryPreview />
    </div>
  );
};

export default Home;
