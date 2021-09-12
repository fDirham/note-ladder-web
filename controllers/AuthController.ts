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
}
