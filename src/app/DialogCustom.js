import { forwardRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar
} from '@mui/material';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DialogCustom(props) {
  const {
    openDialog,
    setOpenDialog,
    traduccions
  } = props;

  //funciones

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div>
      <Dialog
        open={openDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDialog}
      >
        <DialogTitle>
          <Typography className="text-2xl tracking-tight leading-tight ">
            {traduccions[0]}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <List className="w-full">
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <Typography className="text-16 font-semibold">1</Typography>
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography className="text-15 font-semibold">{traduccions[1]}</Typography>
                }
                secondary={
                  <Typography className="text-14">{traduccions[4]}</Typography>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <Typography className="text-16 font-semibold">3</Typography>
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography className="text-15 font-semibold">{traduccions[2]}</Typography>
                }
                secondary={
                  <Typography className="text-14">{traduccions[5]}</Typography>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <Typography className="text-16 font-semibold">0</Typography>
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography className="text-15 font-semibold">{traduccions[3]}</Typography>
                }
                secondary={
                  <Typography className="text-14">{traduccions[6]}</Typography>
                }
              />
            </ListItem>
          </List>
        </DialogContent>
      </Dialog>
    </div>
  );
}