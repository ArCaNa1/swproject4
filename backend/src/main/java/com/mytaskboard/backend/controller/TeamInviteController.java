package com.mytaskboard.backend.controller;

import com.mytaskboard.backend.entity.Team;
import com.mytaskboard.backend.entity.TeamInvite;
import com.mytaskboard.backend.entity.TeamMember;
import com.mytaskboard.backend.repository.TeamInviteRepository;
import com.mytaskboard.backend.repository.TeamMemberRepository;
import com.mytaskboard.backend.repository.TeamRepository;
import com.mytaskboard.backend.repository.UserRepository;
import com.mytaskboard.backend.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TeamInviteController {

    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final TeamInviteRepository inviteRepository;
    private final TeamMemberRepository teamMemberRepository;

    // 1. 팀 초대 API
    @PostMapping("/teams/{teamId}/invite")
    public ResponseEntity<?> inviteUserToTeam(@PathVariable Long teamId, @RequestBody InviteRequest request) {
        Optional<Team> teamOpt = teamRepository.findById(teamId);
        if (teamOpt.isEmpty()) return ResponseEntity.badRequest().body("팀 없음");

        TeamInvite invite = new TeamInvite();
        invite.setTeamId(teamId);
        invite.setEmail(request.getEmail());
        invite.setStatus("PENDING");
        invite.setCreatedAt(Timestamp.from(Instant.now()));
        invite.setInvitedBy(0L); // TODO: 로그인된 사용자로 교체

        inviteRepository.save(invite);
        return ResponseEntity.ok("초대장 저장됨");
    }

    // 2. 유저가 속한 팀 목록 조회
    @GetMapping("/users/{email}/teams")
    public ResponseEntity<List<Team>> getTeamsByUser(@PathVariable String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return ResponseEntity.badRequest().build();
        Long userId = userOpt.get().getId();
        List<Team> teams = teamRepository.findByCreatedBy(userId);
        return ResponseEntity.ok(teams);
    }

    // 3. 초대 수락 API
    @PostMapping("/invites/{inviteId}/accept")
    public ResponseEntity<?> acceptInvite(@PathVariable Long inviteId) {
        Optional<TeamInvite> inviteOpt = inviteRepository.findById(inviteId);
        if (inviteOpt.isEmpty()) return ResponseEntity.badRequest().body("초대 없음");
        TeamInvite invite = inviteOpt.get();

        Optional<User> userOpt = userRepository.findByEmail(invite.getEmail());
        if (userOpt.isEmpty()) return ResponseEntity.badRequest().body("유저 없음");
        User user = userOpt.get();

        TeamMember member = new TeamMember();
        member.setTeamId(invite.getTeamId());
        member.setUserId(user.getId());
        teamMemberRepository.save(member);

        invite.setStatus("ACCEPTED");
        inviteRepository.save(invite);

        return ResponseEntity.ok("팀 참가 완료");
    }

    @PostMapping("/invites/{inviteId}/reject")
    public ResponseEntity<?> rejectInvite(@PathVariable Long inviteId) {
        Optional<TeamInvite> inviteOpt = inviteRepository.findById(inviteId);
        if (inviteOpt.isEmpty()) return ResponseEntity.badRequest().body("초대 없음");

        TeamInvite invite = inviteOpt.get();
        invite.setStatus("REJECTED");
        inviteRepository.save(invite);

        return ResponseEntity.ok("거절 완료");
    }

    @DeleteMapping("/teams/{teamId}/members/{userId}")
    public ResponseEntity<?> removeMember(@PathVariable Long teamId,
                                        @PathVariable Long userId,
                                        @RequestParam String requesterEmail) {
        Optional<User> requesterOpt = userRepository.findByEmail(requesterEmail);
        if (requesterOpt.isEmpty()) return ResponseEntity.status(403).body("요청자 없음");
        User requester = requesterOpt.get();

        // 팀 생성자인지 확인
        Optional<Team> teamOpt = teamRepository.findById(teamId);
        if (teamOpt.isEmpty()) return ResponseEntity.badRequest().body("팀 없음");
        Team team = teamOpt.get();
        if (!team.getCreatedBy().equals(requester.getId())) {
            return ResponseEntity.status(403).body("권한 없음");
        }

        // 본인은 강퇴 불가
        if (requester.getId().equals(userId)) {
            return ResponseEntity.badRequest().body("자기 자신은 강퇴할 수 없습니다.");
        }

        teamMemberRepository.deleteByTeamIdAndUserId(teamId, userId);
        return ResponseEntity.ok("팀원 강퇴 완료");
    }

    // DTO
    public static class InviteRequest {
        private String email;
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }
}
