import {Dialog, DialogTitle, List, ListItem, ListItemButton, ListItemText, Slide} from "@mui/material";
import { styled } from '@mui/material/styles';
import * as React from 'react';
const FollowUpDialog = ({openDialog, handleCloseDialog, handleSelected}) => {

    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });

    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        '& .MuiDialogTitle-root': {
            backgroundColor: '#894bca',
            color: '#fff',
            marginBottom: '5px'
        },
        '& .MuiListItem-root': {
            padding: '10px'
        },
        '& .MuiListItem-root:hover': {
            backgroundColor: '#894bca',
            color: '#fff',
            cursor: 'pointer',
            padding: '10px'
        },
    }));



    return (
        <>
            <BootstrapDialog fullWidth={true} maxWidth={'sm'} open={openDialog} onBackdropClick={handleCloseDialog} TransitionComponent={Transition}>
                <DialogTitle>Select Filter Option</DialogTitle>
                <List sx={{ pt: 0 }}>
                    <ListItem onClick={() => handleSelected('Today')}>
                        <ListItemText primary={'Today'} />
                    </ListItem>

                    <ListItem onClick={() => handleSelected('Tomorrow')}>
                        <ListItemText primary={'Tomorrow'} />
                    </ListItem>

                    <ListItem onClick={() => handleSelected('Next 7 Days')}>
                        <ListItemText primary={'Next 7 Days'} />
                    </ListItem>

                    <ListItem onClick={() => handleSelected('Custom')}>
                        <ListItemText primary={'Select Custom Filter Date'} />
                    </ListItem>
                </List>
            </BootstrapDialog>


        </>
    )
}

export default FollowUpDialog