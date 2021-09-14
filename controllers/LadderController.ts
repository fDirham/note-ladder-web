import axios from "axios";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "firebaseApp";

export default class LadderController {
  static async createLadder(name: string, order: number, accessToken: string) {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const createRes = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/ladder`,
        { name, order },
        config
      );
      return createRes.data.ladder;
    } catch (error) {
      console.log(error);
      return {};
    }
  }
}
