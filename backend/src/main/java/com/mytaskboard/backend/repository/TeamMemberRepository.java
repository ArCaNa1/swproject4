package com.mytaskboard.backend.repository;

import com.mytaskboard.backend.entity.TeamMember;
import com.mytaskboard.backend.entity.TeamMemberId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeamMemberRepository extends JpaRepository<TeamMember, TeamMemberId> {
    List<TeamMember> findByUserId(Long userId);
    List<TeamMember> findByTeamId(Long teamId);

}
