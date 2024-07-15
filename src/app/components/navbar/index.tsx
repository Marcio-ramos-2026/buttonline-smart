import Navbar from "./desktop";
import NavbarMobile from "./mobile";

export default function NavbarRoot(){
    return (
        <>
            <NavbarMobile />
            <Navbar />
        </>
    )
}