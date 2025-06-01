import { Badge, Avatar } from "@mui/material";
import { useState } from "react";
import { FaAccessibleIcon, FaAmazon, FaBox, FaMoneyBillWave, FaShopify, FaShoppingCart, FaSignInAlt, FaStore, FaStoreAltSlash } from "react-icons/fa";
import { IoIosMenu } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import UserMenu from "../UserMenu";
import { logo } from "../../utils/constant";

const Navbar = () => {
    const path = useLocation().pathname;
    const [navbarOpen, setNavbarOpen] = useState(false);
    const cartState = useSelector((state) => state.carts);
    const { user } = useSelector((state) => state.auth);
    const [userMenuAnchor, setUserMenuAnchor] = useState(null);

    const totalCartItems = cartState?.total_items || 0;

    const handleProfileClick = (event) => {
        setUserMenuAnchor(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setUserMenuAnchor(null);
    };

    return (
        <div className="h-[70px] bg-custom-gradient text-white z-50 flex items-center sticky top-0">
            <div className="lg:px-14 sm:px-8 px-4 w-full flex justify-between items-center">
                <Link to="/" className="flex items-center text-2xl font-bold">
                    <img className="w-14 h-auto mr-4" 
                        src={logo}
                    />
                </Link>

                <div className="flex items-center gap-6">
                    <ul className="flex gap-6 items-center">
                        <li><Link to="/" className={path === "/" ? "text-white font-semibold" : "text-gray-200"}>Home</Link></li>
                        <li><Link to="/products" className={path === "/products" ? "text-white font-semibold" : "text-gray-200"}>Products</Link></li>
                        <li><Link to="/about" className={path === "/about" ? "text-white font-semibold" : "text-gray-200"}>About</Link></li>
                        <li><Link to="/contact" className={path === "/contact" ? "text-white font-semibold" : "text-gray-200"}>Contact</Link></li>
                        <li>
                            <Link to="/cart">
                                <Badge
                                    showZero
                                    badgeContent={totalCartItems}
                                    color="primary"
                                    overlap="circular"
                                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                                    <FaShoppingCart size={25} />
                                </Badge>
                            </Link>
                        </li>
                    </ul>
                    <Avatar
                        alt="Profile"
                        src={user?.avatarUrl || undefined}
                        onClick={handleProfileClick}
                        style={{ cursor: 'pointer' }}
                    />
                    <UserMenu anchorEl={userMenuAnchor} open={Boolean(userMenuAnchor)} handleClose={handleUserMenuClose} />
                </div>

                <button
                    onClick={() => setNavbarOpen(!navbarOpen)}
                    className="sm:hidden flex items-center sm:mt-0 mt-2">
                    {navbarOpen ? (
                        <RxCross2 className="text-white text-3xl" />
                    ) : (
                        <IoIosMenu className="text-white text-3xl" />
                    )}
                </button>
            </div>
        </div>
    );
};

export default Navbar;