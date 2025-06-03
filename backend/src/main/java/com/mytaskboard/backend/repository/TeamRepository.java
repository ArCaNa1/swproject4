package com.mytaskboard.backend.repository;

import com.mytaskboard.backend.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeamRepository extends JpaRepository<Team, Long> {
    List<Team> findByCreatedBy(Long userId);
}
