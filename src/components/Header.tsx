import React, { useState } from 'react';
import Link from 'next/link';

export default (props) => {
    return (
    <div className='mHeader'>

        <Link href="/">
          <img className='mProfilePhoto' src='./arif.jpg'></img>
        </Link>

      <div className='mNameContainer'>
        <Link href="/">Arif Kürsad Kavas </Link>
      </div>

      <div className='mHeaderItemContainer'>
            <Link href={'/experience'} key={'Experience'}>
              <div className='mHeaderItem'>{'Experience'}</div>
            </Link>

            <Link href={'/education'} key={'Education'}>
              <div className='mHeaderItem'>{'Education'}</div>
            </Link>
      </div>
    </div>
  );
};
