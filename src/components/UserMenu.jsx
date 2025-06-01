import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Link, useNavigate } from 'react-router-dom';
import { BiStoreAlt, BiUser } from "react-icons/bi";
import { useDispatch, useSelector } from 'react-redux';
import { FaShoppingCart } from 'react-icons/fa';
import { IoExitOutline } from "react-icons/io5";
import BackDrop from './BackDrop';
import { logOutUser } from '../store/actions';

const UserMenu = ({ anchorEl, open, handleClose }) => {
    const {user} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const logOutHandler = () => {
        dispatch(logOutUser(navigate));
    };

    console.log("User : " + user);

    return (
        <Menu
            sx={{width:"400px"}}
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
                sx: {width:160},
            }}
        > 
            <Link to="/profile">
                <MenuItem className='flex gap-2' 
                onClick={handleClose}>
                    <BiUser className ='text-xl'/>
                    <span className='font-bold text-[16px] mt-1'>
                        {user?.username}
                    </span>
                </MenuItem>
            </Link>

            {user?.role === 'seller' && (
                <Link to="/store">
                    <MenuItem className='flex gap-2' 
                    onClick={handleClose}>
                        <BiStoreAlt className ='text-xl'/>
                        <span className='font-bold text-[16px] mt-1'>
                            My Store
                        </span>
                    </MenuItem>
                </Link>
            )}

            <Link to="/profile/order">
                <MenuItem className='flex gap-2' 
                onClick={handleClose}>
                    <FaShoppingCart className ='text-xl'/>
                    <span className='font-semibold '>
                        Order History
                    </span>
                </MenuItem>
            </Link>
                
            {/* LOGOUT */}
            <MenuItem className='flex gap-2' 
            onClick={logOutHandler}>
                <div className='w-full flex gap-2 items-center bg-gray-800 text-white hover:bg-gray-900 active:bg-gray-700 px-4 py-2 rounded transition-all duration-150 text-sm focus:outline-none'>
                    <IoExitOutline className ='text-xl'/>
                    <span className='font-semibold'>
                        LogOut
                    </span>
                </div>
            </MenuItem>
        </Menu>
    );
}

export default UserMenu;