export class Favs {
  artists: string[]; // favorite artists ids
  albums: string[]; // favorite albums ids
  tracks: string[]; // favorite tracks ids

  constructor(partial: Partial<Favs>) {
    Object.assign(this, partial);
  }
}
