import { forwardRef, useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Typography,
  IconButton,
  DialogActions
} from '@mui/material';
import { Print } from '@mui/icons-material';
import { useReactToPrint } from 'react-to-print';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DialogCustom(props) {
  const {
    openDialog,
    setOpenDialog,
    textOriginal,
    tituloDialog,
  } = props;
  const [scroll, setScroll] = useState('paper');
  const componentRef = useRef();

  //funciones

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  if (textOriginal.length === 1 && textOriginal[0] === undefined) {
    return null
  };

  return (
    <Dialog
      open={openDialog}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleCloseDialog}
      scroll={scroll}
      fullWidth={true}
      maxWidth={"sm"}
    >
      <DialogTitle>
        <Typography className="text-3xl">
          {tituloDialog}
        </Typography>
      </DialogTitle>
      <DialogContent
        dividers={scroll === 'paper'}
        sx={{
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.15)',
          },
          marginX: "5px",
        }}
      >
        <div ref={componentRef} className="print:p-32">
          <Typography className="hidden print:block text-3xl print:mb-32">
            {tituloDialog}
          </Typography>
          {textOriginal.map((part, index) => {
            return (
              <div key={`or-${index}`} >
                <Typography
                  key={`part-${index}`}
                  className={`px-8 print:px-0 text-2xl text-[rgba(0, 0, 0, 0.87)] mb-32 bg-[rgba(0,0,0,.2)] print:bg-transparent ${index !== 0 ? 'mt-32' : 'mt-16'}`}
                >
                  {part.titulo}
                </Typography>
                {part.versos.map((item, index2) => {
                  return (
                    <div className="mb-12" key={`est-${index2}`}>
                      {item.split('\n').map((verso, index3) => {
                        return (
                          <Typography
                            key={`verso-${index2}-${index3}`}
                            className="text-16"
                          >
                            {verso}
                          </Typography>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </DialogContent>
      <DialogActions>
        <IconButton
          onClick={handlePrint}
          color="primary"
          sx={{
            backgroundColor: '#161616',
            '&:hover': {
              backgroundColor: '#212121'
            },
            transition: 'background 0.2s ease-in-out',
            width: '35px',
            height: '35px'
          }}
        >
          <Print fontSize="large" sx={{ color: "white" }} />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
}