import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, TextField, Button, LinearProgress, Tabs, Tab, Stack, Chip, Alert, Snackbar } from '@mui/material';
import { FileText, Download, Clock, BarChart2, CheckCircle, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGenerateReportMutation, useGetReportHistoryQuery } from '../store/reportApi';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

const Reports = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [dummyCount, setDummyCount] = useState(10);
    const [liveUpdates, setLiveUpdates] = useState({});
    const [downloadAlert, setDownloadAlert] = useState(null);

    // Fetch user/tenant context from Redux for the Socket room
    const { user } = useSelector((state) => state.auth);

    const { data: historyData, error: historyError, refetch } = useGetReportHistoryQuery();
    const [generateReport] = useGenerateReportMutation();

    const activeHistory = historyData?.data?.reports || [];
    
    const mergedHistory = activeHistory.map(report => {
        if (liveUpdates[report.id]) {
            return { ...report, ...liveUpdates[report.id] };
        }
        return report;
    });

    useEffect(() => {
        if (!user?.tenant_id) return;

        // Connect to your Node.js backend
        const socket = io('https://task-manager.in/api', {
            transports: ['websocket']
        });

        // Tell the backend to put us in our tenant's broadcast room
        socket.emit('join_tenant', user.tenant_id);

        // Listen for processing progress
        socket.on('download_progress', (data) => {
            if (data.reportId) {
                setLiveUpdates(prev => ({
                    ...prev,
                    [data.reportId]: { ...prev[data.reportId], progress: data.progress, status: 'processing' }
                }));
            }
        });

        // Listen for completion and the S3 link
        socket.on('report_completed', (data) => {
            if (data.reportId && data.link) {
                setLiveUpdates(prev => ({
                    ...prev,
                    [data.reportId]: { ...prev[data.reportId], progress: 100, status: 'completed', link: data.link }
                }));
                setDownloadAlert(data.link);
                refetch(); // Optionally refetch to solidify cache
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [user?.tenant_id, refetch]);

    const handleGenerate = async () => {
        try {
            await generateReport({ dummyCount }).unwrap();
            // Refetch immediately so the new 'pending' row appears at index 0
            refetch(); 
            // Switch to Download History tab to show the progress
            setTabIndex(1);
        } catch (err) {
            console.error('Failed to generate report', err);
        }
    };

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
            <Box mb={5}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BarChart2 size={28} color="var(--accent-primary)" /> Global Reports
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                    Generate detailed CSV exports of all tenant tasks and inject dummy data for load testing.
                </Typography>
            </Box>

            <Paper className="glass-panel" sx={{ borderRadius: 4, overflow: 'hidden', mb: 4 }}>
                <Tabs 
                    value={tabIndex} 
                    onChange={(e, val) => setTabIndex(val)}
                    textColor="inherit"
                    TabIndicatorProps={{ style: { backgroundColor: 'var(--accent-primary)' } }}
                    sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)', px: 2 }}
                >
                    <Tab icon={<FileText size={18} />} iconPosition="start" label="Generate Report" sx={{ fontWeight: 600, minHeight: 64 }} />
                    <Tab icon={<Clock size={18} />} iconPosition="start" label="Download History" sx={{ fontWeight: 600, minHeight: 64 }} />
                </Tabs>

                <Box sx={{ p: 4, minHeight: 400 }}>
                    <AnimatePresence mode="wait">
                        {tabIndex === 0 && (
                            <motion.div key="generate" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}>
                                <Grid container spacing={4}>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Configure Export</Typography>
                                        <Stack spacing={4}>
                                            <Box>
                                                <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 1 }}>
                                                    How many dummy tasks should be injected into this report?
                                                </Typography>
                                                <TextField 
                                                    fullWidth 
                                                    type="number"
                                                    label="Dummy Data Count" 
                                                    value={dummyCount}
                                                    onChange={(e) => setDummyCount(parseInt(e.target.value) || 0)}
                                                    InputProps={{ inputProps: { min: 0, max: 10000 } }}
                                                />
                                            </Box>
                                            
                                            <Button 
                                                variant="contained" 
                                                size="large"
                                                onClick={handleGenerate}
                                                startIcon={<FileText size={20} />}
                                                sx={{ bgcolor: 'var(--accent-primary)', py: 1.5 }}
                                            >
                                                Request Report
                                            </Button>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Box sx={{ p: 4, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Report Contents</Typography>
                                            <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 3 }}>
                                                The generated CSV will contain the following data points for all tasks within your tenant:
                                            </Typography>
                                            <Stack spacing={1.5}>
                                                {['Task ID & Title', 'Workspace Origin', 'Current Status & Priority', 'Creation & Update Timestamps', 'Injected Dummy Flag'].map((item, idx) => (
                                                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'var(--accent-primary)' }} />
                                                        <Typography variant="body2">{item}</Typography>
                                                    </Box>
                                                ))}
                                            </Stack>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </motion.div>
                        )}

                        {tabIndex === 1 && (
                            <motion.div key="history" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                                {mergedHistory.length === 0 ? (
                                    <Typography variant="body1" sx={{ color: 'var(--text-muted)', textAlign: 'center', py: 8 }}>No reports generated yet.</Typography>
                                ) : (
                                    <Stack spacing={2}>
                                        {mergedHistory.map((report) => (
                                            <Box key={report.id} sx={{ p: 3, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box>
                                                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                                        Tenant Export - {new Date(report.date || report.created_at).toLocaleDateString()}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', gap: 2, mt: 1, alignItems: 'center' }}>
                                                        <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
                                                            {new Date(report.date || report.created_at).toLocaleTimeString()}
                                                        </Typography>
                                                        <Chip label={`${report.dummyCount || report.dummy_count} Dummy Rows`} size="small" sx={{ height: 20, fontSize: '0.7rem', bgcolor: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)' }} />
                                                        {(report.status === 'pending' || report.status === 'processing') ? (
                                                            <Chip label={`${report.progress || 0}% Processing`} size="small" sx={{ height: 20, fontSize: '0.7rem', bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }} />
                                                        ) : (
                                                            <Chip label={report.status} size="small" sx={{ height: 20, fontSize: '0.7rem', bgcolor: report.status === 'failed' ? 'rgba(239,68,68,0.1)' : 'rgba(16, 185, 129, 0.1)', color: report.status === 'failed' ? '#ef4444' : '#10b981', textTransform: 'capitalize' }} />
                                                        )}
                                                    </Box>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    {(report.status === 'pending' || report.status === 'processing') ? (
                                                        <Box sx={{ width: 120, ml: 2 }}>
                                                            <LinearProgress variant="determinate" value={report.progress || 0} sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: '#f59e0b' } }} />
                                                        </Box>
                                                    ) : report.status === 'completed' && report.link ? (
                                                        <Button 
                                                            component="a" 
                                                            href={report.link} 
                                                            target="_blank" 
                                                            variant="outlined" 
                                                            size="small"
                                                            startIcon={<Download size={16} />}
                                                            sx={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)', '&:hover': { borderColor: 'var(--accent-primary)' } }}
                                                        >
                                                            Download
                                                        </Button>
                                                    ) : null}
                                                </Box>
                                            </Box>
                                        ))}
                                    </Stack>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Box>
            </Paper>

            {/* Alert Popup when background generation finishes */}
            <Snackbar
                open={Boolean(downloadAlert)}
                autoHideDuration={6000}
                onClose={() => setDownloadAlert(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={() => setDownloadAlert(null)} severity="success" sx={{ width: '100%' }}>
                    Your report is ready to download!
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Reports;
