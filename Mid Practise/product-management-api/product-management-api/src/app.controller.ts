import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Status')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Confirm the API is running' })
  status() {
    return {
      message: 'Tech Shop Management API - Version 2 is running',
      documentation: '/docs',
      endpoints: ['/products', '/employees'],
    };
  }
}
