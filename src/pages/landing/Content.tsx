import React, { useRef } from 'react';

import Introduce from './Introduce';
import Description from './Description';
import Service from './Service';

export type SectionId = 'introduce' | 'description';

export type refType = {
  [id in SectionId]: HTMLElement;
};

const Content = () => {
  const sectionRef = useRef<refType>({} as refType);

  const addSectionRef = (id: SectionId, elem: HTMLElement) => {
    sectionRef.current[id] = elem;
  };

  const moveToSection = (id: SectionId) => {
    sectionRef.current[id].scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Introduce addSectionRef={addSectionRef} moveToSection={moveToSection} />
      <Description
        addSectionRef={addSectionRef}
        moveToSection={moveToSection}
      />
      <Service />
    </>
  );
};

export default Content;
