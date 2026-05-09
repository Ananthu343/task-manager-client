import React, { useState } from 'react';
import { Typography, Button, Stack, Dialog, DialogTitle, DialogContent, TextField, Box, IconButton, Paper, CircularProgress, Alert } from '@mui/material';
import { Plus, Edit2, Trash2, Folder, LayoutDashboard } from 'lucide-react';
import { 
    useGetWorkspacesQuery, 
    useCreateWorkspaceMutation,
    useUpdateWorkspaceMutation,
    useDeleteWorkspaceMutation 
} from '../store/workspaceApi';
import { motion, AnimatePresence } from 'framer-motion';

const Workspaces = () => {
    const { data: workspaceData, isLoading, error } = useGetWorkspacesQuery();
    const [createWorkspace, { isLoading: isCreating }] = useCreateWorkspaceMutation();
    const [updateWorkspace, { isLoading: isUpdating }] = useUpdateWorkspaceMutation();
    const [deleteWorkspace, { isLoading: isDeleting }] = useDeleteWorkspaceMutation();

    const [openDialog, setOpenDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentWorkspace, setCurrentWorkspace] = useState({ id: '', name: '' });

    const workspaces = workspaceData?.data?.workspaces || [];

    const handleOpenCreate = () => {
        setIsEditing(false);
        setCurrentWorkspace({ id: '', name: '' });
        setOpenDialog(true);
    };

    const handleOpenEdit = (ws) => {
        setIsEditing(true);
        setCurrentWorkspace({ id: ws.id, name: ws.name });
        setOpenDialog(true);
    };

    const handleSave = async () => {
        try {
            if (isEditing) {
                await updateWorkspace({ id: currentWorkspace.id, name: currentWorkspace.name }).unwrap();
            } else {
                await createWorkspace({ name: currentWorkspace.name }).unwrap();
            }
            setOpenDialog(false);
        } catch (err) {
            console.error('Failed to save workspace:', err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this workspace? This will cascade and delete all related tasks.')) {
            try {
                await deleteWorkspace(id).unwrap();
            } catch (err) {
                console.error('Failed to delete workspace:', err);
            }
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress sx={{ color: 'var(--accent-primary)' }} />
            </Box>
        );
    }

    return (
        <Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} mb={4} spacing={2}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>Workspace Settings</Typography>
                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>Manage your organization's sub-environments</Typography>
                </Box>
                <Button 
                    variant="contained" 
                    onClick={handleOpenCreate}
                    startIcon={<Plus size={18} />}
                    sx={{ bgcolor: 'var(--accent-primary)', '&:hover': { bgcolor: 'var(--accent-secondary)' }, py: 1.5, px: 3 }}
                >
                    Create Workspace
                </Button>
            </Stack>

            <Box sx={{ mt: 6 }}>

            {error && (
                <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
                    Failed to load workspaces. Please check your connection.
                </Alert>
            )}
            

            {workspaces.length === 0 && !error ? (
                <Box className="glass-panel" sx={{ p: 6, borderRadius: 4, textAlign: 'center' }}>
                    <LayoutDashboard size={48} color="var(--text-muted)" style={{ marginBottom: 16 }} />
                    <Typography variant="h6" sx={{ color: 'var(--text-primary)' }}>No Workspaces Configured</Typography>
                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>Get started by creating your first workspace.</Typography>
                </Box>
            ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 3 }}>
                    <AnimatePresence>
                        {workspaces.map((ws, index) => (
                            <motion.div
                                key={ws.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                            >
                                <Paper className="glass-panel" sx={{ p: 3, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                                        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(99, 102, 241, 0.1)', mr: 2 }}>
                                            <Folder size={24} color="var(--accent-primary)" />
                                        </Box>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--text-primary)', wordBreak: 'break-word' }}>
                                                {ws.name}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
                                                ID: {ws.id.substring(0, 8)}...
                                            </Typography>
                                        </Box>
                                    </Box>
                                    
                                    <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 2, borderTop: '1px solid var(--border-color)' }}>
                                        <IconButton size="small" onClick={() => handleOpenEdit(ws)} sx={{ color: 'var(--text-secondary)', '&:hover': { color: 'var(--accent-primary)', bgcolor: 'rgba(99, 102, 241, 0.1)' } }}>
                                            <Edit2 size={18} />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => handleDelete(ws.id)} disabled={isDeleting} sx={{ color: 'var(--text-secondary)', '&:hover': { color: 'var(--error)', bgcolor: 'rgba(239, 68, 68, 0.1)' } }}>
                                            <Trash2 size={18} />
                                        </IconButton>
                                    </Box>
                                </Paper>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </Box>
            )}

            <Dialog 
                open={openDialog} 
                onClose={() => setOpenDialog(false)}
                PaperProps={{
                    className: 'glass-panel',
                    sx: { borderRadius: 4, width: '100%', maxWidth: 400, backgroundImage: 'none', bgcolor: 'var(--bg-secondary)' }
                }}
            >
                <DialogTitle sx={{ pb: 1, fontWeight: 700 }}>
                    {isEditing ? 'Edit Workspace' : 'Initialize Workspace'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 1 }}>
                        <TextField 
                            fullWidth 
                            label="Workspace Name" 
                            variant="outlined"
                            autoFocus
                            value={currentWorkspace.name}
                            onChange={(e) => setCurrentWorkspace({...currentWorkspace, name: e.target.value})}
                            sx={{ mb: 3 }}
                        />
                        <Stack direction="row" spacing={2}>
                            <Button onClick={() => setOpenDialog(false)} fullWidth sx={{ color: 'var(--text-secondary)' }}>
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleSave} 
                                fullWidth 
                                variant="contained" 
                                disabled={!currentWorkspace.name || isCreating || isUpdating}
                                sx={{ bgcolor: 'var(--accent-primary)', '&:hover': { bgcolor: 'var(--accent-secondary)' } }}
                            >
                                {isEditing ? 'Save Changes' : 'Create'}
                            </Button>
                        </Stack>
                    </Box>
                </DialogContent>
            </Dialog>
            </Box>
        </Box>
    );
};

export default Workspaces;
