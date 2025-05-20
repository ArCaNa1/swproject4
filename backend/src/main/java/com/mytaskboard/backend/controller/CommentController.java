package com.mytaskboard.backend.controller;

import com.mytaskboard.backend.entity.Comment;
import com.mytaskboard.backend.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/cards/{cardId}/comments")
public class CommentController {

    @Autowired
    private CommentRepository commentRepository;

    // 댓글 목록 조회
    @GetMapping
    public List<Comment> getComments(@PathVariable Long cardId) {
        return commentRepository.findByCardIdOrderByCreatedAtAsc(cardId);
    }

    // 댓글 추가
    @PostMapping
    public Comment addComment(@PathVariable Long cardId, @RequestBody Comment comment) {
        comment.setCardId(cardId);
        comment.setCreatedAt(LocalDateTime.now());
        return commentRepository.save(comment);
    }
}
