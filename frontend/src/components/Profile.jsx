import React from "react";
import { Link } from "react-router-dom";
import avatar from "../assets/profile.png";
import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { profileValidate } from "../helper/validate";
import styles from "../styles/Username.module.css";
import extend from "../styles/Profile.module.css";
import { convertToBase64 } from "../helper/convert";
import { useState } from "react";

const Profile = () => {
  const [file, setFile] = useState();

  const formik = useFormik({
    initialValues: {
      firstName : "",
      lastName: "",
      email: "",
      mobile: "",
      address : "",
    },
    enableReinitialize: true,
    validate: profileValidate,
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
          className={`${styles.glass} ${extend.glass}`}
          style={{ width: "45%", paddingTop: "2em" }}
        >
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">My Profile</h4>
            <span className="py-1 text-xl w-2/3 text-center text-gray-500">
              You can update your details
            </span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="glass-content">
              <div className="profile flex justify-center py-1 pt-3">
                <label htmlFor="profile">
                  <img
                    src={file || avatar}
                    className={`border-4 border-gray-100 w-[100px] rounded-full shadow-lg cursor-pointer hover:border-gray-200 ${extend.profile_img}`}
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

              <div className="textbox flex flex-col items-center pt-2 gap-3">
                <div className="name flex w-3/4 gap-10">
                  <input
                    {...formik.getFieldProps("firstName")}
                    className={`${styles.textbox} ${extend.textbox}`}
                    type="text"
                    placeholder="FirstName"
                  />
                  <input
                    {...formik.getFieldProps("lastName")}
                    className={`${styles.textbox} ${extend.textbox}`}
                    type="text"
                    placeholder="LastName"
                  />
                </div>

                <div className="name flex w-3/4 gap-10">
                  <input
                    {...formik.getFieldProps("mobile")}
                    className={`${styles.textbox} ${extend.textbox}`}
                    type="text"
                    placeholder="Mobile No."
                  />
                  <input
                    {...formik.getFieldProps("email")}
                    className={`${styles.textbox} ${extend.textbox}`}
                    type="text"
                    placeholder="Email*"
                  />
                </div>

                <input
                  {...formik.getFieldProps("address")}
                  className={`${styles.textbox} ${extend.textbox}`}
                  type="text"
                  placeholder="Address"
                />
                <button
                  className="border bg-indigo-500 w-3/4 px-3 py-2 rounded-xl text-gray-50 text-lg shadow-sm text-center hover:bg-orange-500"
                  type="submit"
                >
                  Update
                </button>
              </div>

              <div className="text-center py-4">
                <span className="text-gray-500">
                  Want to come back later ?{" "}
                  <Link className="text-red-500" to="/">
                    Logout
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

export default Profile;
