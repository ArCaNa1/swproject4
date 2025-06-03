// src/main/java/com/mytaskboard/backend/controller/CardController.java
package com.mytaskboard.backend.controller;
import com.mytaskboard.backend.repository.UserRepository;
import com.mytaskboard.backend.entity.Card;
import com.mytaskboard.backend.entity.User;
import com.mytaskboard.backend.repository.CardRepository;
import com.mytaskboard.backend.repository.CommentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Map;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cards")
public class CardController {

    @Autowired
    private UserRepository userRepository;


    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private CommentRepository commentRepository;

    @PostMapping
public ResponseEntity<Card> createCard(@RequestBody Map<String, Object> req) {
    System.out.println("📥 카드 생성 요청 수신: " + req);

    Long listId = Long.valueOf(req.get("listId").toString());
    String title = req.get("title").toString();
    String status = req.get("status").toString();
    Long teamId = Long.valueOf(req.get("teamId").toString());
    String createdByEmail = req.get("createdByEmail").toString();

    System.out.println("✅ listId: " + listId);
    System.out.println("✅ title: " + title);
    System.out.println("✅ status: " + status);
    System.out.println("✅ teamId: " + teamId);
    System.out.println("✅ email: " + createdByEmail);

    User createdBy = userRepository.findByEmail(createdByEmail)
            .orElseThrow(() -> new RuntimeException("User not found: " + createdByEmail));

    Card card = new Card();
    card.setListId(listId);
    card.setTitle(title);
    card.setStatus(status);
    card.setCreatedBy(createdBy.getId());
    card.setTeamId(teamId);
    card.setDescription("");
    card.setDueDate(LocalDate.now());

    cardRepository.save(card);

    return ResponseEntity.ok(card);
}



    @GetMapping
    public List<Card> getAllCards() {
        return cardRepository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Card> getCardById(@PathVariable Long id) {
        return cardRepository.findById(id);
    }

    @PutMapping("/{id}")
    public Card updateCard(@PathVariable Long id, @RequestBody Card cardDetails) {
        Card card = cardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Card not found with id " + id));

        card.setTitle(cardDetails.getTitle());
        card.setDescription(cardDetails.getDescription());
        card.setDueDate(cardDetails.getDueDate());
        card.setStatus(cardDetails.getStatus());
        card.setListId(cardDetails.getListId());
        card.setPosition(cardDetails.getPosition());
        return cardRepository.save(card);
    }


    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deleteCard(@PathVariable Long id) {
        try {
            System.out.println("🧨 삭제 시도 카드 ID: " + id);

            commentRepository.deleteByCardId(id);

            cardRepository.deleteById(id);

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("삭제 실패: " + e.getMessage());
        }
    }

}
