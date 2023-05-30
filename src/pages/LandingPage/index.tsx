import React, { useEffect, useState } from 'react';

import Header from 'pages/LandingPage/Header';
import Footer from 'components/Footer';
import Content from 'pages/LandingPage/Content';

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
      <Header isTop={isTop} />
      <Content />
      <Footer />
    </>
  );
};

export default Landing;
