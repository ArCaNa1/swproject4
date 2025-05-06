package com.example.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 모든 경로에 대해
                .allowedOrigins("http://localhost:5173") // 프론트엔드 포트
                .allowedMethods("*") // 모든 HTTP 메서드 허용
                .allowedHeaders("*")
                .allowCredentials(true); // 쿠키 등 인증정보 허용
    }
}
