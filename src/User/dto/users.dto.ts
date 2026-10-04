// users/dto/create-user.dto.ts
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsNumber,
  IsUrl,
  IsObject,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

class LinkDto {
  @IsUrl()
  @IsOptional() //only checks undefined or null , if its empty string throws error
  @ValidateIf((o: LinkDto) => o.linkedin !== '')
  linkedin?: string;

  //decorators processed in reverse order , so only validate if not empty
  @IsUrl()
  @IsOptional() //only checks undefined or null , if its empty string throws error
  @ValidateIf((o: LinkDto) => o.github !== '')
  github?: string;

  //decorators processed in reverse order , so only validate if not empty
  @IsUrl()
  @IsOptional() //only checks undefined or null , if its empty string throws error
  @ValidateIf((o: LinkDto) => o.mail !== '')
  mail?: string;
}

class ContentDataDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  //decorators processed in bottom to top order , so only validate if not empty
  @IsOptional()
  @IsUrl()
  @ValidateIf((o: ContentDataDto) => o.link !== '')
  link?: string;
}

//Under "projects":{"structureid":2,data:[{}]}
class ContentItemDto {
  @IsNumber()
  structureId!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentDataDto)
  data!: ContentDataDto[];
}

//For {"Projects":{},"Experience":{}}
// export class ContentDto {
//     [key: string]: ContentItemDto;
//   }

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  wildcard!: string;

  @IsNumber()
  templateId!: number;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => LinkDto)
  links?: LinkDto;

  @IsOptional()
  @IsString()
  description!: string;

  @IsOptional()
  @IsArray()
  skills!: string[];

  @IsArray()
  @IsNotEmpty({ each: true }) // ensures no empty strings in the array
  tabs!: string[];

  @IsOptional()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => ContentItemDto)
  content?: Map<string, ContentItemDto>;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  wildcard!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  color!: string;

  // @IsNumber()
  // templateId: number;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => LinkDto)
  links?: LinkDto;

  @IsOptional()
  @IsNumber()
  templateId!: number;

  @IsOptional()
  @IsArray()
  @IsNotEmpty({ each: true }) // ensures no empty strings in the array
  tabs!: string[];

  @IsOptional()
  @IsString()
  description!: string;

  @IsOptional()
  @IsArray()
  skills!: string[];

  @IsOptional()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => ContentItemDto)
  content?: Map<string, ContentItemDto>;
}
