import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Favs } from './entities/favs.entity';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { Artist } from 'src/artist/entities/artist.entity';
import { Album } from 'src/album/entities/album.entity';
import { Track } from 'src/track/entities/track.entity';
import { TRACK_NOT_FOUND_ID_ERROR } from 'src/track/track.constants';
import { ALBUM_NOT_FOUND_ID_ERROR } from 'src/album/album.constants';
import { ARTIST_NOT_FOUND_ID_ERROR } from 'src/artist/artist.constants';

export interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}

@Injectable()
export class FavsService {
  favs: Favs = {
    artists: ['5ecd32e8-1999-4707-b6bb-7e31b66a8f66'],
    albums: ['c2c1992c-0ffa-48f8-bc63-681424fb4abc'],
    tracks: ['7f021f90-6787-4094-8ab3-50b6aff18890'],
  };

  constructor(
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
    private readonly artistService: ArtistService,
  ) {}

  async findAll() {
    const artists: Artist[] = [];

    this.favs.artists.forEach((id) => {
      const obj = this.artistService.artists.find((artist) => artist.id === id);
      if (obj) artists.push(obj);
    });

    const albums: Album[] = [];

    this.favs.albums.forEach((id) => {
      const obj = this.albumService.albums.find((album) => album.id === id);
      if (obj) albums.push(obj);
    });

    const tracks: Track[] = [];

    this.favs.tracks.forEach((id) => {
      const obj = this.trackService.tracks.find((track) => track.id === id);
      if (obj) tracks.push(obj);
    });

    const favsResponse: FavoritesResponse = {
      artists,
      albums,
      tracks,
    };

    return favsResponse;
  }

  async findAllFavTracks() {
    return [...this.favs.tracks];
  }

  async addTrack(id: string) {
    const foundTrack = await this.trackService.findOne(id);

    if (this.favs.tracks.find((trackId) => trackId === id) && foundTrack) {
      return { message: 'Track is already in the favorites' };
    }

    if (id && foundTrack) {
      this.favs.tracks.push(id);
      return { message: 'Track added to the favorites' };
    } else {
      throw new UnprocessableEntityException(TRACK_NOT_FOUND_ID_ERROR);
    }
  }

  async removeTrack(id: string) {
    const foundTrack = await this.trackService.findOne(id);

    if (foundTrack) {
      const trackIndex = this.favs.tracks.findIndex(
        (trackId) => trackId === id,
      );

      if (trackIndex >= 0) this.favs.tracks.splice(trackIndex, 1);

      return null;
    } else {
      throw new NotFoundException(TRACK_NOT_FOUND_ID_ERROR);
    }
  }

  async addAlbum(id: string) {
    const foundAlbum = await this.albumService.findOne(id);

    if (this.favs.albums.find((albumId) => albumId === id) && foundAlbum) {
      return { message: 'Album is already in the favorites' };
    }

    if (foundAlbum) {
      this.favs.albums.push(id);
      return { message: 'Album added to the favorites' };
    } else {
      throw new UnprocessableEntityException(ALBUM_NOT_FOUND_ID_ERROR);
    }
  }

  async removeAlbum(id: string) {
    const foundAlbum = await this.albumService.findOne(id);

    if (foundAlbum) {
      const albumIndex = this.favs.albums.findIndex(
        (albumId) => albumId === id,
      );

      if (albumIndex >= 0) this.favs.albums.splice(albumIndex, 1);

      return null;
    } else {
      throw new NotFoundException(ALBUM_NOT_FOUND_ID_ERROR);
    }
  }

  async addArtist(id: string) {
    const foundArtist = await this.artistService.findOne(id);

    if (this.favs.artists.find((artistId) => artistId === id) && foundArtist) {
      return { message: 'Artist is already in the favorites' };
    }

    if (foundArtist) {
      this.favs.artists.push(id);
      return { message: 'Artist added to the favorites' };
    } else {
      throw new UnprocessableEntityException(ARTIST_NOT_FOUND_ID_ERROR);
    }
  }

  async removeArtist(id: string) {
    const foundArtist = await this.artistService.findOne(id);

    if (foundArtist) {
      const artistIndex = this.favs.artists.findIndex(
        (artistId) => artistId === id,
      );

      if (artistIndex >= 0) this.favs.artists.splice(artistIndex, 1);

      return null;
    } else {
      throw new NotFoundException(ARTIST_NOT_FOUND_ID_ERROR);
    }
  }
}
