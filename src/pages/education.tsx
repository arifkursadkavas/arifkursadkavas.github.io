import React from 'react';
import Card from '../components/Card';

const Education = (props) => {
  const mscDesc = [];
  return (
    <div className='cardsList'>
      <Card
        jobTitle='M.Sc Electronics Engineering'
        companyName='Istanbul Technical University'
        duration=''
        techStack={[
          'Matlab',
          'Digital Signal Processing',
          'DSP',
          'C',
          'CPM',
          'GMSK',
          'AIS',
        ]}
        description={[
          'MSc with a focus on wireless communication. Graduation work on modelling and realization of\
        a GMSK modem with one bit differential detection. Aimed to be used on AIS for the sea vessels.',
        ]}
        companyUrl='https://itu.edu.tr'
        location=''
      ></Card>
      <Card
        jobTitle='B.Sc Electronics Engineering'
        companyName='Yeditepe University'
        duration=''
        techStack={[
          'High Frequeny Electronics',
          'Logic Circuits',
          'Solid State Physics',
          'Quantum Optoelectronics',
          'Electromagnetics',
        ]}
        description={[
          'Graduation work was about design of a twin tee notch filter for S3 signalling system',
        ]}
        companyUrl='https://yeditepe.edu.tr'
        location=''
      ></Card>
      <Card
        jobTitle='High School'
        companyName='Bornova Anadolu Lisesi'
        duration=''
        description={['High School Education']}
        companyUrl='http://izmirbal.meb.k12.tr/'
        location=''
      ></Card>
    </div>
  );
};

export default Education
