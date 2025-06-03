package com.mytaskboard.backend.controller;

import com.mytaskboard.backend.entity.Team;
import com.mytaskboard.backend.entity.TeamMember;
import com.mytaskboard.backend.entity.TeamInvite;
import com.mytaskboard.backend.entity.User;
import com.mytaskboard.backend.repository.TeamInviteRepository;
import com.mytaskboard.backend.repository.TeamMemberRepository;
import com.mytaskboard.backend.repository.UserRepository;
import com.mytaskboard.backend.service.TeamService;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/api/team")
public class TeamController {

    private final TeamService teamService;
    private final TeamMemberRepository teamMemberRepository;
    private final UserRepository userRepository;
    private final TeamInviteRepository teamInviteRepository;

    public TeamController(TeamService teamService,
                          TeamMemberRepository teamMemberRepository,
                          UserRepository userRepository,
                          TeamInviteRepository teamInviteRepository) {
        this.teamService = teamService;
        this.teamMemberRepository = teamMemberRepository;
        this.userRepository = userRepository;
        this.teamInviteRepository = teamInviteRepository;
    }

    @PostMapping
    @ResponseBody
    public ResponseEntity<Team> createTeam(@RequestBody Map<String, String> req) {
        String name = req.get("name");
        String email = req.get("email");
        Team team = teamService.createTeam(name, email);
        return ResponseEntity.ok(team);
    }

    @GetMapping("/my")
    @ResponseBody
    public ResponseEntity<List<Team>> getMyTeams(@RequestParam String email) {
        List<Team> teams = teamService.getMyTeams(email);
        return ResponseEntity.ok(teams);
    }

    @PostMapping("/{teamId}/invite")
    @ResponseBody
    public ResponseEntity<String> inviteUser(
            @PathVariable Long teamId,
            @RequestBody Map<String, String> req) {

        String inviteeEmail = req.get("email");
        String inviterEmail = req.get("inviterEmail");
        teamService.inviteUser(teamId, inviteeEmail, inviterEmail);
        return ResponseEntity.ok("초대 완료");
    }

    @GetMapping("/{teamId}/members")
    @ResponseBody
    public ResponseEntity<List<User>> getTeamMembers(@PathVariable Long teamId) {
        List<TeamMember> members = teamMemberRepository.findByTeamId(teamId);

        List<Long> userIds = members.stream()
                                    .map(TeamMember::getUserId)
                                    .toList();

        List<User> users = userRepository.findAllById(userIds);

        return ResponseEntity.ok(users);
    }

    @PostMapping("/{teamId}/accept")
    @ResponseBody
    public ResponseEntity<String> acceptInvite(
            @PathVariable Long teamId,
            @RequestBody Map<String, String> req) {

        String email = req.get("email");
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("유저 없음"));

        TeamInvite invite = teamInviteRepository
                .findByTeamIdAndEmail(teamId, email)
                .orElseThrow(() -> new RuntimeException("초대가 없습니다."));

        if (!"PENDING".equals(invite.getStatus())) {
            return ResponseEntity.badRequest().body("이미 수락됨 또는 취소됨");
        }

        TeamMember member = new TeamMember();
        member.setTeamId(teamId);
        member.setUserId(user.getId());
        member.setRole("MEMBER");
        teamMemberRepository.save(member);

        invite.setStatus("ACCEPTED");
        teamInviteRepository.save(invite);

        return ResponseEntity.ok("팀 초대를 수락했습니다.");
    }

    @GetMapping("/{teamId}/invites")
    @ResponseBody
    public ResponseEntity<List<TeamInvite>> getInvites(@PathVariable Long teamId) {
        return ResponseEntity.ok(teamInviteRepository.findByTeamId(teamId));
    }

    @DeleteMapping("/{teamId}/invite")
    @ResponseBody
    public ResponseEntity<String> cancelInvite(
            @PathVariable Long teamId,
            @RequestParam String email) {

        TeamInvite invite = teamInviteRepository
                .findByTeamIdAndEmail(teamId, email)
                .orElseThrow(() -> new RuntimeException("초대 내역 없음"));

        teamInviteRepository.delete(invite);
        return ResponseEntity.ok("초대가 취소되었습니다.");
    }

    @GetMapping("/received-invites")
    @ResponseBody
    public ResponseEntity<List<TeamInvite>> getReceivedInvites(@RequestParam String email) {
        List<TeamInvite> invites = teamInviteRepository.findByEmailAndStatus(email, "PENDING");
        return ResponseEntity.ok(invites);
    }
}
