import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Chip,
  Divider,
  Stack,
  Avatar,
  LinearProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import type { Employee } from "../types";

interface EmployeeDrawerProps {
  employee: Employee | null;
  open: boolean;
  onClose: () => void;
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
   <Stack
  sx={{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1.5,
  }}
>
      <Box sx={{ color: "text.secondary" }}>{icon}</Box>
      <Box>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}

export function EmployeeDrawer({ employee, open, onClose }: EmployeeDrawerProps) {
  if (!employee) return null;

  const initials = `${employee.firstName[0]}${employee.lastName[0]}`;
  const ratingPct = (employee.performanceRating / 5) * 100;
  const hireDate = new Date(employee.hireDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Drawer anchor="right" open={open} onClose={onClose} slotProps={{ paper: { sx: { width: { xs: "100%", sm: 380 } } } }}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
         <Stack
  sx={{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  }}
>
            <Avatar sx={{ width: 48, height: 48, bgcolor: "primary.main", fontWeight: 700 }}>
              {initials}
            </Avatar>
            <Box>
              <Typography variant="h6">
                {employee.firstName} {employee.lastName}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {employee.position}
              </Typography>
            </Box>
          </Stack>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Chip
          label={employee.isActive ? "Active" : "Inactive"}
          size="small"
          color={employee.isActive ? "success" : "default"}
          variant={employee.isActive ? "filled" : "outlined"}
          sx={{ fontWeight: 600, mb: 3 }}
        />

        <Divider sx={{ mb: 2 }} />

        <Stack spacing={2}>
          <InfoRow icon={<EmailIcon fontSize="small" />} label="Email" value={employee.email} />
          <InfoRow icon={<PersonIcon fontSize="small" />} label="Department" value={employee.department} />
          <InfoRow icon={<LocationOnIcon fontSize="small" />} label="Location" value={employee.location} />
          <InfoRow icon={<CalendarTodayIcon fontSize="small" />} label="Hire Date" value={hireDate} />
          <InfoRow
            icon={<PersonIcon fontSize="small" />}
            label="Manager"
            value={employee.manager ?? "None (Top Level)"}
          />
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Performance
        </Typography>
      
<Stack
  sx={{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
    mb: 0.5,
  }}
>

          <LinearProgress
            variant="determinate"
            value={ratingPct}
            color={employee.performanceRating >= 4.5 ? "success" : employee.performanceRating >= 4 ? "primary" : "warning"}
            sx={{ flex: 1, height: 8, borderRadius: 4 }}
          />
          <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 35 }}>
            {employee.performanceRating}/5
          </Typography>
        </Stack>

        <Stack  sx={{ mt: 2, mb: 1,direction:"row" ,justifyContent:"space-between"}}>
          <Box>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>Salary</Typography>
            <Typography variant="body1" sx={{ fontWeight: 700 }}>
              ${employee.salary.toLocaleString()}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>Projects</Typography>
            <Typography variant="body1" sx={{ fontWeight: 700 }}>
              {employee.projectsCompleted}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>Age</Typography>
            <Typography variant="body1" sx={{ fontWeight: 700 }}>
              {employee.age}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Skills
        </Typography>

<Stack
  sx={{
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 0.5,
  }}
>


          {employee.skills.map((skill) => (
            <Chip key={skill} label={skill} size="small" variant="outlined" />
          ))}
        </Stack>
      </Box>
    </Drawer>
  );
}
