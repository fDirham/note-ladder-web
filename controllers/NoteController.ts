import axios from "axios";
import { note } from "types/rungs";

export default class NoteController {
  static async createNote(
    content: string,
    order: number,
    ladder: string,
    accessToken: string
  ): Promise<note | null> {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const createRes = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/note`,
        { content, order, ladder },
        config
      );
      return createRes.data.note as note;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
