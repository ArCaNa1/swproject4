package com.mytaskboard.backend.controller;

import com.mytaskboard.backend.entity.*;
import com.mytaskboard.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/invites")
@RequiredArgsConstructor
public class InviteController {

    private final TeamInviteRepository inviteRepository;
    private final TeamMemberRepository memberRepository;
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;

    // 받은 초대 목록 조회
    @GetMapping
    public List<TeamInvite> getMyInvites(@RequestParam String email) {
        return inviteRepository.findByEmailAndStatus(email, "PENDING");
    }

    // 초대 수락/거절 처리
    @PostMapping("/{inviteId}/respond")
    public ResponseEntity<?> respondInvite(@PathVariable Long inviteId, @RequestBody Map<String, Boolean> body) {
        boolean accepted = body.get("accepted");
        TeamInvite invite = inviteRepository.findById(inviteId)
                .orElseThrow(() -> new RuntimeException("초대가 존재하지 않습니다."));

        if (!invite.getStatus().equals("PENDING")) {
            return ResponseEntity.badRequest().body("이미 처리된 초대입니다.");
        }

        invite.setStatus(accepted ? "ACCEPTED" : "REJECTED");
        inviteRepository.save(invite);

        if (accepted) {
            User user = userRepository.findByEmail(invite.getEmail())
                    .orElseThrow(() -> new RuntimeException("사용자 없음"));

            // 팀 멤버로 등록
            TeamMember member = new TeamMember();
            member.setTeamId(invite.getTeamId());
            member.setUserId(user.getId());
            memberRepository.save(member);
        }

        return ResponseEntity.ok().build();
    }
}
