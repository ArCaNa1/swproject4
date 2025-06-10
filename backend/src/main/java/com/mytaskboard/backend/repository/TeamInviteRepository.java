package com.mytaskboard.backend.repository;

import com.mytaskboard.backend.entity.TeamInvite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TeamInviteRepository extends JpaRepository<TeamInvite, Long> {

    boolean existsByTeamIdAndEmail(Long teamId, String email);

    Optional<TeamInvite> findByTeamIdAndEmail(Long teamId, String email);

    List<TeamInvite> findByTeamId(Long teamId);

    List<TeamInvite> findByEmailAndStatus(String email, String status);

    List<TeamInvite> findByEmail(String email);
}
