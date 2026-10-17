import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix("/api/v1/");
    app.enableCors({ origin: process.env.CLIENT_CORS_ORIGIN });
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.listen(
        process.env.APP_PORT ?? 3000,
        process.env.APP_HOST_NAME ?? "0.0.0.0",
    );
}
bootstrap();
