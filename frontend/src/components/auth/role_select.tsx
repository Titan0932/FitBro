import React, {useState} from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CaretUpDown as CaretUpDownIcon } from '@phosphor-icons/react/dist/ssr/CaretUpDown';
import { parseCookies } from 'nookies';
import { Container } from '@mui/material';
import { setCookie } from 'nookies';
import { UserContext } from '@/contexts/user-context';


const RoleMenu = ({curRole, setCurRole, openMenu} : any) => {

    const onSelect = (val: string) => {
        setCurRole((prev: any) => ({...prev, role: val}))

        setCookie(null, 'role', val, {
            maxAge: 30 * 24 * 60 * 60, // 30 days
            path: '/',
        });
    }
    
    return(
        <Container 
        className="RoleMenu" 
        sx={{ 
            overflow: "hidden",
            maxHeight: openMenu ? "7rem" : 0,
            // display: openMenu ? "block" : "none",
            transition: "max-height 0.4s",
        }}
        >
            <Typography color="inherit" className="RoleMenu_Option_Member" variant="subtitle1" onClick = { () => onSelect("Member")}>
                Member
            </Typography>
            <Typography color="inherit" className="RoleMenu_Option_Trainer" variant="subtitle1" onClick = { () => onSelect("Trainer")}>
                Trainer
            </Typography>
            <Typography color="inherit" className="RoleMenu_Option_Admin" variant="subtitle1" onClick = { () => onSelect("Admin")}>
                Admin
            </Typography>
        </Container>
    )
}



export const Role_select = ({role}: any) => {
    const [openMenu, setOpenMenu] = useState(false)
    const user = React.useContext(UserContext);
  
    const handleMenu = () => {
        setOpenMenu( cur => !cur)
    }

    return(
        <Box
          sx={{
            alignItems: 'center',
            // backgroundColor: 'var(--mui-palette-neutral-950)',
            border: '1px solid var(--mui-palette-neutral-700)',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex',
            p: '4px 12px',
          }}
        >
          <Box sx={{ flex: '1 1 auto' }} onClick={ () => handleMenu()}>
            <Typography color="var(--mui-palette-neutral-400)" variant="body2">
              Role
            </Typography>
            {!openMenu &&
                <Typography color="inherit" variant="subtitle1">
                    {user?.role}
                </Typography>
            }
            <RoleMenu curRole={user?.role} setCurRole={user?.setState} openMenu={openMenu} />

          </Box>
          <CaretUpDownIcon  onClick={ () => handleMenu()}/>
        </Box>
    )
}