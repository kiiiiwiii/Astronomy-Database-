export class Network {
  static async fetch(url, init) {
    const data = await fetch(url, init);
    const text = await data.text();
    try {
      return JSON.parse(text);
    } catch (err) {
      throw new Error(err);
    }
  }
}