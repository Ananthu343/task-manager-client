import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Box, Container, Typography, Button, Grid, Paper, Chip } from '@mui/material';
import { Shield, Zap, Layers, Code, ArrowRight, Database, Server, GitMerge, Lock, FileJson } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    style={{ height: '100%' }}
  >
    <Paper
      elevation={0}
      className="glass-panel"
      sx={{
        p: 4,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        borderRadius: 4,
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-8px)',
          borderColor: 'var(--accent-glow)'
        },
      }}
    >
      <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', mb: 3 }}>
        <Icon size={28} />
      </Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: 'var(--text-primary)' }}>
        {title}
      </Typography>
      <Typography variant="body1" sx={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        {description}
      </Typography>
    </Paper>
  </motion.div>
);

const TechCard = ({ title, techList, delay }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay }}
    >
        <Paper className="glass-panel" sx={{ p: 4, borderRadius: 4, height: '100%', '&:hover': { borderColor: 'var(--accent-primary)' } }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: 'var(--text-primary)' }}>{title}</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {techList.map((tech, idx) => (
                    <Chip key={idx} label={tech} sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', fontWeight: 500, borderRadius: 2 }} />
                ))}
            </Box>
        </Paper>
    </motion.div>
);

const LandingPage = () => {
  return (
    <Box sx={{ minHeight: '100vh', overflow: 'hidden', position: 'relative' }}>
      {/* Background Effects */}
      <Box
        sx={{ position: 'absolute', top: '-20%', left: '-10%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(15, 17, 21, 0) 70%)', filter: 'blur(60px)', zIndex: 0 }}
      />
      <Box
        sx={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(15, 17, 21, 0) 70%)', filter: 'blur(60px)', zIndex: 0 }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pt: 12, pb: 12 }}>
        
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 12 }}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
            <Typography variant="h1" sx={{ fontWeight: 800, fontSize: { xs: '3rem', md: '5rem' }, lineHeight: 1.1, mb: 3, letterSpacing: '-0.02em' }}>
              Task Management, <br />
              <span className="text-gradient">Evolved.</span>
            </Typography>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <Typography variant="h6" sx={{ color: 'var(--text-secondary)', maxWidth: '800px', mx: 'auto', mb: 6, fontWeight: 400, lineHeight: 1.6 }}>
              A high-performance, multi-tenant ecosystem prioritizing extreme data isolation and developer-centric flexibility. Built for modern engineering teams.
            </Typography>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                endIcon={<ArrowRight size={20} />}
                sx={{ px: 4, py: 1.5, borderRadius: 2, bgcolor: 'var(--accent-primary)', color: 'white', fontWeight: 600, fontSize: '1.1rem', '&:hover': { bgcolor: 'var(--accent-secondary)', transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(99, 102, 241, 0.4)' }, transition: 'all 0.2s' }}
              >
                Get Started
              </Button>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                sx={{ px: 4, py: 1.5, borderRadius: 2, borderColor: 'var(--border-color)', color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.1rem', '&:hover': { borderColor: 'var(--text-primary)', bgcolor: 'rgba(255, 255, 255, 0.05)' } }}
              >
                Sign In
              </Button>
            </Box>
          </motion.div>
        </Box>

        {/* Motivation Section */}
        <Box sx={{ mb: 12 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <Paper className="glass-panel" sx={{ p: { xs: 4, md: 6 }, borderRadius: 4, textAlign: 'center', bgcolor: 'rgba(99, 102, 241, 0.02)' }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 3, color: 'var(--text-primary)' }}>Why Build This?</Typography>
                    <Typography variant="h6" sx={{ color: 'var(--text-secondary)', maxWidth: '800px', mx: 'auto', fontWeight: 400, lineHeight: 1.8 }}>
                        I engineered this platform specifically to push my backend skills to the next level. 
                        My primary goal was to architect a production-ready application to practice advanced <strong style={{ color: 'var(--accent-primary)' }}>PostgreSQL</strong> database design 
                        (like JSONB metadata columns and cascading constraints) and to construct robust <strong style={{ color: 'var(--accent-primary)' }}>CI/CD pipelines</strong> using GitHub Actions. 
                        It evolved into a full-stack exploration of modern web technologies.
                    </Typography>
                </Paper>
            </motion.div>
        </Box>

        {/* Tech Stack Section */}
        <Box sx={{ mb: 12 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 6, textAlign: 'center' }}>The Technology Stack</Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    <TechCard 
                        title="Frontend Architecture" 
                        delay={0.1}
                        techList={['React', 'Redux Toolkit (RTK) Query', 'Material UI (MUI)', 'Framer Motion']} 
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TechCard 
                        title="Backend Services" 
                        delay={0.2}
                        techList={['Node.js', 'Express.js', 'JSON Web Tokens (JWT)', 'Zod Validation']} 
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TechCard 
                        title="Database & DevOps" 
                        delay={0.3}
                        techList={['PostgreSQL (JSONB)', 'GitHub Actions (CI/CD)', 'Socket.IO (Real-time)']} 
                    />
                </Grid>
            </Grid>
        </Box>

        {/* Core Features Grid */}
        <Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 6, textAlign: 'center' }}>Core Features</Typography>
            <Grid container spacing={4}>
            <Grid item xs={12} md={6} lg={4}>
                <FeatureCard
                icon={Database}
                title="PostgreSQL Mastery"
                description="Leveraging JSONB columns for schema-less custom metadata, foreign key constraints, and optimized relational indexing."
                delay={0.1}
                />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <FeatureCard
                icon={GitMerge}
                title="CI/CD Pipelines"
                description="Automated testing, linting, and deployment workflows powered entirely by GitHub Actions for robust delivery."
                delay={0.2}
                />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <FeatureCard
                icon={Lock}
                title="JWT Multi-Tenancy"
                description="Secure API gatekeepers extracting tenant IDs directly from cryptographically signed tokens to ensure absolute data isolation."
                delay={0.3}
                />
            </Grid>
            </Grid>
        </Box>

      </Container>
    </Box>
  );
};

export default LandingPage;
