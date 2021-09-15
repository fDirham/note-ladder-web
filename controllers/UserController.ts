import axios from "axios";
import { user } from "types/users";

export default class UserController {
  static async getUser(displayName: string): Promise<user | null> {
    try {
      const userRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${displayName}`
      );
      const { user } = userRes.data;
      return user as user;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
