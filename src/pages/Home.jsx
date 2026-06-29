import React from 'react';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import Branches from '../components/home/Branches';
import MembershipPlans from '../components/home/MembershipPlans'; // Added Premium Plans Matrix
import TrainersPreview from '../components/home/TrainersPreview'; // Added Expert Profiles
import GalleryPreview from '../components/home/GalleryPreview';   // Added Inspire Carousel Slider

const Home = () => {
  return (
    <div className="bg-dark-bg min-h-screen luxury-grid overflow-x-hidden">
      
      {/* 1. High-End Top View Aggressive Banner Grid */}
      <Hero />
      
      {/* 2. Sub-Hero Mini Badges Grid Overlay Row */}
      <Features />
      
      {/* 3. Elite Gym Near You Branch Matrix Cards Layout */}
      <Branches />

      {/* 4. Luxury Pricing Grid Matrix Setup Section */}
      <MembershipPlans />

      {/* 5. Expert Trainers Showcase Matrix System */}
      <TrainersPreview />

      {/* 6. High Contrast Moments Inspire Slides Layout */}
      <GalleryPreview />



    </div>
  );
};

export default Home;