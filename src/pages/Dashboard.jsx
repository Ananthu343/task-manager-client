import React from 'react';
import { Box, Grid, Typography, CircularProgress, Button, Chip } from '@mui/material';
import { useGetTasksQuery } from '../store/taskApi';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertCircle, Plus, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

const MetricCard = ({ title, value, icon: Icon, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        style={{ height: '100%' }}
    >
        <Box className="glass-panel" sx={{ p: 3, borderRadius: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="body2" sx={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                    {title}
                </Typography>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: `rgba(${color}, 0.1)`, color: `rgb(${color})` }}>
                    <Icon size={20} />
                </Box>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                {value}
            </Typography>
        </Box>
    </motion.div>
);

const Dashboard = () => {
  const { data, error, isLoading } = useGetTasksQuery();

  if (isLoading) {
      return (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
              <CircularProgress sx={{ color: 'var(--accent-primary)' }} />
          </Box>
      );
  }

  // Using optional chaining to handle potential API failure gracefully or empty states
  const tasks = data?.data?.tasks || [];
  
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const pendingCount = tasks.length - completedCount;

  return (
    <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                    Overview
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                    Here's what's happening in your workspaces today.
                </Typography>
            </Box>
            <Button 
                variant="contained" 
                startIcon={<Plus size={18} />}
                component={Link}
                to="/tasks"
                sx={{ bgcolor: 'var(--accent-primary)', '&:hover': { bgcolor: 'var(--accent-secondary)' } }}
            >
                New Task
            </Button>
        </Box>

        {/* Metrics Bento Box */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
                <MetricCard title="Total Tasks" value={tasks.length || '0'} icon={AlertCircle} color="99, 102, 241" delay={0.1} />
            </Grid>
            <Grid item xs={12} sm={4}>
                <MetricCard title="In Progress" value={pendingCount || '0'} icon={Clock} color="245, 158, 11" delay={0.2} />
            </Grid>
            <Grid item xs={12} sm={4}>
                <MetricCard title="Completed" value={completedCount || '0'} icon={CheckCircle2} color="16, 185, 129" delay={0.3} />
            </Grid>
        </Grid>

        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Recent Activity
        </Typography>

        {error ? (
            <Box className="glass-panel" sx={{ p: 4, borderRadius: 4, textAlign: 'center' }}>
                <AlertCircle size={40} color="var(--error)" style={{ marginBottom: 16 }} />
                <Typography variant="h6" sx={{ color: 'var(--error)', mb: 1 }}>Failed to load dashboard data</Typography>
                <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>Please ensure your backend server is running and you are authenticated.</Typography>
            </Box>
        ) : tasks.length === 0 ? (
            <Box className="glass-panel" sx={{ p: 6, borderRadius: 4, textAlign: 'center' }}>
                <Typography variant="body1" sx={{ color: 'var(--text-secondary)' }}>No tasks found in your workspaces.</Typography>
            </Box>
        ) : (
            <Grid container spacing={3}>
                {tasks.slice(0, 6).map((task, index) => (
                    <Grid item xs={12} md={6} lg={4} key={task.id}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.4 + (index * 0.1) }}
                            style={{ height: '100%' }}
                        >
                            <Box className="glass-panel" sx={{ 
                                p: 3, 
                                borderRadius: 3, 
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'all 0.2s',
                                '&:hover': { transform: 'translateY(-4px)', borderColor: 'var(--accent-primary)' }
                            }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Chip 
                                        label={task.status} 
                                        size="small"
                                        sx={{ 
                                            bgcolor: task.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                            color: task.status === 'completed' ? 'var(--success)' : 'var(--warning)',
                                            fontWeight: 600,
                                            borderRadius: 2
                                        }} 
                                    />
                                    <MoreHorizontal size={20} color="var(--text-muted)" />
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, flexGrow: 1 }}>
                                    {task.title}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'var(--accent-secondary)' }} />
                                    {task.workspace_name || 'General Workspace'}
                                </Typography>
                            </Box>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>
        )}
    </Box>
  );
};

export default Dashboard;