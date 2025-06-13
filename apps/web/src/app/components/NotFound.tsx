import { Box, Container, Typography, useTheme, useMediaQuery } from '@mui/material';
import { Button } from "@/shared/components/design-system/button"
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from "@tanstack/react-router"

const NotFound = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          zIndex: 0,
        }
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 1,
          py: 4,
        }}
      >
        <Box sx={{ alignSelf: 'flex-start', mb: 2 }}>
          <Button
            variant="secundario"
            onClick={() => navigate({ to: "/app" })}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 4,
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box
              component="img"
              src="/Ilustracion.svg"
              alt="Página no encontrada"
              sx={{
                maxWidth: '100%',
                height: 'auto',
                maxHeight: isMobile ? '300px' : '500px',
              }}
            />
          </Box>

          <Box
            sx={{
              flex: 1,
              textAlign: isMobile ? 'center' : 'left',
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: isMobile ? '2.5rem' : '4rem',
                fontWeight: 'bold',
                color: theme.palette.primary.main,
                mb: 2,
              }}
            >
              En construcción
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{
                maxWidth: '600px',
                mx: isMobile ? 'auto' : 0,
              }}
            >
              Esta sección está actualmente en desarrollo. Pronto estará disponible.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFound; 