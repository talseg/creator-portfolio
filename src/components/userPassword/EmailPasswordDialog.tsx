import { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, IconButton, InputAdornment,
  styled
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (email: string, password: string) => void;
  hasError?: boolean;
}

const EmailInputStyled = styled(TextField)`
  margin-top: 8px;
`;


export const EmailPasswordDialog: React.FC<LoginDialogProps> = ({ open, onClose, onSubmit, hasError }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Login</DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <EmailInputStyled
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          fullWidth
        />

        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullWidth
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(prev => !prev)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }
          }}
        />

        <div style={{ height: "4px", color: "#ff0a0ac7" }}>
          { hasError && <div>Login Failed</div>}
        </div>

      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onSubmit(email, password)}>
          Login
        </Button>
      </DialogActions>
    </Dialog>
  );
}
