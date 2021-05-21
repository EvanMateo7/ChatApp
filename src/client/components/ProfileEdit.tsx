import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import { useFormik } from 'formik';
import React from 'react';
import { User } from '../../models';

interface ProfileEditProps { user: User, open: boolean, handleClose: () => void }

export const ProfileEdit = (props: ProfileEditProps) => {

  const formik = useFormik({
    initialValues: { id: '', name: '' } as User,
    validate: (values) => {
      const errors = {} as User;
      if (!values.name) {
        errors.name = 'Required';
      }
      return errors;
    },
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2));
        setSubmitting(false);
      }, 400);
    }
  });

  return (
    <Dialog
      fullWidth={true}
      maxWidth='sm'
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="form-dialog-title">
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>

        <Box display="flex" flexDirection="column" alignItems="stretch" height="100%" padding="15">
          <form onSubmit={formik.handleSubmit}>
            <FormControl fullWidth={true}>
              <TextField id="name" name="name" value={formik.values.name}
                size="small"
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                margin="normal" label="Name" InputLabelProps={{ shrink: true, }} />
            </FormControl>

            <DialogActions>
              <Button onClick={props.handleClose} color="primary">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={formik.isSubmitting}>
                Save
              </Button>
            </DialogActions>
          </form>
        </Box>

      </DialogContent>
    </Dialog>
  );
}
