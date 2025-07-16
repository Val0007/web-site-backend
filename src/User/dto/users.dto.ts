// users/dto/create-user.dto.ts
import { IsString, IsOptional, IsNotEmpty, IsArray, ValidateNested, IsNumber, IsUrl, IsObject, IsEmail, isString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

class LinkDto {
  @IsOptional()
  @IsUrl()
  linkedin?: string;

  @IsOptional()
  @IsUrl()
  github?: string;

  @IsOptional()
  @IsUrl()
  mail?: string;
}

class ContentDataDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  link?: string;
}

//Under "projects":{"structureid":2,data:[{}]}
class ContentItemDto {
  @IsNumber()
  structureId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentDataDto)
  data: ContentDataDto[];
}

//For {"Projects":{},"Experience":{}}
// export class ContentDto {
//     [key: string]: ContentItemDto;
//   }

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  wildcard: string;

  @IsNumber()
  templateId: number;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => LinkDto)
  links?: LinkDto;

  @IsOptional()
  @IsString()
  description:string

  @IsOptional()
  @IsArray()
  skills:string[]

  @IsArray()
  @IsNotEmpty({ each: true }) // ensures no empty strings in the array
  tabs: string[];

  @IsOptional()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => ContentItemDto)
  content?: Map<string,ContentItemDto>;
}


export class UpdateUserDto {

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    wildcard: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    color: string;
  
    // @IsNumber()
    // templateId: number;
  
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => LinkDto)
    links?: LinkDto;

    @IsOptional()
    @IsNumber()
    templateId: number;
  
    @IsOptional()
    @IsArray()
    @IsNotEmpty({ each: true }) // ensures no empty strings in the array
    tabs: string[];

    @IsOptional()
    @IsString()
    description:string
  
    @IsOptional()
    @IsArray()
    skills:string[]
  
    @IsOptional()
    @IsObject()
    @ValidateNested({ each: true })
    @Type(() => ContentItemDto)
    content?: Map<string,ContentItemDto>;
  }