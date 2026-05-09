import React from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { useRegisterTenantMutation } from '../store/tenantApi';
import { useRegisterMutation } from '../store/authApi';

const registerSchema = z.object({
  name: z.string().min(2, 'Company name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Register = () => {
    const navigate = useNavigate();
    const [registerTenant, { isLoading: tenantLoading }] = useRegisterTenantMutation();
    const [registerUser, { isLoading: userLoading, error }] = useRegisterMutation();

    const { register, handleSubmit, formState: { errors } } = useForm({
      resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data) => {
        try {
            // 1. Create Tenant
            const tenantRes = await registerTenant({ name: data.name }).unwrap();
            const tenant_id = tenantRes.data.tenant.id;

            // 2. Create User
            await registerUser({
                email: data.email,
                password: data.password,
                tenant_id: tenant_id,
                role: 'admin'
            }).unwrap();

            navigate('/login');
        } catch (err) {
            console.error('Failed to register:', err);
        }
    };

    const isLoading = tenantLoading || userLoading;

    return (
        <Box 
          sx={{ 
            minHeight: '100vh', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
            py: 4
          }}
        >
          {/* Background glow */}
          <Box sx={{
            position: 'absolute', bottom: '-10%', right: '-10%',
            width: '50vw', height: '50vw', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, rgba(15, 17, 21, 0) 70%)',
            filter: 'blur(60px)', zIndex: 0
          }} />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ zIndex: 1, width: '100%', maxWidth: 450, padding: '0 20px' }}
          >
            <Paper className="glass-panel" sx={{ p: 5, borderRadius: 4, width: '100%' }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    Create Ecosystem
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                    Setup your isolated multi-tenant workspace
                  </Typography>
                </Box>
                
                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                      {error.data?.message || 'Registration failed'}
                    </Alert>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField 
                      fullWidth 
                      label="Company Name" 
                      variant="outlined"
                      margin="normal"
                      {...register('name')}
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      sx={{ mb: 2 }}
                    />
                    <TextField 
                      fullWidth 
                      label="Admin Email" 
                      variant="outlined"
                      margin="normal"
                      {...register('email')}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      sx={{ mb: 2 }}
                    />
                    <TextField 
                      fullWidth 
                      label="Password" 
                      type="password" 
                      variant="outlined"
                      margin="normal"
                      {...register('password')}
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      sx={{ mb: 4 }}
                    />
                    
                    <Button 
                      fullWidth 
                      variant="contained" 
                      type="submit" 
                      disabled={isLoading} 
                      sx={{ 
                        py: 1.5, 
                        fontSize: '1rem',
                        bgcolor: 'var(--accent-primary)',
                        '&:hover': { bgcolor: 'var(--accent-secondary)' }
                      }}
                    >
                        {isLoading ? 'Provisioning...' : 'Register Workspace'}
                    </Button>
                </form>

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600 }}>
                      Sign in
                    </Link>
                  </Typography>
                </Box>
            </Paper>
          </motion.div>
        </Box>
    );
};

export default Register;