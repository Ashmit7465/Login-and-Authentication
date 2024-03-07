import { User } from "../models/user_model.js";
import ErrorHandler from "../middlewares/error.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ENV from "../config.js";
import otpGenerator from "otp-generator"

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

/** POST: http://localhost:8080/api/v1/v1/register 
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

/** POST: http://localhost:8080/api/v1/v1/login 
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

/** GET: http://localhost:8080/api/v1/v1/user/example123 */
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

/** PUT: http://localhost:8080/api/v1/v1/updateuser 
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
    const dec = await User.findOne({_id: userId})
    if(dec) {
      const body = req.body;
      await User.updateOne({_id : userId}, body)
      .then(() => {
        return res.status(201).send({message: "User record updated...!"});
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

/** GET: http://localhost:8080/api/v1/generateOTP */
export const generateOTP = async (req, res) => {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  res.status(201).send({message: "OTP generated successfully...!", code: req.app.locals.OTP});
};

/** GET: http://localhost:8080/api/v1/verifyOTP */
export const verifyOTP = async (req, res) => {
  const {code} = req.query;
  if(parseInt(req.app.locals.OTP) === parseInt(code))
  {
    req.app.locals.OTP = null;
    req.app.locals.resetSession = true;
    return res.status(201).send({message: "OTP verifies successfully...!"});
  }
  return res.status(400).send({error: "Invalid OTP"});
};

// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/v1/createResetSession */
export const createResetSession = async (req, res) => {
  if(req.app.locals.resetSession)
  {
    req.app.locals.resetSession = false;
    return res.status(201).send({message: "Access Granted"});
  }
  return res.status(400).send({error: "Session expired...!"});
};

// update the password when we have valid session
/** PUT: http://localhost:8080/api/v1/resetPassword */
export const resetPassword = async (req, res) => {
  try {
    if(!req.app.locals.resetSession)
    {
      return res.status(400).send({error: "Session expired...!"});
    }
    const {username, password} = req.body;

    try {
      await User.findOne({username})
      .then(user => {
        bcrypt.hash(password, 10)
        .then(hashedPassword => {
          User.updateOne({username: user.username}, {password: hashedPassword})
          .then(() => {
            return res.status(201).send({message: "Password updated successfully...!"});
          })
          .catch(error => {
            res.status(401).send({error: "Could not update password...!"});
          });
        })
        .catch(error => {
          return res.status(500).send({error: "Unable to hash password...!"});
        })
      })
      .catch(error => {
        return res.status(401).send({error: "Username not found..!"});
      })
    } catch (error) {
      return res.status(500).send({error});
    }
  } catch (error) {
    return res.status(401).send({error});
  }
};
