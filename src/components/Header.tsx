import Link from "next/link";

export default function Header() {
  return (
    <div className="mHeader">
      <Link href="/">
        <img className="mProfilePhoto" src="./arif.jpg"></img>
      </Link>

      <div className="mNameContainer">
        <Link href="/">Arif Kürsad Kavas</Link>
      </div>

      <div className="mHeaderItemContainer">
        <Link href={"/experience"} key={"Experience"}>
          <div className="mHeaderItem">{"Experience"}</div>
        </Link>

        <Link href={"/education"} key={"Education"}>
          <div className="mHeaderItem">{"Education"}</div>
        </Link>

        <details className="mHeaderDropdown">
          <summary className="mHeaderItem">{"Miscellaneous"}</summary>
          <div className="mHeaderDropdownMenu">
            <Link href="/moviedb">{"Movie Database"}</Link>
          </div>
        </details>
      </div>
    </div>
  );
}
