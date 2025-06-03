package com.mytaskboard.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "team_members")
@IdClass(TeamMemberId.class)
public class TeamMember {

    @Id
    @Column(name = "team_id")
    private Long teamId;

    @Id
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "role")
    private String role; // ✅ 역할 필드 추가

    public TeamMember() {}

    public Long getTeamId() {
        return teamId;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
