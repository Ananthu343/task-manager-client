import React, { useState } from 'react';
import { Box, Drawer, AppBar, Toolbar, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import { LayoutDashboard, CheckSquare, LogOut, Menu as MenuIcon, User, Settings, Bell, Folder, BarChart2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logOut } from '../store/authSlice';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const drawerWidth = 260;

const Layout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        setAnchorEl(null);
        dispatch(logOut());
        navigate('/login');
    };

    const handleMenu = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    const menuItems = [
        { text: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
        { text: 'My Tasks', icon: <CheckSquare size={20} />, path: '/tasks' },
        { text: 'Workspaces', icon: <Folder size={20} />, path: '/workspaces' },
        { text: 'Reports', icon: <BarChart2 size={20} />, path: '/reports' },
        { text: 'Settings', icon: <Settings size={20} />, path: '/settings' },
    ];

    const drawerContent = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)' }}>
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckSquare size={20} color="white" />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Task Manager
                </Typography>
            </Box>

            <List sx={{ px: 2, flexGrow: 1 }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton 
                                onClick={() => { navigate(item.path); setMobileOpen(false); }}
                                sx={{
                                    borderRadius: 2,
                                    bgcolor: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                    color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                    '&:hover': {
                                        bgcolor: isActive ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                                        color: isActive ? 'var(--accent-primary)' : 'var(--text-primary)',
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText 
                                    primary={item.text} 
                                    primaryTypographyProps={{ fontWeight: isActive ? 600 : 500, fontSize: '0.95rem' }} 
                                />
                                {isActive && (
                                    <motion.div layoutId="activeNav" style={{ position: 'absolute', left: 0, top: '10%', bottom: '10%', width: 3, borderRadius: 3, backgroundColor: 'var(--accent-primary)' }} />
                                )}
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            {/* <Box sx={{ p: 3 }}>
                <Box className="glass-panel" sx={{ p: 2, borderRadius: 3, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 1 }}>
                        Pro Plan Active
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
                        All features unlocked
                    </Typography>
                </Box>
            </Box> */}
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'var(--bg-primary)' }}>
            <AppBar 
                position="fixed" 
                sx={{ 
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: 'var(--glass-bg)',
                    backdropFilter: 'var(--glass-blur)',
                    borderBottom: '1px solid var(--border-color)',
                    boxShadow: 'none',
                    zIndex: (theme) => theme.zIndex.drawer + 1
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' }, color: 'var(--text-primary)' }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600, display: { xs: 'none', sm: 'block' }, color: 'var(--text-primary)' }}>
                        {menuItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}>
                        <IconButton sx={{ color: 'var(--text-secondary)' }}>
                            <Bell size={20} />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={handleMenu}
                            sx={{ p: 0.5, border: '2px solid var(--border-color)', '&:hover': { borderColor: 'var(--accent-primary)' } }}
                        >
                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'var(--accent-primary)' }}>
                                <User size={18} />
                            </Avatar>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            keepMounted
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            PaperProps={{
                                sx: { mt: 1.5, bgcolor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', backgroundImage: 'none' }
                            }}
                        >
                            <MenuItem onClick={handleClose} sx={{ gap: 1, py: 1.5 }}><Settings size={18} /> Settings</MenuItem>
                            <MenuItem onClick={handleLogout} sx={{ gap: 1, py: 1.5, color: 'var(--error)' }}><LogOut size={18} /> Logout</MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
            
            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                {/* Mobile drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none' },
                    }}
                >
                    {drawerContent}
                </Drawer>
                {/* Desktop drawer */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none' },
                    }}
                    open
                >
                    {drawerContent}
                </Drawer>
            </Box>
            
            <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 4 }, width: { sm: `calc(100% - ${drawerWidth}px)` }, overflowX: 'hidden' }}>
                <Toolbar />
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Outlet />
                    </motion.div>
            </Box>
        </Box>
    );
};

export default Layout;