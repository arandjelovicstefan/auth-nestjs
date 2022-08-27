import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDTO } from './reports-dtos/create-report.dto';
import { Report } from './reports.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private reportsRepository: Repository<Report>,
  ) {}

  create(reportDTO: CreateReportDTO) {
    const report = this.reportsRepository.create(reportDTO); // sa create pravimo novu instancu entiteta u bazi dok sa save cuvamo
    return this.reportsRepository.save(report);
  }
}
