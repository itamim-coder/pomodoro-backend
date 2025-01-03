/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from '@prisma/client';
import { Secret } from 'jsonwebtoken';

import config from '../../../config';
import { jwtHelpers } from '../../../helpers/jwtHelpers';

const prisma = new PrismaClient();
const loginUser = async (payload: any): Promise<any> => {
  const { email, password }: { email: string; password: string } = payload;

  let isUserExist: any;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error('User does not exist');
  }

  if (user) {
    isUserExist = user;
  }

  if (isUserExist && isUserExist.verified !== true) {
    throw new Error('Email is not verified please check your email');
  }

  if (isUserExist && isUserExist.password !== password) {
    throw new Error('Password is incorrect');
  }
  const payloadData = {
    userId: isUserExist!.id,

    email: isUserExist!.email,
  };

  //   create token
  const accessToken = jwtHelpers.createToken(
    payloadData,

    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );
  const refreshToken = jwtHelpers.createToken(
    payloadData,
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );
  return { accessToken, refreshToken };
};
// const googleLogin = async (payload: any): Promise<any> => {
//   const { email }: { email: string } = payload;

//   let isUserExist: any;
//   const user = await prisma.user.findUnique({
//     where: {
//       email
//     }
//   });

//   if (!user) {
//     const { id,image, ...data } = payload;
//     if (!data.password) {
//       data.password = config.default_user_pass as string;
//     }

//     data.role = 'user';
//     data.profileImg = image;
//     data.verified = true;
//     data.password = '123456';
//     console.log('service', data);
//     const result = await prisma.user.create({
//       data
//     });
//     console.log('result', data);
//     const payloadData = {
//       userId: result!.id,
//       name: result!.name,
//       email: result!.email,
//       role: result!.role,
//       contactNo: result!.contactNo
//     };

//     //   create token
//     const accessToken = jwtHelpers.createToken(
//       payloadData,

//       config.jwt.secret as Secret,
//       config.jwt.expires_in as string
//     );
//     const refreshToken = jwtHelpers.createToken(
//       payloadData,
//       config.jwt.refresh_secret as Secret,
//       config.jwt.refresh_expires_in as string
//     );
//     return { accessToken, refreshToken };
//   }

//   if (user) {
//     isUserExist = user;
//   }

//   // if (isUserExist && isUserExist.verified !== true) {
//   //   throw new Error('Email is not verified please check your email');
//   // }

//   // if (isUserExist && isUserExist.password !== password) {
//   //   throw new Error('Password is incorrect');
//   // }
//   const payloadData = {
//     userId: isUserExist!.id,
//     name: isUserExist!.name,
//     email: isUserExist!.email,
//     role: isUserExist!.role,
//     contactNo: isUserExist!.contactNo
//   };

//   //   create token
//   const accessToken = jwtHelpers.createToken(
//     payloadData,

//     config.jwt.secret as Secret,
//     config.jwt.expires_in as string
//   );
//   const refreshToken = jwtHelpers.createToken(
//     payloadData,
//     config.jwt.refresh_secret as Secret,
//     config.jwt.refresh_expires_in as string
//   );
//   return { accessToken, refreshToken };
// };

// const refreshToken = async (refreshToken: string) => {
//   if (!refreshToken) {
//     throw new Error('Refresh Token is required');
//   }

//   const decodedToken = jwtHelpers.decodeToken(refreshToken);
//   console.log(decodedToken);
//   const { email, role, contactNo, name, userId } = decodedToken;
//   if (!email || !role || !name || !userId) {
//     throw new Error('Invalid token');
//   }

//   const user = await prisma.user.findUnique({
//     where: {
//       email
//     }
//   });

//   if (!user) {
//     throw new Error('User does not exist');
//   }
//   const payloadData = {
//     userId: userId,
//     name: name,
//     email: email,
//     role: role,
//     contactNo: contactNo
//   };
//   const newAccessToken = JwtHelper.createToken(
//     payloadData,
//     config.jwt.secret as Secret,
//     config.jwt.expires_in as string
//   );
//   return {
//     accessToken: newAccessToken
//   };
// };
export const authServices = { loginUser };
