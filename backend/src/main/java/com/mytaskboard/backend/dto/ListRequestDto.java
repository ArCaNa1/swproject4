// src/main/java/com/mytaskboard/backend/dto/ListRequestDto.java
package com.mytaskboard.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ListRequestDto {
    private String email;
    private String title;
    private Long teamId;
}
