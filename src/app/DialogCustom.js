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
    setOpenDialog
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
            Control teclado numérico
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
                  <Typography className="text-15 font-semibold">Tecla no. 1</Typography>
                }
                secondary={
                  <Typography className="text-14">Sobreponer capa de vídeo</Typography>
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
                  <Typography className="text-15 font-semibold">Tecla no. 3</Typography>
                }
                secondary={
                  <Typography className="text-14">Cambiar vídeo</Typography>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <Typography className="text-16 font-semibold">4</Typography>
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography className="text-15 font-semibold">Tecla no. 4</Typography>
                }
                secondary={
                  <Typography className="text-14">Reordenar texto</Typography>
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
                  <Typography className="text-15 font-semibold">Tecla no. 0</Typography>
                }
                secondary={
                  <Typography className="text-14">Resetear proyecto</Typography>
                }
              />
            </ListItem>
          </List>
        </DialogContent>     
      </Dialog>
    </div>
  );
}