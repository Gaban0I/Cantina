import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const Suppression = ({ open, onConfirm, onClose }) => {
  const handleConfirmDelete = () => {
    onConfirm(); // Call the passed onConfirm function
  };

  const handleCloseDeleteDialog = () => {
    onClose(); // Call the passed onClose function
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseDeleteDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Confirmer la suppression"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Êtes-vous sûr de vouloir supprimer cette recette ?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDeleteDialog} color="primary">
          Annuler
        </Button>
        <Button onClick={handleConfirmDelete} color="primary" autoFocus>
          Confirmer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Suppression;
