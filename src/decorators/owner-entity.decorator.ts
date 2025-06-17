import { SetMetadata } from '@nestjs/common';

export const OwnerEntity = (entity: string) => SetMetadata('entity', entity);
