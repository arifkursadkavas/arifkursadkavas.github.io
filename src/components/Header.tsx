import React, { useState } from "react";
import Link from "next/link";

export default (props) => {
  return (
    <div className="mHeader">
      <Link href="/">
        <a>
          <img className="mProfilePhoto" src="./arif.jpg"></img>
        </a>
      </Link>

      <div className="mNameContainer">
        <Link href="/">
          <a>Arif Kürsad Kavas</a>
        </Link>
      </div>

      <div className="mHeaderItemContainer">
        <Link href={"/experience"} key={"Experience"}>
          <a>
            <div className="mHeaderItem">{"Experience"}</div>
          </a>
        </Link>

        <Link href={"/education"} key={"Education"}>
          <a>
            <div className="mHeaderItem">{"Education"}</div>
          </a>
        </Link>
      </div>
    </div>
  );
};
