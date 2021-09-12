export default class AuthController {
  static async logIn(credential: string, password: string) {
    console.log(process.env.API_URL);
  }
}
