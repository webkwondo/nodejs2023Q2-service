import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { v4 as uuidv4 } from 'uuid';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';

@Injectable()
export class ArtistService {
  artists: Artist[] = [
    {
      id: '687be0ab-70c0-43c4-9521-8f05409072ac',
      name: 'Freddie Mercury',
      grammy: true,
    },
    {
      id: 'b62c655d-d6a0-4685-be54-5510e90ac930',
      name: 'Keane',
      grammy: false,
    },
    {
      id: '1baf0be3-b033-4597-b3a4-52d2d7f9719b',
      name: 'Craig David',
      grammy: true,
    },
    {
      id: '5ecd32e8-1999-4707-b6bb-7e31b66a8f66',
      name: 'Kelly Clarkson',
      grammy: true,
    },
    {
      id: '3e29d2d3-492f-4fb3-a2cb-b926a2ccdbc4',
      name: 'Coldplay',
      grammy: true,
    },
  ];

  constructor(
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
  ) {}

  async create(dto: CreateArtistDto) {
    const artistObj = {
      id: uuidv4(),
      ...dto,
    };

    this.artists.push(artistObj);

    return artistObj;
  }

  async findAll() {
    return [...this.artists];
  }

  async findOne(id: string) {
    return this.artists.find((artist) => artist.id === id);
  }

  async update(id: string, dto: UpdateArtistDto) {
    const artistIndex = this.artists.findIndex((artist) => artist.id === id);

    if (artistIndex < 0) {
      return null;
    }

    const artist = this.artists[artistIndex];

    this.artists[artistIndex] = {
      ...artist,
      ...dto,
    };

    return { ...this.artists[artistIndex] };
  }

  async remove(id: string) {
    const artistIndex = this.artists.findIndex((artist) => artist.id === id);

    if (artistIndex < 0) {
      return null;
    }

    const artist = this.artists[artistIndex];

    this.artists.splice(artistIndex, 1);

    const tracksWithArtistId = this.trackService.tracks.filter(
      (track) => track.artistId === id,
    );

    tracksWithArtistId.forEach((track) => {
      const found = this.trackService.tracks.find((t) => t.id === track.id);
      if (found) found.artistId = null;
    });

    const albumsWithArtistId = this.albumService.albums.filter(
      (album) => album.artistId === id,
    );

    albumsWithArtistId.forEach((album) => {
      const found = this.albumService.albums.find((a) => a.id === album.id);
      if (found) found.artistId = null;
    });

    return artist;
  }
}
