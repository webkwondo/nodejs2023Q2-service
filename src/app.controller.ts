import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Service')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Check server responce' })
  @ApiResponse({ status: 200 })
  @Get()
  checkServer(): string {
    return this.appService.checkServer();
  }
}
