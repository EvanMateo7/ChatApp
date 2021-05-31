import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import { User } from '../../models';
import { object, SchemaOf, string } from 'yup';
import { socket } from '../script';
import { InvalidPhotoURL } from '../../customErrors';

interface ProfileEditProps { user: User, open: boolean, handleClose: () => void }

const UserSchema: SchemaOf<Partial<User>> = object({
  id: string().notRequired(),
  name: string().required("Display name is required."),
  photoURL: string().notRequired(),
});

export const ProfileEdit = (props: ProfileEditProps) => {

  const formik = useFormik({
    initialValues: props.user,
    validationSchema: UserSchema,
    
    onSubmit: async (user, { setSubmitting, setErrors }) => {
      socket.emit("editUser", user, (error: Error) => {
        if (error.name == InvalidPhotoURL.name) {
          setErrors({
            "photoURL": "Invalid Photo URL"
          });
        }
        else {
          setSubmitting(false);
          props.handleClose();
        }
      });
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
              <TextField id="name" name="name" size="small"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                margin="normal" label="Name" InputLabelProps={{ shrink: true, }} />
            </FormControl>

            <FormControl fullWidth={true}>
              <TextField id="photoURL" name="photoURL" size="small"
                value={formik.values.photoURL}
                onChange={formik.handleChange}
                error={formik.touched.photoURL && Boolean(formik.errors.photoURL)}
                helperText={formik.touched.photoURL && formik.errors.photoURL}
                margin="normal" label="Photo URL" InputLabelProps={{ shrink: true, }} />
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
