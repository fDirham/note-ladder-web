import axios from "axios";
import { ladder } from "types/rungs";

export default class LadderController {
  static async createLadder(
    name: string,
    order: number,
    accessToken: string
  ): Promise<ladder | null> {
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
      return createRes.data.ladder as ladder;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async getLadder(
    authorId: string,
    ladderId: string
  ): Promise<ladder | null> {
    try {
      const getRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/ladder/${authorId}/${ladderId}`
      );
      return getRes.data.ladder as ladder;
    } catch (error) {
      console.log(error.response);
      return null;
    }
  }
}
