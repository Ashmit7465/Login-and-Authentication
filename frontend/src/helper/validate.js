/*Validate username*/
import toast from "react-hot-toast";

export const usernameValidate = async (values) => {
  const errors = verifyUsername({}, values);

  return errors;
};

export const passwordValidate = async (values) => {
  const errors = verifyPassword({}, values);

  return errors;
};

export const resetPasswordValidate = async (values) => {
  const errors = verifyPassword({}, values);

  if (values.password != values.confirm_pwd) {
    errors.exist = toast.error("Password did not match....");
  }

  return errors;
};

export const profileValidate = async (values) => {
  const errors = verifyEmail({}, values);
  
  return errors;
}

export const registerValidate = (values) => {
  const errors = verifyUsername({}, values);
  verifyPassword(errors, values);
  verifyEmail(errors, values);

  return errors;
};

const verifyUsername = (error = {}, values) => {
  if (!values.username) {
    error.username = toast.error("Username Required");
  } else if (values.username.includes(" ")) {
    error.username = toast.error("Invalid Username");
  }
  return error;
};

const verifyPassword = (error = {}, values) => {
  const specialCharacters = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

  if (!values.password) {
    error.password = toast.error("Password Required...");
  } else if (values.password.includes(" ")) {
    error.password = toast.error("Wrong Password...");
  } else if (values.password.length < 8) {
    error.password = toast.error(
      "Password must be of at least 8 characters..."
    );
  } else if (!specialCharacters.test(values.password)) {
    error.password = toast.error(
      "Password must have atleast one special character"
    );
  }
  return error;
};

const verifyEmail = (error = {}, values) => {
  if (!values.email) {
    error.email = toast.error("Email Required...!");
  } else if (values.email.includes(" ")) {
    error.email = toast.error("Wrong Email...!");
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    error.email = toast.error("Invalid email address...!");
  }
  return error;
};
