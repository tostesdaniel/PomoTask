import { HeaderContainer } from "./Header/styles";

import { Scroll, Timer } from "phosphor-react";
import { NavLink } from "react-router-dom";
import logo from "../assets/undraw_time_management_re_tk5w.svg";

export default function Header() {
  return (
    <HeaderContainer>
      <img src={logo} alt="" width="40px" />
      <nav>
        <NavLink to="/" title="Timer">
          <Timer size={24} />
        </NavLink>
        <NavLink to="/history" title="Histórico">
          <Scroll size={24} />
        </NavLink>
      </nav>
    </HeaderContainer>
  );
}
