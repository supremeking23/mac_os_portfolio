import dayjs from "dayjs";
import { navLinks, navIcons } from "#constants/index";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <img src="/images/logo.svg" alt="Logo" />
        <p className="font-bold">Ivan's Portfolio</p>
        <ul className="nav-menu">
         {/* auto returns what's inside the map function if we use parenthesis directly instead of a curly brace */}
         {navLinks.map((item) => ( 
            <li key={item.id}><a href={`#${item.name.toLowerCase()}`} className="nav-link">{item.name}</a></li>
         ))}
        </ul>
      </div>
      <div>
        <ul>
            {navIcons.map(({id, img}) => (
                <li key={id}>
                    <img src={img} alt={`icon-${id}`} className="icon-hover cursor-pointer"/>
                </li>
            ))}
        </ul>
        {/* html 5 syntax for time ? whaatt */}
        <time>{dayjs().format("ddd MMMM D h:mm A")}</time>
      </div>
    </nav>
  );
};

export default Navbar;