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

  static async reorderLadder(
    ladderId: string,
    newOrder: number,
    accessToken: string
  ): Promise<ladder | null> {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const reorderRes = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/ladder/reorder`,
        { ladderId, newOrder },
        config
      );

      return reorderRes.data.ladder as ladder;
    } catch (error) {
      console.log(error.response);
      return null;
    }
  }

  static async editLadder(
    ladderId: string,
    newName: string,
    accessToken: string
  ): Promise<ladder | null> {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const reorderRes = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/ladder/edit`,
        { ladderId, newName },
        config
      );

      return reorderRes.data.ladder as ladder;
    } catch (error) {
      console.log(error.response);
      return null;
    }
  }
}
