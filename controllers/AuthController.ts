import axios from "axios";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "firebaseApp";

export default class AuthController {
  static async logIn(email: string, password: string) {
    try {
      const signInRes = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );

      const config = {
        headers: {
          Authorization: `Bearer ${await signInRes.user.getIdToken()}`,
        },
      };
      const signInApiRes = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/in`,
        {},
        config
      );
      const { user } = signInApiRes.data;
      return user;
    } catch (error) {
      console.log(error);
      return {};
    }
  }

  static async logOut(accessToken: string) {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/out`,
        {},
        config
      );
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  static async validateCredentials(email: string, displayName: string) {
    try {
      const validateRes = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/validate/credentials`,
        {
          email,
          displayName,
        }
      );
      return validateRes.data;
    } catch (error) {
      console.log(error);
      return {};
    }
  }

  static async signUp(email: string, password: string, displayName: string) {
    try {
      const signUpRes = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth`,
        {
          email,
          password,
          displayName,
        }
      );
      return signUpRes.data;
    } catch (error) {
      console.log(error);
      return {};
    }
  }
}
