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

  static async reorderNote(
    noteId: string,
    ladderId: string,
    newOrder: number,
    accessToken: string
  ): Promise<note | null> {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const reorderRes = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/note/reorder`,
        { noteId, ladderId, newOrder },
        config
      );

      return reorderRes.data.note as note;
    } catch (error) {
      console.log(error.response);
      return null;
    }
  }

  static async editNote(
    noteId: string,
    ladderId: string,
    newContent: string,
    accessToken: string
  ): Promise<note | null> {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const editRes = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/note/edit`,
        { noteId, ladderId, newContent },
        config
      );

      return editRes.data.note as note;
    } catch (error) {
      console.log(error.response);
      return null;
    }
  }

  static async deleteNote(
    noteId: string,
    ladderId: string,
    accessToken: string
  ): Promise<boolean> {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const reorderRes = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/note/${ladderId}/${noteId}`,
        config
      );

      return true;
    } catch (error) {
      console.log(error.response);
      return false;
    }
  }
}
