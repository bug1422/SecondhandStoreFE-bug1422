import cn from 'classnames'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Cookies from 'universal-cookie'
import { AppBar, Avatar, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { Box } from 'victory'
import { useState } from 'react'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import styled from 'styled-components'
import MuiAppBar from '@mui/material/AppBar'
import { Logout } from '@mui/icons-material'
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import FlagIcon from '@mui/icons-material/Flag';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';

const drawerWidth = 240;


export const Menu = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const cookies = new Cookies()
    const location = useLocation()
    const path = location.pathname
    const navigate = useNavigate()
    const logout = () => {
        cookies.remove('jwt_authorization', { path: '/' });
        alert("Successfully logged out!")
        navigate('/', { replaced: true })
    }

    useEffect(() => {
        console.log(path.includes('dashboard'))
    }, [])



    return (
        <>
            <div class="admin-header d-flex flex-row side-bar-title  align-self-center">
                <IconButton size='large' edge='start' className='p-2' color='inherit' aria-label='logo' onClick={(() => { setIsDrawerOpen(true) })}>
                    <MenuIcon className='sbBtn' />
                </IconButton>
                <h1 className='p-2'>&emsp;FPT OSE SERVICE </h1>
            </div>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                anchor='left' open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
                <span className='d-flex align-items-center side-bar-title'>
                    <h4 className='col-8'>Menu</h4>
                    <IconButton className='align-self-end back-button' onClick={() => { setIsDrawerOpen(false) }}>
                        <ChevronLeftIcon />
                    </IconButton>
                </span>
                <div className='divider'></div>
                <div className=''>
                    <div className={cn(path.includes('dashboard') && 'side-bar-active')}>
                        <ListItemButton className='row py-4' onClick={() => { navigate('/admin/dashboard') }}>
                            <DashboardIcon />
                            <ListItemIcon>
                                <div>&emsp;Admin <br />&emsp;Dashboard</div>
                            </ListItemIcon>
                        </ListItemButton>
                    </div>
                    <div className={cn(path.includes('transaction') && 'side-bar-active')}>
                        <ListItemButton className='row py-4' onClick={() => { navigate('/admin/transaction-management') }}>
                            <ReceiptIcon />
                            <ListItemIcon>
                                <div>&emsp;Transaction <br />&emsp;Management</div>
                            </ListItemIcon>
                        </ListItemButton>
                    </div>
                    <div className={cn(path.includes('user') && 'side-bar-active')}>

                        <ListItemButton className='row py-4' onClick={() => { navigate('/admin/user-management') }}>
                            <SupervisorAccountIcon />
                            <ListItemIcon>
                                <div>&emsp;User <br />&emsp;Management</div>
                            </ListItemIcon>
                        </ListItemButton>
                    </div>
                    <div className={cn(path.includes('post') && 'side-bar-active')}>

                        <ListItemButton className='row py-4' onClick={() => { navigate('/admin/post-management') }}>
                            <Inventory2Icon />
                            <ListItemIcon>
                                <div>&emsp;Post<br />&emsp;Management</div>
                            </ListItemIcon>
                        </ListItemButton>
                    </div>
                    <div className={cn(path.includes('exchange') && 'side-bar-active')}>

                        <ListItemButton className='row py-4' onClick={() => { navigate('/admin/exchange-order') }}>
                            <ConnectWithoutContactIcon />
                            <ListItemIcon>
                                <div>&emsp;Exchange Order<br />&emsp;List</div>
                            </ListItemIcon>
                        </ListItemButton>
                    </div>
                    <div className={cn(path.includes('report') && 'side-bar-active')}>

                        <ListItemButton className='row py-4' onClick={() => { navigate('/admin/report-management') }}>
                            <FlagIcon />
                            <ListItemIcon>
                                <div>&emsp;Reported User <br />&emsp;Management</div>
                            </ListItemIcon>
                        </ListItemButton>
                    </div>
                    <div>
                        <ListItemButton onClick={() => { logout() }}>
                            <Logout />
                            <ListItemIcon>
                                <ListItemText primary='&emsp;Log Out' />
                            </ListItemIcon>
                        </ListItemButton>
                    </div>
                </div>
            </Drawer>
        </>
    )
}

