import React, { useState, useEffect } from 'react';
import { Box, Typography, Stack, Switch, FormControlLabel, Button, TextField, Divider, IconButton, Paper, Grid, MenuItem } from '@mui/material';
import { Settings as SettingsIcon, Bell, Globe, Trash2, Plus, Mail, ShieldAlert } from 'lucide-react';
import { useGetSettingsQuery, useUpdateSettingsMutation, useGetWebhooksQuery, useCreateWebhookMutation, useDeleteWebhookMutation } from '../store/settingsApi';
import { motion } from 'framer-motion';

const Settings = () => {
    // These queries might fail since backend isn't built yet, so we use local fallback state
    const { data: settingsData, error: settingsError } = useGetSettingsQuery();
    const { data: webhooksData, error: webhooksError } = useGetWebhooksQuery();
    
    const [updateSettings] = useUpdateSettingsMutation();
    const [createWebhook] = useCreateWebhookMutation();
    const [deleteWebhook] = useDeleteWebhookMutation();

    // Local State Fallbacks for UI demonstration
    const [settings, setSettings] = useState({
        emailNotifications: true,
        pushNotifications: false,
        theme: 'dark',
        timezone: 'UTC'
    });
    
    const [webhooks, setWebhooks] = useState([
        { id: '1', url: 'https://example.com/webhook/jira', event: 'task_created' }
    ]);
    
    const [newWebhook, setNewWebhook] = useState({ url: '', event: 'task_created' });

    useEffect(() => {
        if (settingsData?.data) setSettings(settingsData.data);
    }, [settingsData]);

    useEffect(() => {
        if (webhooksData?.data?.webhooks) setWebhooks(webhooksData.data.webhooks);
    }, [webhooksData]);

    const handleToggleSetting = async (key) => {
        const updated = { ...settings, [key]: !settings[key] };
        setSettings(updated);
        try {
            await updateSettings(updated).unwrap();
        } catch (e) {
            console.log("Mocking update since backend API is pending.");
        }
    };

    const handleAddWebhook = async () => {
        if (!newWebhook.url) return;
        const mockWebhook = { id: Date.now().toString(), ...newWebhook };
        setWebhooks([...webhooks, mockWebhook]);
        try {
            await createWebhook(newWebhook).unwrap();
        } catch (e) {
            console.log("Mocking webhook creation since backend API is pending.");
        }
        setNewWebhook({ url: '', event: 'task_created' });
    };

    const handleDeleteWebhook = async (id) => {
        setWebhooks(webhooks.filter(w => w.id !== id));
        try {
            await deleteWebhook(id).unwrap();
        } catch (e) {
            console.log("Mocking webhook deletion since backend API is pending.");
        }
    };

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
            <Box mb={5}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SettingsIcon size={28} color="var(--accent-primary)" /> Global Configuration
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                    Manage notifications, webhooks, and system preferences. Note: API integration pending backend build.
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {/* Notifications & Preferences */}
                <Grid item xs={12} md={6}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                        <Paper className="glass-panel" sx={{ p: 4, borderRadius: 4, mb: 4 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Bell size={20} /> Notification Preferences
                            </Typography>
                            
                            <Stack spacing={3}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>Email Notifications</Typography>
                                        <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>Receive daily summaries and updates.</Typography>
                                    </Box>
                                    <Switch 
                                        checked={settings.emailNotifications} 
                                        onChange={() => handleToggleSetting('emailNotifications')} 
                                        color="primary"
                                    />
                                </Box>
                                <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>Push Notifications</Typography>
                                        <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>Instant alerts in your browser.</Typography>
                                    </Box>
                                    <Switch 
                                        checked={settings.pushNotifications} 
                                        onChange={() => handleToggleSetting('pushNotifications')} 
                                        color="primary"
                                    />
                                </Box>
                            </Stack>
                        </Paper>
                    </motion.div>

                    
                </Grid>

                {/* Webhooks Config */}
                <Grid item xs={12} md={6}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
                        <Paper className="glass-panel" sx={{ p: 4, borderRadius: 4, height: '100%' }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Globe size={20} /> Webhook Integrations
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 3 }}>
                                Automatically push events (like task creation or deletion) to external services like Slack or Jira.
                            </Typography>

                            <Box sx={{ mb: 4, p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}>
                                <Typography variant="subtitle2" sx={{ mb: 2 }}>Register New Endpoint</Typography>
                                <Stack spacing={2}>
                                    <TextField 
                                        size="small" 
                                        label="Payload URL" 
                                        placeholder="https://" 
                                        value={newWebhook.url}
                                        onChange={(e) => setNewWebhook({...newWebhook, url: e.target.value})}
                                    />
                                    <TextField 
                                        select 
                                        size="small" 
                                        label="Trigger Event"
                                        value={newWebhook.event}
                                        onChange={(e) => setNewWebhook({...newWebhook, event: e.target.value})}
                                    >
                                        <MenuItem value="task_created">Task Created</MenuItem>
                                        <MenuItem value="task_updated">Task Updated</MenuItem>
                                        <MenuItem value="task_deleted">Task Deleted</MenuItem>
                                    </TextField>
                                    <Button 
                                        variant="contained" 
                                        startIcon={<Plus size={16} />}
                                        onClick={handleAddWebhook}
                                        sx={{ bgcolor: 'var(--accent-primary)' }}
                                    >
                                        Add Webhook
                                    </Button>
                                </Stack>
                            </Box>

                            <Typography variant="subtitle2" sx={{ mb: 2, color: 'var(--text-secondary)' }}>Active Endpoints</Typography>
                            {webhooks.length === 0 ? (
                                <Typography variant="body2" color="var(--text-muted)">No webhooks configured.</Typography>
                            ) : (
                                <Stack spacing={2}>
                                    {webhooks.map((wh) => (
                                        <Box key={wh.id} sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box sx={{ overflow: 'hidden' }}>
                                                <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--text-primary)' }} noWrap>{wh.url}</Typography>
                                                <Typography variant="caption" sx={{ color: 'var(--accent-primary)' }}>Event: {wh.event}</Typography>
                                            </Box>
                                            <IconButton size="small" onClick={() => handleDeleteWebhook(wh.id)} sx={{ color: 'var(--text-muted)', '&:hover': { color: 'var(--error)' } }}>
                                                <Trash2 size={16} />
                                            </IconButton>
                                        </Box>
                                    ))}
                                </Stack>
                            )}
                        </Paper>
                    </motion.div>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Settings;
