import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { v4 as uuidv4 } from 'uuid';
import { TrackService } from 'src/track/track.service';

@Injectable()
export class AlbumService {
  albums: Album[] = [
    {
      id: 'c2c1992c-0ffa-48f8-bc63-681424fb4abc',
      name: 'Innuendo',
      year: 1991,
      artistId: '687be0ab-70c0-43c4-9521-8f05409072ac',
    },
    {
      id: '7806d7d1-0786-4e42-be06-29286f7bdd1e',
      name: 'Hopes and Fears',
      year: 2004,
      artistId: 'b62c655d-d6a0-4685-be54-5510e90ac930',
    },
    {
      id: 'e69c3c78-dcf4-4432-821a-c041958b7aa9',
      name: 'Slicker Than Your Average',
      year: 2002,
      artistId: '1baf0be3-b033-4597-b3a4-52d2d7f9719b',
    },
    {
      id: 'd5d8db0a-59b0-4395-a813-f20633d326ba',
      name: 'Stronger',
      year: 2011,
      artistId: '5ecd32e8-1999-4707-b6bb-7e31b66a8f66',
    },
  ];

  constructor(private readonly trackService: TrackService) {}

  async create(dto: CreateAlbumDto) {
    const albumObj = {
      id: uuidv4(),
      ...dto,
    };

    this.albums.push(albumObj);

    return albumObj;
  }

  async findAll() {
    return [...this.albums];
  }

  async findOne(id: string) {
    return this.albums.find((album) => album.id === id);
  }

  async update(id: string, dto: UpdateAlbumDto) {
    const albumIndex = this.albums.findIndex((album) => album.id === id);

    if (albumIndex < 0) {
      return null;
    }

    const album = this.albums[albumIndex];

    this.albums[albumIndex] = {
      ...album,
      ...dto,
    };

    return { ...this.albums[albumIndex] };
  }

  async remove(id: string) {
    const albumIndex = this.albums.findIndex((album) => album.id === id);

    if (albumIndex < 0) {
      return null;
    }

    const album = this.albums[albumIndex];

    this.albums.splice(albumIndex, 1);

    const tracksWithAlbumId = this.trackService.tracks.filter(
      (track) => track.albumId === id,
    );

    tracksWithAlbumId.forEach((track) => {
      const found = this.trackService.tracks.find((t) => t.id === track.id);
      if (found) found.albumId = null;
    });

    return album;
  }
}
