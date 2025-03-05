import { BadRequestException, Controller, Get, Post, Request, Response, UseGuards } from "@nestjs/common";
import { AuthService } from "../services";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { LoginUserDto } from "../dto/login.dto";
import { setAccessTokenCookie, setRefreshTokenCookie } from "../utils/cookie.util";
import { User } from "src/common/decorators";
import { JwtAuthGuard } from "../guard";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiBody({ type: LoginUserDto })
    @Post("login")
    async login(@Request() req, @Response() res) {
        const user = await this.authService.validateUser(req.body.email, req.body.password);
        if (!user) throw new BadRequestException("Invalid email or password");

        // check if token is already in the cookie
        if (req.cookies["at"]) {
            throw new BadRequestException("Already logged in");
        }

        const { access_token, refresh_token } = await this.authService.login({ email: user.email, id: user.id });

        setAccessTokenCookie(res, access_token);
        setRefreshTokenCookie(res, refresh_token);

        return res.status(200).send({ message: "Login successful" });
    }

    @Post("logout")
    async logout(@Request() req, @Response() res) {
        if (!req.cookies["at"]) {
            throw new BadRequestException("Not logged in");
        }

        res.clearCookie("at");
        res.clearCookie("rt");

        return res.status(200).send({ message: "Logout successful" });
    }

    @UseGuards(JwtAuthGuard)
    @Get("verify")
    async verify(@User() user: Express.User) {
        if (!user) {
            throw new BadRequestException("Not authenticated");
        }

        return { message: "Authenticated" };
    }
}
