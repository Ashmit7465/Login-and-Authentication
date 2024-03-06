import { User } from "../models/user_model.js";
import ErrorHandler from "../middlewares/error.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ENV from "../config.js";

//middleware to verify user
export const verifyUser = async (req, res, next) => {
  try {
    const { username } = req.method == "GET" ? req.query : req.body;

    //check the user existence
    let exist = await User.findOne({ username });
    if (!exist) {
      return res.status(404).send({ error: "Can't find the user" });
    }
    next();
  } catch (error) {
    return res.status(404).send({ error: "Authentication error" });
  }
};

/** POST: http://localhost:8080/api/v1/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
}
*/
export const register = async (req, res) => {
  try {
    const { username, email, password, profile } = req.body;

    //check if user already exists

    const existUsername = new Promise((resolve, reject) => {
      User.findOne({ username })
        .then((err, user) => {
          if (err) reject(new Error(err));
          if (user) reject({ error: "Please use unique username" });

          resolve();
        })
        .catch((err) => reject({ error: "existing username findOne error" }));
    });

    const existEmail = new Promise((resolve, reject) => {
      User.findOne({ email })
        .then((err, user) => {
          if (err) reject(new Error(err));
          if (user) reject({ error: "Please use unique e-mail" });

          resolve();
        })
        .catch((err) => reject({ error: "existing email findOne error" }));
    });

    Promise.all([existUsername, existEmail])
      .then(() => {
        if (password) {
          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {
              const user = new User({
                username: username,
                password: hashedPassword,
                profile: profile || "",
                email: email,
              });

              user
                .save()
                .then((result) =>
                  res
                    .status(201)
                    .send({ message: "User registered successfully" })
                )
                .catch((error) => res.status(500).send({ error }));
            })
            .catch((error) => {
              return res.status(500).send({
                error: "Enable to hashed password",
              });
            });
        }
      })
      .catch((error) => {
        return res.status(500).send({ error });
      });
  } catch (error) {
    return res.status(500).send(error);
  }
};

/** POST: http://localhost:8080/api/v1/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/
export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    User.findOne({ username })
      .then((user) => {
        bcrypt
          .compare(password, user.password)
          .then((existPassword) => {
            if (!existPassword) {
              res.status(500).send({ error: "Don't have password" });
            }

            const token = jwt.sign(
              {
                userId: user._id,
                username: user.username,
              },
              ENV.JWT_SECRET,
              { expiresIn: "24h" }
            );

            return res.status(201).send({
              message: "Login Successful...!",
              username: user.username,
              token,
            });
          })
          .catch((error) => {
            res.status(400).send({ error: "Password does not match" });
          });
      })
      .catch((error) => {
        return res.status(404).send({ error: "Username not found" });
      });
  } catch (error) {
    return res.status(500).send({ error });
  }
};

/** GET: http://localhost:8080/api/v1/user/example123 */
// export const getUser = async (req, res) => {
//   const { username } = req.params;

//   try
//   {
//     if (!username) return res.status(501).send({ error: "Invalid Username" });

//     User.findOne({ username }, (err, user) => {
//       if (err) return res.status(500).send({ err });

//       if (!user) return res.status(501).send({ error: "Couldn't Find the User" });

//       // const { password, ...rest } = Object.assign({}, user.toJSON());

//       return res.status(201).send(user);
//     });
//   }
//   catch (error)
//   {
//     return res.status(404).send({ error: "Cannot Find User Data" });
//   }
// };

export const getUser = async (req, res) => {
  const { username } = req.params;

  try {
    if (!username) return res.status(501).send({ error: "Invalid Username" });

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send({ error: "Couldn't Find the User" });
    }

    // Remove sensitive data (e.g., password) from the user object
    const { password, ...rest } = user.toObject();

    return res.status(201).send(rest);
  } catch (error) {
    console.error("Error in getUser:", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

/** PUT: http://localhost:8080/api/v1/updateuser 
 * @param: {
  "header" : "<token>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/
export const updateUser = async (req, res) => {
  try {
    //const id = req.query.id;
    const {userId} = req.user;
    const dec = await User.findOne({_id: id})
    if(dec) {
      const body = req.body;
      await User.updateOne({_id : userId}, body)
      .then(() => {
        return res.status(201).send({error: "User record updated...!"});
      })
      .catch((err) => {
        return res.status(401).send({error: "User doesn't exist"});
      })
    }
    else
    {
      return res.status(401).send({error: "User Not found....!"});
    }
  }
  catch(error)
  {
    return res.status(401).send({error});
  }
};

// export const updateUser = async (req, res) => {
//   const { userId } = req.params;
//   try {
//     if (userId) {
//       const body = req.body;

//       await User.updateOne({ _id: userId }, body).exec();

//       return res.status(201).send({ message: "Record Updated...!" });
//     } else {
//       return res.status(401).send({ error: "User Not Found...!" });
//     }
//   } catch (error) {
//     console.error("Error in updateUser:", error);
//     return res.status(401).send({ error: "Update Failed" });
//   }
// };

/** GET: http://localhost:8080/api/generateOTP */
export const generateOTP = async (req, res) => {
  
};

/** GET: http://localhost:8080/api/verifyOTP */
export const verifyOTP = async (req, res) => {
  res.status(201).json({
    success: true,
    message: "Verify OTP Controller",
  });
};

// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
export const createResetSession = async (req, res) => {
  res.status(201).json({
    success: true,
    message: "Reset session Controller",
  });
};

// update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword */
export const resetPassword = async (req, res) => {
  res.status(201).json({
    success: true,
    message: "Reset password Controller",
  });
};
