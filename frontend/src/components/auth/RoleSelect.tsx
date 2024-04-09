import React, {useState, useContext} from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CaretUpDown as CaretUpDownIcon } from '@phosphor-icons/react/dist/ssr/CaretUpDown';
import { Container } from '@mui/material';
import { setCookie } from 'nookies';
import { UserContext } from '@/contexts/user-context';
import { useRouter } from 'next/navigation';

interface RoleMenuProps{
    updateRole?: (role: string, checkRole?: boolean) => Promise<void>,
    openMenu: boolean,
    redirect?: boolean
}

const RoleMenu = ({updateRole, openMenu, redirect} : RoleMenuProps) => {
    const { replace } = useRouter();
    const onSelect = (val: string) => {
        if(updateRole){
            updateRole(val, redirect).then( (res:any) => {
                redirect && replace('/dashboard')
            })
            .catch( (err:any) => {
                console.error(err)
            })
        }
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
            <Typography color="inherit" className="RoleMenu_Option_Member" variant="subtitle1" onClick = { () => {onSelect("Member")}}>
                Member
            </Typography>
            <Typography color="inherit" className="RoleMenu_Option_Trainer" variant="subtitle1" onClick = { () => {onSelect("Trainer")}}>
                Trainer
            </Typography>
            <Typography color="inherit" className="RoleMenu_Option_Admin" variant="subtitle1" onClick = { () => {onSelect("Admin")}}>
                Admin
            </Typography>
        </Container>
    )
}



export const RoleSelect = ({redirect = true}: {redirect?: boolean}) => {
    const [openMenu, setOpenMenu] = useState<any | null>(false)
    const user = useContext(UserContext);
  
    const handleMenu = () => {
        setOpenMenu( (cur:any) => !cur)
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
          <Box sx={{ flex: '1 1 auto' }} onClick={ () => {handleMenu()}}>
            <Typography color="var(--mui-palette-neutral-400)" variant="body2">
              Role
            </Typography>
            {!openMenu &&
                <Typography color="inherit" variant="subtitle1">
                    {user?.role}
                </Typography>
            }
            <RoleMenu updateRole={user?.updateRole} openMenu={openMenu} redirect={redirect} />

          </Box>
          <CaretUpDownIcon  onClick={ () => {handleMenu()}}/>
        </Box>
    )
}