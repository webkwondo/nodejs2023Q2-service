import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TrackService {
  tracks: Track[] = [
    {
      id: '7f021f90-6787-4094-8ab3-50b6aff18890',
      name: 'The Show Must Go On',
      artistId: '687be0ab-70c0-43c4-9521-8f05409072ac',
      albumId: 'c2c1992c-0ffa-48f8-bc63-681424fb4abc',
      duration: 271,
    },
    {
      id: '64d73f8d-181c-4f70-8151-bfed1174c773',
      name: 'Somewhere Only We Know',
      artistId: 'b62c655d-d6a0-4685-be54-5510e90ac930',
      albumId: '7806d7d1-0786-4e42-be06-29286f7bdd1e',
      duration: 237,
    },
  ];

  async create(dto: CreateTrackDto) {
    const trackObj = {
      id: uuidv4(),
      ...dto,
    };

    this.tracks.push(trackObj);

    return trackObj;
  }

  async findAll() {
    return [...this.tracks];
  }

  async findOne(id: string) {
    return this.tracks.find((track) => track.id === id);
  }

  async update(id: string, dto: UpdateTrackDto) {
    const trackIndex = this.tracks.findIndex((track) => track.id === id);

    if (trackIndex < 0) {
      return null;
    }

    const track = this.tracks[trackIndex];

    this.tracks[trackIndex] = {
      ...track,
      ...dto,
    };

    return { ...this.tracks[trackIndex] };
  }

  async remove(id: string) {
    const trackIndex = this.tracks.findIndex((track) => track.id === id);

    if (trackIndex < 0) {
      return null;
    }

    const track = this.tracks[trackIndex];

    this.tracks.splice(trackIndex, 1);

    return track;
  }
}
