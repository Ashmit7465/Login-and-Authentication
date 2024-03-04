import React from "react";
import { Link } from "react-router-dom";
import avatar from "../assets/profile.png";
import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { registerValidate } from "../helper/validate";
import styles from "../styles/Username.module.css";
import { convertToBase64 } from "../helper/convert";
import { useState } from "react";

const Register = () => {
  const [file, setFile] = useState();

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
    },
    validate: registerValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, { profile: file || "" });
      console.log(values);
    },
  });

  const onUpload = async (ev) => {
    const base64 = await convertToBase64(ev.target.files[0]);
    setFile(base64);
  };

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center h-screen">
        <div
          className={styles.glass}
          style={{ width: "45%", paddingTop: "2em" }}
        >
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Register Now</h4>
            <span className="py-1 text-xl w-2/3 text-center text-gray-500">
              Enter your details to register successfully
            </span>
          </div>

          <form className="py-3" onSubmit={formik.handleSubmit}>
            <div className="glass-content">
              <div className="profile flex justify-center py-3 pt-3">
                <label htmlFor="profile">
                  <img
                    src={file || avatar}
                    className="border-4 border-gray-100 w-[100px] rounded-full shadow-lg cursor-pointer hover:border-gray-200"
                    alt="avatar"
                  />
                </label>
                <input
                  onChange={onUpload}
                  type="file"
                  name="profile"
                  id="profile"
                />
              </div>

              <div className="textbox flex flex-col items-center pt-4 gap-3">
                <input
                  {...formik.getFieldProps("email")}
                  className="border-0 px-3 py-2 rounded-xl w-3/4 shadow-sm text-lg focus:outline-none"
                  type="text"
                  placeholder="Email*"
                />
                <input
                  {...formik.getFieldProps("username")}
                  className="border-0 px-3 py-2 rounded-xl w-3/4 shadow-sm text-lg focus:outline-none"
                  type="text"
                  placeholder="Username*"
                />
                <input
                  {...formik.getFieldProps("password")}
                  className="border-0 px-3 py-2 rounded-xl w-3/4 shadow-sm text-lg focus:outline-none"
                  type="text"
                  placeholder="Password*"
                />
                <button
                  className="border bg-indigo-500 w-3/4 px-3 py-2 rounded-xl text-gray-50 text-lg shadow-sm text-center hover:bg-orange-500"
                  type="submit"
                >
                  Sign In
                </button>
              </div>

              <div className="text-center py-1">
                <span className="text-gray-500">
                  Already Registered ?{" "}
                  <Link className="text-red-500" to="/">
                    Login Now
                  </Link>
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
