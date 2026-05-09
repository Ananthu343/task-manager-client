import React, { useState } from 'react';
import { Typography, Button, Stack, Dialog, DialogTitle, DialogContent, TextField, Box, IconButton, Chip, MenuItem, ToggleButton, ToggleButtonGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid } from '@mui/material';
import { Search, Plus, X, Tag, List as ListIcon, Maximize2, CheckCircle2, Columns, Table as TableIcon, Trash2, Clock } from 'lucide-react';
import { useGetTasksQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } from '../store/taskApi';
import { useGetWorkspacesQuery } from '../store/workspaceApi';
import { motion, AnimatePresence } from 'framer-motion';

const Tasks = () => {
    const { data: taskData, isLoading, error } = useGetTasksQuery();
    const { data: workspaceData } = useGetWorkspacesQuery();
    const [createTask] = useCreateTaskMutation();
    const [updateTask] = useUpdateTaskMutation();
    const [deleteTask] = useDeleteTaskMutation();
    
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [view, setView] = useState('list'); // 'list', 'kanban', 'table'
    const [newTask, setNewTask] = useState({ title: '', workspace_id: '', priority: 'medium' });

    const handleCreate = async () => {
        if (!newTask.workspace_id && workspaceData?.data?.workspaces?.[0]) {
            newTask.workspace_id = workspaceData.data.workspaces[0].id;
        }
        await createTask({
            ...newTask,
            status: 'pending',
            metadata: { priority: newTask.priority, tags: ['new'] }
        });
        setOpen(false);
        setNewTask({ title: '', workspace_id: '', priority: 'medium' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            await deleteTask(id);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        await updateTask({ id, status: newStatus });
    };

    const handleDragStart = (e, id) => {
        e.dataTransfer.setData('taskId', id);
    };

    const handleDrop = async (e, newStatus) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        if (taskId) {
            await handleStatusChange(taskId, newStatus);
        }
    };

    const tasks = taskData?.data?.tasks || [];
    const filteredTasks = tasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));

    const kanbanColumns = [
        { id: 'pending', title: 'To Do', color: 'rgba(239, 68, 68, 0.1)', textColor: 'var(--error)' },
        { id: 'in-progress', title: 'In Progress', color: 'rgba(245, 158, 11, 0.1)', textColor: 'var(--warning)' },
        { id: 'completed', title: 'Done', color: 'rgba(16, 185, 129, 0.1)', textColor: 'var(--success)' }
    ];

    return (
        <Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} mb={4} spacing={2}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>Task Explorer</Typography>
                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>Manage your workspace items and custom metadata</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <ToggleButtonGroup
                        value={view}
                        exclusive
                        onChange={(e, newView) => newView && setView(newView)}
                        aria-label="view configuration"
                        size="small"
                        sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}
                    >
                        <ToggleButton value="list" aria-label="list view" sx={{ '&.Mui-selected': { bgcolor: 'rgba(99, 102, 241, 0.2)' } }}>
                            <ListIcon size={18} />
                        </ToggleButton>
                        <ToggleButton value="kanban" aria-label="kanban view" sx={{ '&.Mui-selected': { bgcolor: 'rgba(99, 102, 241, 0.2)' } }}>
                            <Columns size={18} />
                        </ToggleButton>
                        <ToggleButton value="table" aria-label="table view" sx={{ '&.Mui-selected': { bgcolor: 'rgba(99, 102, 241, 0.2)' } }}>
                            <TableIcon size={18} />
                        </ToggleButton>
                    </ToggleButtonGroup>
                    <Button 
                        variant="contained" 
                        onClick={() => setOpen(true)}
                        startIcon={<Plus size={18} />}
                        sx={{ bgcolor: 'var(--accent-primary)', '&:hover': { bgcolor: 'var(--accent-secondary)' }, py: 1, px: 3 }}
                    >
                        Create Task
                    </Button>
                </Box>
            </Stack>

            {/* Command Palette Style Search */}
            <Box className="glass-panel" sx={{ mb: 4, p: 1, borderRadius: 3, display: 'flex', alignItems: 'center' }}>
                <Search size={20} color="var(--text-muted)" style={{ marginLeft: 16, marginRight: 8 }} />
                <TextField
                    fullWidth
                    variant="standard"
                    placeholder="Search tasks, filter by priority, or press '/' to focus..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        disableUnderline: true,
                        sx: { color: 'var(--text-primary)', fontSize: '1.1rem', py: 1 }
                    }}
                />
                {searchQuery && (
                    <IconButton size="small" onClick={() => setSearchQuery('')} sx={{ color: 'var(--text-muted)', mr: 1 }}>
                        <X size={18} />
                    </IconButton>
                )}
            </Box>

            {isLoading ? (
                <Typography color="var(--text-secondary)">Loading tasks...</Typography>
            ) : error ? (
                <Box className="glass-panel" sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
                    <Typography color="var(--error)">Could not fetch tasks. Is the backend running?</Typography>
                </Box>
            ) : filteredTasks.length === 0 ? (
                <Box className="glass-panel" sx={{ p: 6, borderRadius: 4, textAlign: 'center' }}>
                    <ListIcon size={48} color="var(--text-muted)" style={{ marginBottom: 16 }} />
                    <Typography variant="h6" sx={{ color: 'var(--text-primary)' }}>No tasks found</Typography>
                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>Adjust your search or create a new task.</Typography>
                </Box>
            ) : (
                <Box>
                    {/* LIST VIEW */}
                    {view === 'list' && (
                        <Stack spacing={2}>
                            <AnimatePresence>
                                {filteredTasks.map((task, index) => (
                                    <motion.div
                                        key={task.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2, delay: index * 0.05 }}
                                    >
                                        <Box className="glass-panel" sx={{ 
                                            p: 2.5, 
                                            borderRadius: 3, 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: 2,
                                            transition: 'all 0.2s',
                                            border: '1px solid transparent',
                                            '&:hover': { borderColor: 'var(--accent-glow)', transform: 'translateX(4px)' }
                                        }}>
                                            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: task.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.1)' }}>
                                                {task.status === 'completed' ? <CheckCircle2 size={20} color="var(--success)" /> : <Clock size={20} color="var(--accent-primary)" />}
                                            </Box>
                                            
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                                    {task.title}
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 2, mt: 0.5, alignItems: 'center' }}>
                                                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                                                        {task.workspace_name || 'General Workspace'}
                                                    </Typography>
                                                    <Chip 
                                                        label={task.status} 
                                                        size="small"
                                                        sx={{ height: 20, fontSize: '0.7rem', bgcolor: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}
                                                    />
                                                    {task.metadata && task.metadata.priority && (
                                                        <Chip 
                                                            icon={<Tag size={12} />} 
                                                            label={`Priority: ${task.metadata.priority}`} 
                                                            size="small"
                                                            sx={{ height: 20, fontSize: '0.7rem', bgcolor: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}
                                                        />
                                                    )}
                                                </Box>
                                            </Box>

                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <TextField
                                                    select
                                                    size="small"
                                                    value={task.status}
                                                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                                    sx={{ minWidth: 130, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                                >
                                                    <MenuItem value="pending">Pending</MenuItem>
                                                    <MenuItem value="in-progress">In Progress</MenuItem>
                                                    <MenuItem value="completed">Completed</MenuItem>
                                                </TextField>
                                                <IconButton onClick={() => handleDelete(task.id)} sx={{ color: 'var(--text-muted)', '&:hover': { color: 'var(--error)', bgcolor: 'rgba(239, 68, 68, 0.1)' } }}>
                                                    <Trash2 size={18} />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </Stack>
                    )}

                    {/* KANBAN VIEW */}
                    {view === 'kanban' && (
                        <Grid container spacing={3}>
                            {kanbanColumns.map(col => (
                                <Grid item xs={12} md={4} key={col.id}>
                                    <Box 
                                        sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', minHeight: '60vh' }}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={(e) => handleDrop(e, col.id)}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>{col.title}</Typography>
                                            <Chip label={filteredTasks.filter(t => (t.status === col.id || (col.id==='pending' && !t.status))).length} size="small" sx={{ bgcolor: col.color, color: col.textColor }} />
                                        </Box>
                                        <Stack spacing={2}>
                                            <AnimatePresence>
                                                {filteredTasks.filter(t => (t.status === col.id || (col.id==='pending' && !t.status))).map(task => (
                                                    <motion.div key={task.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                                                        <Paper 
                                                            className="glass-panel" 
                                                            draggable
                                                            onDragStart={(e) => handleDragStart(e, task.id)}
                                                            sx={{ p: 2, borderRadius: 2, '&:hover': { borderColor: 'var(--accent-glow)' }, cursor: 'grab' }}
                                                        >
                                                            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>{task.title}</Typography>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                                                <TextField
                                                                    select
                                                                    size="small"
                                                                    value={task.status || 'pending'}
                                                                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                                                    sx={{ minWidth: 120, '& .MuiOutlinedInput-root': { borderRadius: 1, fontSize: '0.8rem' } }}
                                                                >
                                                                    <MenuItem value="pending">To Do</MenuItem>
                                                                    <MenuItem value="in-progress">In Progress</MenuItem>
                                                                    <MenuItem value="completed">Done</MenuItem>
                                                                </TextField>
                                                                <IconButton size="small" onClick={() => handleDelete(task.id)} sx={{ color: 'var(--text-muted)', '&:hover': { color: 'var(--error)' } }}>
                                                                    <Trash2 size={16} />
                                                                </IconButton>
                                                            </Box>
                                                        </Paper>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </Stack>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    {/* TABLE VIEW */}
                    {view === 'table' && (
                        <TableContainer component={Paper} className="glass-panel" sx={{ borderRadius: 3, backgroundImage: 'none' }}>
                            <Table>
                                <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}>
                                    <TableRow>
                                        <TableCell sx={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Title</TableCell>
                                        <TableCell sx={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Workspace</TableCell>
                                        <TableCell sx={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Priority</TableCell>
                                        <TableCell sx={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Status</TableCell>
                                        <TableCell align="right" sx={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredTasks.map(task => (
                                        <TableRow key={task.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                                            <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 500 }}>{task.title}</TableCell>
                                            <TableCell sx={{ color: 'var(--text-secondary)' }}>{task.workspace_name || 'General'}</TableCell>
                                            <TableCell>
                                                <Chip size="small" label={task.metadata?.priority || 'none'} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    select
                                                    size="small"
                                                    value={task.status || 'pending'}
                                                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                                    variant="standard"
                                                    InputProps={{ disableUnderline: true, sx: { fontSize: '0.85rem' } }}
                                                >
                                                    <MenuItem value="pending">Pending</MenuItem>
                                                    <MenuItem value="in-progress">In Progress</MenuItem>
                                                    <MenuItem value="completed">Completed</MenuItem>
                                                </TextField>
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton size="small" onClick={() => handleDelete(task.id)} sx={{ color: 'var(--text-muted)', '&:hover': { color: 'var(--error)' } }}>
                                                    <Trash2 size={18} />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>
            )}

            {/* Premium Create Dialog */}
            <Dialog 
                open={open} 
                onClose={() => setOpen(false)}
                PaperProps={{
                    className: 'glass-panel',
                    sx: { borderRadius: 4, width: '100%', maxWidth: 500, backgroundImage: 'none', bgcolor: 'var(--bg-secondary)' }
                }}
            >
                <DialogTitle sx={{ pb: 1, fontWeight: 700 }}>Initialize Task</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 1 }}>
                        <TextField 
                            fullWidth 
                            label="Task Description" 
                            variant="outlined"
                            autoFocus
                            value={newTask.title}
                            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                            sx={{ mb: 3 }}
                        />
                        <TextField
                            select
                            fullWidth
                            label="Workspace"
                            value={newTask.workspace_id}
                            onChange={(e) => setNewTask({...newTask, workspace_id: e.target.value})}
                            sx={{ mb: 3 }}
                        >
                            <MenuItem value="" disabled>Select Workspace</MenuItem>
                            {workspaceData?.data?.workspaces?.map(ws => (
                                <MenuItem key={ws.id} value={ws.id}>{ws.name}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            select
                            fullWidth
                            label="Urgency (JSONB Metadata)"
                            value={newTask.priority}
                            onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                            sx={{ mb: 1 }}
                        >
                            <MenuItem value="low">Low</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="high">High</MenuItem>
                            <MenuItem value="critical">Critical</MenuItem>
                        </TextField>
                        <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                            <Button onClick={() => setOpen(false)} fullWidth sx={{ color: 'var(--text-secondary)' }}>
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleCreate} 
                                fullWidth 
                                variant="contained" 
                                disabled={!newTask.title}
                                sx={{ bgcolor: 'var(--accent-primary)', '&:hover': { bgcolor: 'var(--accent-secondary)' } }}
                            >
                                Deploy Task
                            </Button>
                        </Stack>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Tasks;