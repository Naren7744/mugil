import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { FiArrowUp } from 'react-icons/fi';



const MainLayout = () => {
  return (
    <div className="bg-dark-bg min-h-screen flex flex-col justify-between overflow-x-hidden admin-font">
      <div>
        <Navbar />
        <main>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;