import { Body, Controller, Get, HttpException, Param, Patch, Post, Put, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto, UpdateUserDto } from "./dto/users.dto";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";

@Controller("users")
export class UsersController{
    constructor(private UserService : UserService){}


    @Get()
    @UseGuards(AuthGuard("jwt"))
    getUser(@Req() req:Request){
        if(!req.user) throw new HttpException("User not found",400)
        return this.UserService.getUser(req.user["email"])

    }

    @Post()
    @UseGuards(AuthGuard("jwt"))
    createUser(@Req() req:Request,@Body(new ValidationPipe({ whitelist: true })) createUserDto:CreateUserDto){
        if(!req.user) throw new HttpException("User not found",400)
        return this.UserService.createUser(req.user["email"],createUserDto)
    }

    @Put()
    @UseGuards(AuthGuard("jwt"))
    updateUser(@Body(new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist:true
    })) updateUserDto: UpdateUserDto,@Req() req:Request) {
      if(!req.user) throw new HttpException("User not found",400)
      return this.UserService.updateUser(req.user["email"], updateUserDto);
    }

    @Patch('wildcard/:wildcard')
    @UseGuards(AuthGuard("jwt"))
    updateWildcard(@Req() req: Request, @Param('wildcard') wildcard: string) {
      if (!req.user) throw new HttpException('User not found', 400);
      return this.UserService.updateWildCard(wildcard, req.user['email']);
    }



}