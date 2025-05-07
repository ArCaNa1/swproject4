package com.mytaskboard.backend.repository;

import com.mytaskboard.backend.entity.ListEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ListRepository extends JpaRepository<ListEntity, Integer> {
    List<ListEntity> findByEmail(String email);
}