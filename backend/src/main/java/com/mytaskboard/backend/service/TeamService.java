package com.mytaskboard.backend.service;

import com.mytaskboard.backend.entity.Team;
import com.mytaskboard.backend.entity.TeamInvite;
import com.mytaskboard.backend.entity.TeamMember;
import com.mytaskboard.backend.entity.User;
import com.mytaskboard.backend.repository.TeamInviteRepository;
import com.mytaskboard.backend.repository.TeamMemberRepository;
import com.mytaskboard.backend.repository.TeamRepository;
import com.mytaskboard.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final TeamInviteRepository teamInviteRepository;

    // ✅ 생성자 수동 작성
    public TeamService(TeamRepository teamRepository,
                       UserRepository userRepository,
                       TeamMemberRepository teamMemberRepository,
                       TeamInviteRepository teamInviteRepository) {
        this.teamRepository = teamRepository;
        this.userRepository = userRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.teamInviteRepository = teamInviteRepository;
    }

    public Team createTeam(String name, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("유저 없음"));

        Team team = new Team();
        team.setName(name);
        team.setCreatedBy(user.getId());
        teamRepository.save(team);

        TeamMember member = new TeamMember();
        member.setTeamId(team.getId());
        member.setUserId(user.getId());
        member.setRole("LEADER");
        teamMemberRepository.save(member);

        return team;
    }

    public List<Team> getMyTeams(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("유저 없음"));
        Long userId = user.getId();

        List<TeamMember> memberships = teamMemberRepository.findByUserId(userId);
        List<Long> teamIds = memberships.stream().map(TeamMember::getTeamId).toList();

        return teamRepository.findAllById(teamIds);
    }

    public void inviteUser(Long teamId, String inviteeEmail, String inviterEmail) {
        User inviter = userRepository.findByEmail(inviterEmail)
                .orElseThrow(() -> new RuntimeException("초대한 유저 없음"));

        TeamInvite invite = new TeamInvite();
        invite.setTeamId(teamId);
        invite.setEmail(inviteeEmail);
        invite.setInvitedBy(inviter.getId());
        invite.setStatus("PENDING");
        invite.setCreatedAt(new Timestamp(System.currentTimeMillis()));

        teamInviteRepository.save(invite);
    }
}
