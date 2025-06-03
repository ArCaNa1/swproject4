package com.mytaskboard.backend.controller;

import com.mytaskboard.backend.entity.Comment;
import com.mytaskboard.backend.entity.User;
import com.mytaskboard.backend.repository.CommentRepository;
import com.mytaskboard.backend.repository.UserRepository;
import com.mytaskboard.backend.dto.CommentRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/cards/{cardId}/comments")
public class CommentController {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Comment> getComments(@PathVariable Long cardId) {
        return commentRepository.findByCardIdOrderByCreatedAtAsc(cardId);
    }

    @PostMapping
    public Comment addComment(@PathVariable Long cardId, @RequestBody CommentRequest request) {
        User user = userRepository.findByEmail(request.userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = new Comment();
        comment.setCardId(cardId);
        comment.setUserId(user.getId());
        comment.setUserEmail(user.getEmail());
        comment.setContent(request.content);
        comment.setCreatedAt(LocalDateTime.now());

        return commentRepository.save(comment);
    }
}
