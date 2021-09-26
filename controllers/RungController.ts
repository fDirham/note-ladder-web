import axios from "axios";
import { rung } from "types/rungs";

export default class RungController {
  static async createRung(
    content: string,
    order: number,
    parent: string,
    accessToken: string
  ): Promise<rung | null> {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const createRes = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/note`,
        { content, order, parent },
        config
      );
      return createRes.data.rung as rung;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async reorderRung(
    rungId: string,
    order: number,
    accessToken: string
  ): Promise<rung | null> {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const reorderRes = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/note/reorder/${rungId}`,
        { order },
        config
      );

      return reorderRes.data.rung as rung;
    } catch (error) {
      console.log(error.response);
      return null;
    }
  }

  static async editRung(
    rungId: string,
    content: string,
    accessToken: string
  ): Promise<rung | null> {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const editRes = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/rung/edit/${rungId}`,
        { content },
        config
      );

      return editRes.data.rung as rung;
    } catch (error) {
      console.log(error.response);
      return null;
    }
  }

  static async deleteRung(
    rungId: string,
    accessToken: string
  ): Promise<boolean> {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/rung/${rungId}`,
        config
      );

      return true;
    } catch (error) {
      console.log(error.response);
      return false;
    }
  }
}
