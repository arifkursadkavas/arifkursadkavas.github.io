import React, { useState } from 'react';
import Tag from './Tag';

export default function Card(props) {
  const {
    companyName,
    jobTitle,
    avatarImage,
    duration,
    techStack,
    description,
    companyUrl,
    location,
  } = props;
  return (
    <div className='cardContainer'>
      {/* <img src={avatarImage} alt='Avatar' style='width:100%'></img> */}
      <div className='cardHeader'>
        <b>
          {jobTitle} -{' '}
          <a href={companyUrl} target='_blank'>
            {companyName}
          </a>
          <span className='workLocation'>{location}</span>
          <div className='workDuration'>{duration}</div>
        </b>
      </div>
      <div className='cardtext'>
        {techStack && (
          <div className='techStackContainer'>
            <b>Tech Stack</b>
            <br />
            <div className='tagList'>
              {techStack.map((t) => (
                <Tag text={t} key={t}></Tag>
              ))}
            </div>
          </div>
        )}
        <p>
          <b>Description</b>
        </p>

        <ul>
          {description.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
