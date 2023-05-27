import React, { useEffect, useState } from 'react';

import Navbar from 'components/landing/Navbar';
import Footer from 'components/landing/Footer';
import Body from 'components/landing/Body';

const Landing = () => {
  const [position, setPostion] = useState(0);
  const onScroll = () => {
    setPostion(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const isTop = position === 0;

  return (
    <>
      <Navbar isTop={isTop} />
      <Body />
      <Footer />
    </>
  );
};

export default Landing;
