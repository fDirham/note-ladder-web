import axios from "axios";

export default class UserController {
  static async getUser(displayName: string) {
    try {
      const userRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/${displayName}`
      );
      const { user } = userRes.data;
      return user;
    } catch (error) {
      console.log(error);
      return {};
    }
  }
}
